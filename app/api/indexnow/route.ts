import { NextRequest, NextResponse } from 'next/server'
import {
  submitToIndexNow,
  INDEXNOW_KEY,
  INDEXNOW_HOST,
  INDEXNOW_KEY_LOCATION,
} from '@/lib/indexnow'
import carsData from '@/data/cars.json'
import blogData from '@/data/blog.json'
import quickCompareData from '@/data/quick-compares.json'

export async function GET() {
  return NextResponse.json({
    status: 'active',
    protocol: 'IndexNow',
    host: INDEXNOW_HOST,
    keyLocation: INDEXNOW_KEY_LOCATION,
    keyMasked: `${INDEXNOW_KEY.slice(0, 6)}...${INDEXNOW_KEY.slice(-4)}`,
    engines: ['Bing', 'Yandex', 'Seznam', 'Naver'],
    endpoints: ['https://api.indexnow.org/indexnow', 'https://www.bing.com/indexnow'],
  })
}

export async function POST(request: NextRequest) {
  try {
    let body: any = {}
    try {
      body = await request.json()
    } catch {
      // Empty body
    }

    const { urls, submitAll } = body

    // 1. If explicit URLs are provided, submit them
    if (Array.isArray(urls) && urls.length > 0) {
      const result = await submitToIndexNow(urls)
      return NextResponse.json(result, { status: result.success ? 200 : 500 })
    }

    // 2. If submitAll is true (or default batch trigger), collect all site canonical URLs
    if (submitAll === true) {
      const baseUrl = `https://${INDEXNOW_HOST}`
      const urlSet = new Set<string>()

      // Static routes
      const staticPages = [
        '/',
        '/longest-range-phev/',
        '/phev-with-dc-charging/',
        '/7-seater-phev/',
        '/compare/',
        '/faq/',
        '/blog/',
        '/about/',
      ]
      staticPages.forEach((p) => urlSet.add(`${baseUrl}${p}`))

      // Models
      ;(carsData as any[]).forEach((car) => {
        const slugOrId = car.slug || car.id
        if (slugOrId) {
          urlSet.add(`${baseUrl}/models/${slugOrId}/`)
        }
      })

      // Blog posts
      ;(blogData as any[]).forEach((post) => {
        if (post.slug) {
          urlSet.add(`${baseUrl}/blog/${post.slug}/`)
        }
      })

      // Quick compares
      ;(quickCompareData as any[]).forEach((cmp) => {
        if (cmp.slug) {
          urlSet.add(`${baseUrl}/compare/${cmp.slug}/`)
        }
      })

      const allUrls = Array.from(urlSet)
      const result = await submitToIndexNow(allUrls)

      return NextResponse.json(
        {
          ...result,
          totalCollected: allUrls.length,
        },
        { status: result.success ? 200 : 500 }
      )
    }

    return NextResponse.json(
      {
        error: 'Provide an array of `urls` or set `submitAll: true` to trigger IndexNow submission',
      },
      { status: 400 }
    )
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
