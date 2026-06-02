import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ products: [], total: 0 })
    }
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const url = new URL(req.url)
    const { searchParams } = url

    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '24')
    const q = searchParams.get('q')
    const from = (page - 1) * limit

    let query = supabase
      .from('products')
      .select(`id, slug, name, tagline, fragrance_family, concentration, gender_target,
        is_featured, is_new_arrival, is_bestseller, is_arabic_collection,
        average_rating, review_count, total_sold,
        brand:brands(id, name, slug),
        images:product_images(url, alt_text, is_primary),
        variants:product_variants(id, size_ml, price, compare_at_price, stock_quantity, is_active)`,
        { count: 'exact' })
      .eq('status', 'active')
      .range(from, from + limit - 1)
      .order('created_at', { ascending: false })

    if (q) query = query.ilike('name', `%${q}%`)

    const { data, count, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ products: data ?? [], total: count ?? 0, page, limit })
  } catch (error: any) {
    console.error('Products API error:', error)
    return NextResponse.json({ products: [], total: 0, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Not configured' }, { status: 503 })
    }
    const { createAdminClient } = await import('@/lib/supabase/server')
    const supabase = await createAdminClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { data, error } = await supabase.from('products').insert(body).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ product: data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
