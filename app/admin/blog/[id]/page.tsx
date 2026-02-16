import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import BlogForm from '@/components/admin/BlogForm'

async function getBlogPost(id: string) {
  return prisma.blogPost.findUnique({
    where: { id },
  })
}

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const { id } = await params
  const post = await getBlogPost(id)

  if (!post) {
    notFound()
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif text-charcoal">Edit Blog Post</h1>
          <p className="text-charcoal-light">Update your blog post</p>
        </div>

        <BlogForm post={post} />
      </main>
    </div>
  )
}
