'use client'

import { useEffect, useState } from 'react'
import VehicleForm from '../VehicleForm'

export default function EditVehiclePage({ params }: { params: { id: string } }) {
  const [defaultValues, setDefaultValues] = useState<any>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/vehicles/${params.id}`)
      if (!res.ok) {
        setNotFound(true)
        return
      }
      const data = await res.json()
      setDefaultValues({ ...data.item, featuresText: (data.item.features || []).join('\n') })
    }
    load()
  }, [params.id])

  if (notFound) return <p className="text-red-600">Vehicle not found.</p>
  if (!defaultValues) return <p className="text-slate-400">Loading…</p>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Edit Vehicle</h1>
      <VehicleForm mode="edit" vehicleId={params.id} defaultValues={defaultValues} />
    </div>
  )
}
