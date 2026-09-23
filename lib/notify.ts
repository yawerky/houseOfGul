import { prisma } from '@/lib/prisma'
import { getSettings } from '@/lib/settings'

// Order emails sent through Resend (https://resend.com).
// Needs RESEND_API_KEY. Optional: EMAIL_FROM (a sender on your verified
// domain, e.g. "House of Gul <orders@houseofgul.in>") and ORDER_ALERT_EMAIL
// (where new-order alerts go; defaults to the store email in Settings).
// Without RESEND_API_KEY nothing is sent and orders still work.

const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofgul.in'

const esc = (value: unknown) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

const rupees = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`

export function emailEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY)
}

async function sendEmail(to: string, subject: string, html: string, replyTo?: string) {
  if (!emailEnabled() || !to) return
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'House of Gul <onboarding@resend.dev>',
        to: [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    })
    if (!res.ok) console.error('Email send failed:', res.status, await res.text())
  } catch (error) {
    console.error('Email send error:', error)
  }
}

function layout(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#FDFBF7;font-family:Georgia,serif;color:#2C2C2C">
<div style="max-width:560px;margin:0 auto;padding:32px 24px">
<p style="text-align:center;letter-spacing:4px;font-size:12px;color:#A68B4B;margin:0 0 8px">HOUSE OF GUL</p>
<h1 style="text-align:center;font-weight:normal;font-size:24px;margin:0 0 24px">${esc(title)}</h1>
${body}
<p style="font-family:Arial,sans-serif;font-size:12px;color:#888;text-align:center;margin-top:32px">Where every bloom speaks · Jaipur</p>
</div></body></html>`
}

async function loadOrder(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: { select: { sku: true } } } } },
  })
}

type LoadedOrder = NonNullable<Awaited<ReturnType<typeof loadOrder>>>

function summary(order: LoadedOrder) {
  const rows = order.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0">${esc(i.name)}${i.product?.sku ? ` <span style="color:#888">(${esc(i.product.sku)})</span>` : ''} × ${i.quantity}</td><td style="text-align:right">${rupees(i.price * i.quantity)}</td></tr>`
    )
    .join('')
  const date = order.deliveryDate
    ? order.deliveryDate.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short', day: 'numeric', month: 'short' })
    : '—'
  const payment =
    order.paymentStatus === 'paid' ? 'Paid online' : order.paymentMethod === 'cod' ? 'Pay on delivery' : 'Payment pending'
  return `<table style="width:100%;font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">
${rows}
<tr><td style="padding:6px 0;border-top:1px solid #eee">Delivery</td><td style="text-align:right;border-top:1px solid #eee">${rupees(order.deliveryCharge)}</td></tr>
${order.discount > 0 ? `<tr><td style="padding:6px 0">Discount</td><td style="text-align:right">−${rupees(order.discount)}</td></tr>` : ''}
<tr><td style="padding:6px 0;font-weight:bold">Total (${payment})</td><td style="text-align:right;font-weight:bold">${rupees(order.total)}</td></tr>
</table>
<p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6">
<strong>Delivery:</strong> ${esc(date)} · ${esc(order.deliverySlot)}<br>
<strong>To:</strong> ${esc(order.shippingFirstName)} ${esc(order.shippingLastName)}, ${esc(order.shippingAddress)}${order.shippingApartment ? `, ${esc(order.shippingApartment)}` : ''}, ${esc(order.shippingCity)} ${esc(order.shippingPincode)}
</p>`
}

