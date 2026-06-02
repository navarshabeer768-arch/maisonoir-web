import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const { createAdminClient } = await import('@/lib/supabase/server')
    const supabase = await createAdminClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await req.json()
    const { items, email, firstName, lastName, phone, streetLine1, streetLine2, city, postalCode, country, paymentMethod } = body

    if (!items?.length) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })

    // Calculate totals from cart items
    let subtotal = 0
    const orderItems = items.map((item: any) => {
      const lineTotal = item.variant.price * item.quantity
      subtotal += lineTotal
      return {
        product_id: item.product.id,
        variant_id: item.variant.id,
        product_name: item.product.name,
        product_brand: item.product.brand?.name ?? '',
        variant_size_ml: item.variant.size_ml,
        sku: item.variant.sku ?? `SKU-${item.variant.id.slice(0,8)}`,
        quantity: item.quantity,
        unit_price: item.variant.price,
        total_price: lineTotal,
      }
    })

    const shippingAmount = subtotal >= 550 ? 0 : 55
    const taxAmount = subtotal * 0.05
    const total = subtotal + shippingAmount + taxAmount

    const shippingAddress = { first_name: firstName, last_name: lastName, phone, street_line1: streetLine1, street_line2: streetLine2, city, postal_code: postalCode, country }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        profile_id: user?.id ?? null,
        guest_email: user ? null : (email ?? body.email),
        payment_method: paymentMethod,
        subtotal, discount_amount: 0,
        shipping_amount: shippingAmount,
        tax_amount: taxAmount,
        total,
        loyalty_points_earned: Math.floor(total * 10),
        shipping_address: shippingAddress,
        billing_address: shippingAddress,
        currency: 'QAR',
        status: 'pending',
        payment_status: paymentMethod === 'cash_on_delivery' ? 'pending' : 'pending',
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order error:', orderError)
      return NextResponse.json({ error: orderError.message }, { status: 400 })
    }

    // Insert order items
    await supabase.from('order_items').insert(
      orderItems.map((item: any) => ({ ...item, order_id: order.id }))
    )

    // Status history
    await supabase.from('order_status_history').insert({
      order_id: order.id, status: 'pending', note: 'Order placed',
    })

    return NextResponse.json({ orderId: order.id, orderNumber: order.order_number, total })

  } catch (error: any) {
    console.error('Order API error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return NextResponse.json({ orders: [] })
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data } = await supabase.from('orders').select('*, items:order_items(*)').eq('profile_id', user.id).order('created_at', { ascending: false }).limit(10)
    return NextResponse.json({ orders: data ?? [] })
  } catch {
    return NextResponse.json({ orders: [] })
  }
}
