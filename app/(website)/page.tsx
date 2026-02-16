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

export default function HomePage() {
  return (
    <>
      <FAQSchema />
      <HeroBanner />
      <OccasionGrid />
      <FeaturedProducts />
      <BrandStatement />
      <Testimonials />
      <SignatureBanner />
      <PressSection />
      <WhyHouseOfGul />
      <InstagramGallery />
      <RecentlyViewed />
      <Newsletter />
    </>
  )
}
