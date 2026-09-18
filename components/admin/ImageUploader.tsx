'use client'

import { useState } from 'react'
import { useToast } from './ui/toast-provider'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  folder: 'vehicles' | 'blog'
}

export default function ImageUploader({ value, onChange, folder }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      onChange(data.url)
      toast({ title: 'Image uploaded' })
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' })
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-2">
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="Preview" className="h-32 w-auto rounded-md border border-slate-200 object-cover" />
      )}
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFile}
          disabled={uploading}
          className="text-sm"
        />
        {uploading && <span className="text-xs text-slate-500">Uploading…</span>}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste an image URL"
        className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs"
      />
    </div>
  )
}
