import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ received: true }) // Silently ignore if not configured
    }

    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as any })

    const body = await req.text()
    const sig = req.headers.get('stripe-signature')!

    let event
    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ received: true })
    }

    const { createAdminClient } = await import('@/lib/supabase/server')
    const supabase = await createAdminClient()

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as any
        const orderId = pi.metadata?.order_id
        if (orderId) {
          await supabase.from('orders').update({
            payment_status: 'paid', status: 'confirmed', payment_intent_id: pi.id,
          }).eq('id', orderId)
        }
        break
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as any
        const orderId = pi.metadata?.order_id
        if (orderId) {
          await supabase.from('orders').update({ payment_status: 'failed', status: 'cancelled' }).eq('id', orderId)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
