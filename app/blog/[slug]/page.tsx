import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import blogData from '@/data/blog.json'
import carsData from '@/data/cars.json'
import BlogImage from '@/components/BlogImage'
import { getTranslations, type Locale } from '@/lib/i18n'
import LanguageSelector from '@/components/LanguageSelector'

interface BlogPost {
  id: string
  slug: string
  title: string
  title_en: string
  title_de?: string
  title_pl?: string
  excerpt: string
  excerpt_en: string
  excerpt_de?: string
  excerpt_pl?: string
  content: string
  content_en: string
  content_de?: string
  content_pl?: string
  author: string
  author_en: string
  author_de?: string
  author_pl?: string
  published_at: string
  updated_at: string
  category: string
  category_en: string
  category_de?: string
  category_pl?: string
  tags: string[]
  featured_image: string
  read_time: number
  related_cars: string[]
}

interface BlogDetailProps {
  params: {
    slug: string
  }
  searchParams: {
    lang?: string
  }
}

function getBlogPost(slug: string): BlogPost | undefined {
  return (blogData as BlogPost[]).find(post => post.slug === slug)
}

export async function generateMetadata({ params, searchParams }: BlogDetailProps): Promise<Metadata> {
  const locale = (searchParams?.lang as 'en' | 'tr' | 'de' | 'pl') || 'tr'
  const post = getBlogPost(params.slug)

  if (!post) {
    return {
      title: 'Haber Bulunamadı | PHEVs.eu',
    }
  }

  const baseUrl = 'https://phevs.eu'
  const currentUrl = `${baseUrl}/blog/${params.slug}`
  const title = locale === 'en' ? post.title_en : locale === 'de' ? (post.title_de || post.title_en || post.title) : locale === 'pl' ? (post.title_pl || post.title_en || post.title) : post.title
  const description = locale === 'en' ? post.excerpt_en : locale === 'de' ? (post.excerpt_de || post.excerpt_en || post.excerpt) : locale === 'pl' ? (post.excerpt_pl || post.excerpt_en || post.excerpt) : post.excerpt
  
  // Görsel URL'ini mutlak URL'e çevir (SEO için önemli)
  const featuredImageUrl = post.featured_image.startsWith('http') 
    ? post.featured_image 
    : `${baseUrl}${post.featured_image}`

  return {
    title: `${title} | PHEVs.eu`,
    description,
    keywords: [
      ...post.tags,
      'PHEV haberleri',
      'plug-in hibrit',
      'hibrit araç',
      'elektrikli araç'
    ],
    authors: [{ name: post.author }],
    openGraph: {
      title: `${title} | PHEVs.eu`,
      description,
      type: 'article',
      url: currentUrl,
      siteName: 'PHEVs.eu',
      locale: locale === 'tr' ? 'tr_TR' : locale === 'de' ? 'de_DE' : locale === 'pl' ? 'pl_PL' : 'en_US',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: [post.author],
      images: [
        {
          url: featuredImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | PHEVs.eu`,
      description,
      images: [featuredImageUrl],
      creator: '@phevs_eu',
      site: '@phevs_eu',
    },
    alternates: {
      canonical: currentUrl,
      languages: {
        'x-default': `${baseUrl}/blog/${params.slug}`,
        en: `${baseUrl}/blog/${params.slug}`,
        tr: `${baseUrl}/blog/${params.slug}`,
        de: `${baseUrl}/blog/${params.slug}`,
        pl: `${baseUrl}/blog/${params.slug}`,
      },
    },
  }
}

export async function generateStaticParams() {
  const posts = blogData as BlogPost[]
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogDetailPage({ params, searchParams }: BlogDetailProps) {
  const locale = (searchParams?.lang as Locale) || 'tr'
  const t = getTranslations(locale)
  const post = getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  const title = locale === 'en' ? post.title_en : locale === 'de' ? (post.title_de || post.title_en || post.title) : locale === 'pl' ? (post.title_pl || post.title_en || post.title) : post.title
  const content = locale === 'en' ? post.content_en : locale === 'de' ? (post.content_de || post.content_en || post.content) : locale === 'pl' ? (post.content_pl || post.content_en || post.content) : post.content
  const author = locale === 'en' ? post.author_en : locale === 'de' ? (post.author_de || post.author_en || post.author) : locale === 'pl' ? (post.author_pl || post.author_en || post.author) : post.author
  const category = locale === 'en' ? post.category_en : locale === 'de' ? (post.category_de || post.category_en || post.category) : locale === 'pl' ? (post.category_pl || post.category_en || post.category) : post.category

  // İlgili araçları bul
  const relatedCars = post.related_cars
    .map(carSlug => carsData.find(car => car.slug === carSlug || car.id === carSlug))
    .filter(Boolean)
    .slice(0, 3)

  // Diğer yazıları bul (aynı kategori veya rastgele)
  const otherPosts = (blogData as BlogPost[])
    .filter(p => p.id !== post.id)
    .slice(0, 3)

  // İçeriği paragraflara ayır
  const paragraphs = content.split('\n\n').filter(p => p.trim())

  return (
    <>
      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": locale === 'en' ? post.excerpt_en : locale === 'de' ? (post.excerpt_de || post.excerpt_en || post.excerpt) : locale === 'pl' ? (post.excerpt_pl || post.excerpt_en || post.excerpt) : post.excerpt,
            "image": post.featured_image.startsWith('http') ? post.featured_image : `https://phevs.eu${post.featured_image}`,
            "datePublished": post.published_at,
            "dateModified": post.updated_at,
            "author": {
              "@type": "Person",
              "name": author
            },
            "publisher": {
              "@type": "Organization",
              "name": "PHEVs.eu",
              "url": "https://phevs.eu",
              "logo": {
                "@type": "ImageObject",
                "url": "https://phevs.eu/favicon.svg"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://phevs.eu/blog/${params.slug}`
            }
          })
        }}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        {/* Breadcrumb */}
        <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 py-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <nav className="flex items-center space-x-2 text-sm">
                <Link href={`/?lang=${locale}`} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  {t.blog.home}
                </Link>
                <span className="text-gray-400">/</span>
                <Link href={`/blog?lang=${locale}`} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Blog
                </Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900 dark:text-white">{title}</span>
              </nav>
              <LanguageSelector currentLocale={locale} basePath={`/blog/${params.slug}`} />
            </div>
          </div>
        </div>

        {/* Article Header */}
        <article className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Featured Image */}
            <div className="mb-8">
              <div className="relative h-96 rounded-xl overflow-hidden">
                <BlogImage
                  src={post.featured_image}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Article Meta */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  {category}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  {new Date(post.published_at).toLocaleDateString(locale === 'tr' ? 'tr-TR' : locale === 'de' ? 'de-DE' : locale === 'pl' ? 'pl-PL' : 'en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  {post.read_time} {t.blog.readTime}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {title}
              </h1>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <span className="font-semibold">{author}</span>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
              {paragraphs.map((paragraph, index) => {
                // Başlık kontrolü
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  const heading = paragraph.replace(/\*\*/g, '')
                  const level = heading.match(/^#{1,6}/)?.[0]?.length || 0
                  if (level > 0) {
                    const HeadingTag = `h${Math.min(level + 1, 6)}` as keyof JSX.IntrinsicElements
                    const text = heading.replace(/^#+\s*/, '')
                    return <HeadingTag key={index} className="font-bold mt-8 mb-4 text-gray-900 dark:text-white">{text}</HeadingTag>
                  }
                }
                
                // Liste kontrolü
                if (paragraph.includes('✅') || paragraph.includes('❌')) {
                  const items = paragraph.split('\n').filter(i => i.trim())
                  return (
                    <ul key={index} className="list-none space-y-2 my-6">
                      {items.map((item, i) => {
                        const isPositive = item.includes('✅')
                        const text = item.replace(/[✅❌]\s*/, '').replace(/\*\*/g, '')
                        return (
                          <li key={i} className={`flex items-start ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            <span className="mr-2">{isPositive ? '✅' : '❌'}</span>
                            <span className="text-gray-700 dark:text-gray-300">{text}</span>
                          </li>
                        )
                      })}
                    </ul>
                  )
                }

                // Normal paragraf
                const processedParagraph = paragraph
                  .split('\n')
                  .map((line, i) => {
                    // Bold text
                    if (line.includes('**')) {
                      const parts = line.split('**')
                      return (
                        <span key={i}>
                          {parts.map((part, j) => 
                            j % 2 === 1 ? (
                              <strong key={j} className="font-semibold text-gray-900 dark:text-white">{part}</strong>
                            ) : (
                              <span key={j}>{part}</span>
                            )
                          )}
                        </span>
                      )
                    }
                    return <span key={i}>{line}</span>
                  })

                return (
                  <p key={index} className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {processedParagraph}
                  </p>
                )
              })}
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mb-12">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Cars */}
            {relatedCars.length > 0 && (
              <div className="mb-12 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {t.blog.relatedModels}
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {relatedCars.map((car: any) => (
                    <Link
                      key={car.id}
                      href={`/models/${car.slug || car.id}`}
                      className="group block bg-gray-50 dark:bg-slate-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                    >
                      <div className="aspect-video mb-3 rounded-lg overflow-hidden">
                        <BlogImage
                          src={car.image_url}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {car.brand} {car.model}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {car.ev_range_km} {t.blog.range}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Other Posts */}
        {otherPosts.length > 0 && (
          <section className="bg-white dark:bg-slate-800 py-12 border-t border-gray-200 dark:border-slate-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                {t.blog.otherNews}
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {otherPosts.map((otherPost) => {
                  const otherTitle = locale === 'en' ? otherPost.title_en : locale === 'de' ? (otherPost.title_de || otherPost.title_en || otherPost.title) : locale === 'pl' ? (otherPost.title_pl || otherPost.title_en || otherPost.title) : otherPost.title
                  const otherExcerpt = locale === 'en' ? otherPost.excerpt_en : locale === 'de' ? (otherPost.excerpt_de || otherPost.excerpt_en || otherPost.excerpt) : locale === 'pl' ? (otherPost.excerpt_pl || otherPost.excerpt_en || otherPost.excerpt) : otherPost.excerpt
                  const otherCategory = locale === 'en' ? otherPost.category_en : locale === 'de' ? (otherPost.category_de || otherPost.category_en || otherPost.category) : locale === 'pl' ? (otherPost.category_pl || otherPost.category_en || otherPost.category) : otherPost.category
                  return (
                    <Link
                      key={otherPost.id}
                      href={`/blog/${otherPost.slug}?lang=${locale}`}
                      className="group block bg-gray-50 dark:bg-slate-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="relative h-48">
                        <BlogImage
                          src={otherPost.featured_image}
                          alt={otherTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <span className="text-blue-600 dark:text-blue-400 text-xs font-semibold">
                          {otherCategory}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {otherTitle}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                          {otherExcerpt}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-blue-600 dark:bg-slate-800 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t.blog.compareCTA.title}
            </h2>
            <p className="text-blue-100 dark:text-slate-300 mb-6 text-lg">
              {t.blog.compareCTA.description}
            </p>
            <Link
              href={`/compare?lang=${locale}`}
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {t.blog.compareCTA.button}
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}

