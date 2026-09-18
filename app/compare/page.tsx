'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import carsData from '@/data/cars.json'
import { getImageUrl } from '@/lib/image-url'

interface Vehicle {
  id: string
  slug?: string
  brand: string
  model: string
  year: number
  image_url: string
  ev_range_km: number
  battery_kwh: number
  power_hp: number
}

export default function CompareLandingPage() {
  const router = useRouter()
  const vehicles = useMemo(
    () => (carsData as Vehicle[])
      .filter((vehicle) => vehicle.id && vehicle.brand && vehicle.model)
      .sort((a, b) =>
        String(a.brand).localeCompare(String(b.brand)) || String(a.model).localeCompare(String(b.model))
      ),
    []
  )
  const [firstId, setFirstId] = useState('')
  const [secondId, setSecondId] = useState('')

  const firstVehicle = vehicles.find((vehicle) => vehicle.id === firstId)
  const secondVehicle = vehicles.find((vehicle) => vehicle.id === secondId)
  const canCompare = Boolean(firstVehicle && secondVehicle && firstId !== secondId)

  function startComparison() {
    if (!firstVehicle || !secondVehicle || firstId === secondId) return
    const firstSlug = firstVehicle.slug || firstVehicle.id
    const secondSlug = secondVehicle.slug || secondVehicle.id
    router.push(`/compare/${firstSlug}-vs-${secondSlug}`)
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to vehicle database
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Compare PHEV Vehicles</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Select two plug-in hybrid vehicles to compare electric range, battery capacity, power, charging, consumption, safety and practicality.
          </p>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <VehiclePicker
              label="Vehicle 1"
              value={firstId}
              onChange={setFirstId}
              vehicles={vehicles}
              selected={firstVehicle}
            />

            <div className="flex justify-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white">
                <ArrowsRightLeftIcon className="h-5 w-5" />
              </div>
            </div>

            <VehiclePicker
              label="Vehicle 2"
              value={secondId}
              onChange={setSecondId}
              vehicles={vehicles}
              selected={secondVehicle}
              excludedId={firstId}
            />
          </div>

          {firstId && secondId && firstId === secondId && (
            <p className="mt-5 text-center text-sm text-red-600">Select two different vehicles.</p>
          )}

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={startComparison}
              disabled={!canCompare}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-blue-600 px-7 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <ArrowsRightLeftIcon className="h-5 w-5" />
              Compare vehicles
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}

function VehiclePicker({
  label,
  value,
  onChange,
  vehicles,
  selected,
  excludedId,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  vehicles: Vehicle[]
  selected?: Vehicle
  excludedId?: string
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">Select a vehicle…</option>
        {vehicles.map((vehicle) => (
          <option key={vehicle.id} value={vehicle.id} disabled={vehicle.id === excludedId}>
            {vehicle.brand} {vehicle.model} ({vehicle.year})
          </option>
        ))}
      </select>

      <div className="mt-4 min-h-52 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        {selected ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getImageUrl(selected.image_url)}
              alt={`${selected.brand} ${selected.model}`}
              className="h-32 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="font-semibold text-slate-900">{selected.brand} {selected.model}</h2>
              <p className="mt-1 text-xs text-slate-500">{selected.year}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <span><strong className="block text-slate-900">{selected.ev_range_km}</strong>km</span>
                <span><strong className="block text-slate-900">{selected.battery_kwh}</strong>kWh</span>
                <span><strong className="block text-slate-900">{selected.power_hp}</strong>HP</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-52 items-center justify-center text-sm text-slate-400">Choose a vehicle</div>
        )}
      </div>
    </div>
  )
}
