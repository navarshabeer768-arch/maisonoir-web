'use client'
import { motion } from 'framer-motion'

interface NoteEntry { note: { name: string; family: string | null }; intensity: number }
interface FragrancePyramidProps { topNotes: NoteEntry[]; heartNotes: NoteEntry[]; baseNotes: NoteEntry[] }

function NoteChip({ name }: { name: string }) {
  return (
    <span className="px-3 py-1 border border-[rgba(201,168,76,0.25)] text-[10px] tracking-[1px] text-[#9A9080] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300 cursor-default">
      {name}
    </span>
  )
}

export function FragrancePyramid({ topNotes, heartNotes, baseNotes }: FragrancePyramidProps) {
  if (!topNotes.length && !heartNotes.length && !baseNotes.length) return null

  const tiers = [
    { label: 'Top Notes', sub: 'First impression · 15–30 min', notes: topNotes, icon: '◈', delay: '0–30 min' },
    { label: 'Heart Notes', sub: 'The soul · 30 min – 4 hrs', notes: heartNotes, icon: '❋', delay: '30 min–4 hr' },
    { label: 'Base Notes', sub: 'The foundation · 4+ hrs', notes: baseNotes, icon: '◆', delay: '4–12+ hr' },
  ]

  return (
    <div>
      <p className="section-eyebrow">Fragrance Pyramid</p>
      <h3 className="font-display text-2xl font-light mb-6">Composition</h3>
      <div className="space-y-5">
        {tiers.map(({ label, sub, notes, icon, delay }, i) => (
          notes.length > 0 && (
            <motion.div key={label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[#C9A84C] text-lg">{icon}</span>
                <div>
                  <span className="text-[10px] tracking-[2px] uppercase text-[#F0EAD6]">{label}</span>
                  <span className="text-[9px] text-[#5A5048] ml-3">{delay}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 ml-8">
                {notes.map(n => <NoteChip key={n.note.name} name={n.note.name} />)}
              </div>
            </motion.div>
          )
        ))}
      </div>
    </div>
  )
}
