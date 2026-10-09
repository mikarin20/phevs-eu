import { ShieldCheck, Gauge, Zap, Snowflake, Fuel, ExternalLink } from 'lucide-react'
import { aggregateReports, type CommunityReport } from '@/lib/community-telemetry'

interface Props {
  modelName: string
  reports: CommunityReport[]
}

const sign = (n: number) => `${n > 0 ? '+' : ''}${n}%`

export default function CommunityTelemetry({ modelName, reports }: Props) {
  const agg = aggregateReports(reports)
  // Never render an empty/placeholder block: no data, no section.
  if (!agg) return null

  const submitHref = `mailto:info@phevs.eu?subject=${encodeURIComponent(`Telemetry submission: ${modelName}`)}`

  return (
    <section
      id="owner-telemetry"
      aria-label={`${modelName} real-world owner telemetry`}
      className="mt-12 rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl text-slate-100"
    >
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800/80 pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Real-World Fleet Telemetry</span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-slate-100">Owner Benchmarks vs WLTP — {modelName}</h2>
          <p className="text-xs text-slate-400">
            {agg.count} owner report{agg.count > 1 ? 's' : ''} · {agg.totalKm.toLocaleString('en-GB')} km logged
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-right">
          <div>
            <div className="text-[11px] text-slate-400">WLTP</div>
            <div className="font-mono text-sm text-slate-300">{agg.wltp} km</div>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <div className="text-[11px] text-emerald-400">Summer ({sign(agg.summerDeltaPct)})</div>
            <div className="font-mono text-sm font-bold text-emerald-400">{agg.summer} km</div>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <div className="text-[11px] text-cyan-400">Winter ({sign(agg.winterDeltaPct)})</div>
            <div className="font-mono text-sm font-bold text-cyan-400">{agg.winter} km</div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {reports.map(r => (
          <article key={r.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <header className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden />
                u/{r.ownerHandle}
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="rounded-md bg-slate-800 px-2 py-0.5 font-mono text-slate-300">
                  {r.odometerKm.toLocaleString('en-GB')} km logged
                </span>
                {r.sourceUrl ? (
                  <a
                    href={r.sourceUrl}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-0.5 text-cyan-400 hover:text-cyan-300"
                  >
                    {r.source} <ExternalLink className="h-3 w-3" aria-hidden />
                  </a>
                ) : (
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-slate-300">{r.source}</span>
                )}
              </div>
            </header>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-slate-950 p-2">
                <Zap className="mx-auto h-4 w-4 text-emerald-400" aria-hidden />
                <div className="mt-1 font-mono text-lg font-bold text-emerald-400">{r.realEvRangeSummerKm}</div>
                <div className="text-[10px] text-slate-400">Pure EV warm (km)</div>
              </div>
              <div className="rounded-lg bg-slate-950 p-2">
                <Snowflake className="mx-auto h-4 w-4 text-cyan-400" aria-hidden />
                <div className="mt-1 font-mono text-lg font-bold text-cyan-400">{r.realEvRangeWinterKm}</div>
                <div className="text-[10px] text-slate-400">Winter EV (km)</div>
              </div>
              <div className="rounded-lg bg-slate-950 p-2 ring-1 ring-amber-400/40">
                <Fuel className="mx-auto h-4 w-4 text-amber-400" aria-hidden />
                <div className="mt-1 font-mono text-lg font-bold text-amber-400">{r.emptyBatteryFuelL100}</div>
                <div className="text-[10px] text-slate-400">Empty battery (L/100km)</div>
              </div>
            </div>

            <blockquote className="mt-4 text-sm italic text-slate-300">“{r.note}”</blockquote>

            <footer className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Gauge className="h-3.5 w-3.5" aria-hidden /> {r.electricConsumptionKwh} kWh/100km
              </span>
              <span>Lifetime {r.combinedLifetimeL100} L/100km</span>
              <span>{r.verifiedDate}</span>
            </footer>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-4 text-center">
        <p className="text-sm text-slate-300">Own this vehicle? Help other drivers with your real numbers.</p>
        <a href={submitHref} className="mt-2 inline-block text-sm font-semibold text-emerald-400 hover:text-emerald-300">
          Submit your telemetry →
        </a>
      </div>
    </section>
  )
}
