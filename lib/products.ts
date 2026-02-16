export interface Product {
  id: string
  name: string
  price: number
  description: string
  story: string
  flowers: string[]
  images: string[]
  category: string
  featured: boolean
  deliveryInfo: string
  occasions: string[]
  season: string
  rating: number
  reviewCount: number
}

export interface Review {
  id: string
  productId: string
  author: string
  rating: number
  title: string
  content: string
  date: string
  verified: boolean
}

export interface FlowerMeaning {
  id: string
  name: string
  meaning: string
  symbolism: string[]
  colors: string[]
  season: string
  careLevel: string
  image: string
}

export const occasions = [
  { id: 'wedding', label: 'Wedding', icon: '💒' },
  { id: 'anniversary', label: 'Anniversary', icon: '💕' },
  { id: 'birthday', label: 'Birthday', icon: '🎂' },
  { id: 'sympathy', label: 'Sympathy', icon: '🕊️' },
  { id: 'congratulations', label: 'Congratulations', icon: '🎉' },
  { id: 'thank-you', label: 'Thank You', icon: '🙏' },
  { id: 'romance', label: 'Romance', icon: '❤️' },
  { id: 'new-baby', label: 'New Baby', icon: '👶' },
]

export const seasons = [
  { id: 'spring', label: 'Spring', color: '#F4E4E1' },
  { id: 'summer', label: 'Summer', color: '#FFF5E6' },
  { id: 'autumn', label: 'Autumn', color: '#F5E6D3' },
  { id: 'winter', label: 'Winter', color: '#E8EDF2' },
]

