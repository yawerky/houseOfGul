'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Welcome to House of Gul. How may I assist you with your floral needs today?',
    },
  ])

  const handleSend = () => {
    if (!message.trim()) return

    setMessages([...messages, { id: Date.now(), type: 'user', text: message }])
    setMessage('')

    // Simulated bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: 'bot',
          text: 'Thank you for your message. Our floral concierge will respond shortly. For immediate assistance, please call us at +1 (888) HOUSE-GUL.',
        },
      ])
    }, 1000)
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
          <h3 className="font-serif text-lg">Floral Concierge</h3>
          <p className="text-xs text-ivory/70">We typically reply within minutes</p>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'max-w-[80%] p-3 rounded-sm',
                msg.type === 'bot'
                  ? 'bg-champagne text-charcoal'
                  : 'bg-gold text-white ml-auto'
              )}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          ))}
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
              onClick={handleSend}
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