// New order: alert the store and confirm to the customer.
export async function sendNewOrderEmails(orderId: string) {
  if (!emailEnabled()) return
  const [order, settings] = await Promise.all([loadOrder(orderId), getSettings()])
  if (!order) return

  const payment =
    order.paymentStatus === 'paid' ? 'PAID ONLINE' : order.paymentMethod === 'cod' ? 'PAY ON DELIVERY' : 'PAYMENT PENDING'
  const storeTo = process.env.ORDER_ALERT_EMAIL || settings.storeEmail
  const phoneDigits = order.phone.replace(/\D/g, '').slice(-10)

  const storeBody = `
<p style="font-family:Arial,sans-serif;font-size:14px"><strong>${esc(order.orderNumber)}</strong> · ${payment}</p>
${summary(order)}
<p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6">
<strong>Phone:</strong> <a href="tel:+91${phoneDigits}">${esc(order.phone)}</a> ·
<a href="https://wa.me/91${phoneDigits}">WhatsApp</a><br>
<strong>Email:</strong> ${esc(order.email)}
${order.giftMessage ? `<br><strong>Card message:</strong> “${esc(order.giftMessage)}”${order.senderName ? ` — ${esc(order.senderName)}` : ''}` : ''}
${order.hidePrice ? '<br><strong>Hide the price from the recipient.</strong>' : ''}
${order.customerNote ? `<br><strong>Notes:</strong> ${esc(order.customerNote).replace(/\n/g, '<br>')}` : ''}
</p>
<p style="text-align:center;margin-top:24px"><a href="${siteUrl()}/admin/orders/${order.id}" style="background:#C4A35A;color:#fff;padding:12px 24px;text-decoration:none;font-family:Arial,sans-serif;font-size:14px">Open in Admin</a></p>`

  const customerBody = `
<p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6">Thank you for your order! Here are the details. ${
    order.paymentMethod === 'cod' && order.paymentStatus !== 'paid'
      ? 'You can pay by cash or UPI when your flowers arrive — we will call you to confirm.'
      : ''
  }</p>
<p style="font-family:Arial,sans-serif;font-size:14px"><strong>Order number:</strong> ${esc(order.orderNumber)}</p>
${summary(order)}
<p style="text-align:center;margin-top:24px"><a href="${siteUrl()}/track-order?order=${encodeURIComponent(order.orderNumber)}" style="background:#C4A35A;color:#fff;padding:12px 24px;text-decoration:none;font-family:Arial,sans-serif;font-size:14px">Track your order</a></p>
<p style="font-family:Arial,sans-serif;font-size:13px;color:#666;text-align:center">Questions? Call or WhatsApp us at ${esc(settings.storePhone)}.</p>`

  await Promise.all([
    sendEmail(storeTo, `New order ${order.orderNumber} — ${rupees(order.total)} (${payment.toLowerCase()})`, layout('New order received', storeBody), order.email),
    sendEmail(order.email, `Your House of Gul order ${order.orderNumber}`, layout('Thank you for your order', customerBody), settings.storeEmail),
  ])
}

const customerStatusText: Record<string, { subject: string; line: string }> = {
  confirmed: { subject: 'is confirmed', line: 'Your order is confirmed. Our florists will begin arranging your flowers.' },
  'out-for-delivery': { subject: 'is out for delivery', line: 'Your flowers are on their way!' },
  shipped: { subject: 'is on its way', line: 'Your flowers have left our studio and are on their way.' },
  delivered: { subject: 'has been delivered', line: 'Your flowers have been delivered. Thank you for choosing House of Gul.' },
  cancelled: { subject: 'was cancelled', line: 'Your order has been cancelled. If you have questions, please contact us.' },
}

// Status change: let the customer know about the important steps.
export async function sendStatusEmail(orderId: string, status: string, note?: string) {
  const text = customerStatusText[status]
  if (!emailEnabled() || !text) return
  const [order, settings] = await Promise.all([loadOrder(orderId), getSettings()])
  if (!order) return
  const body = `
<p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6">${esc(text.line)}${note ? `<br><br>${esc(note)}` : ''}</p>
<p style="font-family:Arial,sans-serif;font-size:14px"><strong>Order number:</strong> ${esc(order.orderNumber)}</p>
<p style="text-align:center;margin-top:24px"><a href="${siteUrl()}/track-order?order=${encodeURIComponent(order.orderNumber)}" style="background:#C4A35A;color:#fff;padding:12px 24px;text-decoration:none;font-family:Arial,sans-serif;font-size:14px">Track your order</a></p>
<p style="font-family:Arial,sans-serif;font-size:13px;color:#666;text-align:center">Questions? Call or WhatsApp us at ${esc(settings.storePhone)}.</p>`
  await sendEmail(order.email, `Your order ${order.orderNumber} ${text.subject}`, layout('Order update', body), settings.storeEmail)
}

