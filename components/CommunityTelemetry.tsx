'use client'

import { useState, useEffect } from 'react'
import { ShieldCheck, Gauge, Zap, Snowflake, Fuel, ExternalLink } from 'lucide-react'
import { aggregateReports, type CommunityReport } from '@/lib/community-telemetry'

interface Props {
  modelName: string
  reports: CommunityReport[]
  theme?: string
}

const sign = (n: number) => `${n > 0 ? '+' : ''}${n}%`

export default function CommunityTelemetry({ modelName, reports, theme: propTheme }: Props) {
  const [activeTheme, setActiveTheme] = useState<string>(propTheme || 'light')

  useEffect(() => {
    if (propTheme) {
      setActiveTheme(propTheme)
      return
    }

    const checkTheme = () => {
      const savedTheme = localStorage.getItem('phevs-theme')
      if (savedTheme) {
        setActiveTheme(savedTheme)
      } else if (document.documentElement.classList.contains('dark')) {
        setActiveTheme('dark')
      } else {
        setActiveTheme('light')
      }
    }

    checkTheme()

    const handleThemeChange = () => checkTheme()
    window.addEventListener('storage', handleThemeChange)
    window.addEventListener('themeChanged', handleThemeChange)

    return () => {
      window.removeEventListener('storage', handleThemeChange)
      window.removeEventListener('themeChanged', handleThemeChange)
    }
  }, [propTheme])

  const agg = aggregateReports(reports)
  // Never render an empty/placeholder block: no data, no section.
  if (!agg) return null

  const isDark = activeTheme === 'dark'
  const submitHref = `mailto:info@phevs.eu?subject=${encodeURIComponent(`Telemetry submission: ${modelName}`)}`

  return (
    <section
      id="owner-telemetry"
      aria-label={`${modelName} real-world owner telemetry`}
      className={`mt-12 rounded-2xl border transition-colors duration-200 ${
        isDark
          ? 'border-slate-800 bg-slate-950 text-slate-100 shadow-2xl'
          : 'border-slate-200 bg-white text-slate-800 shadow-sm'
      } p-6 sm:p-8`}
    >
      <div className={`flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center ${
        isDark ? 'border-slate-800/80' : 'border-slate-100'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className={`text-xs font-semibold uppercase tracking-wider ${
              isDark ? 'text-emerald-400' : 'text-emerald-700'
            }`}>
              Real-World Fleet Telemetry
            </span>
          </div>
          <h2 className={`mt-1 text-xl sm:text-2xl font-bold tracking-tight ${
            isDark ? 'text-slate-100' : 'text-slate-900'
          }`}>
            Owner Benchmarks vs WLTP — {modelName}
          </h2>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {agg.count} verified owner report{agg.count > 1 ? 's' : ''} · {agg.totalKm.toLocaleString('en-GB')} km logged
          </p>
        </div>

        {/* Aggregate KPI pill */}
        <div className={`flex items-center gap-3 rounded-xl border px-4 py-2 text-right transition-colors ${
          isDark
            ? 'border-slate-800 bg-slate-900'
            : 'border-slate-200 bg-slate-50/80'
        }`}>
          <div>
            <div className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>WLTP</div>
            <div className={`font-mono text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
              {agg.wltp} km
            </div>
          </div>
          <div className={`h-6 w-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
          <div>
            <div className={`text-[11px] font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
              Summer ({sign(agg.summerDeltaPct)})
            </div>
            <div className={`font-mono text-sm font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {agg.summer} km
            </div>
          </div>
          <div className={`h-6 w-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
          <div>
            <div className={`text-[11px] font-semibold ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>
              Winter ({sign(agg.winterDeltaPct)})
            </div>
            <div className={`font-mono text-sm font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
              {agg.winter} km
            </div>
          </div>
        </div>
      </div>

      {/* Grid of driver reports */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {reports.map(r => (
          <article
            key={r.id}
            className={`rounded-xl border p-5 transition-all duration-200 ${
              isDark
                ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                : 'border-slate-200 bg-slate-50/80 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <header className="flex flex-wrap items-center justify-between gap-2">
              <div className={`flex items-center gap-2 text-sm font-semibold ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              }`}>
                <ShieldCheck className={`h-4 w-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} aria-hidden />
                u/{r.ownerHandle}
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className={`rounded-md px-2 py-0.5 font-mono ${
                  isDark
                    ? 'bg-slate-800 text-slate-300'
                    : 'border border-slate-200 bg-white text-slate-600 shadow-2xs'
                }`}>
                  {r.odometerKm.toLocaleString('en-GB')} km logged
                </span>
                {r.sourceUrl ? (
                  <a
                    href={r.sourceUrl}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 transition-colors ${
                      isDark
                        ? 'bg-slate-800 text-cyan-400 hover:text-cyan-300'
                        : 'border border-slate-200 bg-white text-cyan-700 hover:text-cyan-800 shadow-2xs'
                    }`}
                  >
                    {r.source} <ExternalLink className="h-3 w-3" aria-hidden />
                  </a>
                ) : (
                  <span className={`rounded-md px-2 py-0.5 ${
                    isDark
                      ? 'bg-slate-800 text-slate-300'
                      : 'border border-slate-200 bg-white text-slate-600 shadow-2xs'
                  }`}>
                    {r.source}
                  </span>
                )}
              </div>
            </header>

            {/* 3 Metric benchmarking cards */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className={`rounded-lg p-2.5 transition-colors ${
                isDark
                  ? 'bg-slate-950 border border-slate-800/80'
                  : 'bg-white border border-emerald-100 shadow-2xs'
              }`}>
                <Zap className={`mx-auto h-4 w-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} aria-hidden />
                <div className={`mt-1 font-mono text-lg font-bold ${
                  isDark ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  {r.realEvRangeSummerKm}
                </div>
                <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Pure EV warm (km)
                </div>
              </div>

              <div className={`rounded-lg p-2.5 transition-colors ${
                isDark
                  ? 'bg-slate-950 border border-slate-800/80'
                  : 'bg-white border border-cyan-100 shadow-2xs'
              }`}>
                <Snowflake className={`mx-auto h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} aria-hidden />
                <div className={`mt-1 font-mono text-lg font-bold ${
                  isDark ? 'text-cyan-400' : 'text-cyan-600'
                }`}>
                  {r.realEvRangeWinterKm}
                </div>
                <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Winter EV (km)
                </div>
              </div>

              <div className={`rounded-lg p-2.5 ring-1 transition-colors ${
                isDark
                  ? 'bg-slate-950 ring-amber-400/40 border border-slate-800/80'
                  : 'bg-white ring-amber-400/50 border border-amber-200/80 shadow-2xs'
              }`}>
                <Fuel className={`mx-auto h-4 w-4 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} aria-hidden />
                <div className={`mt-1 font-mono text-lg font-bold ${
                  isDark ? 'text-amber-400' : 'text-amber-600'
                }`}>
                  {r.emptyBatteryFuelL100}
                </div>
                <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Empty battery (L/100km)
                </div>
              </div>
            </div>

            <blockquote className={`mt-4 text-xs sm:text-sm italic leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              “{r.note}”
            </blockquote>

            <footer className={`mt-4 flex items-center justify-between border-t pt-3 text-xs ${
              isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
            }`}>
              <span className="inline-flex items-center gap-1">
                <Gauge className="h-3.5 w-3.5" aria-hidden /> {r.electricConsumptionKwh} kWh/100km
              </span>
              <span>Lifetime {r.combinedLifetimeL100} L/100km</span>
              <span>{r.verifiedDate}</span>
            </footer>
          </article>
        ))}
      </div>

      {/* Submission CTA box */}
      <div className={`mt-6 rounded-xl border border-dashed p-4 text-center transition-colors ${
        isDark
          ? 'border-slate-700 bg-slate-900/40 text-slate-300'
          : 'border-slate-300 bg-slate-50/70 text-slate-600'
      }`}>
        <p className="text-sm">Own this vehicle? Help other drivers with your real numbers.</p>
        <a
          href={submitHref}
          className={`mt-2 inline-block text-sm font-semibold transition-colors ${
            isDark
              ? 'text-emerald-400 hover:text-emerald-300'
              : 'text-emerald-600 hover:text-emerald-700'
          }`}
        >
          Submit your telemetry →
        </a>
      </div>
    </section>
  )
}
