import { prisma } from '@/lib/prisma'

export interface BannerContent {
  title: string
  subtitle: string | null
  buttonText: string | null
  buttonLink: string | null
  image: string
}

// Active banners for a position ('hero', 'secondary' or 'popup'), in admin
// order, respecting their optional start and end dates.
export async function getActiveBanners(position: string): Promise<BannerContent[]> {
  try {
    const now = new Date()
    const banners = await prisma.banner.findMany({
      where: {
        position,
        isActive: true,
        AND: [
          { OR: [{ startDate: null }, { startDate: { lte: now } }] },
          { OR: [{ endDate: null }, { endDate: { gte: now } }] },
        ],
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    return banners.map((banner) => ({
      title: banner.title,
      subtitle: banner.subtitle,
      buttonText: banner.buttonText,
      buttonLink: banner.buttonLink,
      image: banner.image,
    }))
  } catch (error) {
    console.error(`Error loading ${position} banners:`, error)
    return []
  }
}

export async function getActiveBanner(position: string): Promise<BannerContent | null> {
  return (await getActiveBanners(position))[0] || null
}
