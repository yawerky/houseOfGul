'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface Message {
  id: number
  type: 'bot' | 'user'
  text: string
  options?: string[]
}

const quickReplies = [
  'Track my order',
  'Delivery areas',
  'Same-day delivery',
  'Custom bouquet',
]

const responses: Record<string, string> = {
  'track': 'To track your order, please visit our Track Order page at /track-order or provide your order ID and we\'ll look it up for you.',
  'delivery': 'We offer same-day flower delivery across Jaipur! Orders placed between 6 AM and 2 PM are delivered the same day by 6 PM; orders after 2 PM arrive by 12 PM (noon). Delivery is free across Jaipur.',
  'areas': 'We deliver to all major areas in Jaipur including Malviya Nagar, C-Scheme, Vaishali Nagar, Mansarovar, Jagatpura, Tonk Road, MI Road, and more!',
  'same-day': 'Yes! We offer same-day delivery in Jaipur. Place your order before 2 PM for same-day delivery. Express delivery within 3 hours is also available.',
  'custom': 'We\'d love to create a custom bouquet for you! Please share your preferences (flowers, colors, budget) and we\'ll design something special.',
  'price': 'Our bouquets start from ₹499. We have options for every budget - from everyday arrangements to luxury premium bouquets.',
  'occasion': 'We have flowers perfect for every occasion - birthdays, anniversaries, weddings, congratulations, sympathy, and more. What occasion are you shopping for?',
  'wedding': 'We offer complete wedding flower services in Jaipur - bridal bouquets, venue decoration, centerpieces, and more. Contact us for a custom quote.',
  'roses': 'Our rose arrangements are very popular! We have red roses for romance, pink for elegance, white for purity, and mixed bouquets for variety.',
  'payment': 'We accept all major payment methods - UPI, credit/debit cards, net banking, and cash on delivery (COD) in Jaipur.',
  'return': 'We have a 100% freshness guarantee. If you\'re not satisfied with your flowers, contact us within 24 hours for a replacement or refund.',
}

function getBotResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  for (const [keyword, response] of Object.entries(responses)) {
    if (lowerMessage.includes(keyword)) {
      return response
    }
  }

  // Default response
  return 'Thank you for your message! Our floral concierge will get back to you shortly. For immediate assistance, please call us at +91-9461900344 or WhatsApp us.'
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      text: 'Namaste! Welcome to House of Gul - Jaipur\'s premium flower delivery service. How may I assist you today?',
      options: quickReplies,
    },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = (text?: string) => {
    const msgText = text || message
    if (!msgText.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { id: Date.now(), type: 'user', text: msgText }])
    setMessage('')

    // Simulate typing delay and add bot response
    setTimeout(() => {
      const botResponse = getBotResponse(msgText)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: 'bot',
          text: botResponse,
        },
      ])
    }, 800)
  }

  const handleQuickReply = (reply: string) => {
    handleSend(reply)
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300',
          isOpen ? 'bg-charcoal text-ivory' : 'bg-gold text-white hover:bg-gold-dark'
        )}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          'fixed bottom-24 right-6 z-40 w-[350px] max-w-[calc(100vw-3rem)] bg-ivory rounded-sm shadow-2xl transition-all duration-500 overflow-hidden',
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        {/* Header */}
        <div className="bg-charcoal text-ivory p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-serif text-lg">Floral Concierge</h3>
              <p className="text-xs text-ivory/70 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Online • Jaipur
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id}>
              <div
                className={cn(
                  'max-w-[85%] p-3 rounded-sm',
                  msg.type === 'bot'
                    ? 'bg-champagne text-charcoal'
                    : 'bg-gold text-white ml-auto'
                )}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
              {/* Quick Reply Options */}
              {msg.type === 'bot' && msg.options && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {msg.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleQuickReply(option)}
                      className="text-xs px-3 py-1.5 border border-gold text-gold rounded-sm hover:bg-gold hover:text-white transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="border-t border-blush-dark/10 px-4 py-2 bg-champagne/30">
          <div className="flex gap-2 overflow-x-auto pb-1">
            <a
              href="tel:+919461900344"
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white text-charcoal rounded-sm hover:bg-gold hover:text-white transition-colors whitespace-nowrap"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call
            </a>
            <a
              href="https://wa.me/919461900344"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-green-500 text-white rounded-sm hover:bg-green-600 transition-colors whitespace-nowrap"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-blush-dark/20 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 bg-white border border-blush-dark/20 rounded-sm text-sm focus:outline-none focus:border-gold"
            />
            <button
              onClick={() => handleSend()}
              className="px-4 py-2 bg-gold text-white rounded-sm hover:bg-gold-dark transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
