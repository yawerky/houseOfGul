import Image from 'next/image'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ivory">
      <div className="text-center">
        <Image
          src="/images/logo.png"
          alt="House of Gul"
          width={200}
          height={100}
          className="h-28 w-auto object-contain mx-auto mb-8"
          priority
        />
        <div className="flex justify-center gap-1">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse [animation-delay:0.2s]" />
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  )
}
