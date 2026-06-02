import type { Metadata } from 'next'
import { Footer } from '@/components/layout/Footer'
import { ProductCard } from '@/components/product/ProductCard'
import { ShopFilters } from '@/components/shop/ShopFilters'
import { ShopSort } from '@/components/shop/ShopSort'

export const metadata: Metadata = { title: 'Shop Luxury Fragrances' }
export const dynamic = 'force-dynamic'

interface ShopPageProps {
  searchParams: Promise<{
    category?: string; brand?: string; gender?: string; family?: string
    sort?: string; page?: string; filter?: string; q?: string
  }>
}

const PAGE_SIZE = 24

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams
  let products: any[] = []
  let count = 0
  let categories: any[] = []
  let brands: any[] = []
  let supabaseConnected = false

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      const page = parseInt(params.page ?? '1')
      const from = (page - 1) * PAGE_SIZE

      let query = supabase
        .from('products')
        .select(`
          id, slug, name, tagline, fragrance_family, concentration, gender_target,
          is_featured, is_new_arrival, is_bestseller, is_arabic_collection, is_exclusive,
          average_rating, review_count, total_sold, status,
          brand:brands(id, name, slug),
          images:product_images(url, alt_text, is_primary),
          variants:product_variants(id, size_ml, price, compare_at_price, stock_quantity, is_active)
        `, { count: 'exact' })
        .eq('status', 'active')
        .range(from, from + PAGE_SIZE - 1)

      if (params.category) {
        const { data: cat } = await supabase.from('categories').select('id').eq('slug', params.category).single()
        if (cat) query = query.eq('category_id', cat.id)
      }
      if (params.gender) query = query.eq('gender_target', params.gender)
      if (params.family) query = query.eq('fragrance_family', params.family)
      if (params.filter === 'new') query = query.eq('is_new_arrival', true)
      if (params.filter === 'featured') query = query.eq('is_featured', true)
      if (params.filter === 'arabic') query = query.eq('is_arabic_collection', true)
      if (params.filter === 'exclusive') query = query.eq('is_exclusive', true)
      if (params.q) query = query.ilike('name', `%${params.q}%`)

      // Sort
      switch (params.sort) {
        case 'newest': query = query.order('created_at', { ascending: false }); break
        case 'bestseller': query = query.order('total_sold', { ascending: false }); break
        case 'rating': query = query.order('average_rating', { ascending: false }); break
        case 'price-asc': query = query.order('created_at', { ascending: false }); break // handled client-side
        case 'price-desc': query = query.order('created_at', { ascending: false }); break
        default: query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false })
      }

      const [productsResult, catsResult, brandsResult] = await Promise.all([
        query,
        supabase.from('categories').select('id, slug, name').eq('is_active', true).is('parent_id', null).order('display_order'),
        supabase.from('brands').select('id, slug, name').eq('is_active', true).order('name').limit(30),
      ])

      products = productsResult.data ?? []
      count = productsResult.count ?? 0
      categories = catsResult.data ?? []
      brands = brandsResult.data ?? []
      supabaseConnected = true

      // Client-side price sort
      if (params.sort === 'price-asc') {
        products.sort((a, b) => {
          const pa = a.variants?.find((v: any) => v.is_active)?.price ?? 0
          const pb = b.variants?.find((v: any) => v.is_active)?.price ?? 0
          return pa - pb
        })
      } else if (params.sort === 'price-desc') {
        products.sort((a, b) => {
          const pa = a.variants?.find((v: any) => v.is_active)?.price ?? 0
          const pb = b.variants?.find((v: any) => v.is_active)?.price ?? 0
          return pb - pa
        })
      }
    }
  } catch (e) {
    console.error('Shop page error:', e)
  }

  const page = parseInt(params.page ?? '1')
  const totalPages = Math.ceil(count / PAGE_SIZE)

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="h-[68px]" />
      <div className="px-6 md:px-12 py-12 border-b border-[rgba(42,36,32,0.06)] bg-white">
        <p className="section-eyebrow">Our Boutique</p>
        <h1 className="font-display text-5xl md:text-6xl font-light text-[#2A2420]">
          The Full <em className="gold-text">Collection</em>
        </h1>
      </div>

      <div className="flex">
        <aside className="hidden lg:block w-64 shrink-0 border-r border-[rgba(42,36,32,0.07)] p-8 sticky top-[68px] h-[calc(100vh-68px)] overflow-y-auto bg-white">
          <ShopFilters categories={categories} brands={brands} currentParams={params as any} />
        </aside>

        <main className="flex-1 p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <p className="text-[10px] tracking-[2px] text-[#9A8A7A] uppercase">{count} Fragrances</p>
            <ShopSort currentSort={params.sort} />
          </div>

          {!supabaseConnected && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-700 text-[11px] rounded">
              ⚠ Database not connected. Please add Supabase environment variables to your Vercel project and redeploy.
            </div>
          )}

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product as any} priority={i < 4} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="text-8xl mb-6 opacity-20">
                <svg viewBox="0 0 80 80" className="w-20 h-20 text-[#9A8A7A]" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M30 20h20M32 20V16a2 2 0 014 0v4M28 60V30c0-4 2-10 12-10s12 6 12 10v30a3 3 0 01-3 3H31a3 3 0 01-3-3z"/>
                  <path d="M33 38h14M33 44h14"/>
                </svg>
              </div>
              <p className="font-display text-3xl font-light text-[#9A8A7A]">
                {supabaseConnected ? 'No fragrances found' : 'Connect your database'}
              </p>
              {supabaseConnected && (
                <p className="text-[10px] tracking-[2px] text-[#9A8A7A] mt-2 uppercase">Try adjusting your filters</p>
              )}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-16">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <a key={p} href={`/shop?${new URLSearchParams({ ...params, page: p.toString() }).toString()}`}
                  className={`w-10 h-10 flex items-center justify-center text-[11px] border transition-all ${
                    p === page ? 'border-[#C9A84C] text-[#C9A84C] bg-[rgba(201,168,76,0.06)]' : 'border-[rgba(42,36,32,0.15)] text-[#9A8A7A] hover:border-[#C9A84C]'
                  }`}>
                  {p}
                </a>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  )
}
