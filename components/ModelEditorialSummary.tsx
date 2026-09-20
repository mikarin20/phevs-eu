import React from 'react'
import { BoltIcon, Battery50Icon, SparklesIcon, InformationCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import Euro6eTaxBadge from '@/components/Euro6eTaxBadge'

interface ModelEditorialSummaryProps {
  car: {
    brand: string
    model: string
    year: number
    segment: string
    battery_kwh: number
    usable_battery_kwh?: number
    ev_range_km: number
    power_hp: number
    fuel_consumption: number
    co2_emission: number
    charge_time_ac?: number
    charge_time_dc?: number
    ac_max_power_kw?: number
    dc_max_power_kw?: number
    dc_charging_supported?: boolean
    charging_capabilities?: {
      ac_power?: number
      dc_power?: number
      ac_power_max?: number
    }
  }
  selectedTheme?: string
  locale?: string
}

export default function ModelEditorialSummary({
  car,
  selectedTheme = 'light',
  locale = 'en'
}: ModelEditorialSummaryProps) {
  const isDark = selectedTheme === 'dark'

  // Calculations
  const batteryKwh = car.battery_kwh || 15
  const wltpRange = car.ev_range_km || 50
  const acPower = car.ac_max_power_kw || car.charging_capabilities?.ac_power || 3.7
  const dcPower = car.dc_max_power_kw || car.charging_capabilities?.dc_power || 0
  const hasDc = Boolean(car.dc_charging_supported || dcPower > 0)

  // Real world estimates
  const citySummerRange = Math.round(wltpRange * 0.92)
  const winterHighwayRange = Math.max(25, Math.round(wltpRange * 0.64))
  const homeSocketHours = Math.round((batteryKwh * 0.9) / 2.1)
  const wallboxHours = ((batteryKwh * 0.9) / Math.min(acPower, 11)).toFixed(1)

  // Battery Segment classification
  let batteryTier = 'standard'
  let batteryTierLabel = 'Segment Standard'
  if (batteryKwh >= 25) {
    batteryTier = 'exceptional'
    batteryTierLabel = 'Ultra High-Capacity PHEV'
  } else if (batteryKwh >= 19) {
    batteryTier = 'above_average'
    batteryTierLabel = 'Above European Market Average'
  }

  // Commute utility (Average EU commute is 34 km roundtrip)
  const commuteDays = (wltpRange / 34).toFixed(1)

  return (
    <section 
      aria-labelledby="editorial-analysis-heading"
      className={`rounded-2xl p-6 sm:p-8 mb-8 border transition-all duration-200 ${
        isDark 
          ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl' 
          : 'bg-gradient-to-br from-white via-blue-50/20 to-slate-50 border-slate-200/90 text-slate-800 shadow-md'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            <SparklesIcon className="h-4 w-4" />
            <span>Automated Technical Verdict & Data Analysis</span>
          </div>
          <h2 id="editorial-analysis-heading" className="text-xl sm:text-2xl font-bold tracking-tight">
            {car.brand} {car.model} ({car.year}): Powertrain & Real-World Utility
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40">
            {batteryTierLabel}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Metric 1: Battery Context */}
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-700/80' : 'bg-white border-slate-200/80'}`}>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
            <Battery50Icon className="h-5 w-5" />
            <h3 className="font-semibold text-sm">Battery Pack vs Market</h3>
          </div>
          <p className="text-2xl font-bold mb-1">
            {batteryKwh} <span className="text-sm font-normal text-slate-500">kWh gross</span>
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {batteryKwh >= 20
              ? `Equipped with a large ${batteryKwh} kWh pack, the ${car.model} sits in the upper percentile of European plug-in hybrids, offering true zero-emission range that rivals dedicated urban EVs.`
              : `With ${batteryKwh} kWh storage, the battery packaging is optimized to balance electric range with reduced vehicle curb weight, preserving luggage space and internal agility.`}
          </p>
        </div>

        {/* Metric 2: Real-World Electric Range */}
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-700/80' : 'bg-white border-slate-200/80'}`}>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
            <BoltIcon className="h-5 w-5" />
            <h3 className="font-semibold text-sm">Real-World Range Expectation</h3>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">~{winterHighwayRange}–{citySummerRange}</span>
            <span className="text-sm font-normal text-slate-500">km realistic</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            While official WLTP laboratory figures state <strong>{wltpRange} km</strong>, drivers should anticipate approximately <strong>~{citySummerRange} km</strong> in temperate urban commutes, and around <strong>~{winterHighwayRange} km</strong> during sub-zero motorway trips with cabin heating.
          </p>
        </div>

        {/* Metric 3: Charging Time & Infrastructure */}
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-700/80' : 'bg-white border-slate-200/80'}`}>
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
            <ClockIcon className="h-5 w-5" />
            <h3 className="font-semibold text-sm">Charging Infrastructure</h3>
          </div>
          <p className="text-2xl font-bold mb-1">
            {acPower} <span className="text-sm font-normal text-slate-500">kW AC Onboard</span>
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            A standard 11/22 kW home wallbox will replenish the pack in approximately <strong>~{wallboxHours} hours</strong>. 
            {hasDc 
              ? ` Thanks to ${dcPower > 0 ? `${dcPower} kW ` : ''}DC fast charging support, quick roadside boosts from 10% to 80% can be completed in approximately ~${car.charge_time_dc || 30} minutes.`
              : ' Fast DC charging is not equipped on this model, meaning charging is best suited for overnight domestic wallboxes or workplace destination chargers.'}
          </p>
        </div>
      </div>

      {/* Programmatic Editorial Paragraph */}
      <div className={`p-4 sm:p-5 rounded-xl border text-xs sm:text-sm leading-relaxed ${isDark ? 'bg-slate-800/40 border-slate-700/60 text-slate-300' : 'bg-blue-50/40 border-blue-100 text-slate-700'}`}>
        <p className="mb-2">
          <strong>Daily Commute & Efficiency Verdict:</strong> For European motorists with typical round-trip daily commutes of ~30–40 km, the {car.brand} {car.model}'s {wltpRange} km electric range can comfortably cover <strong>~{commuteDays} days of routine driving</strong> on pure electricity before triggering the combustion engine.
        </p>
        <p>
          <strong>Euro 6e-bis & Corporate Fleet Impact:</strong> With an official rating of {car.co2_emission} g/km CO₂ and {car.fuel_consumption} L/100km fuel consumption, this vehicle benefits from competitive tax brackets across major European markets. Under revised 2026/2027 Euro 6e-bis Utility Factor calculations, high electric range models like this retain substantially lower Benefit-in-Kind (BiK) and company car tax liabilities compared to older generation PHEVs.
        </p>
      </div>

      {/* Euro 6e-bis & Company Car Tax Breakdown */}
      <Euro6eTaxBadge car={car} isDark={isDark} />
    </section>
  )
}
