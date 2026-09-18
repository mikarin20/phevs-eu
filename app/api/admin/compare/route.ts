import { NextRequest, NextResponse } from 'next/server'
import { compareStore } from '@/lib/admin/data-store'
import { quickCompareSchema } from '@/lib/admin/validation'

export async function GET() {
  try {
    const { items } = await compareStore.list()
    return NextResponse.json({ items })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = quickCompareSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    const data = parsed.data

    const { items, sha } = await compareStore.list()
    if (items.some((c: any) => c.slug === data.slug)) {
      return NextResponse.json({ error: 'A comparison with this slug already exists' }, { status: 409 })
    }

    const newCompare = { ...data, created_at: new Date().toISOString() }
    await compareStore.save([...items, newCompare], sha, `admin: add quick compare ${data.slug}`)
    return NextResponse.json({ item: newCompare }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
