'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getImageUrl } from '@/lib/image-url'
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  BoltIcon,
  Battery100Icon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

interface Car {
  id: string
  slug?: string
  brand: string
  model: string
  year: number
  segment?: string
  ev_range_km: number
  battery_kwh: number
  power_hp?: number
  price_eur?: number
  image_url: string
  dc_charging_supported?: boolean
  dc_max_power_kw?: number
  charging_capabilities?: {
    dc_power?: number
    ac_power?: number
  }
}

interface Props {
  cars: Car[]
}

export default function ModelsCatalogClient({ cars }: Props) {
  const [search, setSearch] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('ALL')
  const [sortBy, setSortBy] = useState<'range' | 'battery' | 'power' | 'name'>('range')

  // Unique list of brands
  const brands = useMemo(() => {
    const set = new Set<string>()
    cars.forEach(c => {
      if (c.brand) set.add(c.brand)
    })
    return ['ALL', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
  }, [cars])

  // Filtered and sorted cars
  const filteredCars = useMemo(() => {
    return cars
      .filter(car => {
        const matchesBrand = selectedBrand === 'ALL' || car.brand.toLowerCase() === selectedBrand.toLowerCase()
        const query = search.trim().toLowerCase()
        const matchesQuery = !query || 
          car.brand.toLowerCase().includes(query) || 
          car.model.toLowerCase().includes(query) ||
          `${car.brand} ${car.model}`.toLowerCase().includes(query)
        return matchesBrand && matchesQuery
      })
      .sort((a, b) => {
        if (sortBy === 'range') return (b.ev_range_km || 0) - (a.ev_range_km || 0)
        if (sortBy === 'battery') return (b.battery_kwh || 0) - (a.battery_kwh || 0)
        if (sortBy === 'power') return (b.power_hp || 0) - (a.power_hp || 0)
        return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`)
      })
  }, [cars, search, selectedBrand, sortBy])

  return (
    <div className="space-y-8">
      {/* Controls Bar: Search & Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by brand or model (e.g. Tiguan, BYD, BMW X1)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="range">Longest Range First</option>
              <option value="battery">Largest Battery First</option>
              <option value="power">Highest Power First</option>
              <option value="name">Model Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Brand Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-thin">
          {brands.map(brand => (
            <button
              key={brand}
              type="button"
              onClick={() => setSelectedBrand(brand)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedBrand === brand
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {brand === 'ALL' ? 'All Brands' : brand}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>Showing <strong>{filteredCars.length}</strong> of {cars.length} plug-in hybrid models</span>
          {selectedBrand !== 'ALL' && (
            <button
              type="button"
              onClick={() => setSelectedBrand('ALL')}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Reset brand filter
            </button>
          )}
        </div>
      </div>

      {/* Models Grid */}
      {filteredCars.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-base text-slate-600 dark:text-slate-400 font-medium">
            No plug-in hybrid models found matching &quot;{search}&quot;.
          </p>
          <button
            type="button"
            onClick={() => { setSearch(''); setSelectedBrand('ALL') }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCars.map((car) => {
            const modelUrl = `/models/${car.slug || car.id}`
            const dcPower = car.charging_capabilities?.dc_power || car.dc_max_power_kw

            return (
              <div
                key={car.id || car.slug}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <Image
                    src={getImageUrl(car.image_url)}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {car.segment && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider">
                      {car.segment}
                    </div>
                  )}
                  {dcPower && dcPower > 0 && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-cyan-600/90 backdrop-blur-md text-white text-[10px] font-bold flex items-center space-x-1 shadow-xs">
                      <BoltIcon className="w-3.5 h-3.5" />
                      <span>{dcPower} kW DC</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span className="font-bold uppercase tracking-wider">{car.brand}</span>
                      <span>{car.year}</span>
                    </div>
                    <Link href={modelUrl}>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {car.model}
                      </h3>
                    </Link>
                  </div>

                  {/* 3 Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">WLTP Range</div>
                      <div className="font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">{car.ev_range_km} km</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Battery</div>
                      <div className="font-bold text-slate-900 dark:text-white mt-0.5">{car.battery_kwh} kWh</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Power</div>
                      <div className="font-bold text-slate-900 dark:text-white mt-0.5">{car.power_hp ? `${car.power_hp} hp` : '—'}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-between gap-2">
                    <Link
                      href={modelUrl}
                      className="flex-1 text-center py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
                    >
                      View Specs
                    </Link>
                    <Link
                      href={`/range-calculator?car=${car.slug || car.id}`}
                      className="py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/80 text-blue-600 dark:text-blue-300 font-bold text-xs transition-colors flex items-center space-x-1"
                    >
                      <span>⚡ Simulate</span>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