export const products: Product[] = [
  {
    id: 'eternal-elegance',
    name: 'Eternal Elegance',
    price: 285,
    description: 'A sophisticated arrangement of ivory roses and delicate orchids, designed for moments of timeless grace.',
    story: 'Inspired by the soft morning light of Parisian ateliers, Eternal Elegance captures the essence of refined beauty. Each bloom is hand-selected at peak perfection, arranged to create a cascading silhouette that speaks of quiet luxury.',
    flowers: ['Ivory Roses', 'Phalaenopsis Orchids', 'White Ranunculus', 'Eucalyptus'],
    images: [
      'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80',
      'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&q=80',
      'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80',
    ],
    category: 'Signature',
    featured: true,
    deliveryInfo: 'Same-day delivery available in select areas. Arrives in our signature House of Gul packaging.',
    occasions: ['wedding', 'anniversary', 'sympathy'],
    season: 'all',
    rating: 4.9,
    reviewCount: 127,
  },
  {
    id: 'blushing-romance',
    name: 'Blushing Romance',
    price: 225,
    description: 'Soft pink peonies meet garden roses in this romantic expression of heartfelt sentiment.',
    story: 'Born from the gardens of the French countryside, Blushing Romance tells a story of tender affection. The gentle pink hues create an atmosphere of warmth and intimacy.',
    flowers: ['Pink Peonies', 'Garden Roses', 'Sweet Peas', 'Dusty Miller'],
    images: [
      'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
      'https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=800&q=80',
    ],
    category: 'Romance',
    featured: true,
    deliveryInfo: 'Same-day delivery available in select areas. Arrives in our signature House of Gul packaging.',
    occasions: ['romance', 'anniversary', 'birthday'],
    season: 'spring',
    rating: 4.8,
    reviewCount: 94,
  },
  {
    id: 'midnight-velvet',
    name: 'Midnight Velvet',
    price: 345,
    description: 'Deep burgundy roses and plum calla lilies create a dramatic statement of sophisticated allure.',
    story: 'For those who dare to make a statement, Midnight Velvet embodies the mystery of twilight hours. Rich, deep tones create an unforgettable impression.',
    flowers: ['Burgundy Roses', 'Plum Calla Lilies', 'Black Dahlias', 'Amaranthus'],
    images: [
      'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&q=80',
      'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80',
      'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=800&q=80',
    ],
    category: 'Signature',
    featured: true,
    deliveryInfo: 'Same-day delivery available in select areas. Arrives in our signature House of Gul packaging.',
    occasions: ['anniversary', 'congratulations'],
    season: 'autumn',
    rating: 5.0,
    reviewCount: 56,
  },
  {
    id: 'garden-poetry',
    name: 'Garden Poetry',
    price: 195,
    description: 'A whimsical collection of seasonal blooms arranged in an organic, flowing style.',
    story: 'Garden Poetry celebrates the untamed beauty of nature. Each arrangement is unique, reflecting the changing seasons and the artistry of our master florists.',
    flowers: ['Seasonal Garden Roses', 'Lisianthus', 'Astilbe', 'Mixed Greenery'],
    images: [
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
      'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=800&q=80',
      'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80',
    ],
    category: 'Garden',
    featured: true,
    deliveryInfo: 'Same-day delivery available in select areas. Arrives in our signature House of Gul packaging.',
    occasions: ['birthday', 'thank-you', 'congratulations'],
    season: 'summer',
    rating: 4.7,
    reviewCount: 83,
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    price: 265,
    description: 'Warm amber roses and golden ranunculus capture the magic of sunset.',
    story: 'Golden Hour is an ode to the most beautiful moment of the day. Warm, honeyed tones create a sense of peace and contentment.',
    flowers: ['Amber Roses', 'Golden Ranunculus', 'Champagne Carnations', 'Wheat Stems'],
    images: [
      'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
    ],
    category: 'Signature',
    featured: true,
    deliveryInfo: 'Same-day delivery available in select areas. Arrives in our signature House of Gul packaging.',
    occasions: ['thank-you', 'congratulations', 'birthday'],
    season: 'autumn',
    rating: 4.9,
    reviewCount: 71,
  },
  {
    id: 'pure-serenity',
    name: 'Pure Serenity',
    price: 215,
    description: 'An all-white arrangement of lilies and hydrangeas exuding peace and tranquility.',
    story: 'Pure Serenity brings calm to any space. The pristine white blooms create an atmosphere of quiet contemplation and refined simplicity.',
    flowers: ['White Lilies', 'Hydrangeas', 'White Tulips', 'Silver Dollar Eucalyptus'],
    images: [
      'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80',
      'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80',
      'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&q=80',
    ],
    category: 'Classic',
    featured: true,
    deliveryInfo: 'Same-day delivery available in select areas. Arrives in our signature House of Gul packaging.',
    occasions: ['sympathy', 'wedding', 'new-baby'],
    season: 'winter',
    rating: 4.8,
    reviewCount: 92,
  },
  {
    id: 'enchanted-garden',
    name: 'Enchanted Garden',
    price: 275,
    description: 'A lush, overflowing arrangement reminiscent of secret English gardens.',
    story: 'Step into an Enchanted Garden where every bloom tells a story. This abundant arrangement captures the romance of hidden garden pathways.',
    flowers: ['English Roses', 'Clematis', 'Foxglove', 'Jasmine Vines'],
    images: [
      'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=800&q=80',
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
      'https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=800&q=80',
    ],
    category: 'Garden',
    featured: true,
    deliveryInfo: 'Same-day delivery available in select areas. Arrives in our signature House of Gul packaging.',
    occasions: ['wedding', 'anniversary', 'romance'],
    season: 'spring',
    rating: 4.9,
    reviewCount: 68,
  },
  {
    id: 'royal-orchid',
    name: 'Royal Orchid',
    price: 395,
    description: 'Rare orchid varieties arranged in an architectural display of modern luxury.',
    story: 'Royal Orchid represents the pinnacle of floral artistry. Each exotic bloom is carefully positioned to create a living sculpture.',
    flowers: ['Cymbidium Orchids', 'Vanda Orchids', 'Oncidium', 'Tropical Foliage'],
    images: [
      'https://images.unsplash.com/photo-1518882605630-8eb936a8c281?w=800&q=80',
      'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80',
      'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80',
    ],
    category: 'Luxury',
    featured: true,
    deliveryInfo: 'Same-day delivery available in select areas. Arrives in our signature House of Gul packaging.',
    occasions: ['congratulations', 'anniversary', 'thank-you'],
    season: 'all',
    rating: 5.0,
    reviewCount: 43,
  },
]

