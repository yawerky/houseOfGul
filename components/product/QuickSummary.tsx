interface QuickSummaryProps {
  name: string
  category: string
  flowers: string[]
  deliveryInfo: string
  occasion?: string | null
}

export default function QuickSummary({
  name,
  category,
  flowers,
  deliveryInfo,
  occasion,
}: QuickSummaryProps) {
  return (
    <section className="bg-ivory py-8 border-t border-b border-blush-dark/10">
      <div className="luxury-container">
        <h3 className="font-serif text-lg text-charcoal mb-4 text-center">
          Quick Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {/* Category */}
          <div className="p-4 bg-white rounded-sm">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-champagne flex items-center justify-center">
              <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <p className="text-xs text-charcoal-light uppercase tracking-wider mb-1">Category</p>
            <p className="text-sm font-medium text-charcoal">{category}</p>
          </div>

          {/* Flowers */}
          <div className="p-4 bg-white rounded-sm">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-champagne flex items-center justify-center">
              <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <p className="text-xs text-charcoal-light uppercase tracking-wider mb-1">Contains</p>
            <p className="text-sm font-medium text-charcoal">
              {flowers.length > 0 ? flowers.slice(0, 2).join(', ') : 'Fresh Blooms'}
              {flowers.length > 2 && ` +${flowers.length - 2} more`}
            </p>
          </div>

          {/* Occasion */}
          <div className="p-4 bg-white rounded-sm">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-champagne flex items-center justify-center">
              <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-xs text-charcoal-light uppercase tracking-wider mb-1">Perfect For</p>
            <p className="text-sm font-medium text-charcoal">{occasion || 'All Occasions'}</p>
          </div>

          {/* Delivery */}
          <div className="p-4 bg-white rounded-sm">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-champagne flex items-center justify-center">
              <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
            </div>
            <p className="text-xs text-charcoal-light uppercase tracking-wider mb-1">Delivery</p>
            <p className="text-sm font-medium text-charcoal">Same Day Jaipur</p>
          </div>
        </div>

        {/* AI-Ready Summary Text */}
        <div className="mt-6 p-4 bg-champagne/30 rounded-sm">
          <p className="text-sm text-charcoal-light text-center">
            <strong className="text-charcoal">{name}</strong> is a beautiful {category.toLowerCase()} arrangement
            {flowers.length > 0 && ` featuring ${flowers.slice(0, 3).join(', ')}`}.
            Perfect for {occasion?.toLowerCase() || 'any occasion'}.
            Available with same-day delivery in Jaipur.
          </p>
        </div>
      </div>
    </section>
  )
}
