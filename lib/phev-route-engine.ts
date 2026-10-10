import {
  PHEVModel,
  LocationWaypoint,
  RouteSimulationResult,
  RouteStepMetric,
  TransitionPoint
} from './phev-simulator-types'

/**
 * Calculates the temperature and HVAC efficiency coefficient (k_temp).
 * Incorporates heat pump thermodynamics and sub-zero viscosity penalties.
 */
export function calculateTemperatureCoefficient(tempC: number, hasHeatPump: boolean): number {
  if (tempC >= 18) {
    return 1.0
  }

  if (tempC >= 0 && tempC < 18) {
    const delta = 18 - tempC
    if (hasHeatPump) {
      return Math.max(0.65, 1.0 - delta * 0.012)
    } else {
      return Math.max(0.50, 1.0 - delta * 0.020)
    }
  }

  // Sub-zero (T < 0°C)
  const absTemp = Math.abs(tempC)
  if (hasHeatPump) {
    return Math.max(0.40, 0.78 - absTemp * 0.015)
  } else {
    return Math.max(0.30, 0.64 - absTemp * 0.025)
  }
}

interface RawOSRMStep {
  distance: number; // meters
  duration: number; // seconds
  name?: string;
  geometry?: {
    coordinates: [number, number][]; // [lon, lat]
  };
}

interface RawOSRMRoute {
  distance: number; // meters
  duration: number; // seconds
  geometry?: {
    coordinates: [number, number][]; // [lon, lat]
  };
  legs?: Array<{
    steps?: RawOSRMStep[];
  }>;
}

/**
 * Simulates a PHEV driving along an OSRM route step-by-step.
 */
