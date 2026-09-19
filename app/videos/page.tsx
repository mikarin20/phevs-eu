'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import YouTubeLiteEmbed from '@/components/YouTubeLiteEmbed'
import comparisonVideosData from '@/data/comparison-videos.json'
import carsData from '@/data/cars.json'

interface VideoItem {
  id: string
  youtubeId: string
  title: string
  channel: string
  lang: string
  relatedCars: string[]
  type: string
  description?: string
  publishedAt?: string
}

const languages = [
  { code: 'all', label: 'All Languages', flag: '🌐' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
]

const types = [
  { code: 'all', label: 'All Formats' },
  { code: 'comparison', label: 'Head-to-Head (VS)' },
  { code: 'single_review', label: 'In-Depth Reviews' },
]

export default function VideosPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedLang, setSelectedLang] = useState('all')

  // Resolve car details by ID or slug
  const getCarInfo = (carIdentifier: string) => {
    const normalized = carIdentifier.toLowerCase().trim()
    const car = (carsData as any[]).find(
      (c) =>
        c.id?.toLowerCase() === normalized ||
        c.slug?.toLowerCase() === normalized ||
        c.slug?.toLowerCase().replace(/-phev$/, '') === normalized
    )
    if (car) {
      return {
        brand: car.brand,
        model: car.model,
        year: car.year,
        slug: car.slug || car.id,
      }
    }
    return null
  }

  const filteredVideos = useMemo(() => {
    return (comparisonVideosData as VideoItem[]).filter((video) => {
      // Type filter
      if (selectedType !== 'all' && video.type !== selectedType) {
        return false
      }
      // Lang filter
      if (selectedLang !== 'all' && video.lang !== selectedLang) {
        return false
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const titleMatch = video.title.toLowerCase().includes(q)
        const channelMatch = video.channel.toLowerCase().includes(q)
        const carsMatch = video.relatedCars.some((rc) => rc.toLowerCase().includes(q))
        if (!titleMatch && !channelMatch && !carsMatch) {
          return false
        }
      }
      return true
    })
  }, [searchQuery, selectedType, selectedLang])

  // Generate VideoObject schemas for rich Google Search indexing
  const videoSchemas = useMemo(() => {
    return (comparisonVideosData as VideoItem[]).map((v) => ({
      '@type': 'VideoObject',
      name: v.title,
      description: v.description || v.title,
      thumbnailUrl: `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${v.youtubeId}`,
      uploadDate: v.publishedAt || '2026-09-01',
    }))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: videoSchemas.map((schema, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: schema,
            })),
          }),
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors group"
            >
              <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Database</span>
            </Link>

            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center justify-center p-1.5 bg-red-600 text-white rounded-lg shadow-md">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="font-bold text-lg text-slate-900 dark:text-white">PHEV Videos</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 py-12 sm:py-16 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-red-200 dark:border-red-900/50">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>Real-World Tests & Comparisons</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto leading-tight">
            Best Plug-in Hybrid <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Video Reviews</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal">
            Watch head-to-head PHEV comparisons, 100 km electric range verifications, battery degradation tests, and highway fuel economy analysis.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by model, brand, or channel (e.g. MG HS, Jaecoo, Autogefühl)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {/* Format filter */}
            <div className="flex items-center space-x-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              {types.map((type) => (
                <button
                  key={type.code}
                  onClick={() => setSelectedType(type.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedType === type.code
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Language filter */}
            <div className="flex items-center space-x-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 ${
                    selectedLang === lang.code
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span className="hidden sm:inline">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredVideos.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 mb-4">
              <FunnelIcon className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No videos found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              No reviews match your current search filters. Try clearing your search query or selecting all categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedType('all')
                setSelectedLang('all')
              }}
              className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
            {filteredVideos.map((video) => {
              // Extract matching unique cars
              const uniqueCarInfos = Array.from(
                new Map(
                  video.relatedCars
                    .map((cId) => getCarInfo(cId))
                    .filter(Boolean)
                    .map((car) => [car!.slug, car!])
                ).values()
              )

              return (
                <article
                  key={video.id}
                  className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Video Player */}
                  <div className="relative">
                    <YouTubeLiteEmbed youtubeId={video.youtubeId} title={video.title} />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {video.type === 'comparison' ? '⚔️ Head-to-Head' : '⭐ Single Review'}
                        </span>
                        <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          📺 {video.channel}
                        </span>
                        <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold px-2 py-0.5 rounded-full uppercase">
                          {video.lang}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                        {video.title}
                      </h2>

                      {/* Description */}
                      {video.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                          {video.description}
                        </p>
                      )}
                    </div>

                    {/* Related Cars Chips */}
                    {uniqueCarInfos.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
                          Featured Vehicles:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {uniqueCarInfos.map((car) => (
                            <Link
                              key={car.slug}
                              href={`/models/${car.slug}`}
                              className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-700/70 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg text-xs font-semibold transition-colors border border-slate-200/60 dark:border-slate-600"
                            >
                              <span>🚗</span>
                              <span>{car.brand} {car.model}</span>
                            </Link>
                          ))}

                          {/* Direct comparison button if 2 vehicles featured */}
                          {uniqueCarInfos.length >= 2 && (
                            <Link
                              href={`/compare/${uniqueCarInfos[0].slug}-vs-${uniqueCarInfos[1].slug}`}
                              className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold transition-colors border border-emerald-200 dark:border-emerald-800"
                            >
                              <span>⚔️ Compare Specs</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
