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
  acceleration_0_100: z.coerce.number().min(0).optional(),
  price_eur: z.coerce.number().min(0).optional(),
  dc_charging_supported: z.boolean().default(false),
  dc_max_power_kw: z.preprocess(
    (value) => value === '' || value === undefined ? null : value,
    z.coerce.number().positive().nullable()
  ),
  featuresText: z.string().optional(),
  image_url: z.string().min(1, 'Image is required'),
}).superRefine((data, ctx) => {
  if (data.dc_charging_supported && !data.dc_max_power_kw) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['dc_max_power_kw'],
      message: 'Required when DC fast charging is enabled',
    })
  }
})

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
      dc_charging_supported: false,
      dc_max_power_kw: null,
      image_url: '',
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
    const payload = {
      ...values,
      dc_max_power_kw: values.dc_charging_supported ? values.dc_max_power_kw : null,
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
        throw new Error(typeof data.error === 'string' ? data.error : 'Save failed')
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
              <Input {...register('brand')} onBlur={handleAutoSlug} />
              {errors.brand && <p className="text-xs text-red-600 mt-1">{errors.brand.message}</p>}
            </div>
            <div>
              <Label>Model (Title)</Label>
              <Input {...register('model')} onBlur={handleAutoSlug} />
              {errors.model && <p className="text-xs text-red-600 mt-1">{errors.model.message}</p>}
            </div>
          </div>

          <div>
            <Label>Slug</Label>
            <Input {...register('slug')} placeholder="brand-model-phev" />
            {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug.message}</p>}
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
              <Label>Power (hp)</Label>
              <Input type="number" {...register('power_hp')} />
            </div>
            <div>
              <Label>0-100 km/h (s)</Label>
              <Input type="number" step="0.1" {...register('acceleration_0_100')} />
            </div>
            <div>
              <Label>Price (€)</Label>
              <Input type="number" {...register('price_eur')} />
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
              rows={4}
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
