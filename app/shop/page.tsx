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

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      const page = parseInt(params.page ?? '1')
      const from = (page - 1) * PAGE_SIZE

      let query = supabase
        .from('products')
        .select(`*, brand:brands(id,name,slug), category:categories(id,name,slug),
          images:product_images(url,alt_text,is_primary),
          variants:product_variants(id,size_ml,price,compare_at_price,stock_quantity,is_active)`,
          { count: 'exact' })
        .eq('status', 'active')
        .range(from, from + PAGE_SIZE - 1)

      if (params.gender) query = query.eq('gender_target', params.gender)
      if (params.family) query = query.eq('fragrance_family', params.family)
      if (params.filter === 'new') query = query.eq('is_new_arrival', true)
      if (params.filter === 'featured') query = query.eq('is_featured', true)
      if (params.filter === 'arabic') query = query.eq('is_arabic_collection', true)
      if (params.q) query = query.ilike('name', `%${params.q}%`)

      if (params.sort === 'newest') query = query.order('created_at', { ascending: false })
      else if (params.sort === 'bestseller') query = query.order('total_sold', { ascending: false })
      else if (params.sort === 'rating') query = query.order('average_rating', { ascending: false })
      else query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false })

      const [productsResult, catsResult, brandsResult] = await Promise.all([
        query,
        supabase.from('categories').select('id,slug,name').eq('is_active', true).is('parent_id', null),
        supabase.from('brands').select('id,slug,name').eq('is_active', true).order('name').limit(30),
      ])

      products = productsResult.data ?? []
      count = productsResult.count ?? 0
      categories = catsResult.data ?? []
      brands = brandsResult.data ?? []
    }
  } catch (e) {
    console.error('Shop page error:', e)
  }

  const page = parseInt(params.page ?? '1')
  const totalPages = Math.ceil(count / PAGE_SIZE)

  return (
    <div className="min-h-screen">
      <div className="h-[72px]" />
      <div className="px-6 md:px-12 py-12 border-b border-[rgba(201,168,76,0.1)]">
        <p className="section-eyebrow">Our Boutique</p>
        <h1 className="font-display text-5xl md:text-6xl font-light">
          The Full <em className="gold-text">Collection</em>
        </h1>
      </div>
      <div className="flex">
        <aside className="hidden lg:block w-64 shrink-0 border-r border-[rgba(201,168,76,0.1)] p-8 sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto">
          <ShopFilters categories={categories} brands={brands} currentParams={params as any} />
        </aside>
        <main className="flex-1 p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <p className="text-[10px] tracking-[2px] text-[#6B5E4A] uppercase">{count} Fragrances</p>
            <ShopSort currentSort={params.sort} />
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-px">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} priority={i < 4} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32">
              <span className="text-6xl opacity-20 mb-6">🫙</span>
              <p className="font-display text-3xl font-light text-[#6B5E4A]">
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'No fragrances found' : 'Add your Supabase env vars to see products'}
              </p>
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-16">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <a key={p} href={`/shop?${new URLSearchParams({ ...params, page: p.toString() }).toString()}`}
                  className={`w-10 h-10 flex items-center justify-center text-[11px] border transition-all duration-300 ${p === page ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-[rgba(201,168,76,0.2)] text-[#6B5E4A]'}`}>
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
