import { Footer } from '@/components/layout/Footer'
export const metadata = { title: 'Frequently Asked Questions' }
export default function Page() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="h-[68px]" />
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-20">
        <p className="section-eyebrow">Frequently Asked Questions</p>
        <h1 className="font-display text-5xl font-light text-[#2A2420] mb-10">Frequently Asked Questions</h1>
        <div className="bg-white border border-[rgba(42,36,32,0.08)] p-10 shadow-sm space-y-6 text-[#6B5E4A] text-sm leading-relaxed">
          <p>Find answers to the most common questions about our products, shipping, returns, and loyalty programme.</p>
          <p>For further assistance, please contact us at <a href="mailto:hello@maisonoir.com" className="text-[#C9A84C] hover:underline">hello@maisonoir.com</a></p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
