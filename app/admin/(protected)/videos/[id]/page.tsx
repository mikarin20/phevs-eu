'use client'

import { useEffect, useState } from 'react'
import VideoForm from '../VideoForm'

export default function EditVideoPage({ params }: { params: { id: string } }) {
  const [defaultValues, setDefaultValues] = useState<any>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/videos/${params.id}`)
      if (!res.ok) {
        setNotFound(true)
        return
      }
      const data = await res.json()
      setDefaultValues(data.item)
    }
    load()
  }, [params.id])

  if (notFound) return <p className="text-red-600">Video not found.</p>
  if (!defaultValues) return <p className="text-slate-400">Loading…</p>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Edit Video</h1>
        <p className="text-sm text-slate-500">Update video details, channel, or linked vehicles.</p>
      </div>
      <VideoForm mode="edit" videoId={params.id} defaultValues={defaultValues} />
    </div>
  )
}
