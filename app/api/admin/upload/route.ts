import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export const runtime = 'nodejs'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 8 * 1024 * 1024 // 8MB

function getR2Client() {
  const accountId = process.env.R2_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('R2 credentials are not configured')
  }
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  })
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const folder = (formData.get('folder') as string) || 'misc'

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, and WebP images are allowed' }, { status: 400 })
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'Image must be smaller than 8MB' }, { status: 400 })
    }

    const bucket = process.env.R2_BUCKET_NAME
    const publicUrl = process.env.R2_PUBLIC_URL
    if (!bucket || !publicUrl) {
      return NextResponse.json({ error: 'R2 bucket is not configured' }, { status: 500 })
    }

    const safeFolder = folder === 'blog' ? 'blog' : 'vehicles'
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
    const key = `admin-uploads/${safeFolder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const buffer = Buffer.from(await file.arrayBuffer())
    const client = getR2Client()
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    )

    return NextResponse.json({ url: `${publicUrl}/${key}` })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 })
  }
}
