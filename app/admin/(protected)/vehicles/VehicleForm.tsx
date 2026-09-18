'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/admin/ui/button'
import { Input } from '@/components/admin/ui/input'
import { Label } from '@/components/admin/ui/label'
import { Textarea } from '@/components/admin/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/card'
import ImageUploader from '@/components/admin/ImageUploader'
import { useToast } from '@/components/admin/ui/toast-provider'
import { slugify } from '@/lib/admin/slug'

const formSchema = z.object({
  brand: z.string().min(1, 'Required'),
  model: z.string().min(1, 'Required'),
  slug: z.string().min(1, 'Required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, hyphens only'),
  year: z.coerce.number().int().min(2000).max(2100),
  battery_kwh: z.coerce.number().min(0),
  ev_range_km: z.coerce.number().min(0),
  power_hp: z.coerce.number().min(0),
  electric_motor_power_hp: z.coerce.number().min(0).optional(),
  engine_displacement: z.coerce.number().min(0).optional(),
  charge_time_ac: z.coerce.number().min(0).optional(),
  weight_kg: z.coerce.number().min(0).optional(),
  fuel_consumption: z.coerce.number().min(0).optional(),
  co2_emission: z.coerce.number().min(0).optional(),
  trunk_volume: z.coerce.number().min(0).optional(),
  segment: z.string().default('SUV'),
  acceleration_0_100: z.coerce.number().min(0).optional(),
  price_eur: z.coerce.number().min(0).optional(),
  dc_charging_supported: z.boolean().default(false),
  dc_max_power_kw: z.preprocess(
    (value) => value === '' || value === undefined ? null : value,
    z.coerce.number().positive().nullable()
  ),
  featuresText: z.string().optional(),
  image_url: z.string().min(1, 'Image is required'),
  ncap_stars: z.coerce.number().int().min(0).max(5).default(0),
  ncap_adult_occupant: z.coerce.number().min(0).max(100).default(0),
  ncap_child_occupant: z.coerce.number().min(0).max(100).default(0),
  ncap_pedestrian_protection: z.coerce.number().min(0).max(100).default(0),
  ncap_safety_assist: z.coerce.number().min(0).max(100).default(0),
  ncap_overall_rating: z.coerce.number().min(0).max(100).default(0),
  ncap_test_year: z.coerce.number().int().min(2000).max(2100).optional(),
}).superRefine((data, ctx) => {
  if (data.dc_charging_supported && !data.dc_max_power_kw) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['dc_max_power_kw'],
      message: 'Required when DC fast charging is enabled',
    })
  }
})

const STANDARD_BRANDS = [
  'Alfa Romeo', 'Audi', 'BMW', 'BYD', 'Citroën', 'Cupra', 'DS Automobiles',
  'Ford', 'Geely', 'Hyundai', 'Jaecoo', 'Jaguar', 'Jeep', 'Kia', 'Land Rover',
  'Lexus', 'Lynk & Co', 'Mazda', 'Mercedes-Benz', 'MG', 'MINI', 'Mitsubishi',
  'Nissan', 'Opel', 'Peugeot', 'Porsche', 'Range Rover', 'Renault', 'SEAT',
  'Škoda', 'Subaru', 'Suzuki', 'Toyota', 'Volkswagen', 'Volvo'
]

function extractErrorMessage(data: any, defaultMsg = 'Save failed'): string {
  if (!data) return defaultMsg
  if (typeof data.error === 'string') return data.error
  if (typeof data.message === 'string') return data.message
  if (data.error && typeof data.error === 'object') {
    const fieldErrors = data.error.fieldErrors
    if (fieldErrors && typeof fieldErrors === 'object') {
      const messages = Object.entries(fieldErrors)
        .map(([field, errs]) => `${field}: ${(errs as string[]).join(', ')}`)
        .filter(Boolean)
      if (messages.length > 0) return messages.join(' | ')
    }
  }
  return defaultMsg
}

export type VehicleFormValues = z.infer<typeof formSchema>