export function simulatePHEVRoute(
  route: RawOSRMRoute,
  vehicle: PHEVModel,
  startSoC: number,
  ambientTempC: number,
  origin: LocationWaypoint,
  destination: LocationWaypoint
): RouteSimulationResult {
  // Step A: Usable Net Electrical Energy
  const activeSoCPercent = Math.max(0, startSoC - vehicle.hybridThresholdSoC)
  let remainingElecKwh = vehicle.usableBatteryKwh * (activeSoCPercent / 100)
  const initialAvailableElecKwh = remainingElecKwh

  // Step B: Temperature & HVAC coefficient
  const kTemp = calculateTemperatureCoefficient(ambientTempC, vehicle.hasHeatPump)
  const coldWeatherPenaltyPct = Math.max(0, Math.round((1.0 - kTemp) * 100))

  // Extract all steps from OSRM legs
  const osrmSteps: RawOSRMStep[] = []
  if (route.legs && route.legs.length > 0) {
    route.legs.forEach(leg => {
      if (leg.steps && leg.steps.length > 0) {
        osrmSteps.push(...leg.steps)
      }
    })
  }

  // Fallback if steps are missing: synthesize steps from geometry
  const fullGeometry: [number, number][] = (route.geometry?.coordinates || []).map(
    ([lon, lat]): [number, number] => [lat, lon] // Convert [lon, lat] -> [lat, lon]
  )

  let totalCumulativeKm = 0
  let evDistanceKm = 0
  let hevDistanceKm = 0
  let totalElecUsedKwh = 0
  let totalFuelUsedLiters = 0

  let transitionPoint: TransitionPoint | null = null
  const evPolyline: [number, number][] = []
  const hevPolyline: [number, number][] = []

  const stepMetrics: RouteStepMetric[] = []

  // If no steps provided by OSRM, create a synthetic single or dual step
  const stepsToProcess: RawOSRMStep[] = osrmSteps.length > 0 ? osrmSteps : [
    {
      distance: route.distance || 10000,
      duration: route.duration || 600,
      name: 'Direct Route',
      geometry: { coordinates: route.geometry?.coordinates || [] }
    }
  ]

  for (let i = 0; i < stepsToProcess.length; i++) {
    const rawStep = stepsToProcess[i]
    const stepDistMeters = rawStep.distance || 0
    const stepDurationSec = rawStep.duration || 1
    const stepDistKm = stepDistMeters / 1000

    if (stepDistKm <= 0.001) continue

    // Calculate step average speed (km/h)
    const avgSpeedKmH = Math.min(180, Math.max(15, (stepDistMeters / stepDurationSec) * 3.6))

    // Step road type and base electrical consumption (kWh/100km)
    let baseConsumptionKwh100: number
    let roadType: 'urban' | 'suburban' | 'highway'

    if (avgSpeedKmH < 50) {
      roadType = 'urban'
      // Urban regenerative braking recovery:
      // In sub-zero cold, regen is constrained by battery chemistry (cut by ~50%)
      if (ambientTempC < 0) {
        baseConsumptionKwh100 = 15.5
      } else {
        baseConsumptionKwh100 = 13.8
      }
    } else if (avgSpeedKmH <= 90) {
      roadType = 'suburban'
      baseConsumptionKwh100 = 16.5
    } else {
      roadType = 'highway'
      // High speed aerodynamic drag penalty (Fd ∝ v²)
      const speedFactor = Math.pow(avgSpeedKmH / 100, 1.4)
      baseConsumptionKwh100 = 22.5 * speedFactor
    }

    // Convert step coordinates from [lon, lat] to [lat, lon]
    const stepCoords: [number, number][] = (rawStep.geometry?.coordinates || []).map(
      ([lon, lat]): [number, number] => [lat, lon]
    )

    // Check if speed exceeds max EV cruising limit
    const exceedsMaxEvSpeed = avgSpeedKmH > vehicle.maxEvCruisingSpeed

    // Nominal energy required for this step if pure EV:
    // E_step = (DistKm / 100) * (BaseConsumption / k_temp)
    let stepElecNeededKwh = (stepDistKm / 100) * (baseConsumptionKwh100 / kTemp)
    let stepFuelNeededL = 0

    // If speed exceeds max EV cruising speed, ICE engages in parallel (blended mode)
    if (exceedsMaxEvSpeed) {
      stepElecNeededKwh *= 0.5
      stepFuelNeededL += (stepDistKm / 100) * 2.5 // parallel ICE assist draw
    }

    const startStepSoC = vehicle.usableBatteryKwh > 0
      ? Math.round(vehicle.hybridThresholdSoC + (remainingElecKwh / vehicle.usableBatteryKwh) * 100)
      : vehicle.hybridThresholdSoC
    const startStepKwh = remainingElecKwh

    let stepMode: 'EV' | 'HEV' | 'BLENDED' = 'EV'

    if (remainingElecKwh >= stepElecNeededKwh && remainingElecKwh > 0.01) {
      // Step can be completed fully on electrical buffer
      remainingElecKwh -= stepElecNeededKwh
      totalElecUsedKwh += stepElecNeededKwh
      totalFuelUsedLiters += stepFuelNeededL
      evDistanceKm += stepDistKm
      stepMode = exceedsMaxEvSpeed ? 'BLENDED' : 'EV'

      // All coordinates for this step go into EV polyline
      if (stepCoords.length > 0) {
        evPolyline.push(...stepCoords)
      }
    } else if (remainingElecKwh > 0.01) {
      // Battery depletes inside this step!
      // Calculate fraction of step covered by remaining battery:
      const evRatio = Math.max(0.01, Math.min(0.99, remainingElecKwh / stepElecNeededKwh))
      const stepEvKm = stepDistKm * evRatio
      const stepHevKm = stepDistKm * (1 - evRatio)

      evDistanceKm += stepEvKm
      hevDistanceKm += stepHevKm
      totalElecUsedKwh += remainingElecKwh

      // Fuel for the remaining portion + any blended assist
      const fuelForHevPortion = (stepHevKm / 100) * vehicle.depletedFuelLPer100km
      totalFuelUsedLiters += fuelForHevPortion + (stepFuelNeededL * evRatio)

      remainingElecKwh = 0
      stepMode = 'BLENDED'

      // Transition point coordinate estimation
      const transitionKm = totalCumulativeKm + stepEvKm
      let transitionCoord: [number, number]

      if (stepCoords.length > 1) {
        const splitIdx = Math.floor(stepCoords.length * evRatio)
        transitionCoord = stepCoords[splitIdx] || stepCoords[0]
        evPolyline.push(...stepCoords.slice(0, splitIdx + 1))
        hevPolyline.push(...stepCoords.slice(splitIdx))
      } else {
        transitionCoord = stepCoords[0] || [origin.lat, origin.lon]
        evPolyline.push(transitionCoord)
        hevPolyline.push(transitionCoord)
      }

      if (!transitionPoint) {
        transitionPoint = {
          km: Math.round(transitionKm * 10) / 10,
          lat: transitionCoord[0],
          lon: transitionCoord[1],
          label: `Engine Start Point: Km ${transitionKm.toFixed(1)} (${vehicle.hybridThresholdSoC}% SoC buffer reached)`,
          socBufferReached: vehicle.hybridThresholdSoC
        }
      }
    } else {
      // Battery is already fully at hybrid buffer (0% usable remaining)
      // Step runs entirely on depleted fuel consumption
      const fuelForStep = (stepDistKm / 100) * vehicle.depletedFuelLPer100km
      totalFuelUsedLiters += fuelForStep
      hevDistanceKm += stepDistKm
      stepMode = 'HEV'

      if (stepCoords.length > 0) {
        hevPolyline.push(...stepCoords)
      }
    }

    totalCumulativeKm += stepDistKm

    const endStepSoC = vehicle.usableBatteryKwh > 0
      ? Math.round(vehicle.hybridThresholdSoC + (remainingElecKwh / vehicle.usableBatteryKwh) * 100)
      : vehicle.hybridThresholdSoC

    stepMetrics.push({
      stepIndex: i + 1,
      roadName: rawStep.name || `Segment #${i + 1}`,
      distanceMeters: Math.round(stepDistMeters),
      distanceKm: Math.round(stepDistKm * 10) / 10,
      durationSeconds: Math.round(stepDurationSec),
      avgSpeedKmH: Math.round(avgSpeedKmH),
      roadType,
      mode: stepMode,
      elecConsumedKwh: Math.round(Math.min(startStepKwh, stepElecNeededKwh) * 100) / 100,
      fuelConsumedLiters: Math.round(stepFuelNeededL * 100) / 100,
      startSoC: startStepSoC,
      endSoC: endStepSoC,
      startBatteryKwh: Math.round(startStepKwh * 10) / 10,
      endBatteryKwh: Math.round(remainingElecKwh * 10) / 10,
      coordinates: stepCoords
    })
  }

  const totalDistanceKm = Math.round(totalCumulativeKm * 10) / 10
  const totalDurationMinutes = Math.round((route.duration || 1) / 60)

  const evPercentage = totalDistanceKm > 0
    ? Math.round((evDistanceKm / totalDistanceKm) * 100)
    : 0
  const hevPercentage = 100 - evPercentage

  const avgElecEfficiencyKwh100 = evDistanceKm > 0
    ? Math.round((totalElecUsedKwh / (evDistanceKm / 100)) * 10) / 10
    : 0

  const avgFuelEfficiencyL100 = totalDistanceKm > 0
    ? Math.round((totalFuelUsedLiters / (totalDistanceKm / 100)) * 10) / 10
    : 0

  // Fallback polylines if empty
  const allCoords: [number, number][] = fullGeometry.length > 0 ? fullGeometry : [
    [origin.lat, origin.lon] as [number, number],
    [destination.lat, destination.lon] as [number, number]
  ]

  let finalEvPoly: [number, number][] = evPolyline.length > 0 ? evPolyline : (evDistanceKm > 0 ? allCoords : [])
  let finalHevPoly: [number, number][] = hevPolyline.length > 0 ? hevPolyline : (hevDistanceKm > 0 ? allCoords : [])

  // If transition occurred, ensure polylines meet seamlessly
  if (transitionPoint && finalEvPoly.length > 0 && finalHevPoly.length > 0) {
    const tCoord: [number, number] = [transitionPoint.lat, transitionPoint.lon]
    finalEvPoly.push(tCoord)
    finalHevPoly.unshift(tCoord)
  }

  return {
    origin,
    destination,
    vehicle,
    startSoC,
    ambientTempC,
    kTemp: Math.round(kTemp * 1000) / 1000,
    coldWeatherPenaltyPct,
    totalDistanceKm,
    totalDurationMinutes,
    evDistanceKm: Math.round(evDistanceKm * 10) / 10,
    hevDistanceKm: Math.round(hevDistanceKm * 10) / 10,
    evPercentage,
    hevPercentage,
    totalElecKwh: Math.round(totalElecUsedKwh * 10) / 10,
    totalFuelLiters: Math.round(totalFuelUsedLiters * 10) / 10,
    avgElecEfficiencyKwh100,
    avgFuelEfficiencyL100,
    transitionPoint,
    evPolyline: finalEvPoly,
    hevPolyline: finalHevPoly,
    allCoordinates: allCoords,
    steps: stepMetrics
  }
}
