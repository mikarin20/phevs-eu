'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ShieldCheckIcon,
  SparklesIcon,
  CurrencyPoundIcon,
  CurrencyEuroIcon,
  ArrowTrendingDownIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { getImageUrl } from '@/lib/image-url'

interface Car {
  id: string
  brand: string
  model: string
  year: number
  ev_range_km: number
  co2_emission: number
  battery_kwh: number
  price_eur?: number
  image_url: string
  segment?: string
  weight_kg?: number
  slug?: string
}

interface Props {
  cars: Car[]
}

type CountryTab = 'uk' | 'de' | 'fr' | 'be' | 'euro6e'

export default function CompanyCarTaxSimulatorPageClient({ cars }: Props) {
  // Sort cars with long range first
  const sortedCars = useMemo(() => {
    return [...cars].sort((a, b) => (b.ev_range_km || 0) - (a.ev_range_km || 0))
  }, [cars])

  // Default to a popular fleet PHEV like Tiguan or Audi A3 or RAV4
  const defaultCar = sortedCars.find(c => c.brand.toLowerCase() === 'volkswagen' && c.model.toLowerCase().includes('tiguan')) || sortedCars[0]

  const [selectedCarId, setSelectedCarId] = useState<string>(defaultCar?.id || '')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<CountryTab>('uk')

  const selectedCar = cars.find(c => c.id === selectedCarId) || defaultCar

  const brand = selectedCar?.brand || 'PHEV'
  const model = selectedCar?.model || 'Plug-in Hybrid'
  const evRangeKm = selectedCar?.ev_range_km || 75
  const evRangeMiles = Math.round(evRangeKm * 0.621371)
  const co2 = selectedCar?.co2_emission || 32
  const batteryKwh = selectedCar?.battery_kwh || 18
  const weightKg = selectedCar?.weight_kg || 1950
  const defaultPriceEur = selectedCar?.price_eur || 48000

  // Interactive state
  const [customPriceEur, setCustomPriceEur] = useState<number>(defaultPriceEur)
  const [ukTaxBand, setUkTaxBand] = useState<20 | 40 | 45>(40)
  const [deTaxRate, setDeTaxRate] = useState<number>(42)
  const [deCommuteKm, setDeCommuteKm] = useState<number>(20)

  // Update price slider when selected car changes
  const handleCarSelect = (id: string) => {
    setSelectedCarId(id)
    const car = cars.find(c => c.id === id)
    if (car?.price_eur) {
      setCustomPriceEur(car.price_eur)
    }
  }

  // Filtered cars for search dropdown
  const filteredCars = useMemo(() => {
    if (!searchQuery) return sortedCars.slice(0, 30)
    const q = searchQuery.toLowerCase()
    return sortedCars.filter(c => 
      c.brand.toLowerCase().includes(q) || 
      c.model.toLowerCase().includes(q)
    )
  }, [sortedCars, searchQuery])

  // UK Calculations (HMRC 2025/2026 Bands for PHEV CO2 1-50g/km)
  const p11dValue = Math.round(customPriceEur * 0.85)
  let ukBikPercent = 14
  if (evRangeMiles >= 130) {
    ukBikPercent = 2
  } else if (evRangeMiles >= 70) {
    ukBikPercent = 5
  } else if (evRangeMiles >= 40) {
    ukBikPercent = 8
  } else if (evRangeMiles >= 30) {
    ukBikPercent = 12
  } else {
    ukBikPercent = 14
  }

  const ukBikTaxableValue = (p11dValue * ukBikPercent) / 100
  const ukAnnualTax = Math.round((ukBikTaxableValue * ukTaxBand) / 100)
  const ukMonthlyTax = Math.round(ukAnnualTax / 12)

  const iceBikPercent = 32
  const iceBikTaxableValue = (p11dValue * iceBikPercent) / 100
  const iceAnnualTax = Math.round((iceBikTaxableValue * ukTaxBand) / 100)
  const ukAnnualSavings = Math.max(0, iceAnnualTax - ukAnnualTax)

  // Germany Calculations (§ 6 Abs. 1 Nr. 4 EStG)
  const qualifiesForDeHalfPercent = evRangeKm >= 80 || co2 <= 50
  const deTaxFactor = qualifiesForDeHalfPercent ? 0.005 : 0.01
  const deCommuteFactor = qualifiesForDeHalfPercent ? 0.00015 : 0.0003

  const deMonthlyPrivatnutzung = customPriceEur * deTaxFactor
  const deMonthlyCommute = customPriceEur * deCommuteFactor * deCommuteKm
  const deMonthlyTaxableBenefit = deMonthlyPrivatnutzung + deMonthlyCommute
  const deMonthlyTaxCost = Math.round((deMonthlyTaxableBenefit * deTaxRate) / 100)
  const deAnnualTaxCost = deMonthlyTaxCost * 12

  const iceMonthlyBenefit = (customPriceEur * 0.01) + (customPriceEur * 0.0003 * deCommuteKm)
  const iceDeMonthlyTax = Math.round((iceMonthlyBenefit * deTaxRate) / 100)
  const deAnnualSavings = Math.max(0, (iceDeMonthlyTax - deMonthlyTaxCost) * 12)

  // France Calculations
  const frRangeExemption = evRangeKm >= 50
  const frTvsExempt = co2 < 50

  // Belgium Calculations
  const isGenuineHybrid = (batteryKwh / (weightKg / 100)) >= 0.5 && co2 <= 50
  const rawBeDeductibility = Math.min(100, Math.max(40, Math.round(120 - (0.5 * co2))))
  const beDeductibility = isGenuineHybrid ? rawBeDeductibility : Math.min(50, rawBeDeductibility)

  // Euro 6e-bis (2026/2027 Utility Factor)
  const isEuro6eSafe = evRangeKm >= 80

  return (
    <div className="space-y-8">
      {/* Vehicle Selection & Hero Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Active Vehicle in Simulator
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {brand} {model} ({selectedCar?.year})
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <span className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-1 rounded-full font-semibold">
                ⚡ {evRangeKm} km WLTP Range
              </span>
              <span className="bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-3 py-1 rounded-full font-semibold">
                🌿 {co2} g/km CO₂
              </span>
              <span className="bg-purple-50 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-3 py-1 rounded-full font-semibold">
                🔋 {batteryKwh} kWh Battery
              </span>
            </div>
          </div>

          {/* Car Image Preview & Link */}
          <div className="flex items-center gap-4">
            <div className="relative w-32 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shrink-0">
              <Image
                src={getImageUrl(selectedCar?.image_url)}
                alt={`${brand} ${model}`}
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>
            <Link
              href={`/models/${selectedCar?.slug || selectedCar?.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold text-xs transition-colors"
            >
              <span>View Specs</span>
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick Vehicle Switcher Dropdown */}
        <div className="mt-6">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
            Switch Vehicle to Compare Company Car Tax:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brand or model (e.g. Passat, RAV4, Seal U, GLC)..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <select
              value={selectedCarId}
              onChange={(e) => handleCarSelect(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
            >
              {filteredCars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.brand} {car.model} — {car.ev_range_km} km range ({car.co2_emission}g CO₂)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Interactive Tax Engine */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {/* Country Selector Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 overflow-x-auto px-4 sm:px-8">
          <button
            onClick={() => setActiveTab('uk')}
            className={`py-4 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'uk'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span>🇬🇧 UK BiK Rate</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono">
              {ukBikPercent}%
            </span>
          </button>

          <button
            onClick={() => setActiveTab('de')}
            className={`py-4 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'de'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span>🇩🇪 Germany (0.5%)</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-mono">
              {qualifiesForDeHalfPercent ? '0.5% Privileg' : '1.0%'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('fr')}
            className={`py-4 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'fr'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span>🇫🇷 France (Malus)</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-mono">
              {frRangeExemption ? '-200kg Abattement' : 'Std'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('be')}
            className={`py-4 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'be'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span>🇧🇪 Belgium</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-mono">
              {beDeductibility}% Deductible
            </span>
          </button>

          <button
            onClick={() => setActiveTab('euro6e')}
            className={`py-4 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'euro6e'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span>🇪🇺 Euro 6e-bis (2026/27)</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
              isEuro6eSafe 
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}>
              {isEuro6eSafe ? 'Protected' : 'UF Watch'}
            </span>
          </button>
        </div>

        {/* Content Pane */}
        <div className="p-6 sm:p-8">
          {/* TAB 1: UK BENEFIT IN KIND */}
          {activeTab === 'uk' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Official 2025/26 BiK Band
                  </span>
                  <div className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
                    {ukBikPercent}%
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Applies to {evRangeMiles} miles ({evRangeKm} km) electric range.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Monthly BiK Employee Tax
                  </span>
                  <div className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
                    £{ukMonthlyTax} <span className="text-base font-normal text-slate-400">/mo</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Annual liability: <strong>£{ukAnnualTax.toLocaleString()}</strong> ({ukTaxBand}% tax band).
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-100">
                    <ArrowTrendingDownIcon className="h-4 w-4" />
                    <span>Annual Driver Savings</span>
                  </div>
                  <div className="text-4xl font-extrabold mt-2">
                    £{ukAnnualSavings.toLocaleString()}
                  </div>
                  <p className="text-xs text-emerald-100/90 mt-2">
                    Saved each year compared to equivalent 32% BiK petrol/diesel company car (£{iceAnnualTax.toLocaleString()}/yr).
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-6">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <CurrencyPoundIcon className="h-5 w-5 text-emerald-600" />
                  <span>Adjust Vehicle Price & Tax Bracket</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      P11D Value: <strong className="text-emerald-600 dark:text-emerald-400">£{p11dValue.toLocaleString()}</strong>
                    </label>
                    <input
                      type="range"
                      min="25000"
                      max="120000"
                      step="1000"
                      value={customPriceEur}
                      onChange={(e) => setCustomPriceEur(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Personal Income Tax Bracket:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[20, 40, 45].map((band) => (
                        <button
                          key={band}
                          type="button"
                          onClick={() => setUkTaxBand(band as any)}
                          className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                            ukTaxBand === band
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                          }`}
                        >
                          {band}% Rate
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GERMANY */}
          {activeTab === 'de' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    § 6 Abs. 1 Nr. 4 EStG Status
                  </span>
                  <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">
                    {qualifiesForDeHalfPercent ? '0,5% Regelung' : '1,0% Regelung'}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {qualifiesForDeHalfPercent
                      ? `Erfüllt die gesetzliche Vorgabe (≥80 km Reichweite oder ≤50g CO₂).`
                      : `Unter 80 km und über 50g CO₂.`}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Monatliche Steuerbelastung
                  </span>
                  <div className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
                    €{deMonthlyTaxCost} <span className="text-base font-normal text-slate-400">/Monat</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Geldwerter Vorteil gesamt: <strong>€{Math.round(deMonthlyTaxableBenefit)}/Monat</strong>.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-lg">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-100">
                    <ArrowTrendingDownIcon className="h-4 w-4" />
                    <span>Jährliche Ersparnis</span>
                  </div>
                  <div className="text-4xl font-extrabold mt-2">
                    €{deAnnualSavings.toLocaleString()}
                  </div>
                  <p className="text-xs text-blue-100/90 mt-2">
                    Netto-Steuerersparnis pro Jahr gegenüber reinem Benziner/Diesel (€{iceDeMonthlyTax * 12}/Jahr).
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-6">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <CurrencyEuroIcon className="h-5 w-5 text-blue-600" />
                  <span>Dienstwagen-Parameter</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Bruttolistenpreis: <strong className="text-blue-600 dark:text-blue-400">€{customPriceEur.toLocaleString()}</strong>
                    </label>
                    <input
                      type="range"
                      min="30000"
                      max="140000"
                      step="1000"
                      value={customPriceEur}
                      onChange={(e) => setCustomPriceEur(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Einfache Strecke zur Arbeit: <strong className="text-blue-600 dark:text-blue-400">{deCommuteKm} km</strong>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="80"
                      step="5"
                      value={deCommuteKm}
                      onChange={(e) => setDeCommuteKm(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FRANCE */}
          {activeTab === 'fr' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Malus au Poids (Abattement PHEV)
                  </span>
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
                    {frRangeExemption ? 'Exonération / -200 kg' : 'Malus standard applicable'}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Avec <strong>{evRangeKm} km</strong> d&apos;autonomie WLTP, ce véhicule bénéficie du plafond d&apos;abattement maximal.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Taxe sur les Véhicules de Société (TVS)
                  </span>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                    {frTvsExempt ? '0 € / an (Exonéré CO₂)' : 'Taxe réduite'}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Émissions de <strong>{co2} g/km</strong> inférieures au seuil de 50 g/km.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BELGIUM */}
          {activeTab === 'be' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Fiscale Aftrekbaarheid Bedrijven
                  </span>
                  <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
                    {beDeductibility}%
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Formule: 120% - (0,5% × {co2} g CO₂/km).
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Classificatie Faux-Hybride
                  </span>
                  <div className={`text-2xl font-bold mt-2 ${isGenuineHybrid ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isGenuineHybrid ? 'Voldoet aan normen' : 'Risico Valse Hybride'}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Batterij/gewicht verhouding: <strong>{(batteryKwh / (weightKg / 100)).toFixed(2)} kWh/100kg</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: EURO 6E-BIS */}
          {activeTab === 'euro6e' && (
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border ${
                isEuro6eSafe 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' 
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    isEuro6eSafe ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                  }`}>
                    {isEuro6eSafe ? <ShieldCheckIcon className="h-7 w-7" /> : <ExclamationTriangleIcon className="h-7 w-7" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {isEuro6eSafe
                        ? 'Euro 6e-bis (2026/2027) Future-Proof Certified'
                        : 'Euro 6e-bis Utility Factor Sensitivity Alert'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {isEuro6eSafe
                        ? `With ${evRangeKm} km electric range, the ${brand} ${model} easily withstands the EU's 2026 Utility Factor revision (reference distance expanding from 800 km to 2,200 km). Its official CO₂ figure will remain safely below national 50g tax thresholds.`
                        : `Because this vehicle has ${evRangeKm} km WLTP range (< 80 km), upcoming Euro 6e-bis recalculations could increase its official paper CO₂ emissions by 60–120%, potentially pushing it over European company car tax shelter limits.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
