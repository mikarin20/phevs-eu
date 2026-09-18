import { NextRequest, NextResponse } from 'next/server'
import { blogStore } from '@/lib/admin/data-store'
import { blogPostSchema } from '@/lib/admin/validation'

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
    const newPost = {
      id: data.slug,
      slug: data.slug,
      title: data.title,
      title_en: data.title,
      excerpt: data.excerpt,
      excerpt_en: data.excerpt,
      content: data.content,
      content_en: data.content,
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
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      status: data.status,
    }

    await blogStore.save([...items, newPost], sha, `admin: add blog post ${data.slug}`)
    return NextResponse.json({ item: newPost }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
