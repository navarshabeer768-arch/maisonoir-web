import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createAdminClient()

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent
      const orderId = pi.metadata?.order_id
      if (orderId) {
        await supabase.from('orders').update({
          payment_status: 'paid',
          status: 'confirmed',
          payment_intent_id: pi.id,
        }).eq('id', orderId)

        await supabase.from('order_status_history').insert({
          order_id: orderId,
          status: 'confirmed',
          note: `Payment confirmed via Stripe (${pi.id})`,
        })

        // Deduct inventory
        const { data: items } = await supabase
          .from('order_items')
          .select('variant_id, quantity')
          .eq('order_id', orderId)

        for (const item of items ?? []) {
          await supabase.rpc('decrement_stock', {
            p_variant_id: item.variant_id,
            p_quantity: item.quantity,
          })
        }
      }
      break
    }
    case 'payment_intent.payment_failed': {
      const pi = event.data.object as Stripe.PaymentIntent
      const orderId = pi.metadata?.order_id
      if (orderId) {
        await supabase.from('orders').update({ payment_status: 'failed', status: 'cancelled' }).eq('id', orderId)
      }
      break
    }
    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      const orderId = charge.metadata?.order_id
      if (orderId) {
        await supabase.from('orders').update({ payment_status: 'refunded', status: 'refunded' }).eq('id', orderId)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
