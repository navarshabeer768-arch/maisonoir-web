'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const subscribe = async () => {
    if (!email.includes('@')) return
    setLoading(true)
    try {
      await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      setDone(true)
      toast.success('Welcome to the inner circle ✦')
    } finally { setLoading(false) }
  }

  return (
    <section className="py-24 px-6 md:px-12 border-t border-[rgba(201,168,76,0.08)]">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto text-center">
        <p className="section-eyebrow">Join the Inner Circle</p>
        <h2 className="section-title mb-4">
          Exclusive Access &amp; <em className="gold-text">Privileges</em>
        </h2>
        <p className="text-[11px] tracking-[1px] text-[#5A5048] mb-8 leading-[2]">
          Early access to new arrivals, exclusive member offers, and curated fragrance insights — delivered to your inbox.
        </p>
        {done ? (
          <div className="border border-[rgba(201,168,76,0.3)] bg-[rgba(201,168,76,0.05)] px-8 py-6">
            <p className="font-display text-2xl text-[#C9A84C]">✦ Welcome</p>
            <p className="text-[10px] tracking-[1px] text-[#5A5048] mt-1">You're now part of the Maison Noir inner circle</p>
          </div>
        ) : (
          <div className="flex gap-0 border border-[rgba(201,168,76,0.3)] focus-within:border-[#C9A84C] max-w-md mx-auto transition-colors">
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && subscribe()}
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-transparent px-5 py-4 text-sm outline-none placeholder:text-[#3A3530]"
            />
            <button onClick={subscribe} disabled={loading} className="btn-gold px-6 text-[9px] tracking-[2px] disabled:opacity-50">
              {loading ? '…' : 'Subscribe'}
            </button>
          </div>
        )}
        <p className="text-[9px] text-[#3A3530] mt-4">No spam. Unsubscribe anytime.</p>
      </motion.div>
    </section>
  )
}
