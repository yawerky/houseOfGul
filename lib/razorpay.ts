import crypto from 'crypto'

// Minimal Razorpay client using the REST API (no SDK needed).
// Requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in the environment.

const API = 'https://api.razorpay.com/v1'

function authHeader(): string {
  const id = process.env.RAZORPAY_KEY_ID || ''
  const secret = process.env.RAZORPAY_KEY_SECRET || ''
  return 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64')
}

export interface RazorpayOrder {
  id: string
  amount: number
  currency: string
  receipt: string
  status: string
}

export async function createRazorpayOrder(amountInRupees: number, receipt: string): Promise<RazorpayOrder> {
  const res = await fetch(`${API}/orders`, {
    method: 'POST',
    headers: { Authorization: authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: Math.round(amountInRupees * 100), currency: 'INR', receipt }),
  })
  if (!res.ok) {
    throw new Error(`Razorpay order creation failed (${res.status}): ${await res.text()}`)
  }
  return res.json()
}

export async function fetchRazorpayOrder(razorpayOrderId: string): Promise<RazorpayOrder> {
  const res = await fetch(`${API}/orders/${encodeURIComponent(razorpayOrderId)}`, {
    headers: { Authorization: authHeader() },
  })
  if (!res.ok) {
    throw new Error(`Razorpay order lookup failed (${res.status})`)
  }
  return res.json()
}

export function verifyPaymentSignature(razorpayOrderId: string, paymentId: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET || ''
  const expected = crypto.createHmac('sha256', secret).update(`${razorpayOrderId}|${paymentId}`).digest('hex')
  const a = Buffer.from(expected)
  const b = Buffer.from(signature || '')
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}
