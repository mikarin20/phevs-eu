import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    const encoded = encodeURIComponent(q.trim())
    // Country codes: broad European coverage
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&countrycodes=pl,de,fr,es,tr,nl,be,at,ch,it,se,no,dk,fi,cz,sk,hu,ro,bg,gr,gb&limit=6&addressdetails=1`

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'PHEVs.eu Real-World Range Simulator (contact: info@phevs.eu)',
        'Accept-Language': 'en,de,tr,pl'
      },
      next: { revalidate: 3600 } // cache 1 hour
    })

    if (!res.ok) {
      throw new Error(`Nominatim responded with status ${res.status}`)
    }

    const data = await res.json()
    const results = (Array.isArray(data) ? data : []).map((item: any) => ({
      name: item.name || item.display_name?.split(',')[0] || item.display_name,
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon)
    }))

    return NextResponse.json({ results })
  } catch (error: any) {
    console.error('Geocoding error:', error)
    return NextResponse.json({ error: error.message || 'Geocoding failed', results: [] }, { status: 500 })
  }
}
