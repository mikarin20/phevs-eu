import { z } from 'zod'

const slugPattern = /^[a-z0-9-]+$/

export const vehicleSchema = z.object({
  id: z.string().min(1).optional(),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  slug: z.string().min(1, 'Slug is required').regex(slugPattern, 'Lowercase letters, numbers, and hyphens only'),
  year: z.coerce.number().int().min(2000).max(2100),
  battery_kwh: z.coerce.number().min(0),
  usable_battery_kwh: z.preprocess(
    (value) => value === '' || value === undefined ? null : value,
    z.coerce.number().positive().nullable()
  ).optional(),
  ev_range_km: z.coerce.number().min(0),
  power_hp: z.coerce.number().min(0),
  acceleration_0_100: z.coerce.number().min(0).optional(),
  price_eur: z.coerce.number().min(0).optional(),
  ac_max_power_kw: z.preprocess(
    (value) => value === '' || value === undefined ? null : value,
    z.coerce.number().positive().nullable()
  ).optional(),
  dc_charging_supported: z.boolean().default(false),
  dc_max_power_kw: z.preprocess(
    (value) => value === '' || value === undefined ? null : value,
    z.coerce.number().positive().nullable()
  ),
  charge_time_dc: z.preprocess(
    (value) => value === '' || value === undefined ? null : value,
    z.coerce.number().positive().nullable()
  ).optional(),
  features: z.array(z.string().min(1)).default([]),
  image_url: z.string().min(1, 'Image is required'),
  gallery_images: z.array(z.string().min(1)).default([]),
  segment: z.string().default('SUV'),
  charge_time_ac: z.coerce.number().min(0).default(0),
  weight_kg: z.coerce.number().min(0).default(0),
  engine_displacement: z.coerce.number().min(0).default(0),
  electric_motor_power_hp: z.coerce.number().min(0).default(0),
  fuel_consumption: z.coerce.number().min(0).default(0),
  co2_emission: z.coerce.number().min(0).default(0),
  trunk_volume: z.coerce.number().min(0).default(0),
  seats: z.coerce.number().default(5),
  warranty_years: z.coerce.number().default(3),
  country_availability: z.string().default('EU'),
  euroncap_rating: z.object({
    stars: z.coerce.number().int().min(0).max(5).default(0),
    adult_occupant: z.coerce.number().min(0).max(100).default(0),
    child_occupant: z.coerce.number().min(0).max(100).default(0),
    pedestrian_protection: z.coerce.number().min(0).max(100).default(0),
    safety_assist: z.coerce.number().min(0).max(100).default(0),
    overall_rating: z.coerce.number().min(0).max(100).default(0),
    test_year: z.coerce.number().int().min(2000).max(2100).default(2024),
  }).nullable().optional(),
}).superRefine((data, ctx) => {
  if (data.dc_charging_supported && !data.dc_max_power_kw) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['dc_max_power_kw'],
      message: 'DC max power is required when fast charging is enabled',
    })
  }
})
export type VehicleInput = z.infer<typeof vehicleSchema>

export const blogPostSchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(slugPattern, 'Lowercase letters, numbers, and hyphens only'),
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  featured_image: z.string().min(1, 'Cover image is required'),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  source_locale: z.enum(['tr', 'en', 'de', 'pl']).default('tr'),
  auto_translate: z.boolean().default(true),
  status: z.enum(['draft', 'published']).default('draft'),
})
export type BlogPostInput = z.infer<typeof blogPostSchema>

export const quickCompareSchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(slugPattern, 'Lowercase letters, numbers, and hyphens only'),
  vehicle1Id: z.string().min(1, 'Vehicle 1 is required'),
  vehicle2Id: z.string().min(1, 'Vehicle 2 is required'),
  summary: z.string().optional(),
  verdict: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
})
export type QuickCompareInput = z.infer<typeof quickCompareSchema>
