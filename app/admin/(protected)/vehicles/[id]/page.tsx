'use client'

import { useEffect, useState } from 'react'
import VehicleForm from '../VehicleForm'

export default function EditVehiclePage({ params }: { params: { id: string } }) {
  const [defaultValues, setDefaultValues] = useState<any>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/vehicles/${params.id}`)
      if (!res.ok) {
        setNotFound(true)
        return
      }
      const data = await res.json()
      const legacyDcPower = data.item.charging_capabilities?.dc_power ?? null
      const legacyAcPower = data.item.charging_capabilities?.ac_power_max ?? data.item.charging_capabilities?.ac_power ?? null
      setDefaultValues({
        ...data.item,
        usable_battery_kwh: data.item.usable_battery_kwh ?? null,
        ac_max_power_kw: data.item.ac_max_power_kw ?? legacyAcPower,
        dc_charging_supported: data.item.dc_charging_supported ?? Boolean(legacyDcPower),
        dc_max_power_kw: data.item.dc_max_power_kw ?? legacyDcPower,
        charge_time_dc: data.item.charge_time_dc ?? null,
        gallery_images: Array.isArray(data.item.gallery_images) ? data.item.gallery_images : [],
        ncap_stars: data.item.euroncap_rating?.stars ?? 0,
        ncap_adult_occupant: data.item.euroncap_rating?.adult_occupant ?? 0,
        ncap_child_occupant: data.item.euroncap_rating?.child_occupant ?? 0,
        ncap_pedestrian_protection: data.item.euroncap_rating?.pedestrian_protection ?? 0,
        ncap_safety_assist: data.item.euroncap_rating?.safety_assist ?? 0,
        ncap_overall_rating: data.item.euroncap_rating?.overall_rating ?? 0,
        ncap_test_year: data.item.euroncap_rating?.test_year ?? data.item.year ?? new Date().getFullYear(),
        featuresText: (data.item.features || []).join('\n'),
      })
    }
    load()
  }, [params.id])

  if (notFound) return <p className="text-red-600">Vehicle not found.</p>
  if (!defaultValues) return <p className="text-slate-400">Loading…</p>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Edit Vehicle</h1>
      <VehicleForm mode="edit" vehicleId={params.id} defaultValues={defaultValues} />
    </div>
  )
}
