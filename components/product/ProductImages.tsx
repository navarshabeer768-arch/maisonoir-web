'use client'
import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ProductImagesProps {
  images: { id: string; url: string; alt_text: string | null; is_primary: boolean }[]
  productName: string
}

export function ProductImages({ images, productName }: ProductImagesProps) {
  const [active, setActive] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-[#141414] flex items-center justify-center">
        <span className="text-9xl opacity-20">🫙</span>
      </div>
    )
  }

  const prev = () => setActive(i => (i - 1 + images.length) % images.length)
  const next = () => setActive(i => (i + 1) % images.length)

  return (
    <div className="space-y-3">
      {/* Main */}
      <div className="relative aspect-square bg-[#141414] overflow-hidden group cursor-zoom-in" onClick={() => setZoomed(true)}>
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
            <Image src={images[active].url} alt={images[active].alt_text ?? productName} fill className="object-cover" priority />
          </motion.div>
        </AnimatePresence>
        <button onClick={e => { e.stopPropagation(); setZoomed(true) }}
          className="absolute top-4 right-4 w-9 h-9 bg-[rgba(10,10,10,0.7)] flex items-center justify-center text-[#C9A84C] opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn size={16} />
        </button>
        {images.length > 1 && (
          <>
            <button onClick={e => { e.stopPropagation(); prev() }} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-[rgba(10,10,10,0.7)] flex items-center justify-center text-[#C9A84C] opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronLeft size={18} />
            </button>
            <button onClick={e => { e.stopPropagation(); next() }} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-[rgba(10,10,10,0.7)] flex items-center justify-center text-[#C9A84C] opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button key={img.id} onClick={() => setActive(i)}
              className={`relative w-16 h-16 shrink-0 overflow-hidden border-2 transition-all ${i === active ? 'border-[#C9A84C]' : 'border-transparent opacity-60 hover:opacity-100'}`}>
              <Image src={img.url} alt={img.alt_text ?? ''} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {zoomed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6 cursor-zoom-out"
            onClick={() => setZoomed(false)}>
            <div className="relative max-w-2xl w-full aspect-square">
              <Image src={images[active].url} alt={images[active].alt_text ?? productName} fill className="object-contain" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
