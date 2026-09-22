'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Review, RatingSummary } from '@/lib/reviews'
import { cn } from '@/lib/utils'

interface ProductReviewsProps {
  reviews: Review[]
  summary: RatingSummary
  productName: string
}

type FilterType = 'all' | 'with-images' | 'with-video' | '5-star' | '4-star' | '3-star' | 'verified'
type SortType = 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'

export default function ProductReviews({ reviews, summary, productName }: ProductReviewsProps) {
  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortType>('newest')
  const [showAll, setShowAll] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const filteredReviews = useMemo(() => {
    let result = [...reviews]

    // Apply filter
    switch (filter) {
      case 'with-images':
        result = result.filter(r => r.images && r.images.length > 0)
        break
      case 'with-video':
        result = result.filter(r => r.video)
        break
      case '5-star':
        result = result.filter(r => r.rating === 5)
        break
      case '4-star':
        result = result.filter(r => r.rating === 4)
        break
      case '3-star':
        result = result.filter(r => r.rating <= 3)
        break
      case 'verified':
        result = result.filter(r => r.verified)
        break
    }

    // Apply sort
    switch (sort) {
      case 'newest':
        result.sort((a, b) => b.date.getTime() - a.date.getTime())
        break
      case 'oldest':
        result.sort((a, b) => a.date.getTime() - b.date.getTime())
        break
      case 'highest':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'lowest':
        result.sort((a, b) => a.rating - b.rating)
        break
      case 'helpful':
        result.sort((a, b) => b.helpful - a.helpful)
        break
    }

    return result
  }, [reviews, filter, sort])

  const displayedReviews = showAll ? filteredReviews : filteredReviews.slice(0, 10)

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClass = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={cn(sizeClass, star <= rating ? 'text-yellow-400' : 'text-gray-300')}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  return (
    <section className="bg-white py-8 md:py-12" id="reviews">
      <div className="luxury-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-2">
              Customer Reviews
            </h2>
            <p className="text-charcoal-light">
              {summary.total} reviews for {productName}
            </p>
          </div>
          <button className="mt-4 md:mt-0 px-6 py-2.5 bg-gold text-white rounded-sm hover:bg-gold-dark transition-colors">
            Write a Review
          </button>
        </div>

        {/* Summary Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-8 p-6 bg-ivory rounded-sm">
          {/* Average Rating */}
          <div className="text-center md:border-r border-blush-dark/20">
            <div className="text-5xl font-serif text-charcoal mb-2">{summary.average}</div>
            {renderStars(Math.round(summary.average), 'lg')}
            <p className="text-sm text-charcoal-light mt-2">Based on {summary.total} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="md:col-span-2 space-y-2">
            {summary.distribution.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center gap-3">
                <button
                  onClick={() => setFilter(`${stars}-star` as FilterType)}
                  className="flex items-center gap-1 text-sm text-charcoal hover:text-gold transition-colors min-w-[60px]"
                >
                  {stars} <span className="text-yellow-400">★</span>
                </button>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-charcoal-light min-w-[40px]">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'all', label: 'All Reviews' },
            { key: 'with-images', label: 'With Photos' },
            { key: 'with-video', label: 'With Video' },
            { key: '5-star', label: '5 Star' },
            { key: '4-star', label: '4 Star' },
            { key: '3-star', label: '3 Star & Below' },
            { key: 'verified', label: 'Verified Purchase' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as FilterType)}
              className={cn(
                'px-4 py-2 text-sm rounded-sm border transition-colors',
                filter === key
                  ? 'bg-charcoal text-white border-charcoal'
                  : 'bg-white text-charcoal border-blush-dark/30 hover:border-gold'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm text-charcoal-light">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            className="px-3 py-2 border border-blush-dark/30 rounded-sm text-sm focus:outline-none focus:border-gold"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
          <span className="text-sm text-charcoal-light ml-auto">
            Showing {displayedReviews.length} of {filteredReviews.length} reviews
          </span>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {displayedReviews.map((review) => (
            <div key={review.id} className="border-b border-blush-dark/10 pb-6">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-champagne flex items-center justify-center text-charcoal font-medium">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-charcoal">{review.name}</span>
                      {review.verified && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-charcoal-light">
                      <span>{review.location}, Jaipur</span>
                      <span>•</span>
                      <span>{review.dateFormatted}</span>
                    </div>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>

              {/* Review Content */}
              <p className="text-charcoal mb-4 leading-relaxed">{review.content}</p>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {review.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className="relative w-20 h-20 rounded overflow-hidden border border-blush-dark/20 hover:border-gold transition-colors"
                    >
                      <div className="w-full h-full bg-champagne flex items-center justify-center">
                        <svg className="w-8 h-8 text-charcoal-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Video Review Badge */}
              {review.video && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-sm text-sm mb-4">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Video Review Available
                </div>
              )}

              {/* Seller Reply */}
              {review.reply && (
                <div className="mt-4 ml-6 p-4 bg-champagne/50 rounded-sm border-l-2 border-gold">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-charcoal text-sm">House of Gul</span>
                    <span className="text-xs text-charcoal-light">{review.reply.date}</span>
                  </div>
                  <p className="text-sm text-charcoal-light">{review.reply.content}</p>
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center gap-4 mt-4">
                <button className="flex items-center gap-1.5 text-sm text-charcoal-light hover:text-charcoal transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  Helpful ({review.helpful})
                </button>
                <button className="text-sm text-charcoal-light hover:text-charcoal transition-colors">
                  Report
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {filteredReviews.length > 10 && !showAll && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(true)}
              className="px-8 py-3 border border-charcoal text-charcoal rounded-sm hover:bg-charcoal hover:text-white transition-colors"
            >
              Load More Reviews ({filteredReviews.length - 10} more)
            </button>
          </div>
        )}

        {/* No Reviews Message */}
        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-charcoal-light">No reviews match your filter criteria.</p>
            <button
              onClick={() => setFilter('all')}
              className="mt-4 text-gold hover:underline"
            >
              View all reviews
            </button>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-2xl w-full aspect-square bg-charcoal rounded-sm flex items-center justify-center">
            <p className="text-white">Customer Photo</p>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gold"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
