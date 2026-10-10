import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Missing coordinates', temperature: 18 }, { status: 400 })
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current=temperature_2m`

    const res = await fetch(url, {
      next: { revalidate: 1800 } // cache 30 mins
    })

    if (!res.ok) {
      throw new Error(`Open-Meteo responded with status ${res.status}`)
    }

    const data = await res.json()
    const temp = data?.current?.temperature_2m

    return NextResponse.json({
      temperature: typeof temp === 'number' ? Math.round(temp * 10) / 10 : 18,
      unit: '°C'
    })
  } catch (error: any) {
    console.error('Weather error:', error)
    return NextResponse.json({ temperature: 18, error: error.message }, { status: 200 }) // fallback to 18°C
  }
}
