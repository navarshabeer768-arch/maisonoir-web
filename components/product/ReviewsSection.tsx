'use client'
import { useState } from 'react'
import type { Review } from '@/types'

interface ReviewsSectionProps {
  reviews: (Review & { profile: { first_name: string | null; last_name: string | null; avatar_url: string | null } | null })[]
  productId: string
  averageRating: number
  reviewCount: number
}

function StarRow({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  return (
    <div className={`flex gap-0.5 ${size === 'lg' ? '' : ''}`}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} className={`${size === 'lg' ? 'w-5 h-5' : 'w-3 h-3'} ${s <= Math.round(rating) ? 'text-[#C9A84C]' : 'text-[#3A3A3A]'}`} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function ReviewsSection({ reviews, productId, averageRating, reviewCount }: ReviewsSectionProps) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="section-eyebrow">Reviews</p>
          <h2 className="font-display text-3xl font-light">
            Customer <em className="gold-text">Experiences</em>
          </h2>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-outline-gold text-[9px] px-5 py-2.5">
          Write a Review
        </button>
      </div>

      {/* Summary */}
      {reviewCount > 0 && (
        <div className="flex items-center gap-8 mb-8 p-6 bg-[#141414] border border-[rgba(201,168,76,0.1)]">
          <div className="text-center">
            <p className="font-display text-5xl text-[#C9A84C]">{averageRating.toFixed(1)}</p>
            <StarRow rating={averageRating} size="lg" />
            <p className="text-[9px] text-[#5A5048] mt-1">{reviewCount} reviews</p>
          </div>
          <div className="flex-1 space-y-2">
            {[5,4,3,2,1].map(star => {
              const count = reviews.filter(r => Math.round(r.rating) === star).length
              const pct = reviewCount > 0 ? (count / reviewCount) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-[9px] text-[#5A5048] w-4">{star}</span>
                  <div className="flex-1 h-1 bg-[rgba(201,168,76,0.1)]">
                    <div className="h-full bg-[#C9A84C]" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[9px] text-[#5A5048] w-6">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 border border-[rgba(201,168,76,0.08)]">
          <p className="font-display text-2xl font-light text-[#5A5048]">Be the first to share your experience</p>
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map(review => {
            const initials = `${review.profile?.first_name?.[0] ?? ''}${review.profile?.last_name?.[0] ?? ''}`.toUpperCase() || '?'
            return (
              <div key={review.id} className="bg-[#141414] border border-[rgba(201,168,76,0.1)] p-6">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-9 h-9 bg-[rgba(201,168,76,0.1)] flex items-center justify-center text-[#C9A84C] text-sm font-display shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[11px]">{review.profile?.first_name} {review.profile?.last_name}</span>
                      {review.is_verified_purchase && (
                        <span className="text-[8px] tracking-[1px] text-emerald-400 border border-emerald-400/30 px-2 py-0.5">Verified</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <StarRow rating={review.rating} />
                      <span className="text-[9px] text-[#5A5048]">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                {review.title && <p className="text-[12px] font-medium mb-1.5">{review.title}</p>}
                {review.body && <p className="text-[11px] text-[#9A9080] leading-relaxed">{review.body}</p>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
