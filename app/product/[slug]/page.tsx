import type { Metadata } from 'next'
import { Footer } from '@/components/layout/Footer'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ slug: string }> }

async function getProduct(slug: string) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return { error: 'env_missing', product: null }
    }
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select(`*, brand:brands(*), category:categories(id,name,slug),
        images:product_images(*, display_order),
        variants:product_variants(*),
        notes:product_notes(note_type, intensity, note:fragrance_notes(id,name,name_ar,family))`)
      .eq('slug', slug)
      .neq('status', 'archived')
      .maybeSingle()

    if (error) return { error: error.message, product: null }
    if (!data) return { error: 'not_found', product: null }
    return { error: null, product: data }
  } catch (e: any) {
    return { error: e.message, product: null }
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { product } = await getProduct(slug)
  if (!product) return { title: 'Maison Noir — Luxury Perfumes' }
  return {
    title: `${product.name} — ${(product.brand as any)?.name ?? 'Maison Noir'}`,
    description: (product as any).description?.slice(0, 160),
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const { product, error } = await getProduct(slug)

  // DB unreachable - show beautiful holding page instead of 404
  if (!product && error !== 'not_found') {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
        <div className="h-[68px]" />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="section-eyebrow mb-3">Maison Noir</p>
            <h1 className="font-display text-4xl font-light text-[#2A2420] mb-4">Loading Fragrance</h1>
            <p className="text-[11px] tracking-[1px] text-[#9A8A7A] mb-8 leading-relaxed">
              Our database is being configured. Please try again in a moment.
            </p>
            <div className="flex gap-3 justify-center">
              <a href={`/product/${slug}`} className="btn-dark px-6 py-3 text-[9px]">Refresh</a>
              <a href="/shop" className="btn-outline-gold px-6 py-3 text-[9px]">Browse Shop</a>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // True 404 - product doesn't exist
  if (!product) {
    const { notFound } = await import('next/navigation')
    notFound()
  }

  // Lazy load heavy components
  const [
    { ProductImages },
    { ProductInfo },
    { FragrancePyramid },
    { PerformanceIndicators },
    { ReviewsSection },
    { RelatedProducts },
  ] = await Promise.all([
    import('@/components/product/ProductImages'),
    import('@/components/product/ProductInfo'),
    import('@/components/product/FragrancePyramid'),
    import('@/components/product/PerformanceIndicators'),
    import('@/components/product/ReviewsSection'),
    import('@/components/product/RelatedProducts'),
  ])

  let reviews: any[] = []
  let related: any[] = []
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      const [r, rel] = await Promise.all([
        supabase.from('reviews').select('*, profile:profiles(first_name,last_name,avatar_url)')
          .eq('product_id', product.id).eq('is_approved', true)
          .order('created_at', { ascending: false }).limit(10),
        supabase.from('products')
          .select('*, brand:brands(name), images:product_images(url,is_primary), variants:product_variants(price,size_ml,is_active)')
          .eq('fragrance_family', (product as any).fragrance_family ?? 'woody')
          .neq('id', product.id).neq('status', 'archived').limit(4),
      ])
      reviews = r.data ?? []
      related = rel.data ?? []
    }
  } catch {}

  const sortedImages = [...((product as any).images ?? [])].sort((a: any, b: any) => a.display_order - b.display_order)
  const notes = (product as any).notes ?? []
  const topNotes = notes.filter((n: any) => n.note_type === 'top')
  const heartNotes = notes.filter((n: any) => n.note_type === 'heart')
  const baseNotes = notes.filter((n: any) => n.note_type === 'base')

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="h-[68px]" />
      <div className="px-6 md:px-12 py-4 border-b border-[rgba(42,36,32,0.06)] bg-white">
        <nav className="flex gap-2 text-[9px] tracking-[2px] uppercase text-[#9A8A7A]">
          <a href="/" className="hover:text-[#C9A84C] transition-colors">Home</a>
          <span>/</span>
          <a href="/shop" className="hover:text-[#C9A84C] transition-colors">Shop</a>
          {(product as any).category && (
            <><span>/</span>
            <a href={`/shop?category=${(product as any).category.slug}`} className="hover:text-[#C9A84C] transition-colors">
              {(product as any).category.name}
            </a></>
          )}
          <span>/</span>
          <span className="text-[#2A2420]">{product.name}</span>
        </nav>
      </div>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <div className="lg:sticky lg:top-24">
          <ProductImages images={sortedImages} productName={product.name} />
        </div>
        <div>
          <ProductInfo product={product as any} />
          {(topNotes.length > 0 || heartNotes.length > 0 || baseNotes.length > 0) && (
            <div className="mt-8 pt-8 border-t border-[rgba(42,36,32,0.08)]">
              <FragrancePyramid topNotes={topNotes} heartNotes={heartNotes} baseNotes={baseNotes} />
            </div>
          )}
          <div className="mt-8 pt-8 border-t border-[rgba(42,36,32,0.08)]">
            <PerformanceIndicators product={product as any} />
          </div>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 border-t border-[rgba(42,36,32,0.06)]">
        <ReviewsSection reviews={reviews as any} productId={product.id}
          averageRating={(product as any).average_rating ?? 0}
          reviewCount={(product as any).review_count ?? 0} />
      </div>
      {related.length > 0 && (
        <div className="border-t border-[rgba(42,36,32,0.06)]">
          <RelatedProducts products={related as any} />
        </div>
      )}
      <Footer />
    </div>
  )
}