// A message from the contact form. The enquiry is already saved to the
// database and shows in Admin → Inquiries; this puts a copy in the store
// inbox so it is not missed. Reply-to is the sender, so replying from the
// inbox writes straight back to them.
export async function sendInquiryEmail(inquiryId: string) {
  const inquiry = await prisma.inquiry.findUnique({ where: { id: inquiryId } })
  if (!inquiry) return

  const settings = await getSettings()
  const to = process.env.ORDER_ALERT_EMAIL || settings.storeEmail
  if (!to) return

  const row = (label: string, value: unknown) =>
    value
      ? `<tr><td style="padding:4px 12px 4px 0;color:#888;font-size:13px">${esc(label)}</td><td style="padding:4px 0;font-size:14px">${esc(value)}</td></tr>`
      : ''

  const body = `
<table style="width:100%;border-collapse:collapse;margin-bottom:20px">
${row('Name', inquiry.name)}
${row('Email', inquiry.email)}
${row('Phone', inquiry.phone)}
${row('About', inquiry.type)}
${row('Event date', inquiry.eventDate ? inquiry.eventDate.toDateString() : null)}
${row('Budget', inquiry.budget)}
${row('Guests', inquiry.guests)}
</table>
<p style="font-size:15px;line-height:1.6;white-space:pre-line;border-left:2px solid #A68B4B;padding-left:16px;margin:0">${esc(inquiry.message)}</p>
<p style="font-family:Arial,sans-serif;font-size:13px;color:#888;margin-top:28px">Reply to this email to answer ${esc(inquiry.name)} directly, or open it in <a href="${siteUrl()}/admin/inquiries" style="color:#A68B4B">Admin → Inquiries</a>.</p>`

  await sendEmail(to, `New enquiry from ${inquiry.name}`, layout('A new message', body), inquiry.email)
}

// Someone applied through the Careers page. The application is already saved
// and shows in Admin → Applications; this puts a note in the store inbox so
// the owner sees it. The CV itself is never attached or linked — it is
// personal data and only opens from admin, behind the login.
export async function sendJobApplicationEmail(applicationId: string) {
  const application = await prisma.jobApplication.findUnique({ where: { id: applicationId } })
  if (!application) return

  const settings = await getSettings()
  const to = process.env.ORDER_ALERT_EMAIL || settings.storeEmail
  if (!to) return

  const row = (label: string, value: unknown) =>
    value
      ? `<tr><td style="padding:4px 12px 4px 0;color:#888;font-size:13px">${esc(label)}</td><td style="padding:4px 0;font-size:14px">${esc(value)}</td></tr>`
      : ''

  const body = `
<table style="width:100%;border-collapse:collapse;margin-bottom:20px">
${row('Name', application.name)}
${row('Applying for', application.jobTitle)}
${row('Email', application.email)}
${row('Phone', application.phone)}
${row('CV', `${application.cvName} · ${Math.max(1, Math.round(application.cvSize / 1024))} KB`)}
</table>
${
  application.note
    ? `<p style="font-size:15px;line-height:1.6;white-space:pre-line;border-left:2px solid #A68B4B;padding-left:16px;margin:0">${esc(application.note)}</p>`
    : ''
}
<p style="text-align:center;margin-top:24px"><a href="${siteUrl()}/admin/applications" style="background:#C4A35A;color:#fff;padding:12px 24px;text-decoration:none;font-family:Arial,sans-serif;font-size:14px">Open the application</a></p>
<p style="font-family:Arial,sans-serif;font-size:13px;color:#888;margin-top:20px">The CV opens from Admin → Applications. Reply to this email to write to ${esc(application.name)} directly.</p>`

  await sendEmail(to, `Job application from ${application.name}`, layout('A new application', body), application.email)
}