export const reviews: Review[] = [
  {
    id: '1',
    productId: 'eternal-elegance',
    author: 'Sarah M.',
    rating: 5,
    title: 'Absolutely breathtaking',
    content: 'The arrangement exceeded all my expectations. The flowers were fresh, beautifully arranged, and the packaging was exquisite. My mother was moved to tears.',
    date: 'February 2026',
    verified: true,
  },
  {
    id: '2',
    productId: 'eternal-elegance',
    author: 'James L.',
    rating: 5,
    title: 'Worth every penny',
    content: 'I\'ve ordered from many florists, but House of Gul is in a league of its own. The attention to detail is remarkable.',
    date: 'January 2026',
    verified: true,
  },
  {
    id: '3',
    productId: 'blushing-romance',
    author: 'Emily R.',
    rating: 5,
    title: 'Perfect anniversary gift',
    content: 'My wife absolutely loved these. The peonies were enormous and the scent filled our entire home. Will definitely order again.',
    date: 'February 2026',
    verified: true,
  },
  {
    id: '4',
    productId: 'midnight-velvet',
    author: 'Alexandra K.',
    rating: 5,
    title: 'Dramatic and stunning',
    content: 'These flowers made such a statement at our dinner party. Everyone asked where I got them. The deep colors are even more beautiful in person.',
    date: 'January 2026',
    verified: true,
  },
]

export const flowerMeanings: FlowerMeaning[] = [
  {
    id: 'rose',
    name: 'Rose',
    meaning: 'Love, passion, and beauty',
    symbolism: ['Romance', 'Devotion', 'Admiration', 'Gratitude'],
    colors: ['Red - Deep love', 'Pink - Grace', 'White - Purity', 'Yellow - Friendship'],
    season: 'Summer',
    careLevel: 'Moderate',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
  },
  {
    id: 'peony',
    name: 'Peony',
    meaning: 'Prosperity, romance, and good fortune',
    symbolism: ['Happy Marriage', 'Compassion', 'Beauty', 'Honor'],
    colors: ['Pink - Romance', 'White - Shame/Bashfulness', 'Red - Passion'],
    season: 'Late Spring',
    careLevel: 'Easy',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=80',
  },
  {
    id: 'orchid',
    name: 'Orchid',
    meaning: 'Luxury, beauty, and strength',
    symbolism: ['Refinement', 'Thoughtfulness', 'Mature Charm', 'Exotic Beauty'],
    colors: ['White - Innocence', 'Purple - Royalty', 'Pink - Femininity'],
    season: 'Year-round',
    careLevel: 'Advanced',
    image: 'https://images.unsplash.com/photo-1518882605630-8eb936a8c281?w=800&q=80',
  },
  {
    id: 'lily',
    name: 'Lily',
    meaning: 'Purity, commitment, and rebirth',
    symbolism: ['Motherhood', 'Fertility', 'Devotion', 'Transience'],
    colors: ['White - Virtue', 'Orange - Passion', 'Pink - Prosperity'],
    season: 'Summer',
    careLevel: 'Easy',
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80',
  },
  {
    id: 'tulip',
    name: 'Tulip',
    meaning: 'Perfect love and elegance',
    symbolism: ['Declaration of Love', 'Cheerfulness', 'Spring', 'Rebirth'],
    colors: ['Red - True Love', 'Yellow - Sunshine', 'Purple - Royalty', 'White - Forgiveness'],
    season: 'Spring',
    careLevel: 'Easy',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
  },
  {
    id: 'hydrangea',
    name: 'Hydrangea',
    meaning: 'Gratitude, grace, and abundance',
    symbolism: ['Heartfelt Emotions', 'Understanding', 'Vanity', 'Abundance'],
    colors: ['Blue - Apology', 'Pink - Romance', 'White - Purity', 'Purple - Abundance'],
    season: 'Summer',
    careLevel: 'Moderate',
    image: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=800&q=80',
  },
]

