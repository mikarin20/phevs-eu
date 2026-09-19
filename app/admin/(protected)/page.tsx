'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/card'
import { Car, Newspaper, GitCompareArrows, Video } from 'lucide-react'

interface Stats {
  vehicles: number
  blogPosts: number
  comparisons: number
  videos: number
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStats() {
      try {
        const [vehiclesRes, blogRes, compareRes, videosRes] = await Promise.all([
          fetch('/api/admin/vehicles'),
          fetch('/api/admin/blog'),
          fetch('/api/admin/compare'),
          fetch('/api/admin/videos'),
        ])
        const [vehicles, blog, compare, videos] = await Promise.all([
          vehiclesRes.json(),
          blogRes.json(),
          compareRes.json(),
          videosRes.json(),
        ])
        setStats({
          vehicles: vehicles.items?.length ?? 0,
          blogPosts: blog.items?.length ?? 0,
          comparisons: compare.items?.length ?? 0,
          videos: videos.items?.length ?? 0,
        })
      } catch (err: any) {
        setError(err.message)
      }
    }
    loadStats()
  }, [])

  const cards = [
    {
      href: '/admin/vehicles',
      label: 'Vehicle Profiles',
      value: stats?.vehicles,
      icon: Car,
      description: 'Manage PHEV models in the database',
    },
    {
      href: '/admin/blog',
      label: 'Blog Posts',
      value: stats?.blogPosts,
      icon: Newspaper,
      description: 'Manage news and articles',
    },
    {
      href: '/admin/compare',
      label: 'Quick Compares',
      value: stats?.comparisons,
      icon: GitCompareArrows,
      description: 'Manage curated comparison pages',
    },
    {
      href: '/admin/videos',
      label: 'Videos',
      value: stats?.videos,
      icon: Video,
      description: 'Manage comparison & review videos',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Overview of your site&apos;s content.</p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map(({ href, label, value, icon: Icon, description }) => (
          <Link key={href} href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">{label}</CardTitle>
                <Icon className="h-5 w-5 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{value ?? '—'}</div>
                <p className="text-xs text-slate-500 mt-1">{description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
