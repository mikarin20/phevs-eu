import { NextRequest, NextResponse } from 'next/server'
import { videoStore } from '@/lib/admin/data-store'
import { videoSchema } from '@/lib/admin/validation'
import { extractYouTubeId } from '@/lib/youtube'

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const { items } = await videoStore.list()
  const item = items.find((v: any) => v.id === params.id)
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ item })
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Sanitize youtubeId in case user pasted a full URL
    if (body.youtubeId) {
      body.youtubeId = extractYouTubeId(body.youtubeId)
    }

    const parsed = videoSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const data = parsed.data

    const { items, sha } = await videoStore.list()
    const index = items.findIndex((v: any) => v.id === params.id)
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const updated = {
      ...items[index],
      ...data,
      updated_at: new Date().toISOString()
    }
    items[index] = updated
    await videoStore.save(items, sha, `admin: update video ${params.id}`)
    return NextResponse.json({ item: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { items, sha } = await videoStore.list()
    const filtered = items.filter((v: any) => v.id !== params.id)
    if (filtered.length === items.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await videoStore.save(filtered, sha, `admin: delete video ${params.id}`)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
