import { NextRequest, NextResponse } from 'next/server'

export interface DailyForecastItem {
  date: string
  tempMin: number
  tempMax: number
  tempMean: number
  weatherCode: number
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')
  const targetDate = searchParams.get('date') // Optional: 'YYYY-MM-DD'
  const targetHour = searchParams.get('hour') ? parseInt(searchParams.get('hour')!, 10) : 8 // Default 08:00

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Missing coordinates', temperature: 18 }, { status: 400 })
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,weather_code&forecast_days=10&timezone=auto`

    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PHEVs.eu Range Simulator/1.0 (info@phevs.eu)'
      },
      next: { revalidate: 1800 } // cache 30 mins
    })

    if (!res.ok) {
      throw new Error(`Open-Meteo responded with status ${res.status}`)
    }

    const data = await res.json()
    const currentTemp = typeof data?.current?.temperature_2m === 'number'
      ? Math.round(data.current.temperature_2m * 10) / 10
      : 18
    const currentWeatherCode = data?.current?.weather_code || 0

    // Format 10-day daily forecasts
    const dailyForecasts: DailyForecastItem[] = []
    const dates = data?.daily?.time || []
    const mins = data?.daily?.temperature_2m_min || []
    const maxs = data?.daily?.temperature_2m_max || []
    const means = data?.daily?.temperature_2m_mean || []
    const codes = data?.daily?.weather_code || []

    for (let i = 0; i < dates.length; i++) {
      dailyForecasts.push({
        date: dates[i],
        tempMin: Math.round(mins[i] || 0),
        tempMax: Math.round(maxs[i] || 0),
        tempMean: Math.round(means[i] || 0),
        weatherCode: codes[i] || 0
      })
    }

    // Determine target temperature
    let resolvedTemp = currentTemp
    let resolvedWeatherCode = currentWeatherCode
    let isFuture = false

    if (targetDate) {
      // Find matching hour in hourly forecasts if available
      const hourlyTimes: string[] = data?.hourly?.time || []
      const hourlyTemps: number[] = data?.hourly?.temperature_2m || []
      const hourlyCodes: number[] = data?.hourly?.weather_code || []

      // Look for target date + hour string (e.g. '2026-10-17T08:00')
      const hourPad = String(targetHour).padStart(2, '0')
      const targetPrefix = `${targetDate}T${hourPad}:`
      const hourIndex = hourlyTimes.findIndex(t => t.startsWith(targetPrefix))

      if (hourIndex !== -1 && typeof hourlyTemps[hourIndex] === 'number') {
        resolvedTemp = Math.round(hourlyTemps[hourIndex] * 10) / 10
        resolvedWeatherCode = hourlyCodes[hourIndex] || 0
        isFuture = true
      } else {
        // Fallback to daily mean/max
        const dailyItem = dailyForecasts.find(d => d.date === targetDate)
        if (dailyItem) {
          // If daytime hour (10-16), weight towards max; if night/morning (0-7), weight towards min
          if (targetHour >= 10 && targetHour <= 17) {
            resolvedTemp = dailyItem.tempMax
          } else if (targetHour < 8 || targetHour >= 21) {
            resolvedTemp = dailyItem.tempMin
          } else {
            resolvedTemp = dailyItem.tempMean
          }
          resolvedWeatherCode = dailyItem.weatherCode
          isFuture = true
        }
      }
    }

    return NextResponse.json({
      temperature: resolvedTemp,
      weatherCode: resolvedWeatherCode,
      current: {
        temperature: currentTemp,
        weatherCode: currentWeatherCode
      },
      selected: {
        date: targetDate || dates[0] || '',
        hour: targetHour,
        temperature: resolvedTemp,
        weatherCode: resolvedWeatherCode,
        isFuture
      },
      daily: dailyForecasts,
      unit: '°C'
    })
  } catch (error: any) {
    console.error('Weather error:', error)
    return NextResponse.json({
      temperature: 18,
      weatherCode: 0,
      daily: [],
      error: error.message
    }, { status: 200 })
  }
}
