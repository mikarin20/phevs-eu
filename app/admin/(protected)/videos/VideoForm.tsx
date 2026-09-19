'use client'

import { useEffect, useState, useMemo } from 'react'
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
import { X, Plus, Search, ExternalLink, Play } from 'lucide-react'

const formSchema = z.object({
  id: z.string().min(1, 'ID is required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, hyphens only'),
  youtubeId: z.string().min(1, 'YouTube URL or ID is required'),
  title: z.string().min(1, 'Title is required'),
  channel: z.string().min(1, 'Channel is required'),
  lang: z.enum(['en', 'pl', 'de', 'tr', 'fr', 'es', 'it']),
  relatedCars: z.array(z.string()).min(1, 'Select at least one related car'),
  type: z.enum(['comparison', 'single_review']),
  description: z.string().optional(),
  publishedAt: z.string().optional(),
})

export type VideoFormValues = z.infer<typeof formSchema>

interface Vehicle {
  id: string
  brand: string
  model: string
  slug?: string
}

interface VideoFormProps {
  mode: 'create' | 'edit'
  videoId?: string
  defaultValues?: Partial<VideoFormValues>
}

export default function VideoForm({ mode, videoId, defaultValues }: VideoFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [carSearch, setCarSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/vehicles')
      .then((r) => r.json())
      .then((d) => setVehicles(d.items || []))
      .catch(() => {})
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VideoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      youtubeId: '',
      title: '',
      channel: '',
      lang: 'en',
      type: 'comparison',
      relatedCars: [],
      description: '',
      publishedAt: new Date().toISOString().split('T')[0],
      ...defaultValues,
    },
  })

  const rawYoutubeId = watch('youtubeId')
  const currentTitle = watch('title')
  const selectedCars = watch('relatedCars') || []

  // Clean 11-char YouTube ID for thumbnail preview
  const cleanYoutubeId = useMemo(() => {
    return extractYouTubeId(rawYoutubeId || '')
  }, [rawYoutubeId])

  // Auto-fill ID from title if in create mode
  function handleAutoId() {
    if (mode !== 'create') return
    const currentId = watch('id')
    if (!currentId && currentTitle) {
      setValue('id', slugify(currentTitle))
    }
  }

  function toggleCar(identifier: string) {
    const isSelected = selectedCars.includes(identifier)
    let updated: string[]
    if (isSelected) {
      updated = selectedCars.filter((c) => c !== identifier)
    } else {
      updated = [...selectedCars, identifier]
    }
    setValue('relatedCars', updated, { shouldValidate: true })
  }

  const filteredVehicles = useMemo(() => {
    if (!carSearch.trim()) return vehicles.slice(0, 12)
    const q = carSearch.toLowerCase()
    return vehicles.filter(
      (v) =>
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.id.toLowerCase().includes(q) ||
        (v.slug && v.slug.toLowerCase().includes(q))
    )
  }, [vehicles, carSearch])

  function getVehicleLabel(idOrSlug: string) {
    const v = vehicles.find((item) => item.id === idOrSlug || item.slug === idOrSlug)
    return v ? `${v.brand} ${v.model}` : idOrSlug
  }

  async function onSubmit(values: VideoFormValues) {
    try {
      // Ensure clean YouTube ID is saved
      const payload = {
        ...values,
        youtubeId: extractYouTubeId(values.youtubeId),
      }

      const url = mode === 'create' ? '/api/admin/videos' : `/api/admin/videos/${videoId}`
      const method = mode === 'create' ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error?.message || data.error || 'Save failed')
      }

      toast({ title: mode === 'create' ? 'Video added' : 'Video updated' })
      router.push('/admin/videos')
      router.refresh()
    } catch (err: any) {
      toast({ title: 'Save failed', description: err.message, variant: 'destructive' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      {/* Video Source & Preview */}
      <Card>
        <CardHeader>
          <CardTitle>YouTube Source</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                  <span>Test Link</span>
                </a>
              )}
            </div>
            {errors.youtubeId && <p className="text-xs text-red-600 mt-1">{errors.youtubeId.message}</p>}
            <p className="text-xs text-slate-400 mt-1">
              You can paste a full YouTube URL, Share link (youtu.be), or directly the 11-digit video ID.
            </p>
          </div>

          {/* Live Video Thumbnail Preview */}
          {cleanYoutubeId && cleanYoutubeId.length >= 8 && (
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative w-full sm:w-56 aspect-video bg-black rounded-lg overflow-hidden shrink-0 shadow-sm">
                <img
                  src={`https://i.ytimg.com/vi/${cleanYoutubeId}/hqdefault.jpg`}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLElement).style.display = 'none'
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="text-sm text-slate-600 space-y-1">
                <div className="font-semibold text-slate-900">Thumbnail Preview</div>
                <div className="text-xs text-slate-500 font-mono">ID: {cleanYoutubeId}</div>
                <div className="text-xs text-emerald-600 font-medium">✓ Valid YouTube format detected</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Video Details */}
      <Card>
        <CardHeader>
          <CardTitle>Video Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Video Title</Label>
            <Input
              {...register('title')}
              onBlur={handleAutoId}
              placeholder="e.g. Jaecoo J7 vs MG HS (2026) | Test hybryd PHEV"
            />
            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Channel / Creator Name</Label>
              <Input {...register('channel')} placeholder="e.g. Caroseria, Autogefühl" />
              {errors.channel && <p className="text-xs text-red-600 mt-1">{errors.channel.message}</p>}
            </div>
            <div>
              <Label>Video Language</Label>
              <Select {...register('lang')}>
                <option value="en">English (EN)</option>
                <option value="pl">Polish (PL)</option>
                <option value="de">German (DE)</option>
                <option value="tr">Turkish (TR)</option>
                <option value="fr">French (FR)</option>
                <option value="es">Spanish (ES)</option>
                <option value="it">Italian (IT)</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Video Type / Format</Label>
              <Select {...register('type')}>
                <option value="comparison">Head-to-Head Comparison (VS)</option>
                <option value="single_review">Single Vehicle Review</option>
              </Select>
            </div>
            <div>
              <Label>Slug / Unique Identifier</Label>
              <Input
                {...register('id')}
                disabled={mode === 'edit'}
                placeholder="jaecoo-j7-vs-mg-hs-review"
              />
              {errors.id && <p className="text-xs text-red-600 mt-1">{errors.id.message}</p>}
            </div>
          </div>

          <div>
            <Label>Publish Date</Label>
            <Input type="date" {...register('publishedAt')} />
          </div>

          <div>
            <Label>Summary / Description (for Video Schema & Cards)</Label>
            <Textarea
              rows={3}
              {...register('description')}
              placeholder="Brief description of the test, range results, or key comparison points..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Related Vehicles Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Related PHEV Vehicles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-slate-500">
            Select the vehicles featured in this video. The video will automatically appear on their comparison and model pages.
          </p>

          {/* Selected Pills */}
          <div>
            <Label className="text-xs uppercase text-slate-400 font-semibold">Selected Vehicles ({selectedCars.length})</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCars.length === 0 ? (
                <span className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                  ⚠️ No vehicle selected yet. Please select at least one vehicle below.
                </span>
              ) : (
                selectedCars.map((carId) => (
                  <span
                    key={carId}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    <span>{getVehicleLabel(carId)}</span>
                    <button
                      type="button"
                      onClick={() => toggleCar(carId)}
                      className="hover:text-blue-900 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
            {errors.relatedCars && (
              <p className="text-xs text-red-600 mt-1">{errors.relatedCars.message}</p>
            )}
          </div>

          {/* Car Search & Quick Picker */}
          <div className="pt-2 border-t border-slate-100">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                value={carSearch}
                onChange={(e) => setCarSearch(e.target.value)}
                placeholder="Search vehicle by brand or model (e.g. Jaecoo, MG, Tiguan)..."
                className="pl-9"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1">
              {filteredVehicles.map((v) => {
                const isSelected = selectedCars.includes(v.id) || (v.slug && selectedCars.includes(v.slug))
                const primaryIdentifier = v.slug || v.id

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => toggleCar(primaryIdentifier)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-left text-xs transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/60 font-semibold text-blue-900'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div>{v.brand} {v.model}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{primaryIdentifier}</div>
                    </div>
                    {isSelected ? (
                      <X className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Plus className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : mode === 'create' ? 'Add Video' : 'Save Changes'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/videos')}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
