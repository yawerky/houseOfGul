import HeroBanner from '@/components/home/HeroBanner'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import OccasionGrid from '@/components/home/OccasionGrid'
import BrandStatement from '@/components/home/BrandStatement'
import SignatureBanner from '@/components/home/SignatureBanner'
import Testimonials from '@/components/home/Testimonials'
import PressSection from '@/components/home/PressSection'
import WhyHouseOfGul from '@/components/home/WhyHouseOfGul'
import InstagramGallery from '@/components/home/InstagramGallery'
import Newsletter from '@/components/home/Newsletter'
import RecentlyViewed from '@/components/home/RecentlyViewed'
import FAQSchema from '@/components/seo/FAQSchema'
import PromoPopup from '@/components/home/PromoPopup'
import { getActiveBanner, getActiveBanners } from '@/lib/banners'

// Always read the latest products, banners and posts from the database.
export const dynamic = 'force-dynamic'


export default async function HomePage() {
  const [heroBanners, secondaryBanner, popupBanner] = await Promise.all([
    getActiveBanners('hero'),
    getActiveBanner('secondary'),
    getActiveBanner('popup'),
  ])

  return (
    <>
      <FAQSchema />
      <HeroBanner banners={heroBanners} />
      <OccasionGrid />
      <FeaturedProducts />
      <BrandStatement />
      <Testimonials />
      <SignatureBanner banner={secondaryBanner} />
      <PressSection />
      <WhyHouseOfGul />
      <InstagramGallery />
      <RecentlyViewed />
      <Newsletter />
      {popupBanner && <PromoPopup banner={popupBanner} />}
    </>
  )
}
