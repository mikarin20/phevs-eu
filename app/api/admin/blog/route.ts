import { NextRequest, NextResponse } from 'next/server'
import { blogStore } from '@/lib/admin/data-store'
import { blogPostSchema } from '@/lib/admin/validation'
import { buildLocalizedBlogFields } from '@/lib/admin/translate'
import { submitToIndexNow } from '@/lib/indexnow'

export async function GET() {
  try {
    const { items } = await blogStore.list()
    return NextResponse.json({ items })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = blogPostSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    const data = parsed.data

    const { items, sha } = await blogStore.list()
    if (items.some((p: any) => p.slug === data.slug)) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 })
    }

    const now = new Date().toISOString().split('T')[0]
    const wordCount = data.content.trim().split(/\s+/).filter(Boolean).length
    const localizedFields = await buildLocalizedBlogFields(
      {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        metaTitle: data.meta_title,
        metaDescription: data.meta_description,
      },
      data.source_locale,
      data.auto_translate
    )
    const newPost = {
      id: data.slug,
      slug: data.slug,
      ...localizedFields,
      author: 'PHEVs.eu Team',
      author_en: 'PHEVs.eu Team',
      published_at: now,
      updated_at: now,
      category: 'General',
      category_en: 'General',
      tags: [] as string[],
      featured_image: data.featured_image,
      read_time: Math.max(1, Math.round(wordCount / 200)),
      related_cars: [] as string[],
      status: data.status,
    }

    await blogStore.save([...items, newPost], sha, `admin: add blog post ${data.slug}`)

    // Ping Bing & Yandex via IndexNow immediately
    submitToIndexNow([
      `https://www.phevs.eu/blog/${data.slug}/`,
      'https://www.phevs.eu/blog/',
      'https://www.phevs.eu/',
      'https://www.phevs.eu/sitemap.xml',
    ]).catch((err) => console.error('[IndexNow] Auto-ping error:', err))

    return NextResponse.json({ item: newPost }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
