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
    image: '/images/products/the-keepsake-hatbox-winter-4.jpg',
    order: 1,
  },
  {
    name: 'Sunflower',
    meaning: 'Adoration, warmth and loyalty',
    symbolism: ['Happiness', 'Loyalty', 'Optimism', 'Warmth'],
    colors: ['Golden yellow – Joy and positivity'],
    season: 'All year · best Feb – May',
    careLevel: 'Easy',
    image: '/images/products/the-garden-drawer-summer-3.jpg',
    order: 2,
  },
  {
    name: 'Gerbera',
    meaning: 'Cheerfulness and innocence',
    symbolism: ['Cheer', 'Innocence', 'Purity', 'Beauty'],
    colors: ['Pink – Admiration', 'Red – Love', 'White – Purity', 'Yellow – Joy', 'Orange – Energy'],
    season: 'All year',
    careLevel: 'Easy',
    image: '/images/products/the-garden-drawer-spring-4.jpg',
    order: 3,
  },
  {
    name: 'Chrysanthemum',
    meaning: 'Joy, long life and optimism',
    symbolism: ['Joy', 'Longevity', 'Loyalty', 'Optimism'],
    colors: ['White – Honesty', 'Yellow – Friendship', 'Pink and mauve – Love', 'Bronze – Warm wishes'],
    season: 'Peak Oct – Jan · available all year',
    careLevel: 'Easy',
    image: '/images/products/the-garden-drawer-autumn-3.jpg',
    order: 4,
  },
  {
    name: 'Daisy',
    meaning: 'Innocence and new beginnings',
    symbolism: ['Innocence', 'Purity', 'New beginnings', 'Cheer'],
    colors: ['White – Purity', 'Yellow – Friendship', 'Lilac – Gentle affection'],
    season: 'All year',
    careLevel: 'Easy',
    image: '/images/products/the-bloom-letter-summer-1.jpg',
    order: 5,
  },
  {
    name: 'Lisianthus',
    meaning: 'Appreciation and lasting gratitude',
    symbolism: ['Appreciation', 'Charm', 'Gratitude', 'Grace'],
    colors: ['White and cream – Purity', 'Pink – Romance', 'Purple – Admiration'],
    season: 'All year',
    careLevel: 'Moderate',
    image: '/images/products/the-petal-tote-summer-1.jpg',
    order: 6,
  },
  {
    name: 'Limonium (Statice)',
    meaning: 'Remembrance and lasting love',
    symbolism: ['Remembrance', 'Success', 'Sympathy', 'Lasting love'],
    colors: ['Lilac and purple – Grace and remembrance', 'White – Purity', 'Yellow – Success'],
    season: 'All year · dries beautifully',
    careLevel: 'Easy',
    image: '/images/products/the-petal-tote-spring-1.jpg',
    order: 7,
  },
  {
    name: "Gypsophila (Baby's Breath)",
    meaning: 'Everlasting love and purity',
    symbolism: ['Innocence', 'Everlasting love', 'Purity', 'Sincerity'],
    colors: ['White – Purity and sincerity'],
    season: 'All year',
    careLevel: 'Easy',
    image: '/images/products/the-keepsake-hatbox-spring-4.jpg',
    order: 8,
  },
  {
    name: 'Solidago (Goldenrod)',
    meaning: 'Encouragement and good fortune',
    symbolism: ['Encouragement', 'Good fortune', 'Growth', 'Success'],
    colors: ['Golden yellow – Optimism'],
    season: 'All year',
    careLevel: 'Easy',
    image: '/images/products/the-bloom-letter-autumn-1.jpg',
    order: 9,
  },
]
