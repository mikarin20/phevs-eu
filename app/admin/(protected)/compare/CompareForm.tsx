'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/admin/ui/button'
import { Input } from '@/components/admin/ui/input'
import { Label } from '@/components/admin/ui/label'
import { Textarea } from '@/components/admin/ui/textarea'
import { Select } from '@/components/admin/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/card'
import { useToast } from '@/components/admin/ui/toast-provider'
import { slugify } from '@/lib/admin/slug'

const formSchema = z.object({
  vehicle1Id: z.string().min(1, 'Required'),
  vehicle2Id: z.string().min(1, 'Required'),
  slug: z.string().min(1, 'Required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, hyphens only'),
  summary: z.string().optional(),
  verdict: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
})

export type CompareFormValues = z.infer<typeof formSchema>

interface Vehicle {
  id: string
  brand: string
  model: string
}

interface CompareFormProps {
  mode: 'create' | 'edit'
  compareSlug?: string
  defaultValues?: Partial<CompareFormValues>
}

export default function CompareForm({ mode, compareSlug, defaultValues }: CompareFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])

  useEffect(() => {
    fetch('/api/admin/vehicles')
      .then((r) => r.json())
      .then((d) => setVehicles(d.items || []))
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CompareFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { vehicle1Id: '', vehicle2Id: '', slug: '', ...defaultValues },
  })

  const vehicle1Id = watch('vehicle1Id')
  const vehicle2Id = watch('vehicle2Id')
  const slug = watch('slug')

  function handleAutoSlug() {
    if (mode !== 'create') return
    const v1 = vehicles.find((v) => v.id === vehicle1Id)
    const v2 = vehicles.find((v) => v.id === vehicle2Id)
    if (v1 && v2) setValue('slug', slugify(`${v1.brand}-${v1.model}-vs-${v2.brand}-${v2.model}`))
  }

  async function onSubmit(values: CompareFormValues) {
    try {
      const url = mode === 'create' ? '/api/admin/compare' : `/api/admin/compare/${compareSlug}`
      const method = mode === 'create' ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(typeof data.error === 'string' ? data.error : 'Save failed')
      }
      toast({ title: mode === 'create' ? 'Comparison created' : 'Comparison updated' })
      router.push('/admin/compare')
      router.refresh()
    } catch (err: any) {
      toast({ title: 'Save failed', description: err.message, variant: 'destructive' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Vehicles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Vehicle 1</Label>
              <Select {...register('vehicle1Id')} onBlur={handleAutoSlug}>
                <option value="">Select vehicle…</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.model}
                  </option>
                ))}
              </Select>
              {errors.vehicle1Id && <p className="text-xs text-red-600 mt-1">{errors.vehicle1Id.message}</p>}
            </div>
            <div>
              <Label>Vehicle 2</Label>
              <Select {...register('vehicle2Id')} onBlur={handleAutoSlug}>
                <option value="">Select vehicle…</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.model}
                  </option>
                ))}
              </Select>
              {errors.vehicle2Id && <p className="text-xs text-red-600 mt-1">{errors.vehicle2Id.message}</p>}
            </div>
          </div>
          <div>
            <Label>Slug</Label>
            <Input {...register('slug')} placeholder="brand-model-vs-brand-model" />
            {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug.message}</p>}
            <p className="text-xs text-slate-400 mt-1">Page will be available at /compare/{slug || '...'}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Comparison Summary</Label>
            <Textarea rows={4} {...register('summary')} />
          </div>
          <div>
            <Label>Winner / Verdict Highlights</Label>
            <Textarea rows={4} {...register('verdict')} />
          </div>
          <div>
            <Label>SEO Meta Title</Label>
            <Input {...register('metaTitle')} placeholder="MG HS II vs Peugeot 3008 PHEV Comparison" />
          </div>
          <div>
            <Label>SEO Meta Description</Label>
            <Textarea rows={2} {...register('metaDescription')} />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : mode === 'create' ? 'Create Comparison' : 'Save Changes'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/compare')}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
