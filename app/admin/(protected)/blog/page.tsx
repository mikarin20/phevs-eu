'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/admin/ui/button'
import { useToast } from '@/components/admin/ui/toast-provider'

interface BlogPost {
  slug: string
  title: string
  status?: 'draft' | 'published'
  published_at: string
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/blog')
    const data = await res.json()
    setPosts(data.items || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(slug: string) {
    if (!confirm(`Delete post "${slug}"? This commits directly to the repo.`)) return
    const res = await fetch(`/api/admin/blog/${slug}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      toast({ title: 'Delete failed', description: data.error, variant: 'destructive' })
      return
    }
    toast({ title: 'Post deleted' })
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Blog Posts</h1>
        <Link href="/admin/blog/new">
          <Button>Add Post</Button>
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td className="px-4 py-6 text-slate-400" colSpan={4}>
                  Loading…
                </td>
              </tr>
            )}
            {!loading && posts.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-slate-400" colSpan={4}>
                  No posts yet.
                </td>
              </tr>
            )}
            {posts.map((p) => (
              <tr key={p.slug}>
                <td className="px-4 py-3 font-medium text-slate-900">{p.title}</td>
                <td className="px-4 py-3 capitalize">{p.status || 'published'}</td>
                <td className="px-4 py-3">{p.published_at}</td>
                <td className="px-4 py-3 text-right space-x-3">
                  <Link href={`/admin/blog/${p.slug}`} className="text-slate-600 hover:text-slate-900 underline">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(p.slug)} className="text-red-600 hover:text-red-800 underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
