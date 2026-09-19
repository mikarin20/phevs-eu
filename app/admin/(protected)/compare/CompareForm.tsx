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

import { extractYouTubeId } from '@/lib/youtube'
import { Play, ExternalLink } from 'lucide-react'

const formSchema = z.object({
  vehicle1Id: z.string().min(1, 'Required'),
  vehicle2Id: z.string().min(1, 'Required'),
  slug: z.string().min(1, 'Required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, hyphens only'),
  summary: z.string().optional(),
  verdict: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  youtubeId: z.string().optional(),
  videoTitle: z.string().optional(),
})

export type CompareFormValues = z.infer<typeof formSchema>

interface Vehicle {
  id: string
  brand: string
  model: string
}

interface ExistingVideo {
  id: string
  youtubeId: string
  title: string
  channel: string
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
  const [existingVideos, setExistingVideos] = useState<ExistingVideo[]>([])

  useEffect(() => {
    fetch('/api/admin/vehicles')
      .then((r) => r.json())
      .then((d) => setVehicles(d.items || []))
      .catch(() => {})

    fetch('/api/admin/videos')
      .then((r) => r.json())
      .then((d) => setExistingVideos(d.items || []))
      .catch(() => {})
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CompareFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicle1Id: '',
      vehicle2Id: '',
      slug: '',
      youtubeId: '',
      videoTitle: '',
      ...defaultValues,
    },
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

  const rawYoutubeId = watch('youtubeId')
  const cleanYoutubeId = rawYoutubeId ? extractYouTubeId(rawYoutubeId) : ''

  async function onSubmit(values: CompareFormValues) {
    try {
      const sanitizedYoutubeId = values.youtubeId ? extractYouTubeId(values.youtubeId) : undefined
      const payload = {
        ...values,
        youtubeId: sanitizedYoutubeId || undefined,
        videoTitle: values.videoTitle?.trim() || undefined,
      }

      const url = mode === 'create' ? '/api/admin/compare' : `/api/admin/compare/${compareSlug}`
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
      toast({ title: mode === 'create' ? 'Comparison created' : 'Comparison updated' })
      router.push('/admin/compare')
      router.refresh()
    } catch (err: any) {
      toast({ title: 'Save failed', description: err.message, variant: 'destructive' })
    }
  }

  function handleSelectExistingVideo(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedId = e.target.value
    if (!selectedId) return
    const vid = existingVideos.find((v) => v.id === selectedId || v.youtubeId === selectedId)
    if (vid) {
      setValue('youtubeId', vid.youtubeId, { shouldValidate: true })
      if (!watch('videoTitle')) {
        setValue('videoTitle', vid.title, { shouldValidate: true })
      }
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

      {/* Featured Video Section */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Comparison Video</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-slate-500">
            Attach a YouTube video comparison to appear directly on this comparison page and in Google Video Rich Snippets.
          </p>

          {existingVideos.length > 0 && (
            <div>
              <Label>Quick Select from Video Library</Label>
              <Select onChange={handleSelectExistingVideo} defaultValue="">
                <option value="">Choose an existing video…</option>
                {existingVideos.map((v) => (
                  <option key={v.id} value={v.youtubeId}>
                    {v.channel}: {v.title}
                  </option>
                ))}
              </Select>
            </div>
          )}

          <div>
            <Label>YouTube Video Link or ID</Label>
            <div className="flex gap-2 mt-1">
              <Input
                {...register('youtubeId')}
                placeholder="https://youtu.be/hGBT-lXD9PA or hGBT-lXD9PA"
                className="flex-1"
              />
              {cleanYoutubeId && (
                <a
                  href={`https://www.youtube.com/watch?v=${cleanYoutubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-md flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Preview</span>
                </a>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Leave empty to automatically fall back to any matching video in data/comparison-videos.json.
            </p>
          </div>

          <div>
            <Label>Custom Video Title (Optional)</Label>
            <Input
              {...register('videoTitle')}
              placeholder="e.g. Real World Range & Fast Charging Test"
            />
          </div>

          {/* Thumbnail preview */}
          {cleanYoutubeId && cleanYoutubeId.length >= 8 && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4">
              <div className="relative w-36 aspect-video bg-black rounded-lg overflow-hidden shrink-0">
                <img
                  src={`https://i.ytimg.com/vi/${cleanYoutubeId}/hqdefault.jpg`}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLElement).style.display = 'none'
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play className="w-5 h-5 text-white fill-current opacity-90" />
                </div>
              </div>
              <div className="text-xs text-slate-600">
                <div className="font-semibold text-slate-900">Embedded Video</div>
                <div className="text-slate-500 font-mono mt-0.5">ID: {cleanYoutubeId}</div>
                <div className="text-emerald-600 font-medium mt-1">✓ Active on /compare/{slug || '...'}</div>
              </div>
            </div>
          )}
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
