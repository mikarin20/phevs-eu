import { NextRequest, NextResponse } from 'next/server'
import { blogStore } from '@/lib/admin/data-store'
import { blogPostSchema } from '@/lib/admin/validation'

export async function GET(_request: NextRequest, { params }: { params: { slug: string } }) {
  const { items } = await blogStore.list()
  const item = items.find((p: any) => p.slug === params.slug)
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ item })
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const body = await request.json()
    const parsed = blogPostSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    const data = parsed.data

    const { items, sha } = await blogStore.list()
    const index = items.findIndex((p: any) => p.slug === params.slug)
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const existing = items[index]
    const wordCount = data.content.trim().split(/\s+/).filter(Boolean).length
    const updated = {
      ...existing,
      slug: data.slug,
      title: data.title,
      title_en: data.title,
      excerpt: data.excerpt,
      excerpt_en: data.excerpt,
      content: data.content,
      content_en: data.content,
      featured_image: data.featured_image,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      status: data.status,
      read_time: Math.max(1, Math.round(wordCount / 200)),
      updated_at: new Date().toISOString().split('T')[0],
    }
    items[index] = updated
    await blogStore.save(items, sha, `admin: update blog post ${params.slug}`)
    return NextResponse.json({ item: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { items, sha } = await blogStore.list()
    const filtered = items.filter((p: any) => p.slug !== params.slug)
    if (filtered.length === items.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await blogStore.save(filtered, sha, `admin: delete blog post ${params.slug}`)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
