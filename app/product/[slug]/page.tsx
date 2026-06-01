import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductImages } from '@/components/product/ProductImages'
import { ProductInfo } from '@/components/product/ProductInfo'
import { FragrancePyramid } from '@/components/product/FragrancePyramid'
import { PerformanceIndicators } from '@/components/product/PerformanceIndicators'
import { ReviewsSection } from '@/components/product/ReviewsSection'
import { RelatedProducts } from '@/components/product/RelatedProducts'
import { Footer } from '@/components/layout/Footer'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ slug: string }> }

async function getProduct(slug: string) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select(`*, brand:brands(*), category:categories(id,name,slug),
        images:product_images(*, display_order),
        variants:product_variants(*),
        notes:product_notes(note_type, intensity, note:fragrance_notes(id,name,name_ar,family))`)
      .eq('slug', slug)
      .neq('status', 'archived')
      .maybeSingle()
    return data
  } catch (e) {
    console.error('Product fetch error:', e)
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Product Not Found | Maison Noir' }
  return {
    title: `${product.name} — ${(product.brand as any)?.name ?? 'Maison Noir'}`,
    description: product.description?.slice(0, 160),
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) notFound()

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
          .eq('fragrance_family', product.fragrance_family ?? 'woody')
          .neq('id', product.id).neq('status', 'archived').limit(4),
      ])
      reviews = r.data ?? []
      related = rel.data ?? []
    }
  } catch {}

  const sortedImages = [...((product.images as any[]) ?? [])].sort((a: any, b: any) => a.display_order - b.display_order)
  const topNotes = (product.notes as any[])?.filter((n: any) => n.note_type === 'top') ?? []
  const heartNotes = (product.notes as any[])?.filter((n: any) => n.note_type === 'heart') ?? []
  const baseNotes = (product.notes as any[])?.filter((n: any) => n.note_type === 'base') ?? []

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
            <a href={`/shop?category=${(product as any).category.slug}`} className="hover:text-[#C9A84C] transition-colors">{(product as any).category.name}</a></>
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
          averageRating={product.average_rating ?? 0} reviewCount={product.review_count ?? 0} />
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
