// Where an admin banner can appear. Used by Admin → Banners and the website.
export const bannerPositions = [
  { value: 'hero', label: 'Home — Main banner (top)', size: '16:9 wide, 2560 × 1440. Keep the centre calm for the big title.' },
  { value: 'secondary', label: 'Home — "Curated Blooms" banner', size: 'Wide strip, 2560 × 1100. Keep the centre calm for text.' },
  { value: 'popup', label: 'Home — Popup', size: '4:3, 1600 × 1200.' },
  { value: 'shop', label: 'Shop page — Top banner', size: 'Very wide strip, 2560 × 900. Top 15% sits behind the menu.' },
  { value: 'gul-club', label: 'Gul Club — Top banner', size: 'Wide strip, 2560 × 1100. Top 15% sits behind the menu.' },
  { value: 'gul-club-benefits', label: 'Gul Club — "Why Join" photo', size: '4:5 portrait, 1600 × 2000. No text on top.' },
  { value: 'flower-guide', label: 'Flower Guide — Top banner', size: 'Very wide strip, 2560 × 900. Top 15% sits behind the menu.' },
  { value: 'about', label: 'About — Top banner', size: 'Wide strip, 2560 × 1100. Top 15% sits behind the menu.' },
  { value: 'about-beginning', label: 'About — "The Beginning" photo', size: '4:5 portrait, 1600 × 2000. No text on top.' },
  { value: 'about-craft', label: 'About — "The Craft" photo', size: '4:5 portrait, 1600 × 2000. No text on top.' },
  // Events page is hidden for now; re-enable together with app/(website)/events/page.tsx
  // { value: 'events', label: 'Events — Top banner', size: 'Wide strip, 2560 × 1100. Top 15% sits behind the menu.' },
  { value: 'blog', label: 'Journal — Top banner', size: 'Very wide strip, 2560 × 900. Top 15% sits behind the menu.' },
] as const

export type BannerPosition = (typeof bannerPositions)[number]['value']

export function bannerPositionLabel(value: string): string {
  return bannerPositions.find((p) => p.value === value)?.label || value
}
