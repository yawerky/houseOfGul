'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, type: data.type || 'general' }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Could not send')
      form.reset()
      setStatus('sent')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send')
      setStatus('error')
    }
  }

  const field =
    'w-full border border-blush-dark/30 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal-light/60 focus:border-gold focus:outline-none transition-colors duration-300'

  if (status === 'sent') {
    return (
      <div className="border border-gold/40 bg-white px-6 py-10 text-center">
        <p className="font-serif text-2xl text-charcoal mb-3">Thank you</p>
        <p className="text-sm text-charcoal-light">
          Your message has reached us. We will reply to the address you gave.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 text-xs tracking-widest uppercase text-gold hover:text-charcoal transition-colors duration-300"
        >
          Write another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input name="name" required placeholder="Your name" className={field} />
        <input name="email" type="email" required placeholder="Email" className={field} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input name="phone" placeholder="Phone (optional)" className={field} />
        <select name="type" defaultValue="general" className={field}>
          <option value="general">General enquiry</option>
          <option value="wedding">Wedding flowers</option>
          <option value="corporate">Corporate order</option>
          <option value="support">An existing order</option>
        </select>
      </div>
      <textarea
        name="message"
        required
        rows={5}
        placeholder="How can we help?"
        className={field}
      />
      {status === 'error' && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="px-8 py-3 text-xs tracking-widest uppercase border border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory transition-colors duration-300 disabled:opacity-50"
      >
        {status === 'sending' ? 'Sending' : 'Send message'}
      </button>
    </form>
  )
}
