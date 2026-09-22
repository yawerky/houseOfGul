'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import LineIcon from '@/components/ui/LineIcon'

interface ProductSpecificationsProps {
  name: string
  description: string
  story?: string
  flowers: string[]
  category: string
  occasion?: string
  deliveryInfo: string
  season?: string
}

export default function ProductSpecifications({
  name,
  description,
  story,
  flowers,
  category,
  occasion,
  deliveryInfo,
  season,
}: ProductSpecificationsProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'care'>('description')

  const specifications = [
    { label: 'Product Name', value: name },
    { label: 'Category', value: category },
    { label: 'Occasion', value: occasion || 'All Occasions' },
    { label: 'Season', value: season === 'all' ? 'Year Round' : season || 'Year Round' },
    { label: 'Flowers Included', value: flowers.length > 0 ? flowers.join(', ') : 'Premium Fresh Flowers' },
    { label: 'Delivery', value: 'Same Day Delivery in Jaipur' },
    { label: 'Freshness Guarantee', value: '7-10 Days' },
    { label: 'Gift Wrapping', value: 'Premium Packaging Included' },
    { label: 'Message Card', value: 'Free Personalized Card' },
    { label: 'Country of Origin', value: 'India' },
  ]

  const careInstructions = [
    { icon: '💧', title: 'Water Daily', desc: 'Change water every 2 days to keep flowers fresh' },
    { icon: '✂️', title: 'Trim Stems', desc: 'Cut stems at an angle before placing in water' },
    { icon: '☀️', title: 'Avoid Sunlight', desc: 'Keep away from direct sunlight and heat sources' },
    { icon: '🍎', title: 'No Fruits Nearby', desc: 'Fruits release ethylene which wilts flowers faster' },
    { icon: '❄️', title: 'Cool Location', desc: 'Keep in a cool room for longer lasting blooms' },
    { icon: '🌿', title: 'Remove Leaves', desc: 'Remove leaves below water line to prevent bacteria' },
  ]

  return (
    <section className="bg-white py-8 md:py-12 border-t border-blush-dark/10">
      <div className="luxury-container">
        {/* Tabs */}
        <div className="flex border-b border-blush-dark/20 mb-8">
          {[
            { key: 'description', label: 'Description' },
            { key: 'specifications', label: 'Specifications' },
            { key: 'care', label: 'Care Instructions' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={cn(
                'px-6 py-4 text-sm font-medium border-b-2 -mb-px transition-colors',
                activeTab === key
                  ? 'border-gold text-gold'
                  : 'border-transparent text-charcoal-light hover:text-charcoal'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className="prose prose-charcoal max-w-none">
            {/* Product Highlights */}
            <div className="grid md:grid-cols-4 gap-4 mb-8 not-prose">
              {[
                { icon: 'flower', text: '100% Fresh Flowers' },
                { icon: 'truck', text: 'Same Day Delivery' },
                { icon: 'gift', text: 'Premium Packaging' },
                { icon: 'badge', text: 'Quality Guaranteed' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-champagne/30 rounded-sm">
                  <LineIcon name={item.icon} className="w-7 h-7 flex-shrink-0 text-gold" />
                  <span className="text-sm font-medium text-charcoal">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Main Description */}
            <h3 className="font-serif text-xl text-charcoal mb-4">About {name}</h3>
            <p className="text-charcoal-light leading-relaxed mb-6">{description}</p>

            {story && (
              <>
                <h3 className="font-serif text-xl text-charcoal mb-4">The Story Behind This Arrangement</h3>
                <p className="text-charcoal-light leading-relaxed mb-6">{story}</p>
              </>
            )}

            {/* What's Included */}
            {flowers.length > 0 && (
              <>
                <h3 className="font-serif text-xl text-charcoal mb-4">What's Included</h3>
                <ul className="grid sm:grid-cols-2 gap-2 mb-6 not-prose">
                  {flowers.map((flower, i) => (
                    <li key={i} className="flex items-center gap-2 text-charcoal-light">
                      <svg className="w-5 h-5 text-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {flower}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Delivery Info */}
            <div className="p-6 bg-green-50 rounded-sm border border-green-200 not-prose">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-charcoal mb-1">Delivery Information</h4>
                  <p className="text-sm text-charcoal-light">{deliveryInfo}</p>
                  <ul className="mt-3 space-y-1 text-sm text-charcoal-light">
                    <li>• Order 6 AM – 2 PM: delivered the same day by 6 PM</li>
                    <li>• Order after 2 PM: delivered by 12 PM (noon)</li>
                    <li>• Free delivery across Jaipur</li>
                    <li>• Available across all Jaipur localities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === 'specifications' && (
          <div className="overflow-hidden rounded-sm border border-blush-dark/20">
            <table className="w-full">
              <tbody>
                {specifications.map((spec, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-ivory' : 'bg-white'}>
                    <td className="px-6 py-4 text-sm font-medium text-charcoal w-1/3 border-r border-blush-dark/10">
                      {spec.label}
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal-light">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Care Instructions Tab */}
        {activeTab === 'care' && (
          <div>
            <p className="text-charcoal-light mb-6">
              Follow these simple care tips to keep your flowers fresh and beautiful for longer.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {careInstructions.map((item, i) => (
                <div key={i} className="p-5 bg-ivory rounded-sm">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h4 className="font-medium text-charcoal mb-1">{item.title}</h4>
                  <p className="text-sm text-charcoal-light">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Video Tutorial Placeholder */}
            <div className="mt-8 p-8 bg-charcoal/5 rounded-sm text-center">
              <svg className="w-16 h-16 mx-auto text-charcoal-light mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="font-serif text-lg text-charcoal mb-2">Flower Care Video Guide</h4>
              <p className="text-sm text-charcoal-light">
                Watch our expert florist demonstrate proper flower care techniques
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
