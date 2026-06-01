import type { Metadata } from 'next'
import { HeroSection } from '@/components/home/HeroSection'
import { CategoriesGrid } from '@/components/home/CategoriesGrid'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { AIFinderSection } from '@/components/home/AIFinderSection'
import { BestSellers } from '@/components/home/BestSellers'
import { ArabicCollection } from '@/components/home/ArabicCollection'
import { SocialProof } from '@/components/home/SocialProof'
import { NewsletterSection } from '@/components/home/NewsletterSection'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Maison Noir — Luxury Perfumes & Rare Fragrances',
  description: 'Discover the world\'s most exceptional fragrances. Authentic luxury perfumes from Tom Ford, Creed, Amouage, Roja Dove and niche Arabic perfume houses.',
}

export const revalidate = 3600 // Revalidate every hour

async function getHomePageData() {
  const supabase = await createClient()

  const [
    { data: featured },
    { data: bestsellers },
    { data: newArrivals },
    { data: arabicCollection },
    { data: categories },
  ] = await Promise.all([
    supabase
      .from('products')
      .select(`*, brand:brands(*), images:product_images(*), variants:product_variants(*)`)
      .eq('is_featured', true)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(8),

    supabase
      .from('products')
      .select(`*, brand:brands(*), images:product_images(*), variants:product_variants(*)`)
      .eq('is_bestseller', true)
      .eq('status', 'active')
      .order('total_sold', { ascending: false })
      .limit(8),

    supabase
      .from('products')
      .select(`*, brand:brands(*), images:product_images(*), variants:product_variants(*)`)
      .eq('is_new_arrival', true)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(8),

    supabase
      .from('products')
      .select(`*, brand:brands(*), images:product_images(*), variants:product_variants(*)`)
      .eq('is_arabic_collection', true)
      .eq('status', 'active')
      .order('total_sold', { ascending: false })
      .limit(6),

    supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .is('parent_id', null)
      .order('display_order'),
  ])

  return {
    featured: featured ?? [],
    bestsellers: bestsellers ?? [],
    newArrivals: newArrivals ?? [],
    arabicCollection: arabicCollection ?? [],
    categories: categories ?? [],
  }
}

export default async function HomePage() {
  const { featured, bestsellers, newArrivals, arabicCollection, categories } = await getHomePageData()

  return (
    <>
      <HeroSection />
      <CategoriesGrid categories={categories} />
      <FeaturedProducts products={featured} />
      <BestSellers products={bestsellers} />
      <AIFinderSection />
      <ArabicCollection products={arabicCollection} />
      <FeaturedProducts
        products={newArrivals}
        title="New"
        titleEm="Arrivals"
        eyebrow="Just Landed"
      />
      <SocialProof />
      <NewsletterSection />
      <Footer />
    </>
  )
}