interface VehicleFormProps {
  mode: 'create' | 'edit'
  vehicleId?: string
  defaultValues?: Partial<VehicleFormValues>
}

export default function VehicleForm({ mode, vehicleId, defaultValues }: VehicleFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: '',
      model: '',
      slug: '',
      year: new Date().getFullYear(),
      battery_kwh: 0,
      ev_range_km: 0,
      power_hp: 0,
      electric_motor_power_hp: 0,
      engine_displacement: 0,
      charge_time_ac: 0,
      weight_kg: 0,
      fuel_consumption: 0,
      co2_emission: 0,
      trunk_volume: 0,
      segment: 'SUV',
      dc_charging_supported: false,
      dc_max_power_kw: null,
      image_url: '',
      ncap_stars: 0,
      ncap_adult_occupant: 0,
      ncap_child_occupant: 0,
      ncap_pedestrian_protection: 0,
      ncap_safety_assist: 0,
      ncap_overall_rating: 0,
      ncap_test_year: new Date().getFullYear(),
      ...defaultValues,
    },
  })

  const brand = watch('brand')
  const model = watch('model')
  const imageUrl = watch('image_url')
  const dcChargingSupported = watch('dc_charging_supported')

  function handleAutoSlug() {
    if (brand && model && mode === 'create') setValue('slug', slugify(`${brand}-${model}-phev`))
  }

  async function onSubmit(values: VehicleFormValues) {
    const features = (values.featuresText || '')
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean)
    const hasNcap = (values.ncap_stars && values.ncap_stars > 0) || (values.ncap_overall_rating && values.ncap_overall_rating > 0)
    const euroncap_rating = hasNcap ? {
      stars: values.ncap_stars || 0,
      adult_occupant: values.ncap_adult_occupant || 0,
      child_occupant: values.ncap_child_occupant || 0,
      pedestrian_protection: values.ncap_pedestrian_protection || 0,
      safety_assist: values.ncap_safety_assist || 0,
      overall_rating: values.ncap_overall_rating || 0,
      test_year: values.ncap_test_year || values.year || new Date().getFullYear(),
    } : null

    const payload = {
      ...values,
      brand: values.brand.trim(),
      model: values.model.trim(),
      dc_max_power_kw: values.dc_charging_supported ? values.dc_max_power_kw : null,
      euroncap_rating,
      features,
    }

    try {
      const url = mode === 'create' ? '/api/admin/vehicles' : `/api/admin/vehicles/${vehicleId}`
      const method = mode === 'create' ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(extractErrorMessage(data))
      }
      toast({ title: mode === 'create' ? 'Vehicle created' : 'Vehicle updated' })
      router.push('/admin/vehicles')
      router.refresh()
    } catch (err: any) {
      toast({ title: 'Save failed', description: err.message, variant: 'destructive' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Brand</Label>
              <Input {...register('brand')} list="brand-list" placeholder="e.g. MG, Audi, BMW" onBlur={handleAutoSlug} />
              <datalist id="brand-list">
                {STANDARD_BRANDS.map((b) => (
                  <option key={b} value={b} />
                ))}
              </datalist>
              {errors.brand && <p className="text-xs text-red-600 mt-1">{errors.brand.message}</p>}
            </div>
            <div>
              <Label>Model (Title)</Label>
              <Input {...register('model')} onBlur={handleAutoSlug} />
              {errors.model && <p className="text-xs text-red-600 mt-1">{errors.model.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Slug</Label>
              <Input {...register('slug')} placeholder="brand-model-phev" />
              {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug.message}</p>}
            </div>
            <div>
              <Label>Segment</Label>
              <select
                {...register('segment')}
                className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Station/Estate">Station/Estate</option>
                <option value="Crossover">Crossover</option>
                <option value="Coupe">Coupe</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Model Year</Label>
              <Input type="number" {...register('year')} />
            </div>
            <div>
              <Label>Battery (kWh)</Label>
              <Input type="number" step="0.1" {...register('battery_kwh')} />
            </div>
            <div>
              <Label>Electric Range (km)</Label>
              <Input type="number" {...register('ev_range_km')} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Total Power (hp)</Label>
              <Input type="number" {...register('power_hp')} />
            </div>
            <div>
              <Label>ICE Power (hp)</Label>
              <Input type="number" {...register('electric_motor_power_hp')} placeholder="e.g. 90" />
            </div>
            <div>
              <Label>Engine Displacement (L)</Label>
              <Input type="number" step="0.1" {...register('engine_displacement')} placeholder="e.g. 1.5" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>AC Charge Time (hours)</Label>
              <Input type="number" step="0.1" {...register('charge_time_ac')} placeholder="e.g. 4.0" />
            </div>
            <div>
              <Label>Weight (kg)</Label>
              <Input type="number" {...register('weight_kg')} placeholder="e.g. 1863" />
            </div>
            <div>
              <Label>Fuel Consumption (L/100km)</Label>
              <Input type="number" step="0.1" {...register('fuel_consumption')} placeholder="e.g. 0.5" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>CO2 Emission (g/km)</Label>
              <Input type="number" step="0.1" {...register('co2_emission')} placeholder="e.g. 15" />
            </div>
            <div>
              <Label>Trunk Volume (L)</Label>
              <Input type="number" {...register('trunk_volume')} placeholder="e.g. 385" />
            </div>
            <div>
              <Label>0-100 km/h (s)</Label>
              <Input type="number" step="0.1" {...register('acceleration_0_100')} />
            </div>
          </div>

          <div className="rounded-md border border-slate-200 p-4 space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" {...register('dc_charging_supported')} className="h-4 w-4" />
              DC Fast Charge Supported
            </label>
            <div>
              <Label>DC Fast Charge Support (kW)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                disabled={!dcChargingSupported}
                {...register('dc_max_power_kw')}
              />
              {errors.dc_max_power_kw && (
                <p className="text-xs text-red-600 mt-1">{errors.dc_max_power_kw.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Features (one per line)</Label>
            <Textarea
              rows={3}
              {...register('featuresText')}
              placeholder={'Adaptive Cruise Control\nHeated Seats\n360° Camera'}
            />
          </div>

          <div>
            <Label>Main Image</Label>
            <ImageUploader
              value={imageUrl}
              onChange={(url) => setValue('image_url', url, { shouldValidate: true })}
              folder="vehicles"
            />
            {errors.image_url && <p className="text-xs text-red-600 mt-1">{errors.image_url.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Euro NCAP Safety Rating (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Stars (0 - 5)</Label>
              <select
                {...register('ncap_stars')}
                className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>No Rating (0 Stars)</option>
                <option value={1}>★☆☆☆☆ (1 Star)</option>
                <option value={2}>★★☆☆☆ (2 Stars)</option>
                <option value={3}>★★★☆☆ (3 Stars)</option>
                <option value={4}>★★★★☆ (4 Stars)</option>
                <option value={5}>★★★★★ (5 Stars)</option>
              </select>
            </div>
            <div>
              <Label>Test Year</Label>
              <Input type="number" {...register('ncap_test_year')} placeholder="e.g. 2024" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Adult Occupant (%)</Label>
              <Input type="number" min="0" max="100" {...register('ncap_adult_occupant')} placeholder="e.g. 89" />
            </div>
            <div>
              <Label>Child Occupant (%)</Label>
              <Input type="number" min="0" max="100" {...register('ncap_child_occupant')} placeholder="e.g. 88" />
            </div>
            <div>
              <Label>Pedestrian Protection (%)</Label>
              <Input type="number" min="0" max="100" {...register('ncap_pedestrian_protection')} placeholder="e.g. 72" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Safety Assist (%)</Label>
              <Input type="number" min="0" max="100" {...register('ncap_safety_assist')} placeholder="e.g. 75" />
            </div>
            <div>
              <Label>Overall Rating (%)</Label>
              <Input type="number" min="0" max="100" {...register('ncap_overall_rating')} placeholder="e.g. 81" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : mode === 'create' ? 'Create Vehicle' : 'Save Changes'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/vehicles')}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
