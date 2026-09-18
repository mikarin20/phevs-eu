'use client'

import { useEffect, useState } from 'react'
import CompareForm from '../CompareForm'

export default function EditComparePage({ params }: { params: { id: string } }) {
  const [defaultValues, setDefaultValues] = useState<any>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/compare/${params.id}`)
      if (!res.ok) {
        setNotFound(true)
        return
      }
      const data = await res.json()
      setDefaultValues(data.item)
    }
    load()
  }, [params.id])

  if (notFound) return <p className="text-red-600">Comparison not found.</p>
  if (!defaultValues) return <p className="text-slate-400">Loading…</p>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Edit Quick Compare</h1>
      <CompareForm mode="edit" compareSlug={params.id} defaultValues={defaultValues} />
    </div>
  )
}
