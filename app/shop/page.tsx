import type { Metadata } from 'next'
import { Footer } from '@/components/layout/Footer'
import { ProductCard } from '@/components/product/ProductCard'
import { ShopFilters } from '@/components/shop/ShopFilters'
import { ShopSort } from '@/components/shop/ShopSort'

export const metadata: Metadata = { title: 'Shop Luxury Fragrances | Maison Noir' }
export const dynamic = 'force-dynamic'

const PAGE_SIZE = 24

export default async function ShopPage({ searchParams }: { searchParams: Promise<Record<string,string>> }) {
  const params = await searchParams
  let products: any[] = []
  let count = 0
  let categories: any[] = []
  let brands: any[] = []
  let dbError: string | null = null

  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      dbError = 'env_missing'
    } else {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      const page = parseInt(params.page ?? '1')
      const from = (page - 1) * PAGE_SIZE

      let query = supabase
        .from('products')
        .select(`id, slug, name, tagline, fragrance_family, concentration, gender_target,
          is_featured, is_new_arrival, is_bestseller, is_arabic_collection, is_exclusive,
          average_rating, review_count, total_sold, status,
          brand:brands(id, name, slug),
          images:product_images(url, alt_text, is_primary),
          variants:product_variants(id, size_ml, price, compare_at_price, stock_quantity, is_active)`,
          { count: 'exact' })
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
      if (params.q) query = query.ilike('name', `%${params.q}%`)

      switch (params.sort) {
        case 'newest': query = query.order('created_at', { ascending: false }); break
        case 'bestseller': query = query.order('total_sold', { ascending: false }); break
        case 'rating': query = query.order('average_rating', { ascending: false }); break
        default: query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false })
      }

      const [pr, cr, br] = await Promise.all([
        query,
        supabase.from('categories').select('id, slug, name').eq('is_active', true).is('parent_id', null).order('display_order'),
        supabase.from('brands').select('id, slug, name').eq('is_active', true).order('name').limit(30),
      ])

      if (pr.error) { dbError = pr.error.message }
      else {
        let prods = pr.data ?? []
        if (params.sort === 'price-asc') prods.sort((a,b) => (a.variants?.[0]?.price ?? 0) - (b.variants?.[0]?.price ?? 0))
        if (params.sort === 'price-desc') prods.sort((a,b) => (b.variants?.[0]?.price ?? 0) - (a.variants?.[0]?.price ?? 0))
        products = prods
        count = pr.count ?? 0
        categories = cr.data ?? []
        brands = br.data ?? []
      }
    }
  } catch (e: any) {
    dbError = e.message
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

          {dbError ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="font-display text-3xl font-light text-[#2A2420] mb-3">Collection Loading</p>
              <p className="text-[11px] text-[#9A8A7A] mb-2 max-w-sm">Our database is being set up. Please update the Supabase environment variables in Vercel and redeploy.</p>
              <p className="text-[9px] text-red-400 font-mono mb-6 bg-red-50 px-3 py-1 rounded">{dbError}</p>
              <a href="/shop" className="btn-dark px-6 py-3 text-[9px]">Retry</a>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((p, i) => <ProductCard key={p.id} product={p as any} priority={i < 4} />)}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-16">
                  {Array.from({ length: totalPages }, (_, i) => i+1).map(p => (
                    <a key={p} href={`/shop?${new URLSearchParams({ ...params, page: p.toString() })}`}
                      className={`w-10 h-10 flex items-center justify-center text-[11px] border transition-all ${p === page ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-[rgba(42,36,32,0.15)] text-[#9A8A7A] hover:border-[#C9A84C]'}`}>
                      {p}
                    </a>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-32">
              <svg className="w-16 h-16 text-[#C5BDB5] mb-4" fill="none" viewBox="0 0 64 64" stroke="currentColor" strokeWidth="1">
                <path d="M24 16h16M26 16V12a2 2 0 014 0v4M22 52V24c0-4 2-8 10-8s10 4 10 8v28a3 3 0 01-3 3H25a3 3 0 01-3-3z"/>
                <path d="M27 32h10M27 38h10"/>
              </svg>
              <p className="font-display text-3xl font-light text-[#9A8A7A]">No fragrances found</p>
              <p className="text-[10px] tracking-[2px] text-[#9A8A7A] mt-2 uppercase">Try adjusting your filters</p>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  )
}
