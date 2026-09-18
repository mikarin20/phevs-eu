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
      status: 'draft',
      ...defaultValues,
    },
  })

  const title = watch('title')
  const featuredImage = watch('featured_image')

  function handleAutoSlug() {
    if (title && mode === 'create') setValue('slug', slugify(title))
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
        throw new Error(typeof data.error === 'string' ? data.error : 'Save failed')
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
            <Label>Status</Label>
            <Select {...register('status')}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : mode === 'create' ? 'Create Post' : 'Save Changes'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/blog')}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
