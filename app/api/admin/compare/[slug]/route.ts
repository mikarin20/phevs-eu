import { NextRequest, NextResponse } from 'next/server'
import { compareStore } from '@/lib/admin/data-store'
import { quickCompareSchema } from '@/lib/admin/validation'

export async function GET(_request: NextRequest, { params }: { params: { slug: string } }) {
  const { items } = await compareStore.list()
  const item = items.find((c: any) => c.slug === params.slug)
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ item })
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const body = await request.json()
    const parsed = quickCompareSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    const data = parsed.data

    const { items, sha } = await compareStore.list()
    const index = items.findIndex((c: any) => c.slug === params.slug)
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const updated = { ...items[index], ...data, updated_at: new Date().toISOString() }
    items[index] = updated
    await compareStore.save(items, sha, `admin: update quick compare ${params.slug}`)
    return NextResponse.json({ item: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { items, sha } = await compareStore.list()
    const filtered = items.filter((c: any) => c.slug !== params.slug)
    if (filtered.length === items.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await compareStore.save(filtered, sha, `admin: delete quick compare ${params.slug}`)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
