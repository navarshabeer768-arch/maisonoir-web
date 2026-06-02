import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    const subtotal = parseFloat(searchParams.get('subtotal') ?? '0')

    if (!code) return NextResponse.json({ valid: false, error: 'No code provided' })
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return NextResponse.json({ valid: false, error: 'Service unavailable' })

    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data: coupon } = await supabase
      .from('coupons').select('*').eq('code', code.toUpperCase()).eq('is_active', true).maybeSingle()

    if (!coupon) return NextResponse.json({ valid: false, error: 'Invalid coupon code' })
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date())
      return NextResponse.json({ valid: false, error: 'Coupon has expired' })
    if (subtotal < coupon.min_order_amount)
      return NextResponse.json({ valid: false, error: `Minimum order QAR ${coupon.min_order_amount} required` })

    let discountAmount = 0
    if (coupon.type === 'percentage') discountAmount = subtotal * (coupon.value / 100)
    else if (coupon.type === 'fixed') discountAmount = Math.min(coupon.value, subtotal)
    else if (coupon.type === 'free_shipping') discountAmount = 55

    return NextResponse.json({ valid: true, discountAmount })
  } catch (error: any) {
    return NextResponse.json({ valid: false, error: error.message }, { status: 500 })
  }
}