export const testimonials = [
  {
    id: '1',
    author: 'Victoria S.',
    role: 'Bride',
    content: 'House of Gul created the most magical wedding flowers I could have imagined. Every single guest commented on how stunning they were.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  },
  {
    id: '2',
    author: 'Michael T.',
    role: 'CEO, Sterling & Co.',
    content: 'We use House of Gul for all our corporate events. The arrangements always make a sophisticated impression on our clients.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  },
  {
    id: '3',
    author: 'Charlotte D.',
    role: 'Interior Designer',
    content: 'The quality and artistry is unmatched. I recommend House of Gul to all my high-end clients for their home styling needs.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
  },
]

export const pressFeatures = [
  { name: 'Vogue', logo: 'VOGUE' },
  { name: 'Elle', logo: 'ELLE' },
  { name: 'Harper\'s Bazaar', logo: 'HARPER\'S BAZAAR' },
  { name: 'Architectural Digest', logo: 'AD' },
  { name: 'Town & Country', logo: 'TOWN & COUNTRY' },
]

export const subscriptionPlans = [
  {
    id: 'petite',
    name: 'Petite Bloom',
    price: 89,
    interval: 'month',
    description: 'A delicate arrangement perfect for desks and small spaces',
    features: ['Seasonal blooms', 'Bi-weekly delivery', 'Care guide included'],
  },
  {
    id: 'signature',
    name: 'Signature Gul',
    price: 159,
    interval: 'month',
    description: 'Our most popular subscription for flower enthusiasts',
    features: ['Premium seasonal blooms', 'Weekly delivery', 'Luxury vase included', 'Priority support'],
    popular: true,
  },
  {
    id: 'luxe',
    name: 'Luxe Collection',
    price: 289,
    interval: 'month',
    description: 'The ultimate floral experience for true connoisseurs',
    features: ['Rare & exotic blooms', 'Weekly delivery', 'Crystal vase collection', 'Personal florist', 'Event priority'],
  },
]

export const blogPosts = [
  {
    id: 'art-of-gifting-flowers',
    title: 'The Art of Gifting Flowers',
    excerpt: 'Discover the timeless elegance of expressing emotions through carefully curated blooms.',
    content: `The tradition of gifting flowers dates back centuries, transcending cultures and generations. At House of Gul, we believe that every bouquet tells a story—a narrative of love, gratitude, celebration, or sympathy.

When selecting the perfect arrangement, consider not just the occasion, but the recipient. What colors speak to their soul? What scents evoke their happiest memories? A thoughtfully chosen bouquet becomes more than a gift; it becomes a treasured moment.

The language of flowers, known as floriography, was particularly popular during the Victorian era. Red roses spoke of passionate love, while white lilies conveyed purity and virtue. Today, we continue this tradition, infusing each arrangement with intention and meaning.

Consider the presentation as carefully as the blooms themselves. Our signature House of Gul packaging transforms each delivery into an experience—an unwrapping of beauty that begins before the first petal is revealed.`,
    image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80',
    date: 'February 10, 2026',
    category: 'Gifting Guide',
    author: 'House of Gul',
  },
  {
    id: 'luxury-bouquet-trends-2026',
    title: 'Luxury Bouquet Trends 2026',
    excerpt: 'From sculptural arrangements to rare bloom varieties, explore this year\'s most coveted floral designs.',
    content: `The world of luxury floristry continues to evolve, with 2026 bringing fresh perspectives on timeless elegance. This year, we're seeing a beautiful marriage of architectural precision and organic fluidity.

Monochromatic arrangements in deep, saturated tones are commanding attention. Think rich burgundies, deep plums, and midnight blues—colors that make a sophisticated statement in any space.

Sustainability takes center stage as discerning clients seek locally-sourced, seasonal blooms. At House of Gul, we've embraced this movement, cultivating relationships with artisan growers who share our commitment to quality and environmental stewardship.

The return of sculptural arrangements marks another significant trend. These architectural pieces transform flowers into living art, perfect for those who view their spaces as curated galleries.

Texture remains paramount. The interplay of soft peonies against structural proteas, or delicate sweet peas cascading through sturdy garden roses, creates visual poetry that captivates the eye.`,
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=80',
    date: 'February 5, 2026',
    category: 'Trends',
    author: 'House of Gul',
  },
  {
    id: 'language-of-roses',
    title: 'The Secret Language of Roses',
    excerpt: 'Each rose color carries a hidden message. Learn to speak the language of the world\'s most beloved flower.',
    content: `Roses have enchanted humanity for millennia, their beauty matched only by the depth of meaning they carry. Understanding the language of roses transforms a simple gift into a profound expression.

Red roses need little introduction—they are the universal symbol of romantic love, passion, and desire. A single red rose speaks as eloquently as a dozen, each petal whispering devotion.

White roses embody purity, innocence, and new beginnings. They're perfect for weddings, christenings, or any moment that marks a fresh chapter in life's journey.

Pink roses dance between friendship and romance, conveying grace, gratitude, and admiration. They're ideal when you wish to express appreciation without the intensity of red.

Yellow roses, once associated with jealousy, have evolved to represent friendship, joy, and caring. They bring sunshine into any room and warmth into any heart.

The rare and enchanting lavender rose speaks of enchantment and love at first sight—a perfect choice for new romances or to express the magic someone brings to your life.`,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
    date: 'January 28, 2026',
    category: 'Flower Meanings',
    author: 'House of Gul',
  },
  {
    id: 'caring-for-cut-flowers',
    title: 'The Art of Caring for Cut Flowers',
    excerpt: 'Expert tips to extend the life and beauty of your precious blooms.',
    content: `A stunning bouquet deserves to be enjoyed for as long as possible. With proper care, your flowers can maintain their beauty for weeks.

Upon receiving your arrangement, trim approximately one inch from each stem at a 45-degree angle. This creates a larger surface area for water absorption and prevents stems from sitting flat against the vase bottom.

Fresh, room-temperature water is essential. Add the flower food provided—this carefully formulated mixture nourishes blooms and inhibits bacterial growth. Change the water every two to three days, re-trimming stems with each change.

Position your arrangement away from direct sunlight, heat sources, and drafts. While flowers need light to thrive when growing, cut flowers last longer in cooler conditions.

Remove wilting blooms promptly. Decaying flowers release ethylene gas, which accelerates the aging of surrounding blooms. This attention also keeps your arrangement looking fresh and intentional.

Finally, mist delicate blooms like hydrangeas lightly each day. These flowers absorb water through their petals and appreciate the extra moisture.`,
    image: 'https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=800&q=80',
    date: 'January 20, 2026',
    category: 'Care Guide',
    author: 'House of Gul',
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured)
}

export function getProductsByOccasion(occasionId: string): Product[] {
  return products.filter((product) => product.occasions.includes(occasionId))
}

export function getProductsBySeason(seasonId: string): Product[] {
  if (seasonId === 'all') return products
  return products.filter((product) => product.season === seasonId || product.season === 'all')
}

export function getProductReviews(productId: string): Review[] {
  return reviews.filter((review) => review.productId === productId)
}

export function getBlogPostById(id: string) {
  return blogPosts.find((post) => post.id === id)
}

export function searchProducts(query: string, filters?: {
  occasion?: string
  season?: string
  minPrice?: number
  maxPrice?: number
  category?: string
}): Product[] {
  let results = products

  if (query) {
    const lowerQuery = query.toLowerCase()
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.flowers.some((f) => f.toLowerCase().includes(lowerQuery)) ||
        p.category.toLowerCase().includes(lowerQuery)
    )
  }

  if (filters?.occasion) {
    results = results.filter((p) => p.occasions.includes(filters.occasion!))
  }

  if (filters?.season && filters.season !== 'all') {
    results = results.filter((p) => p.season === filters.season || p.season === 'all')
  }

  if (filters?.minPrice !== undefined) {
    results = results.filter((p) => p.price >= filters.minPrice!)
  }

  if (filters?.maxPrice !== undefined) {
    results = results.filter((p) => p.price <= filters.maxPrice!)
  }

  if (filters?.category) {
    results = results.filter((p) => p.category === filters.category)
  }

  return results
}
