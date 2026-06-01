import { AIFinderSection } from '@/components/home/AIFinderSection'
import { Footer } from '@/components/layout/Footer'
export const dynamic = 'force-dynamic'
export default function DiscoveryPage() {
  return (
    <div className="min-h-screen">
      <div className="h-[72px]" />
      <div className="px-6 md:px-12 py-16 text-center border-b border-[rgba(201,168,76,0.1)]">
        <p className="section-eyebrow">Personalised For You</p>
        <h1 className="font-display text-5xl md:text-6xl font-light">Find Your <em className="gold-text">Signature Scent</em></h1>
        <p className="text-sm text-[#6B5E4A] mt-4 max-w-md mx-auto">Describe a mood, occasion, or preference — our AI expert will find your perfect fragrance.</p>
      </div>
      <AIFinderSection />
      <Footer />
    </div>
  )
}
