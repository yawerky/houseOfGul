'use client'

import { useState } from 'react'
import { FAQ } from '@/lib/reviews'
import { cn } from '@/lib/utils'

interface ProductFAQProps {
  faqs: FAQ[]
  productName: string
}

export default function ProductFAQ({ faqs, productName }: ProductFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [showAskForm, setShowAskForm] = useState(false)
  const [question, setQuestion] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit to an API
    alert('Thank you! Your question has been submitted and will be answered soon.')
    setQuestion('')
    setShowAskForm(false)
  }

  return (
    <section className="bg-ivory py-8 md:py-12" id="faqs">
      <div className="luxury-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-2">
              Questions & Answers
            </h2>
            <p className="text-charcoal-light">
              {faqs.length} questions answered about {productName}
            </p>
          </div>
          <button
            onClick={() => setShowAskForm(!showAskForm)}
            className="mt-4 md:mt-0 px-6 py-2.5 bg-gold text-white rounded-sm hover:bg-gold-dark transition-colors"
          >
            Ask a Question
          </button>
        </div>

        {/* Ask Question Form */}
        {showAskForm && (
          <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-sm border border-blush-dark/20">
            <label className="block text-sm font-medium text-charcoal mb-2">
              Your Question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like to know about this product?"
              className="w-full px-4 py-3 border border-blush-dark/20 rounded-sm focus:outline-none focus:border-gold resize-none"
              rows={3}
              required
            />
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-gold text-white rounded-sm hover:bg-gold-dark transition-colors"
              >
                Submit Question
              </button>
              <button
                type="button"
                onClick={() => setShowAskForm(false)}
                className="px-6 py-2 border border-charcoal text-charcoal rounded-sm hover:bg-charcoal hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-white rounded-sm border border-blush-dark/20 overflow-hidden"
            >
              {/* Question */}
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-start justify-between p-5 text-left hover:bg-champagne/30 transition-colors"
              >
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gold bg-gold/10 px-2 py-0.5 rounded">Q</span>
                    <span className="text-xs text-charcoal-light">{faq.askedBy} • {faq.date}</span>
                  </div>
                  <h3 className="font-medium text-charcoal">{faq.question}</h3>
                </div>
                <svg
                  className={cn(
                    'w-5 h-5 text-charcoal-light transition-transform flex-shrink-0 mt-1',
                    openIndex === index && 'rotate-180'
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Answer */}
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300',
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                )}
              >
                <div className="px-5 pb-5 border-t border-blush-dark/10">
                  <div className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">A</span>
                      <span className="text-xs text-charcoal-light">House of Gul • Seller</span>
                    </div>
                    <p className="text-charcoal-light leading-relaxed">{faq.answer}</p>

                    {/* Helpful */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-blush-dark/10">
                      <span className="text-sm text-charcoal-light">{faq.helpful} people found this helpful</span>
                      <button className="text-sm text-gold hover:underline">
                        Was this helpful?
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See All Questions */}
        <div className="text-center mt-8">
          <button className="text-gold hover:underline">
            See all questions ({faqs.length})
          </button>
        </div>
      </div>
    </section>
  )
}
