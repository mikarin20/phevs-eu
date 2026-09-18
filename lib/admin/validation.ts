import { z } from 'zod'

const slugPattern = /^[a-z0-9-]+$/

export const vehicleSchema = z.object({
  id: z.string().min(1).optional(),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  slug: z.string().min(1, 'Slug is required').regex(slugPattern, 'Lowercase letters, numbers, and hyphens only'),
  year: z.coerce.number().int().min(2000).max(2100),
  battery_kwh: z.coerce.number().min(0),
  ev_range_km: z.coerce.number().min(0),
  power_hp: z.coerce.number().min(0),
  acceleration_0_100: z.coerce.number().min(0).optional(),
  price_eur: z.coerce.number().min(0).optional(),
  dc_charging_supported: z.boolean().default(false),
  dc_max_power_kw: z.preprocess(
    (value) => value === '' || value === undefined ? null : value,
    z.coerce.number().positive().nullable()
  ),
  features: z.array(z.string().min(1)).default([]),
  image_url: z.string().min(1, 'Image is required'),
  // Legacy/site-compat fields not exposed in the simplified admin form; server fills sensible defaults.
  segment: z.string().optional(),
  fuel_consumption: z.coerce.number().optional(),
  co2_emission: z.coerce.number().optional(),
  charge_time_ac: z.coerce.number().optional(),
  trunk_volume: z.coerce.number().optional(),
  seats: z.coerce.number().optional(),
  warranty_years: z.coerce.number().optional(),
  country_availability: z.string().optional(),
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
