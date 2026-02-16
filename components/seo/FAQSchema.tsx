export default function FAQSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofgul.com'

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Do you deliver flowers in Jaipur?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! House of Gul offers same-day flower delivery across Jaipur including areas like Malviya Nagar, C-Scheme, Vaishali Nagar, Mansarovar, Raja Park, Tonk Road, MI Road, Bani Park, and all other localities in Jaipur.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are your delivery timings in Jaipur?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We deliver flowers in Jaipur from 9 AM to 9 PM, 7 days a week. We also offer midnight flower delivery for special occasions. Same-day delivery is available for orders placed before 4 PM.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does flower delivery cost in Jaipur?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer free delivery on orders above ₹999 within Jaipur city limits. For orders below ₹999, a nominal delivery charge applies. Midnight delivery has an additional charge. Check our website for current delivery rates.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I order flowers online for same-day delivery in Jaipur?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, you can order flowers online at houseofgul.com for same-day delivery in Jaipur. Place your order before 4 PM for same-day delivery. We accept all major payment methods including UPI, credit cards, debit cards, and net banking.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you provide wedding flower decoration in Jaipur?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, House of Gul specializes in wedding flower decoration in Jaipur. We offer bridal bouquets, venue decoration, mandap decoration, car decoration, and complete wedding floral services. Contact us for custom wedding packages.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which areas in Jaipur do you deliver to?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We deliver flowers to all areas in Jaipur including Malviya Nagar, Vaishali Nagar, Mansarovar, C-Scheme, Raja Park, Tonk Road, Jagatpura, Sitapura, Sanganer, Ajmer Road, Sirsi Road, Jhotwara, Vidhyadhar Nagar, Sodala, and surrounding areas.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are your flowers fresh?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely! We source fresh flowers daily and our bouquets are handcrafted on the day of delivery to ensure maximum freshness. We guarantee that your flowers will stay fresh for at least 5-7 days with proper care.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I customize my flower bouquet?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we offer customized flower arrangements for all occasions. You can choose specific flowers, colors, and add personalized messages or gifts. Contact us for bespoke floral designs.',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema),
      }}
    />
  )
}
