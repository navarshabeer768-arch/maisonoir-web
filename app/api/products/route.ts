import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const url = new URL(req.url)
  const { searchParams } = url

  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '24')
  const category = searchParams.get('category')
  const gender = searchParams.get('gender')
  const family = searchParams.get('family')
  const featured = searchParams.get('featured')
  const sort = searchParams.get('sort') ?? 'default'
  const q = searchParams.get('q')
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('products')
    .select(`
      id, slug, name, tagline, fragrance_family, concentration, gender_target,
      is_featured, is_new_arrival, is_bestseller, is_arabic_collection,
      average_rating, review_count, total_sold,
      brand:brands(id, name, slug),
      images:product_images(url, alt_text, is_primary),
      variants:product_variants(id, size_ml, price, compare_at_price, stock_quantity, is_active)
    `, { count: 'exact' })
    .eq('status', 'active')
    .range(from, to)

  if (category) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', category).single()
    if (cat) query = query.eq('category_id', cat.id)
  }
  if (gender) query = query.eq('gender_target', gender)
  if (family) query = query.eq('fragrance_family', family)
  if (featured === 'true') query = query.eq('is_featured', true)
  if (q) query = query.ilike('name', `%${q}%`)

  if (sort === 'newest') query = query.order('created_at', { ascending: false })
  else if (sort === 'bestseller') query = query.order('total_sold', { ascending: false })
  else if (sort === 'rating') query = query.order('average_rating', { ascending: false })
  else query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false })

  const { data, count, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ products: data, total: count, page, limit })
}

export async function POST(req: NextRequest) {
  const supabase = await createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!['founder', 'admin', 'marketing_manager'].includes(profile?.role ?? '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { data, error } = await supabase.from('products').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ product: data }, { status: 201 })
}
