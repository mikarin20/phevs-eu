import React, { useState } from 'react'
import { ShieldCheckIcon, InformationCircleIcon, ScaleIcon, BuildingOffice2Icon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

interface Euro6eTaxBadgeProps {
  car: {
    brand: string
    model: string
    ev_range_km: number
    co2_emission: number
    weight_kg?: number
    price_eur?: number
  }
  isDark?: boolean
}

export default function Euro6eTaxBadge({ car, isDark = false }: Euro6eTaxBadgeProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const range = car.ev_range_km || 50
  const co2 = car.co2_emission || 30

  // UK Benefit-in-Kind (BiK) bracket estimation for 2025/2026
  let ukBikBand = '12%'
  let ukBikTier = 'Moderate'
  if (range >= 130) {
    ukBikBand = '2%'
    ukBikTier = 'Ultra Low'
  } else if (range >= 70) {
    ukBikBand = '5%'
    ukBikTier = 'Low'
  } else if (range >= 40) {
    ukBikBand = '8%'
    ukBikTier = 'Standard'
  }

  // Euro 6e-bis Utility Factor risk evaluation
  // Under Euro 6e-bis (2026/2027), reference distance increases from 800km to 2200km.
  // Vehicles with >90 km pure range suffer minimal UF penalties.
  const isEuro6eFutureProof = range >= 80

  // France Weight Penalty (Malus au Poids)
  // PHEVs with >= 50km electric range generally benefit from up to 200kg battery allowance or full exemption
  const frenchMalusStatus = range >= 50 
    ? 'Eligible for battery deduction / reduced weight surcharge'
    : 'Subject to standard vehicle curb weight penalties'

  // Belgium corporate deductibility
  const belgiumStatus = co2 <= 50 
    ? 'High tax deductibility preserved under corporate fleet guidelines' 
    : 'Classified as false hybrid; subject to restricted corporate deduction'

  return (
    <div className={`mt-4 rounded-xl border p-4 transition-all duration-200 ${
      isDark 
        ? 'bg-slate-800/70 border-slate-700/80 text-slate-200' 
        : 'bg-emerald-50/50 border-emerald-200/80 text-slate-800'
    }`}>
      <div 
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheckIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                EU 2026 / 2027 Regulation
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {isEuro6eFutureProof ? 'Euro 6e-bis Protected' : 'Utility Factor Watch'}
              </span>
            </div>
            <h4 className="text-sm font-semibold mt-0.5">
              Euro 6e-bis & Company Car (BiK) Tax Impact
            </h4>
          </div>
        </div>

        <button 
          type="button"
          aria-label="Toggle tax breakdown"
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
        >
          {isExpanded ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
        </button>
      </div>

      {/* Quick Verdict Summary (Always visible) */}
      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
        With <strong>{range} km</strong> electric range and <strong>{co2} g/km CO₂</strong>, this model qualifies for an estimated UK BiK rate of <strong>{ukBikBand} ({ukBikTier})</strong>. {isEuro6eFutureProof ? 'Its high electric range cushions against upcoming EU Utility Factor calculation increases.' : 'Shorter range PHEVs face stricter testing utility factors under 2026/2027 fleet rules.'}
      </p>

      {/* Expandable Country Breakdown */}
      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-1">
              <span>🇬🇧 UK BiK Rate</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-snug">
              Estimated <strong>{ukBikBand}</strong> company car taxation tier based on {range} km pure electric range band.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-1">
              <span>🇫🇷 France (Malus)</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-snug">
              {frenchMalusStatus}.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-1">
              <span>🇧🇪 Belgium Corporate</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-snug">
              {belgiumStatus}.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
