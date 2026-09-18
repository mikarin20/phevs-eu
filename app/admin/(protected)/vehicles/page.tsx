'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/admin/ui/button'
import { useToast } from '@/components/admin/ui/toast-provider'

interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
}

export default function VehiclesListPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/vehicles')
    const data = await res.json()
    setVehicles(data.items || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm(`Delete vehicle "${id}"? This commits directly to the repo.`)) return
    const res = await fetch(`/api/admin/vehicles/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      toast({ title: 'Delete failed', description: data.error, variant: 'destructive' })
      return
    }
    toast({ title: 'Vehicle deleted' })
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Vehicle Profiles</h1>
        <Link href="/admin/vehicles/new">
          <Button>Add Vehicle</Button>
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Model</th>
              <th className="px-4 py-3">Year</th>
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
            {!loading && vehicles.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-slate-400" colSpan={4}>
                  No vehicles yet.
                </td>
              </tr>
            )}
            {vehicles.map((v) => (
              <tr key={v.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{v.brand}</td>
                <td className="px-4 py-3">{v.model}</td>
                <td className="px-4 py-3">{v.year}</td>
                <td className="px-4 py-3 text-right space-x-3">
                  <Link href={`/admin/vehicles/${v.id}`} className="text-slate-600 hover:text-slate-900 underline">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(v.id)} className="text-red-600 hover:text-red-800 underline">
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
