'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Gauge,
  Zap,
  Snowflake,
  Fuel,
  ExternalLink,
  Search,
  SlidersHorizontal,
  Flame,
  ArrowUpDown,
  CheckCircle2,
  Table as TableIcon,
  LayoutGrid,
  ChevronRight,
  Calculator
} from 'lucide-react'
import type { CommunityReport } from '@/lib/community-telemetry'

interface Props {
  initialReports: CommunityReport[]
}

const sign = (n: number) => `${n > 0 ? '+' : ''}${n}%`

export default function TelemetryHubClient({ initialReports }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('All')
  const [onlyHeatPump, setOnlyHeatPump] = useState(false)
  const [sortBy, setSortBy] = useState<'default' | 'odometer' | 'summer' | 'fuel' | 'lifetime'>('default')
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')

  // Extract unique brands from model names
  const brands = useMemo(() => {
    const set = new Set<string>()
    initialReports.forEach(r => {
      const brand = r.modelName.split(' ')[0]
      if (brand) set.add(brand)
    })
    return ['All', ...Array.from(set).sort()]
  }, [initialReports])

  // Filter and sort reports
  const filteredReports = useMemo(() => {
    return initialReports
      .filter(r => {
        if (selectedBrand !== 'All' && !r.modelName.toLowerCase().startsWith(selectedBrand.toLowerCase())) {
          return false
        }
        if (onlyHeatPump && !r.hasHeatPump) {
          return false
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchModel = r.modelName.toLowerCase().includes(q)
          const matchHandle = r.ownerHandle.toLowerCase().includes(q)
          const matchNote = r.note.toLowerCase().includes(q)
          if (!matchModel && !matchHandle && !matchNote) return false
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'odometer') return b.odometerKm - a.odometerKm
        if (sortBy === 'summer') return b.realEvRangeSummerKm - a.realEvRangeSummerKm
        if (sortBy === 'fuel') return a.emptyBatteryFuelL100 - b.emptyBatteryFuelL100
        if (sortBy === 'lifetime') return a.combinedLifetimeL100 - b.combinedLifetimeL100
        return 0
      })
  }, [initialReports, selectedBrand, onlyHeatPump, searchQuery, sortBy])

  // Aggregates of filtered set
  const stats = useMemo(() => {
    const totalKm = filteredReports.reduce((acc, r) => acc + r.odometerKm, 0)
    const avgSummer = Math.round(
      filteredReports.reduce((acc, r) => acc + r.realEvRangeSummerKm, 0) / (filteredReports.length || 1)
    )
    const avgWinter = Math.round(
      filteredReports.reduce((acc, r) => acc + r.realEvRangeWinterKm, 0) / (filteredReports.length || 1)
    )
    const avgEmptyFuel = Number(
      (filteredReports.reduce((acc, r) => acc + r.emptyBatteryFuelL100, 0) / (filteredReports.length || 1)).toFixed(1)
    )
    const avgWinterLoss = Math.round(((avgWinter - avgSummer) / (avgSummer || 1)) * 100)

    return { totalKm, avgSummer, avgWinter, avgEmptyFuel, avgWinterLoss }
  }, [filteredReports])

  const submitHref = `mailto:info@phevs.eu?subject=${encodeURIComponent('PHEVs.eu Community Telemetry Submission')}`

  return (
    <div className="space-y-8">
      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Verified Reports</span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{filteredReports.length}</span>
            <span className="text-xs text-slate-500">owners</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {stats.totalKm.toLocaleString('en-GB')} km logged
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-4 h-4 text-emerald-500" />
            <span>Avg Warm Range</span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{stats.avgSummer}</span>
            <span className="text-xs text-slate-500">km pure EV</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Real everyday mixed driving
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center space-x-2 text-cyan-700 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Snowflake className="w-4 h-4 text-cyan-500" />
            <span>Winter Range Impact</span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">{stats.avgWinter}</span>
            <span className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold font-mono">({stats.avgWinterLoss}%)</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Cold weather cabin HVAC loss
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Fuel className="w-4 h-4 text-amber-500" />
            <span>Empty Battery Fuel</span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">{stats.avgEmptyFuel}</span>
            <span className="text-xs text-slate-500">L/100 km</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Charge-sustaining highway mode
          </p>
        </div>
      </div>

      {/* Control Bar: Search, Filters, Sorting & View Toggle */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by car model, Reddit username, or driving note..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs rounded-xl px-3 py-2 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="default">Sort: Default</option>
                <option value="odometer">Highest Odometer (km)</option>
                <option value="summer">Highest Summer Range (km)</option>
                <option value="fuel">Lowest Depleted Fuel (L/100km)</option>
                <option value="lifetime">Lowest Lifetime Fuel (L/100km)</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Brand Filters & Heat Pump Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-slate-400 mr-1 flex items-center">
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1" /> Brand:
            </span>
            {brands.map(brand => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                  selectedBrand === brand
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>

          <label className="inline-flex items-center cursor-pointer space-x-2 text-xs font-medium text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={onlyHeatPump}
              onChange={e => setOnlyHeatPump(e.target.checked)}
              className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <span className="flex items-center">
              <Flame className="w-3.5 h-3.5 text-amber-500 mr-1" />
              Heat pump equipped only
            </span>
          </label>
        </div>
      </div>

      {/* Main Content: Cards View vs Table View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReports.map(r => (
            <article
              key={r.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Header: Model & User */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/models/${r.carSlug}/`}
                      className="group inline-flex items-center text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <span>{r.modelName}</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center text-xs font-medium text-slate-600 dark:text-slate-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                        u/{r.ownerHandle}
                      </span>
                      {r.hasHeatPump && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
                          Heat Pump
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                      {r.odometerKm.toLocaleString('en-GB')} km
                    </span>
                    {r.sourceUrl && (
                      <div className="mt-1">
                        <a
                          href={r.sourceUrl}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="inline-flex items-center text-[10px] font-medium text-cyan-600 dark:text-cyan-400 hover:underline"
                        >
                          {r.source} <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3 Metrics Cards */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl border border-emerald-100 dark:border-emerald-950/40 bg-emerald-50/40 dark:bg-emerald-950/20 p-2.5">
                    <Zap className="mx-auto h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <div className="mt-1 font-mono text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                      {r.realEvRangeSummerKm}
                    </div>
                    <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Warm EV (km)</div>
                  </div>

                  <div className="rounded-xl border border-cyan-100 dark:border-cyan-950/40 bg-cyan-50/40 dark:bg-cyan-950/20 p-2.5">
                    <Snowflake className="mx-auto h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                    <div className="mt-1 font-mono text-lg font-extrabold text-cyan-600 dark:text-cyan-400">
                      {r.realEvRangeWinterKm}
                    </div>
                    <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Winter (km)</div>
                  </div>

                  <div className="rounded-xl border border-amber-200/60 dark:border-amber-950/40 bg-amber-50/40 dark:bg-amber-950/20 p-2.5 ring-1 ring-amber-400/30">
                    <Fuel className="mx-auto h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <div className="mt-1 font-mono text-lg font-extrabold text-amber-600 dark:text-amber-400">
                      {r.emptyBatteryFuelL100}
                    </div>
                    <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Depleted (L/100)</div>
                  </div>
                </div>

                {/* Verbatim quote */}
                <blockquote className="mt-4 text-xs italic text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  “{r.note}”
                </blockquote>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1 font-mono">
                  <Gauge className="w-3.5 h-3.5" /> {r.electricConsumptionKwh} kWh/100km
                </span>
                <span className="font-mono">Lifetime: {r.combinedLifetimeL100} L/100km</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th scope="col" className="px-4 py-3 sm:px-6">Vehicle Model</th>
                  <th scope="col" className="px-4 py-3 text-right">WLTP</th>
                  <th scope="col" className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400">Real Warm</th>
                  <th scope="col" className="px-4 py-3 text-right text-cyan-600 dark:text-cyan-400">Winter EV</th>
                  <th scope="col" className="px-4 py-3 text-right text-amber-600 dark:text-amber-400">Depleted Fuel</th>
                  <th scope="col" className="px-4 py-3 text-right">Lifetime</th>
                  <th scope="col" className="px-4 py-3 text-right">Odometer</th>
                  <th scope="col" className="px-4 py-3">Contributor</th>
                  <th scope="col" className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {filteredReports.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 sm:px-6 font-sans font-semibold text-slate-900 dark:text-white">
                      <Link href={`/models/${r.carSlug}/`} className="hover:text-blue-600 transition-colors">
                        {r.modelName}
                      </Link>
                      {r.hasHeatPump && (
                        <span className="ml-2 inline-block px-1.5 py-0.2 rounded-sm text-[9px] font-sans font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
                          HP
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500">{r.wltpRangeKm} km</td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {r.realEvRangeSummerKm} km
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-cyan-600 dark:text-cyan-400">
                      {r.realEvRangeWinterKm} km
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-amber-600 dark:text-amber-400">
                      {r.emptyBatteryFuelL100} L/100
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">
                      {r.combinedLifetimeL100} L/100
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500">
                      {r.odometerKm.toLocaleString('en-GB')} km
                    </td>
                    <td className="px-4 py-3 font-sans text-slate-600 dark:text-slate-400">
                      u/{r.ownerHandle}
                    </td>
                    <td className="px-4 py-3 text-center font-sans">
                      <Link
                        href={`/models/${r.carSlug}/`}
                        className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        Specs →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredReports.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
          <p className="text-base font-semibold text-slate-700 dark:text-slate-300">No telemetries match your filters.</p>
          <p className="mt-1 text-sm text-slate-500">Try clearing the search query or selecting &quot;All Brands&quot;.</p>
          <button
            onClick={() => {
              setSelectedBrand('All')
              setSearchQuery('')
              setOnlyHeatPump(false)
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Interactive Range Simulator Banner */}
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Calculate your exact daily commute in summer and winter
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
            Simulate highway speed ratios, sub-zero temperatures, and HVAC cabin heating consumption for any European PHEV model before buying.
          </p>
        </div>
        <Link
          href="/range-calculator/"
          className="shrink-0 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all"
        >
          Launch Range Simulator →
        </Link>
      </div>

      {/* Submission CTA box */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center space-y-3">
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          Drive a Plug-in Hybrid? Share your real numbers with the community.
        </h4>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Help fellow drivers across Europe by sharing your real warm/winter electric range, highway empty-battery fuel consumption, and long-term odometer readings.
        </p>
        <a
          href={submitHref}
          className="inline-block mt-2 px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity"
        >
          Submit Your Telemetry (Email) →
        </a>
      </div>
    </div>
  )
}
