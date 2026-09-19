'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/admin/ui/button'
import { useToast } from '@/components/admin/ui/toast-provider'

import { Play } from 'lucide-react'

interface QuickCompare {
  slug: string
  vehicle1Id: string
  vehicle2Id: string
  youtubeId?: string
}

interface Vehicle {
  id: string
  brand: string
  model: string
}

export default function CompareListPage() {
  const [items, setItems] = useState<QuickCompare[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  async function load() {
    setLoading(true)
    const [compareRes, vehiclesRes] = await Promise.all([
      fetch('/api/admin/compare'),
      fetch('/api/admin/vehicles'),
    ])
    const [compareData, vehiclesData] = await Promise.all([
      compareRes.json(),
      vehiclesRes.json(),
    ])
    setItems(compareData.items || [])
    setVehicles(vehiclesData.items || [])
    setLoading(false)
  }

  function vehicleName(id: string) {
    const vehicle = vehicles.find((item) => item.id === id)
    return vehicle ? `${vehicle.brand} ${vehicle.model}` : id
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(slug: string) {
    if (!confirm(`Delete comparison "${slug}"? This commits directly to the repo.`)) return
    const res = await fetch(`/api/admin/compare/${slug}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      toast({ title: 'Delete failed', description: data.error, variant: 'destructive' })
      return
    }
    toast({ title: 'Comparison deleted' })
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Quick Compares</h1>
        <Link href="/admin/compare/new">
          <Button>Add Comparison</Button>
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Vehicle 1</th>
              <th className="px-4 py-3">Vehicle 2</th>
              <th className="px-4 py-3">Video</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td className="px-4 py-6 text-slate-400" colSpan={5}>
                  Loading…
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-slate-400" colSpan={5}>
                  No comparisons yet.
                </td>
              </tr>
            )}
            {items.map((c) => (
              <tr key={c.slug}>
                <td className="px-4 py-3 font-medium text-slate-900">{c.slug}</td>
                <td className="px-4 py-3">{vehicleName(c.vehicle1Id)}</td>
                <td className="px-4 py-3">{vehicleName(c.vehicle2Id)}</td>
                <td className="px-4 py-3">
                  {c.youtubeId ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-red-600 bg-red-50 px-2 py-0.5 rounded font-medium border border-red-200">
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>Video</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <Link href={`/admin/compare/${c.slug}`} className="text-slate-600 hover:text-slate-900 underline">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(c.slug)} className="text-red-600 hover:text-red-800 underline">
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
