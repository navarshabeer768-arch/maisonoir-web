import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/product/ProductCard'
import { ShopFilters } from '@/components/shop/ShopFilters'
import { ShopSort } from '@/components/shop/ShopSort'
import { Footer } from '@/components/layout/Footer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Shop Luxury Fragrances',
  description: 'Browse our complete collection of luxury perfumes.',
}

interface ShopPageProps {
  searchParams: Promise<{
    category?: string
    brand?: string
    gender?: string
    family?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
    page?: string
    filter?: string
    q?: string
  }>
}

const PAGE_SIZE = 24

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  const page = parseInt(params.page ?? '1')
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('products')
    .select(`
      *,
      brand:brands(id, name, slug, logo_url),
      category:categories(id, name, slug),
      images:product_images(url, alt_text, is_primary, display_order),
      variants:product_variants(id, size_ml, price, compare_at_price, stock_quantity, is_active),
      notes:product_notes(note_type, note:fragrance_notes(name))
    `, { count: 'exact' })
    .eq('status', 'active')
    .range(from, to)

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
  if (params.q) query = query.textSearch('name', params.q, { type: 'websearch' })

  switch (params.sort) {
    case 'price-asc': break // Need to sort on variant prices via join
    case 'newest': query = query.order('created_at', { ascending: false }); break
    case 'bestseller': query = query.order('total_sold', { ascending: false }); break
    case 'rating': query = query.order('average_rating', { ascending: false }); break
    default: query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false })
  }

  const { data: products, count } = await query

  // Fetch categories and brands for filters
  const [{ data: categories }, { data: brands }] = await Promise.all([
    supabase.from('categories').select('id, slug, name').eq('is_active', true).is('parent_id', null),
    supabase.from('brands').select('id, slug, name').eq('is_active', true).eq('is_featured', true).order('name'),
  ])

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  return (
    <div className="min-h-screen">
      <div className="h-[72px]" />

      {/* Header */}
      <div className="px-6 md:px-12 py-12 border-b border-[rgba(201,168,76,0.1)]">
        <p className="section-eyebrow">Our Boutique</p>
        <h1 className="font-display text-5xl md:text-6xl font-light">
          The Full <em className="gold-text">Collection</em>
        </h1>
        {params.q && (
          <p className="mt-4 text-[11px] tracking-[2px] text-[#6B5E4A]">
            Search results for: <span className="text-[#C9A84C]">"{params.q}"</span> · {count} results
          </p>
        )}
      </div>

      <div className="flex">
        {/* Sidebar filters */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-[rgba(201,168,76,0.1)] p-8 sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto">
          <ShopFilters
            categories={categories ?? []}
            brands={brands ?? []}
            currentParams={params}
          />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-8">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-[10px] tracking-[2px] text-[#6B5E4A] uppercase">
              {count ?? 0} Fragrances
            </p>
            <ShopSort currentSort={params.sort} />
          </div>

          {/* Grid */}
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-px">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product as any} priority={i < 4} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32">
              <span className="text-6xl opacity-20 mb-6">🫙</span>
              <p className="font-display text-3xl font-light text-[#6B5E4A]">No fragrances found</p>
              <p className="text-[10px] tracking-[2px] text-[#5A5048] mt-2">Try adjusting your filters</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-16">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <a
                  key={p}
                  href={`/shop?${new URLSearchParams({ ...params, page: p.toString() }).toString()}`}
                  className={`w-10 h-10 flex items-center justify-center text-[11px] border transition-all duration-300 ${
                    p === page
                      ? 'border-[#C9A84C] text-[#C9A84C] bg-[rgba(201,168,76,0.1)]'
                      : 'border-[rgba(201,168,76,0.2)] text-[#6B5E4A] hover:border-[#C9A84C] hover:text-[#C9A84C]'
                  }`}
                >
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
