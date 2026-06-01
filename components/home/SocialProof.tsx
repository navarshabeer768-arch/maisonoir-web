'use client'
import { motion } from 'framer-motion'

const TESTIMONIALS = [
  { name: 'Sarah A.', location: 'Dubai, UAE', rating: 5, text: 'The fragrance arrived beautifully packaged. Maison Noir is my go-to for authentic luxury perfumes.', fragrance: 'Tom Ford Oud Wood' },
  { name: 'Khalid M.', location: 'Doha, Qatar', rating: 5, text: 'Finally found a boutique that stocks the real Creed Aventus. Fast delivery, completely authentic.', fragrance: 'Creed Aventus' },
  { name: 'Layla R.', location: 'Riyadh, KSA', rating: 5, text: 'The AI recommendation was surprisingly accurate. Found my signature scent in minutes.', fragrance: 'Amouage Reflection' },
  { name: 'Omar K.', location: 'Kuwait City', rating: 5, text: 'Outstanding Arabic collection. The bakhoor selection is unrivalled anywhere else online.', fragrance: 'Lattafa Oud Mood' },
]

export function SocialProof() {
  return (
    <section className="py-20 bg-[#FAF7F2] border-t border-[rgba(42,36,32,0.06)]">
      <div className="px-6 md:px-12">
        <div className="text-center mb-12">
          <p className="section-eyebrow">Client Stories</p>
          <h2 className="section-title">Words of <em className="gold-text">Appreciation</em></h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-3xl mx-auto">
          {[['50,000+', 'Happy Clients'], ['4.9★', 'Average Rating'], ['500+', 'Luxury Brands'], ['30', 'Countries']].map(([v, l]) => (
            <div key={l} className="text-center">
              <p className="font-display text-3xl text-[#C9A84C]">{v}</p>
              <p className="text-[9px] tracking-[2px] uppercase text-[#9A8A7A] mt-1">{l}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              className="bg-white border border-[rgba(42,36,32,0.08)] p-6 hover:border-[rgba(201,168,76,0.3)] transition-all hover:shadow-md">
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, s) => <span key={s} className="text-[#C9A84C] text-sm">★</span>)}
              </div>
              <p className="text-[11px] text-[#6B5E4A] leading-[1.9] mb-4">"{t.text}"</p>
              <div className="border-t border-[rgba(42,36,32,0.06)] pt-4">
                <p className="text-[10px] text-[#2A2420] font-medium">{t.name}</p>
                <p className="text-[9px] text-[#9A8A7A]">{t.location}</p>
                <p className="text-[9px] text-[#C9A84C] mt-1">{t.fragrance}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
