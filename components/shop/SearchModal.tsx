'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X, Loader2 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface SearchModalProps { open: boolean; onClose: () => void }

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (open) { setTimeout(() => inputRef.current?.focus(), 100); setQuery('') } }, [open])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const timeout = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(query)}&limit=6`)
        const data = await res.json()
        setResults(data.products ?? [])
      } finally { setLoading(false) }
    }, 350)
    return () => clearTimeout(timeout)
  }, [query])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
            className="fixed top-0 left-0 right-0 z-50 bg-[#141414] border-b border-[rgba(201,168,76,0.2)] p-6 max-h-[80vh] overflow-y-auto"
          >
            {/* Search input */}
            <div className="flex items-center gap-4 max-w-2xl mx-auto">
              {loading ? <Loader2 size={20} className="text-[#C9A84C] animate-spin shrink-0" /> : <Search size={20} className="text-[#C9A84C] shrink-0" />}
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Escape') onClose() }}
                placeholder="Search fragrances, brands, notes…"
                className="flex-1 bg-transparent text-xl font-display font-light text-[#F0EAD6] outline-none placeholder:text-[#3A3530]"
              />
              <button onClick={onClose} className="text-[#5A5048] hover:text-[#C9A84C] transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="max-w-2xl mx-auto mt-6 space-y-1">
                {results.map(p => {
                  const img = p.images?.find((i: any) => i.is_primary) ?? p.images?.[0]
                  const price = p.variants?.find((v: any) => v.is_active)?.price
                  return (
                    <Link key={p.id} href={`/product/${p.slug}`} onClick={onClose}
                      className="flex items-center gap-4 p-3 hover:bg-[rgba(201,168,76,0.06)] transition-colors border border-transparent hover:border-[rgba(201,168,76,0.1)]">
                      <div className="w-12 h-14 bg-[#1E1E1E] flex items-center justify-center shrink-0 overflow-hidden">
                        {img ? <Image src={img.url} alt={p.name} width={48} height={56} className="object-cover" /> : <span>🫙</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] text-[#C9A84C] tracking-[2px] mb-0.5">{p.brand?.name}</p>
                        <p className="text-[13px] truncate">{p.name}</p>
                        <p className="text-[9px] text-[#5A5048] capitalize">{p.fragrance_family?.replace('_', ' ')} · {p.gender_target}</p>
                      </div>
                      {price && <span className="font-display text-lg text-[#C9A84C] shrink-0">${price}</span>}
                    </Link>
                  )
                })}
                <Link
                  href={`/shop?q=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="block text-center py-3 text-[9px] tracking-[3px] uppercase text-[#C9A84C] hover:text-[#E8D5A3] transition-colors border-t border-[rgba(201,168,76,0.1)] mt-2"
                >
                  View All Results →
                </Link>
              </div>
            )}

            {query && !loading && results.length === 0 && (
              <p className="max-w-2xl mx-auto mt-6 text-[11px] text-[#5A5048]">No results for "{query}"</p>
            )}

            {/* Quick links */}
            {!query && (
              <div className="max-w-2xl mx-auto mt-6">
                <p className="text-[9px] tracking-[3px] uppercase text-[#5A5048] mb-3">Popular</p>
                <div className="flex flex-wrap gap-2">
                  {['Oud', 'Rose', 'Vanilla', 'Amber', 'Citrus', 'Tom Ford', 'Creed', 'Amouage'].map(t => (
                    <Link key={t} href={`/shop?q=${t}`} onClick={onClose}
                      className="px-3 py-1.5 border border-[rgba(201,168,76,0.2)] text-[10px] text-[#5A5048] hover:text-[#C9A84C] hover:border-[rgba(201,168,76,0.5)] transition-all">
                      {t}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
