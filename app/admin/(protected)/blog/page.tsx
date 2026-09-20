'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/admin/ui/button'
import { Input } from '@/components/admin/ui/input'
import { useToast } from '@/components/admin/ui/toast-provider'

interface BlogPost {
  slug: string
  title: string
  status?: 'draft' | 'published'
  published_at: string
  category?: string
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [search, setSearch] = useState('')
  const [togglingSlug, setTogglingSlug] = useState<string | null>(null)
  const { toast } = useToast()

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/blog')
      const data = await res.json()
      setPosts(data.items || [])
    } catch (err: any) {
      toast({ title: 'Failed to load posts', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const publishedCount = useMemo(() => {
    return posts.filter((p) => (p.status || 'published') === 'published').length
  }, [posts])

  const draftCount = useMemo(() => {
    return posts.filter((p) => p.status === 'draft').length
  }, [posts])

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const currentStatus = p.status || 'published'
      if (filter === 'published' && currentStatus !== 'published') return false
      if (filter === 'draft' && currentStatus !== 'draft') return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)
      }
      return true
    })
  }, [posts, filter, search])

  async function handleToggleStatus(slug: string, currentStatus: 'draft' | 'published') {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published'
    setTogglingSlug(slug)
    try {
      const res = await fetch(`/api/admin/blog/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to update status')
      }
      toast({
        title: nextStatus === 'published' ? 'Post Published' : 'Post Moved to Drafts',
        description: nextStatus === 'published'
          ? 'Post is now live on phevs.eu and submitted to IndexNow.'
          : 'Post is now saved as draft and hidden from visitors.',
      })
      await load()
    } catch (err: any) {
      toast({ title: 'Status update failed', description: err.message, variant: 'destructive' })
    } finally {
      setTogglingSlug(null)
    }
  }

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog Posts</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage drafts, publish updates, and review blog articles.
          </p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
            + Add New Post
          </Button>
        </Link>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              filter === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>All Posts</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-white">
              {posts.length}
            </span>
          </button>

          <button
            onClick={() => setFilter('published')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              filter === 'published'
                ? 'bg-emerald-600 text-white'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <span>🟢 Published</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
              {publishedCount}
            </span>
          </button>

          <button
            onClick={() => setFilter('draft')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              filter === 'draft'
                ? 'bg-amber-500 text-white'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            <span>📝 Drafts</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800">
              {draftCount}
            </span>
          </button>
        </div>

        <div className="w-full sm:w-64">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or slug…"
            className="h-8 text-xs"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Title & Slug</th>
                <th className="px-4 py-3 w-32">Status</th>
                <th className="px-4 py-3 w-32">Published</th>
                <th className="px-4 py-3 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td className="px-4 py-8 text-center text-slate-400" colSpan={4}>
                    Loading articles…
                  </td>
                </tr>
              )}
              {!loading && filteredPosts.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-slate-400" colSpan={4}>
                    {search ? 'No posts matching search.' : 'No posts in this category.'}
                  </td>
                </tr>
              )}
              {filteredPosts.map((p) => {
                const status = p.status || 'published'
                const isToggling = togglingSlug === p.slug

                return (
                  <tr key={p.slug} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 line-clamp-1">{p.title}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{p.slug}</div>
                    </td>

                    <td className="px-4 py-3">
                      {status === 'published' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Draft
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-xs text-slate-500">
                      {p.published_at || 'Not published'}
                    </td>

                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                      {/* One-Click Quick Toggle Button */}
                      {status === 'draft' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isToggling}
                          onClick={() => handleToggleStatus(p.slug, 'draft')}
                          className="h-7 text-xs bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-600 hover:text-white"
                        >
                          {isToggling ? 'Publishing…' : '🚀 Publish'}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isToggling}
                          onClick={() => handleToggleStatus(p.slug, 'published')}
                          className="h-7 text-xs text-slate-600 border-slate-300 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300"
                        >
                          {isToggling ? 'Updating…' : '📝 Revert to Draft'}
                        </Button>
                      )}

                      {/* Live or Preview Link */}
                      <a
                        href={status === 'draft' ? `/blog/${p.slug}?preview=true` : `/blog/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2.5 py-1 text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        {status === 'draft' ? 'Preview' : 'View'}
                      </a>

                      {/* Edit */}
                      <Link
                        href={`/admin/blog/${p.slug}`}
                        className="inline-flex items-center px-2.5 py-1 text-xs text-slate-700 hover:text-slate-900 font-medium underline"
                      >
                        Edit
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(p.slug)}
                        className="inline-flex items-center px-2.5 py-1 text-xs text-red-600 hover:text-red-800 font-medium underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
