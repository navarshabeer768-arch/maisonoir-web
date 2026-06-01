'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Loader2, Send } from 'lucide-react'

const QUICK_PROMPTS = [
  'A warm oriental for evenings',
  'Fresh citrus for the gym',
  'Gift for a woman who loves roses',
  'Powerful oud for a man',
  'Something unique and niche',
]

export function AIFinderSection() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(false)

  const ask = async (q: string) => {
    if (!q.trim() || loading) return
    setLoading(true); setResult(''); setActive(true)
    try {
      const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: q }) })
      const data = await res.json()
      setResult(data.recommendation ?? 'Unable to get recommendations.')
    } finally { setLoading(false) }
  }

  return (
    <section className="py-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-[rgba(201,168,76,0.3)] bg-[rgba(201,168,76,0.05)]">
            <Sparkles size={14} className="text-[#C9A84C]" />
            <span className="text-[9px] tracking-[3px] uppercase text-[#C9A84C]">AI Fragrance Consultant</span>
          </div>
          <h2 className="section-title mb-4">
            Discover Your <em className="gold-text">Perfect Scent</em>
          </h2>
          <p className="text-[11px] tracking-[1px] text-[#5A5048] mb-10 leading-[2]">
            Describe a mood, occasion, or preference. Our AI expert will curate personalised recommendations from our collection.
          </p>

          {/* Quick prompts */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {QUICK_PROMPTS.map(p => (
              <button key={p} onClick={() => { setQuery(p); ask(p) }}
                className="px-3 py-2 text-[9px] tracking-[0.5px] border border-[rgba(201,168,76,0.2)] text-[#5A5048] hover:text-[#C9A84C] hover:border-[rgba(201,168,76,0.5)] transition-all">
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-0 border border-[rgba(201,168,76,0.3)] focus-within:border-[#C9A84C] transition-colors">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && ask(query)}
              placeholder="Describe your ideal fragrance…"
              className="flex-1 bg-transparent px-5 py-4 text-sm outline-none placeholder:text-[#3A3530]"
            />
            <button onClick={() => ask(query)} disabled={loading || !query.trim()}
              className="px-6 bg-[#C9A84C] text-[#0A0A0A] hover:bg-[#E8D5A3] disabled:opacity-50 transition-colors flex items-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>

          {/* Result */}
          {(loading || result) && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-left bg-[#141414] border border-[rgba(201,168,76,0.15)] p-6">
              {loading ? (
                <div className="flex items-center gap-3 text-[#5A5048]">
                  <Loader2 size={16} className="animate-spin text-[#C9A84C]" />
                  <span className="text-[11px] tracking-[1px]">Curating your recommendations…</span>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  {result.split('\n').map((line, i) => (
                    <p key={i} className="text-[11px] text-[#9A9080] leading-[1.9] mb-2" dangerouslySetInnerHTML={{
                      __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#C9A84C]">$1</strong>')
                    }} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
