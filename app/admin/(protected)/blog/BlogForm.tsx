'use client'

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
import ImageUploader from '@/components/admin/ImageUploader'
import { useToast } from '@/components/admin/ui/toast-provider'
import { slugify } from '@/lib/admin/slug'

const formSchema = z.object({
  title: z.string().min(1, 'Required'),
  slug: z.string().min(1, 'Required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, hyphens only'),
  excerpt: z.string().min(1, 'Required'),
  content: z.string().min(1, 'Required'),
  featured_image: z.string().min(1, 'Required'),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  source_locale: z.enum(['tr', 'en', 'de', 'pl']),
  auto_translate: z.boolean(),
  status: z.enum(['draft', 'published']),
})

export type BlogFormValues = z.infer<typeof formSchema>

interface BlogFormProps {
  mode: 'create' | 'edit'
  postSlug?: string
  defaultValues?: Partial<BlogFormValues>
}

export default function BlogForm({ mode, postSlug, defaultValues }: BlogFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image: '',
      source_locale: 'tr',
      auto_translate: true,
      status: 'draft',
      ...defaultValues,
    },
  })

  const title = watch('title')
  const featuredImage = watch('featured_image')

  function handleAutoSlug() {
    if (title && mode === 'create') setValue('slug', slugify(title))
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

  async function onSubmit(values: BlogFormValues) {
    try {
      const url = mode === 'create' ? '/api/admin/blog' : `/api/admin/blog/${postSlug}`
      const method = mode === 'create' ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(extractErrorMessage(data))
      }
      toast({ title: mode === 'create' ? 'Post created' : 'Post updated' })
      router.push('/admin/blog')
      router.refresh()
    } catch (err: any) {
      toast({ title: 'Save failed', description: err.message, variant: 'destructive' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Post Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Source Language</Label>
              <Select {...register('source_locale')}>
                <option value="tr">Turkish</option>
                <option value="en">English</option>
                <option value="de">German</option>
                <option value="pl">Polish</option>
              </Select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input type="checkbox" {...register('auto_translate')} className="h-4 w-4" />
                Automatically translate to the other 3 languages on save
              </label>
            </div>
          </div>
          <div>
            <Label>Title</Label>
            <Input {...register('title')} onBlur={handleAutoSlug} />
            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <Label>Slug</Label>
            <Input {...register('slug')} />
            {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug.message}</p>}
          </div>
          <div>
            <Label>Excerpt</Label>
            <Textarea rows={2} {...register('excerpt')} />
            {errors.excerpt && <p className="text-xs text-red-600 mt-1">{errors.excerpt.message}</p>}
          </div>
          <div>
            <Label>Content (Markdown supported)</Label>
            <Textarea rows={14} {...register('content')} className="font-mono text-sm" />
            {errors.content && <p className="text-xs text-red-600 mt-1">{errors.content.message}</p>}
          </div>
          <div>
            <Label>Cover Image</Label>
            <ImageUploader
              value={featuredImage}
              onChange={(url) => setValue('featured_image', url, { shouldValidate: true })}
              folder="blog"
            />
            {errors.featured_image && <p className="text-xs text-red-600 mt-1">{errors.featured_image.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO & Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>SEO Meta Title</Label>
            <Input {...register('meta_title')} />
          </div>
          <div>
            <Label>SEO Meta Description</Label>
            <Textarea rows={2} {...register('meta_description')} />
          </div>
          <div>
            <Label className="block mb-2 font-semibold">Publication Status</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  watch('status') === 'draft'
                    ? 'border-amber-500 bg-amber-50/50 text-slate-900 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  value="draft"
                  {...register('status')}
                  className="mt-1 accent-amber-600"
                />
                <div>
                  <div className="font-bold text-sm text-amber-800 flex items-center gap-1.5">
                    <span>📝 Save as Draft (Taslak)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Private and hidden. Will not appear on the public website, blog listings, or sitemaps. You can publish whenever you are ready.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  watch('status') === 'published'
                    ? 'border-emerald-600 bg-emerald-50/50 text-slate-900 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  value="published"
                  {...register('status')}
                  className="mt-1 accent-emerald-600"
                />
                <div>
                  <div className="font-bold text-sm text-emerald-800 flex items-center gap-1.5">
                    <span>🚀 Published (Canlı Yayın)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Publicly visible immediately on phevs.eu, included in sitemap.xml, and pinged to search engines via IndexNow.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={() => {
            setValue('status', 'published')
            handleSubmit(onSubmit)()
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
        >
          {isSubmitting ? 'Saving and translating…' : '🚀 Publish Now'}
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => {
            setValue('status', 'draft')
            handleSubmit(onSubmit)()
          }}
          className="border-amber-400 text-amber-800 hover:bg-amber-50 font-semibold"
        >
          {isSubmitting ? 'Saving and translating…' : '💾 Save as Draft'}
        </Button>

        <Button
          type="button"
          variant="ghost"
          disabled={isSubmitting}
          onClick={() => router.push('/admin/blog')}
          className="text-slate-500 hover:text-slate-800"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
