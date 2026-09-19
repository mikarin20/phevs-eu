'use client'

import { useState } from 'react'
import { useToast } from './ui/toast-provider'
import { XMarkIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'

interface GalleryUploaderProps {
  value: string[]
  onChange: (urls: string[]) => void
  folder?: 'vehicles' | 'blog'
}

export default function GalleryUploader({ value = [], onChange, folder = 'vehicles' }: GalleryUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const { toast } = useToast()

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    const newUrls: string[] = []

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', folder)
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Upload failed')
        if (data.url) newUrls.push(data.url)
      }

      if (newUrls.length > 0) {
        onChange([...value, ...newUrls])
        toast({ title: `${newUrls.length} image(s) uploaded successfully` })
      }
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' })
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  function handleAddUrl() {
    const trimmed = urlInput.trim()
    if (!trimmed) return
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('/')) {
      toast({ title: 'Invalid URL', description: 'Please enter a valid image URL', variant: 'destructive' })
      return
    }
    onChange([...value, trimmed])
    setUrlInput('')
  }

  function handleRemove(index: number) {
    const next = [...value]
    next.splice(index, 1)
    onChange(next)
  }

  function handleMove(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= value.length) return
    const next = [...value]
    const temp = next[index]
    next[index] = next[targetIndex]
    next[targetIndex] = temp
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {/* Existing Gallery Thumbnails */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((url, idx) => (
            <div key={`${url}-${idx}`} className="relative group rounded-lg border border-slate-200 overflow-hidden bg-slate-50 aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'up')}
                    className="p-1 bg-white/80 hover:bg-white text-slate-800 rounded-full shadow transition-colors"
                    title="Move earlier"
                  >
                    <ArrowUpIcon className="w-4 h-4" />
                  </button>
                )}
                {idx < value.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'down')}
                    className="p-1 bg-white/80 hover:bg-white text-slate-800 rounded-full shadow transition-colors"
                    title="Move later"
                  >
                    <ArrowDownIcon className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1 bg-red-600 hover:bg-red-700 text-white rounded-full shadow transition-colors"
                  title="Remove photo"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 text-[10px] text-white rounded font-mono">
                #{idx + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Upload and URL input */}
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded-md text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors">
          <PlusIcon className="w-4 h-4 text-slate-500" />
          <span>{uploading ? 'Uploading…' : 'Upload Photos'}</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            onChange={handleFiles}
            disabled={uploading}
            className="hidden"
          />
        </label>

        <div className="flex flex-1 w-full gap-1.5">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddUrl()
              }
            }}
            placeholder="Or paste photo URL and click Add"
            className="flex-1 h-8 rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium transition-colors"
          >
            Add
          </button>
        </div>
      </div>
      <p className="text-[11px] text-slate-500">
        You can upload multiple interior, exterior, cockpit or detail photos. They will be displayed in the vehicle profile gallery.
      </p>
    </div>
  )
}
