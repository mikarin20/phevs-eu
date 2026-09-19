import { NextRequest, NextResponse } from 'next/server'
import { videoStore } from '@/lib/admin/data-store'
import { videoSchema } from '@/lib/admin/validation'
import { extractYouTubeId } from '@/lib/youtube'
import { submitToIndexNow } from '@/lib/indexnow'

export async function GET() {
  try {
    const { items } = await videoStore.list()
    return NextResponse.json({ items })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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
    if (items.some((v: any) => v.id === data.id)) {
      return NextResponse.json({ error: 'A video with this ID already exists' }, { status: 409 })
    }

    const newVideo = {
      ...data,
      publishedAt: data.publishedAt || new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString()
    }
    await videoStore.save([...items, newVideo], sha, `admin: add video ${data.id}`)

    // Ping Bing & Yandex via IndexNow immediately
    submitToIndexNow([
      'https://www.phevs.eu/videos/',
      'https://www.phevs.eu/compare/',
      'https://www.phevs.eu/',
      'https://www.phevs.eu/sitemap.xml',
    ]).catch((err) => console.error('[IndexNow] Auto-ping error:', err))

    return NextResponse.json({ item: newVideo }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
