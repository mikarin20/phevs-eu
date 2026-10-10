import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ results: [] })
  }

  const query = q.trim()
  const encoded = encodeURIComponent(query)

  // 1. Try Photon (Komoot OSM autocomplete engine - supports prefixes, addresses, diacritics & typo tolerance)
  try {
    const photonUrl = `https://photon.komoot.io/api/?q=${encoded}&limit=8`
    const photonRes = await fetch(photonUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PHEVs.eu Range Simulator/1.0 (info@phevs.eu)'
      },
      next: { revalidate: 3600 }
    })

    if (photonRes.ok) {
      const photonData = await photonRes.json()
      if (Array.isArray(photonData.features) && photonData.features.length > 0) {
        const results = photonData.features.map((f: any) => {
          const p = f.properties || {}
          const streetWithNum = [p.street, p.housenumber].filter(Boolean).join(' ')
          const locality = p.city || p.town || p.village || p.district || p.state || ''
          const country = p.country || ''
          
          const name = streetWithNum
            ? (locality ? `${streetWithNum}, ${locality}` : streetWithNum)
            : (p.name || locality || country)

          const parts = [
            streetWithNum,
            locality,
            p.postcode,
            p.county,
            p.state,
            country
          ].filter(Boolean)

          return {
            name,
            displayName: parts.join(', ') || name,
            lat: f.geometry.coordinates[1],
            lon: f.geometry.coordinates[0]
          }
        })

        return NextResponse.json({ results })
      }
    }
  } catch (photonErr) {
    console.warn('Photon geocoding fallback triggered:', photonErr)
  }

  // 2. Fallback to OpenStreetMap Nominatim API
  try {
    const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&countrycodes=pl,de,fr,es,tr,nl,be,at,ch,it,se,no,dk,fi,cz,sk,hu,ro,bg,gr,gb&limit=8&addressdetails=1`
    const nomRes = await fetch(nomUrl, {
      headers: {
        'User-Agent': 'PHEVs.eu Real-World Range Simulator (contact: info@phevs.eu)',
        'Accept-Language': 'pl,en,de,tr,fr,es'
      },
      next: { revalidate: 3600 }
    })

    if (nomRes.ok) {
      const nomData = await nomRes.json()
      const results = (Array.isArray(nomData) ? nomData : []).map((item: any) => {
        const addr = item.address || {}
        const streetWithNum = [addr.road || addr.street, addr.house_number].filter(Boolean).join(' ')
        const locality = addr.city || addr.town || addr.village || addr.municipality || ''
        
        const name = streetWithNum
          ? (locality ? `${streetWithNum}, ${locality}` : streetWithNum)
          : (item.name || locality || item.display_name?.split(',')[0] || item.display_name)

        return {
          name,
          displayName: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon)
        }
      })

      return NextResponse.json({ results })
    }
  } catch (nomErr: any) {
    console.error('Nominatim geocoding error:', nomErr)
  }

  return NextResponse.json({ results: [] })
}
