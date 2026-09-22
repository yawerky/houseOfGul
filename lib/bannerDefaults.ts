// Banner images shipped with the website (public/images/banners).
// Added to Admin → Banners on live for any position that has no banner yet.
export const defaultBanners = [
  {
    position: 'hero',
    title: 'House of Gul',
    subtitle:
      'Discover the art of floral couture. Each arrangement is a masterpiece, crafted with passion and delivered with elegance.',
    buttonText: 'Shop Bouquets',
    buttonLink: '/shop',
    image: '/images/banners/home-main-v2.jpg',
  },
  {
    position: 'secondary',
    title: 'Curated Blooms. Timeless Elegance.',
    subtitle: 'Seasonal flowers, hand-arranged in Jaipur and delivered with care — a little piece of joy for every moment.',
    buttonText: 'Explore Collection',
    buttonLink: '/shop',
    image: '/images/banners/home-curated-blooms.jpg',
  },
  { position: 'shop', title: 'Shop Bouquets', image: '/images/banners/shop.jpg' },
  { position: 'gul-club', title: 'The Gul Club', image: '/images/banners/gul-club.jpg' },
  { position: 'gul-club-benefits', title: 'Why Join the Gul Club', image: '/images/banners/gul-club-benefits.jpg' },
  { position: 'flower-guide', title: 'Flower Guide', image: '/images/banners/flower-guide.jpg' },
  { position: 'about', title: 'The House of Gul', image: '/images/banners/about.jpg' },
  { position: 'about-beginning', title: 'Born from a Love of Beauty', image: '/images/banners/about-beginning.jpg' },
]

// Replaced banner images: live banners still using the old file are switched
// to the new one (only if the image hasn't been changed in admin).
export const replacedBannerImages: Record<string, string> = {
  '/images/banners/home-main.jpg': '/images/banners/home-main-v2.jpg',
}
