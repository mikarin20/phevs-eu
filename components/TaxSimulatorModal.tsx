'use client'

import { useState } from 'react'
import {
  XMarkIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CurrencyPoundIcon,
  CurrencyEuroIcon,
  ArrowTrendingDownIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

export interface CarForTax {
  id?: string
  brand: string
  model: string
  year?: number
  ev_range_km: number
  co2_emission: number
  battery_kwh: number
  weight_kg?: number
  price_eur?: number
  image_url?: string
}

interface TaxSimulatorModalProps {
  car?: CarForTax | null
  isOpen: boolean
  onClose: () => void
  isDark?: boolean
}

type CountryTab = 'uk' | 'de' | 'fr' | 'be' | 'euro6e'

export default function TaxSimulatorModal({
  car,
  isOpen,
  onClose,
  isDark = false
}: TaxSimulatorModalProps) {
  const [activeTab, setActiveTab] = useState<CountryTab>('uk')

  // Base fallback car values if none provided
  const brand = car?.brand || 'PHEV'
  const model = car?.model || 'Plug-in Hybrid'
  const evRangeKm = car?.ev_range_km || 75
  const evRangeMiles = Math.round(evRangeKm * 0.621371)
  const co2 = car?.co2_emission || 32
  const batteryKwh = car?.battery_kwh || 18
  const weightKg = car?.weight_kg || 1950
  const defaultPriceEur = car?.price_eur || 48000

  // Interactive state
  const [customPriceEur, setCustomPriceEur] = useState<number>(defaultPriceEur)
  const [ukTaxBand, setUkTaxBand] = useState<20 | 40 | 45>(40)
  const [deTaxRate, setDeTaxRate] = useState<number>(42)
  const [deCommuteKm, setDeCommuteKm] = useState<number>(20)

  if (!isOpen) return null

  // UK Calculations (HMRC 2025/2026 Bands for PHEV CO2 1-50g/km)
  // Approximate EUR to GBP ~ 0.85
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

  // Typical petrol/diesel ICE equivalent in UK pays ~32% BiK
  const iceBikPercent = 32
  const iceBikTaxableValue = (p11dValue * iceBikPercent) / 100
  const iceAnnualTax = Math.round((iceBikTaxableValue * ukTaxBand) / 100)
  const ukAnnualSavings = Math.max(0, iceAnnualTax - ukAnnualTax)

  // Germany Calculations (§ 6 Abs. 1 Nr. 4 EStG)
  // 0.5% rule applies if electric range >= 80 km OR CO2 <= 50 g/km
  const qualifiesForDeHalfPercent = evRangeKm >= 80 || co2 <= 50
  const deTaxFactor = qualifiesForDeHalfPercent ? 0.005 : 0.01 // 0.5% vs 1.0%
  const deCommuteFactor = qualifiesForDeHalfPercent ? 0.00015 : 0.0003 // 0.015% vs 0.030%

  const deMonthlyPrivatnutzung = customPriceEur * deTaxFactor
  const deMonthlyCommute = customPriceEur * deCommuteFactor * deCommuteKm
  const deMonthlyTaxableBenefit = deMonthlyPrivatnutzung + deMonthlyCommute
  const deMonthlyTaxCost = Math.round((deMonthlyTaxableBenefit * deTaxRate) / 100)
  const deAnnualTaxCost = deMonthlyTaxCost * 12

  // ICE equivalent pays 1.0% + 0.03%
  const iceMonthlyBenefit = (customPriceEur * 0.01) + (customPriceEur * 0.0003 * deCommuteKm)
  const iceDeMonthlyTax = Math.round((iceMonthlyBenefit * deTaxRate) / 100)
  const deAnnualSavings = Math.max(0, (iceDeMonthlyTax - deMonthlyTaxCost) * 12)

  // France Calculations
  // Malus au poids: rebate 200 kg for PHEVs with >= 50 km pure electric range
  const frRangeExemption = evRangeKm >= 50
  const frTvsExempt = co2 < 50

  // Belgium Calculations
  // Corporate deductibility formula: 120% - (0.5% * CO2)
  const isGenuineHybrid = (batteryKwh / (weightKg / 100)) >= 0.5 && co2 <= 50
  const rawBeDeductibility = Math.min(100, Math.max(40, Math.round(120 - (0.5 * co2))))
  const beDeductibility = isGenuineHybrid ? rawBeDeductibility : Math.min(50, rawBeDeductibility)

  // Euro 6e-bis (2026/2027 Utility Factor)
  // Commission Regulation (EU) 2023/443: Utility Factor test assumption increases from 800 km to 2,200 km.
  // Shorter range PHEVs (<60 km) see official test cycle CO2 double or triple.
  // Longer range (>=80 km) remain cleanly under the 50 g/km barrier.
  const isEuro6eSafe = evRangeKm >= 80

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200 dark:border-slate-800 z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl flex items-center justify-center backdrop-blur-sm text-emerald-400">
                <ShieldCheckIcon className="h-7 w-7 sm:h-8 sm:w-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-1 border border-emerald-400/20">
                  <span>EU 2026 / 2027 Fleet Tax Engine</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Euro 6e-bis & Company Car (BiK) Tax Simulator
                </h2>
                <p className="text-emerald-100/80 text-xs sm:text-sm mt-0.5">
                  Simulate company car tax savings, national fiscal brackets, and Euro 6e-bis regulatory safety
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Active Car Pill */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-emerald-100">
            <span className="font-semibold text-white bg-white/10 px-3 py-1 rounded-lg">
              {brand} {model}
            </span>
            <span>⚡ <strong>{evRangeKm} km</strong> WLTP Range</span>
            <span>🌿 <strong>{co2} g/km</strong> CO₂</span>
            <span>🔋 <strong>{batteryKwh} kWh</strong> Battery</span>
            <span>💶 <strong>€{customPriceEur.toLocaleString()}</strong> List Price</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 overflow-x-auto px-4 sm:px-8">
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
              {frRangeExemption ? '-200kg Rabatt' : 'Std'}
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

        {/* Modal Content */}
        <div className="p-6 sm:p-8 bg-slate-50/50 dark:bg-slate-900/40 max-h-[68vh] overflow-y-auto">
          {/* TAB 1: UK BENEFIT IN KIND */}
          {activeTab === 'uk' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Result Card 1 */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Official 2025/26 BiK Band
                  </span>
                  <div className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
                    {ukBikPercent}%
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Based on <strong>{evRangeMiles} miles ({evRangeKm} km)</strong> pure zero-emission range.
                  </p>
                </div>

                {/* Result Card 2 */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
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

                {/* Result Card 3 */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg">
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

              {/* UK Interactive Controls */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-5">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <CurrencyPoundIcon className="h-5 w-5 text-emerald-600" />
                  <span>Customize BiK Parameters</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      P11D Vehicle Value: <strong className="text-emerald-600 dark:text-emerald-400">£{p11dValue.toLocaleString()}</strong>
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
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>£25k</span>
                      <span>£60k</span>
                      <span>£120k+</span>
                    </div>
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
                              : 'bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {band}% Rate
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong>UK HMRC Guideline:</strong> Under the 2025/2026 tax table, plug-in hybrids emitting 1–50g CO₂/km receive significant Benefit-in-Kind discounts when pure electric range exceeds 40 miles (64 km). This makes the {brand} {model} an exceptionally tax-efficient company vehicle or salary sacrifice choice.
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GERMANY 0.5% DIENSTWAGEN */}
          {activeTab === 'de' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    § 6 Abs. 1 Nr. 4 EStG Status
                  </span>
                  <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">
                    {qualifiesForDeHalfPercent ? '0,5% Regelung' : '1,0% Regelung'}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {qualifiesForDeHalfPercent
                      ? `Erfüllt die gesetzliche Vorgabe (≥80 km Reichweite oder ≤50g CO₂).`
                      : `Unter 80 km und über 50g CO₂ – keine Halbierung.`}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
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

                <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-lg">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-100">
                    <ArrowTrendingDownIcon className="h-4 w-4" />
                    <span>Jährliche Ersparnis</span>
                  </div>
                  <div className="text-4xl font-extrabold mt-2">
                    €{deAnnualSavings.toLocaleString()}
                  </div>
                  <p className="text-xs text-blue-100/90 mt-2">
                    Netto-Steuerersparnis pro Jahr gegenüber einem reinen Benziner/Diesel-Dienstwagen (€{iceDeMonthlyTax * 12}/Jahr).
                  </p>
                </div>
              </div>

              {/* Germany Interactive Controls */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-5">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <CurrencyEuroIcon className="h-5 w-5 text-blue-600" />
                  <span>Dienstwagen-Rechner anpassen</span>
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

          {/* TAB 3: FRANCE MALUS AU POIDS & TVS */}
          {activeTab === 'fr' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Malus au Poids (Abattement PHEV)
                  </span>
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
                    {frRangeExemption ? 'Exonération / -200 kg' : 'Malus standard applicable'}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Avec <strong>{evRangeKm} km</strong> d&apos;autonomie électrique WLTP (&gt; 50 km), ce modèle bénéficie de l&apos;abattement maximal de 200 kg sur la masse en ordre de marche.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Taxe sur les Véhicules de Société (TVS)
                  </span>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                    {frTvsExempt ? '0 € / an (Exonéré CO₂)' : 'Taxe réduite'}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Émissions officielles de <strong>{co2} g/km</strong> inférieures au seuil de 50 g/km.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs sm:text-sm text-indigo-950 dark:text-indigo-200 leading-relaxed">
                <strong>Fiscalité Entreprise en France :</strong> L&apos;abattement spécifique accordé aux hybrides rechargeables avec plus de 50 km d&apos;autonomie permet d&apos;économiser entre 1 500 € et plus de 6 000 € à l&apos;immatriculation par rapport à un véhicule thermique équivalent.
              </div>
            </div>
          )}

          {/* TAB 4: BELGIUM DEDUCTIBILITY */}
          {activeTab === 'be' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
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

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Classificatie Faux-Hybride
                  </span>
                  <div className={`text-2xl font-bold mt-2 ${isGenuineHybrid ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isGenuineHybrid ? 'Voldoet aan normen' : 'Risico Valse Hybride'}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Batterij-energie/gewicht: <strong>{(batteryKwh / (weightKg / 100)).toFixed(2)} kWh/100kg</strong> (Vereist: ≥ 0,5 kWh/100kg en CO₂ ≤ 50g).
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs sm:text-sm text-amber-950 dark:text-amber-200 leading-relaxed">
                <strong>Belgische Vlootwetgeving:</strong> De Belgische fiscale aftrekbaarheid voor bedrijfswagens met verbrandingsmotor wordt stapsgewijs afgebouwd. Echte plug-in hybrides met hoge elektrische autonomie behouden echter de maximale aftrekbaarheid tot de overgangsfase.
              </div>
            </div>
          )}

          {/* TAB 5: EURO 6E-BIS REGULATION */}
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

              {/* Regulatory Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">
                    Phase 1 (Current / Euro 6e)
                  </div>
                  <p className="text-slate-500">
                    Reference distance: <strong>800 km</strong>. High weighting for electric miles. Most PHEVs report 15–35 g CO₂/km.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">
                    Phase 2 (2026 Euro 6e-bis)
                  </div>
                  <p className="text-slate-500">
                    Reference distance: <strong>2,200 km</strong>. Shorter range PHEVs face paper CO₂ doubling. Long range PHEVs (&gt;80 km) remain safe.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">
                    Phase 3 (2027+ Euro 7)
                  </div>
                  <p className="text-slate-500">
                    Reference distance: <strong>4,200 km</strong> + onboard fuel consumption monitoring (OBFCM) data integration.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <InformationCircleIcon className="h-4 w-4" />
            Estimates based on published 2025/2026 fiscal guidelines (HMRC, EStG, EU 2023/443).
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs hover:opacity-90 transition-opacity"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  )
}
