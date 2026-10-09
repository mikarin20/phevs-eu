import reportsData from '@/data/community-reports.json'

export interface CommunityReport {
  id: string
  carSlug: string
  modelName: string
  ownerHandle: string
  source: 'Reddit' | 'Facebook' | 'Motor-Talk' | 'Direct Submission'
  sourceUrl?: string
  odometerKm: number
  realEvRangeSummerKm: number
  realEvRangeWinterKm: number
  wltpRangeKm: number
  electricConsumptionKwh: number
  emptyBatteryFuelL100: number
  combinedLifetimeL100: number
  note: string
  verifiedDate: string
  hasHeatPump?: boolean
}

export interface TelemetryAggregate {
  count: number
  totalKm: number
  wltp: number
  summer: number
  winter: number
  summerDeltaPct: number
  winterDeltaPct: number
  emptyBatteryFuel: number
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0)

export function getReportsForCar(car: { id?: string; slug?: string }): CommunityReport[] {
  const keys = [car.slug, car.id].filter(Boolean).map(s => String(s).toLowerCase())
  return (reportsData as CommunityReport[]).filter(r => keys.includes(r.carSlug.toLowerCase()))
}

export function aggregateReports(reports: CommunityReport[]): TelemetryAggregate | null {
  if (!reports.length) return null
  const wltp = avg(reports.map(r => r.wltpRangeKm))
  const summer = avg(reports.map(r => r.realEvRangeSummerKm))
  const winter = avg(reports.map(r => r.realEvRangeWinterKm))
  const pct = (v: number) => (wltp ? Math.round(((v - wltp) / wltp) * 100) : 0)
  return {
    count: reports.length,
    totalKm: reports.reduce((a, r) => a + r.odometerKm, 0),
    wltp: Math.round(wltp),
    summer: Math.round(summer),
    winter: Math.round(winter),
    summerDeltaPct: pct(summer),
    winterDeltaPct: pct(winter),
    emptyBatteryFuel: Number(avg(reports.map(r => r.emptyBatteryFuelL100)).toFixed(1)),
  }
}

/** FAQPage + aggregate Dataset JSON-LD. Returns null when no verified reports exist. */
export function buildTelemetryJsonLd(modelName: string, reports: CommunityReport[], pageUrl: string) {
  const agg = aggregateReports(reports)
  if (!agg) return null
  const signed = (n: number) => `${n > 0 ? '+' : ''}${n}%`
  return [
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `What is the real-world electric range of the ${modelName} compared to WLTP?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Based on ${agg.count} owner report(s) logging ${agg.totalKm.toLocaleString('en-GB')} km, the ${modelName} averages ${agg.summer} km in warm weather (${signed(agg.summerDeltaPct)} vs the ${agg.wltp} km WLTP figure) and ${agg.winter} km in winter (${signed(agg.winterDeltaPct)}).`,
          },
        },
        {
          '@type': 'Question',
          name: `What is the fuel consumption of the ${modelName} with an empty battery?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `With the battery depleted (charge-sustaining mode), owner-reported consumption averages ${agg.emptyBatteryFuel} L/100 km across ${agg.count} report(s).`,
          },
        },
      ],
    },
    {
      '@type': 'Dataset',
      name: `${modelName} real-world owner telemetry`,
      description: `Owner-submitted real-world electric range and fuel consumption for the ${modelName}.`,
      url: pageUrl,
      creator: { '@type': 'Organization', name: 'PHEVs.eu' },
      variableMeasured: ['Real-world EV range (summer)', 'Real-world EV range (winter)', 'Empty-battery fuel consumption (L/100 km)'],
    },
  ]
}
