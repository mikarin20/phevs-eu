import { NextRequest, NextResponse } from 'next/server'
import { carsStore } from '@/lib/admin/data-store'
import { vehicleSchema } from '@/lib/admin/validation'
import { slugify } from '@/lib/admin/slug'
import { submitToIndexNow } from '@/lib/indexnow'

export async function GET() {
  try {
    const { items } = await carsStore.list()
    return NextResponse.json({ items })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = vehicleSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const data = parsed.data
    const { items, sha } = await carsStore.list()

    const id = data.id || slugify(`${data.brand}-${data.model}-${data.year}`)
    if (items.some((c: any) => c.id === id)) {
      return NextResponse.json({ error: 'A vehicle with this ID already exists' }, { status: 409 })
    }

    const newVehicle = {
      id,
      slug: data.slug,
      brand: data.brand,
      model: data.model,
      year: data.year,
      battery_kwh: data.battery_kwh,
      usable_battery_kwh: data.usable_battery_kwh ?? null,
      ev_range_km: data.ev_range_km,
      power_hp: data.power_hp,
      electric_motor_power_hp: data.electric_motor_power_hp ?? 0,
      engine_displacement: data.engine_displacement ?? 0,
      acceleration_0_100: data.acceleration_0_100,
      price_eur: data.price_eur,
      ac_max_power_kw: data.ac_max_power_kw ?? null,
      dc_charging_supported: data.dc_charging_supported,
      dc_max_power_kw: data.dc_charging_supported ? data.dc_max_power_kw : null,
      charge_time_dc: data.dc_charging_supported ? data.charge_time_dc : null,
      charging_capabilities: {
        ac_power: data.ac_max_power_kw ?? undefined,
        ac_power_max: data.ac_max_power_kw ?? undefined,
        dc_power: data.dc_charging_supported ? data.dc_max_power_kw : undefined,
      },
      features: data.features,
      image_url: data.image_url,
      gallery_images: data.gallery_images || [],
      segment: data.segment || 'SUV',
      fuel_consumption: data.fuel_consumption ?? 0,
      co2_emission: data.co2_emission ?? 0,
      charge_time_ac: data.charge_time_ac ?? 0,
      weight_kg: data.weight_kg ?? 0,
      trunk_volume: data.trunk_volume ?? 0,
      seats: data.seats ?? 5,
      warranty_years: data.warranty_years ?? 3,
      country_availability: data.country_availability || 'EU',
      euroncap_rating: data.euroncap_rating || null,
      last_updated: new Date().toISOString().split('T')[0],
    }

    await carsStore.save([...items, newVehicle], sha, `admin: add vehicle ${id}`)

    // Ping Bing & Yandex via IndexNow immediately
    submitToIndexNow([
      `https://www.phevs.eu/models/${newVehicle.slug || newVehicle.id}/`,
      'https://www.phevs.eu/',
      'https://www.phevs.eu/compare/',
      'https://www.phevs.eu/sitemap.xml',
    ]).catch((err) => console.error('[IndexNow] Auto-ping error:', err))

    return NextResponse.json({ item: newVehicle }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
