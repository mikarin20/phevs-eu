import { NextResponse } from 'next/server'
import blogData from '@/data/blog.json'

/**
 * Image Sitemap XML - Google Image Search için
 * 
 * URL: https://phevs.eu/images-sitemap.xml
 * 
 * Google Search Console'a ekleyin:
 * 1. Sitemaps bölümüne gidin
 * 2. "Yeni sitemap ekle" tıklayın
 * 3. "images-sitemap.xml" yazın ve gönderin
 */
export async function GET() {
  const baseUrl = 'https://phevs.eu'
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`

  // Blog görselleri
  blogData.forEach((post: any) => {
    if (post.featured_image) {
      const imageUrl = post.featured_image.startsWith('http')
        ? post.featured_image
        : `${baseUrl}${post.featured_image}`
      
      const postUrl = `${baseUrl}/blog/${post.slug}`
      const lastMod = new Date(post.updated_at || post.published_at).toISOString()
      const title = post.title || post.title_en || 'Blog Post'
      
      xml += `  <url>
    <loc>${postUrl}</loc>
    <lastmod>${lastMod}</lastmod>
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</image:title>
      <image:caption>${title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</image:caption>
    </image:image>
  </url>
`
    }
  })

  xml += `</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}

