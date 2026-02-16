import Image from 'next/image'
import Link from 'next/link'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  image: string
  date: string
  category: string
}

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  if (featured) {
    return (
      <Link href={`/blog/${post.id}`} className="group block">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="relative aspect-[4/3] overflow-hidden bg-champagne rounded-sm">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-xs tracking-widest uppercase text-charcoal-light">
              <span>{post.category}</span>
              <span className="w-1 h-1 rounded-full bg-gold" />
              <span>{post.date}</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-charcoal group-hover:text-gold transition-colors duration-300">
              {post.title}
            </h2>
            <p className="text-charcoal-light leading-relaxed">{post.excerpt}</p>
            <p className="text-sm text-gold tracking-widest uppercase">
              Read Article
            </p>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${post.id}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-champagne rounded-sm mb-4">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-colors duration-300" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-3 text-xs tracking-widest uppercase text-charcoal-light">
          <span>{post.category}</span>
          <span className="w-1 h-1 rounded-full bg-gold" />
          <span>{post.date}</span>
        </div>
        <h3 className="font-serif text-xl text-charcoal group-hover:text-gold transition-colors duration-300">
          {post.title}
        </h3>
        <p className="text-charcoal-light text-sm line-clamp-2">{post.excerpt}</p>
      </div>
    </Link>
  )
}
