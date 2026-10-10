/**
 * PHEV Real-World Route & Range Simulator Engine Types
 * Engineering-grade physical & architecture modeling for plug-in hybrids.
 */

export interface PHEVModel {
  id: string;
  name: string;
  usableBatteryKwh: number;       // Net kullanılabilir kapasite (kWh)
  wltpRangeKm: number;           // Fabrika verisi
  hybridThresholdSoC: number;    // Aracın saf elektrikten çıkıp zorunlu hibrit moda geçtiği alt tampon (%20-%25)
  maxEvCruisingSpeed: number;    // ICE devreye girmeden saf elektrikle çıkabileceği max hız (örn: Kia için 85, RAV4 için 135)
  hasHeatPump: boolean;          // Isı pompası var mı?
  batteryChemistry: 'NMC' | 'LFP';
  depletedFuelLPer100km: number; // Batarya bittiğindeki otoyol tüketimi (L/100km - community verisi)
  // Additional helpful metadata for UI rendering
  brand: string;
  model: string;
  grossBatteryKwh: number;
  imageUrl?: string;
  slug?: string;
  year?: number;
}

export interface LocationWaypoint {
  name: string;
  displayName: string;
  lat: number;
  lon: number;
}

export interface RouteStepMetric {
  stepIndex: number;
  roadName: string;
  distanceMeters: number;
  distanceKm: number;
  durationSeconds: number;
  avgSpeedKmH: number;
  roadType: 'urban' | 'suburban' | 'highway';
  mode: 'EV' | 'HEV' | 'BLENDED';
  elecConsumedKwh: number;
  fuelConsumedLiters: number;
  startSoC: number;
  endSoC: number;
  startBatteryKwh: number;
  endBatteryKwh: number;
  coordinates: [number, number][]; // [lat, lon]
}

export interface TransitionPoint {
  km: number;
  lat: number;
  lon: number;
  label: string;
  socBufferReached: number;
}

export interface RouteSimulationResult {
  origin: LocationWaypoint;
  destination: LocationWaypoint;
  vehicle: PHEVModel;
  startSoC: number;
  ambientTempC: number;
  kTemp: number;
  coldWeatherPenaltyPct: number;
  
  // Speed & Driving Dynamics
  targetHighwaySpeedKmH: number;
  overallAvgSpeedKmH: number;

  // Trip Distances
  totalDistanceKm: number;
  totalDurationMinutes: number;
  evDistanceKm: number;
  hevDistanceKm: number;
  evPercentage: number;
  hevPercentage: number;

  // Energy & Fuel
  totalElecKwh: number;
  totalFuelLiters: number;
  avgElecEfficiencyKwh100: number;
  avgFuelEfficiencyL100: number;

  // Transition marker (Engine start point)
  transitionPoint: TransitionPoint | null;

  // Path coordinates for Leaflet Polylines: [lat, lon][]
  evPolyline: [number, number][];
  hevPolyline: [number, number][];
  allCoordinates: [number, number][];

  // Segment metrics
  steps: RouteStepMetric[];
}
