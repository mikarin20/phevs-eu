import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lon1 = searchParams.get('lon1')
  const lat1 = searchParams.get('lat1')
  const lon2 = searchParams.get('lon2')
  const lat2 = searchParams.get('lat2')

  if (!lon1 || !lat1 || !lon2 || !lat2) {
    return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 })
  }

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson&steps=true`

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'PHEVs.eu Real-World Range Simulator'
      },
      next: { revalidate: 3600 } // cache 1 hour
    })

    if (!res.ok) {
      throw new Error(`OSRM responded with status ${res.status}`)
    }

    const data = await res.json()
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      return NextResponse.json({ error: 'No route found between selected points' }, { status: 404 })
    }

    return NextResponse.json({
      route: data.routes[0],
      waypoints: data.waypoints
    })
  } catch (error: any) {
    console.error('OSRM route error:', error)
    return NextResponse.json({ error: error.message || 'Routing failed' }, { status: 500 })
  }
}
