import carsData from '@/data/cars.json'
import { PHEVModel } from './phev-simulator-types'

/**
 * Normalizes and returns all PHEV models matching the PHEVModel interface.
 */
export function getAllPHEVModels(): PHEVModel[] {
  return (carsData as any[]).map((c) => {
    const grossKwh = Number(c.battery_kwh) || 15
    const usableKwh = Number(c.usableBatteryKwh || c.usable_battery_kwh) || Math.round(grossKwh * 0.85 * 10) / 10
    const wltp = Number(c.wltpRangeKm || c.ev_range_km) || 50
    const threshold = Number(c.hybridThresholdSoC) || 20
    const maxSpeed = Number(c.maxEvCruisingSpeed) || 130
    const heatPump = Boolean(c.hasHeatPump)
    const chem: 'NMC' | 'LFP' = c.batteryChemistry === 'LFP' ? 'LFP' : 'NMC'
    const depletedFuel = Number(c.depletedFuelLPer100km) || 6.2

    return {
      id: c.id,
      name: c.name || `${c.brand} ${c.model}`,
      brand: c.brand,
      model: c.model,
      usableBatteryKwh: usableKwh,
      grossBatteryKwh: grossKwh,
      wltpRangeKm: wltp,
      hybridThresholdSoC: threshold,
      maxEvCruisingSpeed: maxSpeed,
      hasHeatPump: heatPump,
      batteryChemistry: chem,
      depletedFuelLPer100km: depletedFuel,
      imageUrl: c.image_url,
      slug: c.slug || c.id,
      year: c.year
    }
  })
}

export function getPHEVModelById(id: string): PHEVModel | undefined {
  const models = getAllPHEVModels()
  return models.find((m) => m.id === id || m.slug === id)
}
