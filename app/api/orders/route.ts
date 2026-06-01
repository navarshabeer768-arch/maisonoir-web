import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = await createAdminClient()

    // Get authenticated user (optional — supports guest checkout)
    const { data: { user } } = await supabase.auth.getUser()

    const { items, email, firstName, lastName, phone, streetLine1, streetLine2, city, state, postalCode, country, paymentMethod, couponCode } = body

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Validate variants and calculate totals
    const variantIds = items.map((i: any) => i.variant.id)
    const { data: variants, error: variantError } = await supabase
      .from('product_variants')
      .select('*, product:products(name, brand:brands(name))')
      .in('id', variantIds)

    if (variantError || !variants) {
      return NextResponse.json({ error: 'Failed to validate items' }, { status: 400 })
    }

    // Check stock
    for (const item of items) {
      const variant = variants.find(v => v.id === item.variant.id)
      if (!variant) return NextResponse.json({ error: `Product not found: ${item.variant.id}` }, { status: 400 })
      const available = variant.stock_quantity - variant.reserved_quantity
      if (available < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${(variant.product as any).name}` }, { status: 400 })
      }
    }

    // Calculate pricing
    let subtotal = 0
    const orderItems = items.map((item: any) => {
      const variant = variants.find(v => v.id === item.variant.id)!
      const lineTotal = variant.price * item.quantity
      subtotal += lineTotal
      return {
        product_id: item.product.id,
        variant_id: item.variant.id,
        product_name: (variant.product as any).name,
        product_brand: (variant.product as any).brand?.name,
        variant_size_ml: variant.size_ml,
        sku: variant.sku,
        quantity: item.quantity,
        unit_price: variant.price,
        total_price: lineTotal,
      }
    })

    // Apply coupon
    let discountAmount = 0
    let couponId = null
    if (couponCode) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single()

      if (coupon && (!coupon.expires_at || new Date(coupon.expires_at) > new Date()) && subtotal >= coupon.min_order_amount) {
        couponId = coupon.id
        if (coupon.type === 'percentage') discountAmount = subtotal * (coupon.value / 100)
        else if (coupon.type === 'fixed') discountAmount = Math.min(coupon.value, subtotal)
        else if (coupon.type === 'free_shipping') discountAmount = 15
      }
    }

    const shippingAmount = subtotal >= 550 ? 0 : 55
    const taxAmount = (subtotal - discountAmount) * 0.05
    const total = subtotal - discountAmount + shippingAmount + taxAmount

    // Loyalty points (10 pts per $1)
    const pointsEarned = Math.floor(total * 10)

    // Create order
    const shippingAddress = {
      first_name: firstName,
      last_name: lastName,
      street_line1: streetLine1,
      street_line2: streetLine2,
      city, state, postal_code: postalCode, country,
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        profile_id: user?.id ?? null,
        guest_email: user ? null : email,
        payment_method: paymentMethod,
        subtotal,
        discount_amount: discountAmount,
        shipping_amount: shippingAmount,
        tax_amount: taxAmount,
        total,
        loyalty_points_earned: pointsEarned,
        coupon_id: couponId,
        coupon_code: couponCode ?? null,
        shipping_address: shippingAddress,
        billing_address: shippingAddress,
        currency: 'USD',
      })
      .select()
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // Insert order items
    await supabase.from('order_items').insert(
      orderItems.map((item: any) => ({ ...item, order_id: order.id }))
    )

    // Record status history
    await supabase.from('order_status_history').insert({
      order_id: order.id,
      status: 'pending',
      note: 'Order placed',
    })

    // Award loyalty points
    if (user?.id) {
      await supabase.from('loyalty_transactions').insert({
        profile_id: user.id,
        order_id: order.id,
        type: 'earn',
        points: pointsEarned,
        description: `Order ${order.order_number}`,
      })

      // Update loyalty balance
      await supabase.rpc('increment_loyalty_points', {
        p_profile_id: user.id,
        p_points: pointsEarned,
      })
    }

    // Update coupon usage
    if (couponId) {
      await supabase.rpc('increment_coupon_uses', { p_coupon_id: couponId })
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.order_number,
      total: order.total,
    })

  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const supabase = await createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const page = parseInt(url.searchParams.get('page') ?? '1')
  const limit = parseInt(url.searchParams.get('limit') ?? '10')
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, count } = await supabase
    .from('orders')
    .select('*, items:order_items(*)', { count: 'exact' })
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false })
    .range(from, to)

  return NextResponse.json({ orders: data, total: count, page, limit })
}
