import { pressFeatures } from '@/lib/products'
import SectionWrapper from '@/components/ui/SectionWrapper'

export default function PressSection() {
  return (
    <SectionWrapper background="champagne" padding="md">
      <div className="text-center mb-8">
        <p className="luxury-subheading">As Featured In</p>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
        {pressFeatures.map((press) => (
          <div
            key={press.name}
            className="text-charcoal/40 hover:text-charcoal transition-colors duration-300"
          >
            <span className="font-serif text-xl md:text-2xl tracking-widest">
              {press.logo}
            </span>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
