import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductImages } from '@/components/product/ProductImages'
import { ProductInfo } from '@/components/product/ProductInfo'
import { FragrancePyramid } from '@/components/product/FragrancePyramid'
import { PerformanceIndicators } from '@/components/product/PerformanceIndicators'
import { ReviewsSection } from '@/components/product/ReviewsSection'
import { RelatedProducts } from '@/components/product/RelatedProducts'
import { Footer } from '@/components/layout/Footer'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('name, description, brand:brands(name), images:product_images(url, is_primary)')
    .eq('slug', slug)
    .single()

  if (!data) return { title: 'Product Not Found' }

  const image = (data.images as any[])?.find(i => i.is_primary)?.url
  return {
    title: `${data.name} — ${(data.brand as any)?.name ?? 'Maison Noir'}`,
    description: data.description?.slice(0, 160),
    openGraph: { images: image ? [image] : [] },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      brand:brands(*),
      category:categories(id, name, slug),
      images:product_images(*, display_order),
      variants:product_variants(*, sku),
      notes:product_notes(
        note_type, intensity,
        note:fragrance_notes(id, name, name_ar, family)
      )
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (!product) notFound()

  // Fetch reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select(`*, profile:profiles(first_name, last_name, avatar_url)`)
    .eq('product_id', product.id)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(10)

  // Fetch related
  const { data: related } = await supabase
    .from('products')
    .select(`*, brand:brands(name), images:product_images(url, is_primary), variants:product_variants(price, size_ml, is_active)`)
    .eq('fragrance_family', product.fragrance_family)
    .neq('id', product.id)
    .eq('status', 'active')
    .limit(4)

  const sortedImages = [...(product.images ?? [])].sort((a: any, b: any) => a.display_order - b.display_order)
  const topNotes = product.notes?.filter((n: any) => n.note_type === 'top') ?? []
  const heartNotes = product.notes?.filter((n: any) => n.note_type === 'heart') ?? []
  const baseNotes = product.notes?.filter((n: any) => n.note_type === 'base') ?? []

  return (
    <div>
      <div className="h-[72px]" />

      {/* Breadcrumb */}
      <div className="px-6 md:px-12 py-4 border-b border-[rgba(201,168,76,0.08)]">
        <nav className="flex gap-2 text-[9px] tracking-[2px] uppercase text-[#5A5048]">
          <a href="/" className="hover:text-[#C9A84C] transition-colors">Home</a>
          <span>/</span>
          <a href="/shop" className="hover:text-[#C9A84C] transition-colors">Shop</a>
          {product.category && (
            <>
              <span>/</span>
              <a href={`/shop?category=${product.category.slug}`} className="hover:text-[#C9A84C] transition-colors">
                {product.category.name}
              </a>
            </>
          )}
          <span>/</span>
          <span className="text-[#9A9080]">{product.name}</span>
        </nav>
      </div>

      {/* Main product section */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left: Images */}
        <div className="lg:sticky lg:top-24">
          <ProductImages images={sortedImages} productName={product.name} />
        </div>

        {/* Right: Info */}
        <div>
          <ProductInfo product={product as any} />

          <div className="mt-8 pt-8 border-t border-[rgba(201,168,76,0.1)]">
            <FragrancePyramid
              topNotes={topNotes}
              heartNotes={heartNotes}
              baseNotes={baseNotes}
            />
          </div>

          <div className="mt-8 pt-8 border-t border-[rgba(201,168,76,0.1)]">
            <PerformanceIndicators product={product as any} />
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 border-t border-[rgba(201,168,76,0.08)]">
        <ReviewsSection reviews={reviews as any ?? []} productId={product.id} averageRating={product.average_rating} reviewCount={product.review_count} />
      </div>

      {/* Related products */}
      {related && related.length > 0 && (
        <div className="border-t border-[rgba(201,168,76,0.08)]">
          <RelatedProducts products={related as any} />
        </div>
      )}

      <Footer />
    </div>
  )
}
