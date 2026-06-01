'use client'
import { motion } from 'framer-motion'

const TESTIMONIALS = [
  { name: 'Sarah A.', location: 'Dubai, UAE', rating: 5, text: 'The fragrance arrived beautifully packaged. Maison Noir is my go-to for authentic luxury perfumes.', fragrance: 'Tom Ford Oud Wood' },
  { name: 'Khalid M.', location: 'Doha, Qatar', rating: 5, text: 'I finally found a boutique that stocks the real Creed Aventus. Fast delivery, no questions.', fragrance: 'Creed Aventus' },
  { name: 'Layla R.', location: 'Riyadh, KSA', rating: 5, text: 'The AI recommendation was surprisingly accurate. Found my signature scent in minutes.', fragrance: 'Amouage Reflection' },
  { name: 'Omar K.', location: 'Kuwait City', rating: 5, text: 'Outstanding Arabic collection. The bakhoor selection is unrivalled anywhere else online.', fragrance: 'Lattafa Oud Mood' },
]

export function SocialProof() {
  return (
    <section className="py-20 border-t border-[rgba(201,168,76,0.08)]">
      <div className="px-6 md:px-12">
        <div className="text-center mb-12">
          <p className="section-eyebrow">Client Stories</p>
          <h2 className="section-title">Words of <em className="gold-text">Appreciation</em></h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-3xl mx-auto">
          {[
            { value: '50,000+', label: 'Happy Clients' },
            { value: '4.9★', label: 'Average Rating' },
            { value: '500+', label: 'Luxury Brands' },
            { value: '30', label: 'Countries Served' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-display text-3xl text-[#C9A84C]">{value}</p>
              <p className="text-[9px] tracking-[2px] uppercase text-[#5A5048] mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              className="bg-[#141414] border border-[rgba(201,168,76,0.1)] p-6">
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, s) => (
                  <span key={s} className="text-[#C9A84C] text-xs">★</span>
                ))}
              </div>
              <p className="text-[11px] text-[#9A9080] leading-[1.9] mb-4">"{t.text}"</p>
              <div className="border-t border-[rgba(201,168,76,0.08)] pt-4">
                <p className="text-[10px] text-[#F0EAD6]">{t.name}</p>
                <p className="text-[9px] text-[#5A5048]">{t.location}</p>
                <p className="text-[9px] text-[#C9A84C] mt-1">Purchased: {t.fragrance}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
