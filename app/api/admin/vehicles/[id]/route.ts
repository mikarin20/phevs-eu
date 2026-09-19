import { NextRequest, NextResponse } from 'next/server'
import { carsStore } from '@/lib/admin/data-store'
import { vehicleSchema } from '@/lib/admin/validation'
import { submitToIndexNow } from '@/lib/indexnow'

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const { items } = await carsStore.list()
  const item = items.find((c: any) => c.id === params.id)
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ item })
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const parsed = vehicleSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    const data = parsed.data

    const { items, sha } = await carsStore.list()
    const index = items.findIndex((c: any) => c.id === params.id)
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const existing = items[index]
    const updated = {
      ...existing,
      slug: data.slug,
      brand: data.brand,
      model: data.model,
      year: data.year,
      battery_kwh: data.battery_kwh,
      usable_battery_kwh: data.usable_battery_kwh ?? existing.usable_battery_kwh ?? null,
      ev_range_km: data.ev_range_km,
      power_hp: data.power_hp,
      electric_motor_power_hp: data.electric_motor_power_hp ?? existing.electric_motor_power_hp ?? 0,
      engine_displacement: data.engine_displacement ?? existing.engine_displacement ?? 0,
      acceleration_0_100: data.acceleration_0_100,
      price_eur: data.price_eur,
      ac_max_power_kw: data.ac_max_power_kw ?? existing.ac_max_power_kw ?? existing.charging_capabilities?.ac_power_max ?? existing.charging_capabilities?.ac_power ?? null,
      dc_charging_supported: data.dc_charging_supported,
      dc_max_power_kw: data.dc_charging_supported ? data.dc_max_power_kw : null,
      charge_time_dc: data.dc_charging_supported ? (data.charge_time_dc ?? existing.charge_time_dc ?? null) : null,
      charging_capabilities: {
        ...existing.charging_capabilities,
        ac_power: data.ac_max_power_kw ?? existing.charging_capabilities?.ac_power,
        ac_power_max: data.ac_max_power_kw ?? existing.charging_capabilities?.ac_power_max,
        dc_power: data.dc_charging_supported ? data.dc_max_power_kw : undefined,
      },
      features: data.features,
      image_url: data.image_url,
      gallery_images: data.gallery_images ?? existing.gallery_images ?? [],
      segment: data.segment || existing.segment || 'SUV',
      fuel_consumption: data.fuel_consumption ?? existing.fuel_consumption ?? 0,
      co2_emission: data.co2_emission ?? existing.co2_emission ?? 0,
      charge_time_ac: data.charge_time_ac ?? existing.charge_time_ac ?? 0,
      weight_kg: data.weight_kg ?? existing.weight_kg ?? 0,
      trunk_volume: data.trunk_volume ?? existing.trunk_volume ?? 0,
      seats: data.seats ?? existing.seats ?? 5,
      warranty_years: data.warranty_years ?? existing.warranty_years ?? 3,
      country_availability: data.country_availability || existing.country_availability || 'EU',
      euroncap_rating: data.euroncap_rating !== undefined ? data.euroncap_rating : (existing.euroncap_rating || null),
      last_updated: new Date().toISOString().split('T')[0],
    }
    items[index] = updated
    await carsStore.save(items, sha, `admin: update vehicle ${params.id}`)

    // Ping Bing & Yandex via IndexNow immediately
    submitToIndexNow([
      `https://www.phevs.eu/models/${updated.slug || updated.id}/`,
      'https://www.phevs.eu/',
      'https://www.phevs.eu/compare/',
      'https://www.phevs.eu/sitemap.xml',
    ]).catch((err) => console.error('[IndexNow] Auto-ping error:', err))

    return NextResponse.json({ item: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { items, sha } = await carsStore.list()
    const filtered = items.filter((c: any) => c.id !== params.id)
    if (filtered.length === items.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await carsStore.save(filtered, sha, `admin: delete vehicle ${params.id}`)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
