export interface FlowerGuideEntry {
  id: string
  name: string
  meaning: string
  symbolism: string[]
  colors: string[]
  season: string
  careLevel: string
  image: string | null
  order: number
  isActive: boolean
}

// Starting content for the Flower Guide — the flowers House of Gul uses.
// Added to the database once (when the table is empty); edit it in Admin → Flower Guide.
export const defaultFlowerGuide: Omit<FlowerGuideEntry, 'id' | 'isActive'>[] = [
  {
    name: 'Rose',
    meaning: 'Love, passion and beauty',
    symbolism: ['Romance', 'Devotion', 'Admiration', 'Gratitude'],
    colors: ['Red – Deep love', 'Pink – Grace and gratitude', 'White – Purity and new beginnings', 'Yellow – Friendship and joy', 'Peach – Warmth and appreciation'],
    season: 'All year · best Nov – Mar',
    careLevel: 'Moderate',
    image: '/images/flowers/rose.jpg',
    order: 1,
  },
  {
    name: 'Sunflower',
    meaning: 'Adoration, warmth and loyalty',
    symbolism: ['Happiness', 'Loyalty', 'Optimism', 'Warmth'],
    colors: ['Golden yellow – Joy, warmth and a loyalty that turns to face you'],
    season: 'All year · best Feb – May',
    careLevel: 'Easy',
    image: '/images/flowers/sunflower.jpg',
    order: 2,
  },
  {
    name: 'Gerbera',
    meaning: 'Cheerfulness and innocence',
    symbolism: ['Cheer', 'Innocence', 'Purity', 'Beauty'],
    colors: ['Pink – Admiration', 'Red – Love', 'White – Purity', 'Yellow – Joy', 'Orange – Energy'],
    season: 'All year',
    careLevel: 'Easy',
    image: '/images/flowers/gerbera.jpg',
    order: 3,
  },
  {
    name: 'Chrysanthemum',
    meaning: 'Joy, long life and optimism',
    symbolism: ['Joy', 'Longevity', 'Loyalty', 'Optimism'],
    colors: ['White – Honesty', 'Yellow – Friendship', 'Pink and mauve – Love', 'Bronze – Warm wishes'],
    season: 'Peak Oct – Jan · available all year',
    careLevel: 'Easy',
    image: '/images/flowers/chrysanthemum.jpg',
    order: 4,
  },
  {
    name: 'Daisy',
    meaning: 'Innocence and new beginnings',
    symbolism: ['Innocence', 'Purity', 'New beginnings', 'Cheer'],
    colors: ['White – Purity', 'Yellow – Friendship', 'Lilac – Gentle affection'],
    season: 'All year',
    careLevel: 'Easy',
    image: '/images/flowers/daisy.jpg',
    order: 7,
  },
  {
    name: 'Lisianthus',
    meaning: 'Appreciation and lasting gratitude',
    symbolism: ['Appreciation', 'Charm', 'Gratitude', 'Grace'],
    colors: ['White and cream – Purity', 'Pink – Romance', 'Purple – Admiration'],
    season: 'All year',
    careLevel: 'Moderate',
    image: '/images/flowers/lisianthus.jpg',
    order: 8,
  },
  {
    name: 'Limonium (Statice)',
    meaning: 'Remembrance and lasting love',
    symbolism: ['Remembrance', 'Success', 'Sympathy', 'Lasting love'],
    colors: ['Lilac and purple – Grace and remembrance', 'White – Purity', 'Yellow – Success'],
    season: 'All year · dries beautifully',
    careLevel: 'Easy',
    image: '/images/flowers/limonium.jpg',
    order: 9,
  },
  {
    name: "Gypsophila (Baby's Breath)",
    meaning: 'Everlasting love and purity',
    symbolism: ['Innocence', 'Everlasting love', 'Purity', 'Sincerity'],
    colors: ['White – Purity and sincerity'],
    season: 'All year',
    careLevel: 'Easy',
    image: '/images/flowers/gypsophila.jpg',
    order: 10,
  },
  {
    name: 'Solidago (Goldenrod)',
    meaning: 'Encouragement and good fortune',
    symbolism: ['Encouragement', 'Good fortune', 'Growth', 'Success'],
    colors: ['Golden yellow – Optimism'],
    season: 'All year',
    careLevel: 'Easy',
    image: '/images/flowers/solidago.jpg',
    order: 11,
  },
  {
    name: 'Lily',
    meaning: 'Purity, renewal and quiet devotion',
    symbolism: ['Purity', 'Renewal', 'Devotion', 'Majesty'],
    colors: [
      'White – Purity and peace',
      'Blush pink – Admiration and gentle affection',
      'Yellow – Gratitude and good cheer',
      'Orange – Confidence and warmth',
    ],
    season: 'All year · best Oct – Mar',
    careLevel: 'Moderate',
    image: '/images/flowers/lily.jpg',
    order: 5,
  },
  {
    name: 'Carnation',
    meaning: 'Affection, admiration and steady love',
    symbolism: ['Affection', 'Admiration', 'Devotion', 'Distinction'],
    colors: [
      'Red – Deep affection',
      "Pink – A mother's love and gratitude",
      'White – Pure love and good fortune',
      'Lilac and mauve – Grace and quiet charm',
    ],
    season: 'All year',
    careLevel: 'Easy',
    image: '/images/flowers/carnation.jpg',
    order: 6,
  },
]

// Earlier temporary photos, replaced automatically on live if still in use.
export const previousFlowerImages: Record<string, string> = {
  '/images/products/the-keepsake-hatbox-winter-4.jpg': '/images/flowers/rose.jpg',
  '/images/products/the-garden-drawer-summer-3.jpg': '/images/flowers/sunflower.jpg',
  '/images/products/the-garden-drawer-spring-4.jpg': '/images/flowers/gerbera.jpg',
  '/images/products/the-garden-drawer-autumn-3.jpg': '/images/flowers/chrysanthemum.jpg',
  '/images/products/the-bloom-letter-summer-1.jpg': '/images/flowers/daisy.jpg',
  '/images/products/the-petal-tote-summer-1.jpg': '/images/flowers/lisianthus.jpg',
  '/images/products/the-petal-tote-spring-1.jpg': '/images/flowers/limonium.jpg',
  '/images/products/the-keepsake-hatbox-spring-4.jpg': '/images/flowers/gypsophila.jpg',
  '/images/products/the-bloom-letter-autumn-1.jpg': '/images/flowers/solidago.jpg',
}
