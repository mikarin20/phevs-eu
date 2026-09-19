'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/admin/ui/button'
import { useToast } from '@/components/admin/ui/toast-provider'
import { Plus, ExternalLink, Play, Search, Video as VideoIcon } from 'lucide-react'
import { Input } from '@/components/admin/ui/input'

interface VideoItem {
  id: string
  youtubeId: string
  title: string
  channel: string
  lang: string
  relatedCars: string[]
  type: 'comparison' | 'single_review'
  description?: string
  publishedAt?: string
}

export default function VideoListPage() {
  const [items, setItems] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { toast } = useToast()

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/videos')
      const data = await res.json()
      setItems(data.items || [])
    } catch (err: any) {
      toast({ title: 'Failed to load videos', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete video "${title}"? This commits directly to the repository.`)) return
    try {
      const res = await fetch(`/api/admin/videos/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Delete failed')
      }
      toast({ title: 'Video deleted' })
      load()
    } catch (err: any) {
      toast({ title: 'Delete failed', description: err.message, variant: 'destructive' })
    }
  }

  const filteredItems = items.filter((item) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      item.title.toLowerCase().includes(q) ||
      item.channel.toLowerCase().includes(q) ||
      item.youtubeId.toLowerCase().includes(q) ||
      (item.relatedCars || []).some((rc) => rc.toLowerCase().includes(q))
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <VideoIcon className="w-6 h-6 text-blue-600" />
            <span>Comparison & Review Videos</span>
          </h1>
          <p className="text-sm text-slate-500">
            Manage YouTube comparison tests and video reviews shown across compare pages and the /videos hub.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/videos"
            target="_blank"
            className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <span>Live /videos</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link href="/admin/videos/new">
            <Button className="flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Add Video</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Filter by title, channel, car name, YouTube ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Videos Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Video</th>
              <th className="px-4 py-3">Format / Lang</th>
              <th className="px-4 py-3">Channel</th>
              <th className="px-4 py-3">Featured Cars</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td className="px-4 py-8 text-center text-slate-400" colSpan={5}>
                  Loading videos…
                </td>
              </tr>
            )}
            {!loading && filteredItems.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-slate-400" colSpan={5}>
                  {search ? 'No videos match your search.' : 'No videos added yet.'}
                </td>
              </tr>
            )}
            {filteredItems.map((video) => (
              <tr key={video.id} className="hover:bg-slate-50/70 transition-colors">
                {/* Thumbnail & Title */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative w-24 aspect-video bg-slate-900 rounded overflow-hidden shrink-0 shadow-sm">
                      <img
                        src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Play className="w-4 h-4 text-white fill-current opacity-80" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 leading-snug line-clamp-2">
                        {video.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono text-slate-400">{video.youtubeId}</span>
                        <a
                          href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-0.5"
                        >
                          <span>Watch</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Format / Lang */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex flex-col gap-1 items-start">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        video.type === 'comparison'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {video.type === 'comparison' ? 'VS Compare' : 'Review'}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {video.lang}
                    </span>
                  </div>
                </td>

                {/* Channel */}
                <td className="px-4 py-3.5 text-slate-700 whitespace-nowrap">
                  <span className="font-medium">{video.channel}</span>
                  {video.publishedAt && (
                    <div className="text-[11px] text-slate-400">{video.publishedAt}</div>
                  )}
                </td>

                {/* Related Cars */}
                <td className="px-4 py-3.5">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {(video.relatedCars || []).slice(0, 3).map((carId) => (
                      <span
                        key={carId}
                        className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 truncate max-w-[140px]"
                        title={carId}
                      >
                        {carId}
                      </span>
                    ))}
                    {(video.relatedCars || []).length > 3 && (
                      <span className="text-[11px] text-slate-400 px-1 py-0.5">
                        +{video.relatedCars.length - 3} more
                      </span>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-3">
                  <Link
                    href={`/admin/videos/${video.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(video.id, video.title)}
                    className="text-red-600 hover:text-red-800 font-medium hover:underline"
                  >
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
