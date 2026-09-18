'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/admin/ui/button'
import { useToast } from '@/components/admin/ui/toast-provider'

interface QuickCompare {
  slug: string
  vehicle1Id: string
  vehicle2Id: string
}

export default function CompareListPage() {
  const [items, setItems] = useState<QuickCompare[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/compare')
    const data = await res.json()
    setItems(data.items || [])
    setLoading(false)
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

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Vehicle 1</th>
              <th className="px-4 py-3">Vehicle 2</th>
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
            {!loading && items.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-slate-400" colSpan={4}>
                  No comparisons yet.
                </td>
              </tr>
            )}
            {items.map((c) => (
              <tr key={c.slug}>
                <td className="px-4 py-3 font-medium text-slate-900">{c.slug}</td>
                <td className="px-4 py-3">{c.vehicle1Id}</td>
                <td className="px-4 py-3">{c.vehicle2Id}</td>
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
