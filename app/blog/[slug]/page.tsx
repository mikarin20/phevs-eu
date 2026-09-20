import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import blogData from '@/data/blog.json'
import carsData from '@/data/cars.json'
import BlogImage from '@/components/BlogImage'
import { getTranslations, type Locale } from '@/lib/i18n'
import { marked } from 'marked'

function renderMarkdown(content: string): string {
  if (!content) return ''
  const rawHtml = marked.parse(content, { gfm: true, breaks: true }) as string
  return rawHtml.replace(/<table>([\s\S]*?)<\/table>/g, '<div class="blog-table-wrapper"><table>$1</table></div>')
}


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
  meta_title?: string
  meta_title_en?: string
  meta_title_de?: string
  meta_title_pl?: string
  meta_description?: string
  meta_description_en?: string
  meta_description_de?: string
  meta_description_pl?: string
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
  status?: 'draft' | 'published'
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

  const baseUrl = 'https://www.phevs.eu'
  const currentUrl = `${baseUrl}/blog/${params.slug}`
  const localizedTitle = locale === 'en' ? post.title_en : locale === 'de' ? (post.title_de || post.title_en || post.title) : locale === 'pl' ? (post.title_pl || post.title_en || post.title) : post.title
  const localizedExcerpt = locale === 'en' ? post.excerpt_en : locale === 'de' ? (post.excerpt_de || post.excerpt_en || post.excerpt) : locale === 'pl' ? (post.excerpt_pl || post.excerpt_en || post.excerpt) : post.excerpt
  const title = locale === 'en' ? (post.meta_title_en || localizedTitle) : locale === 'de' ? (post.meta_title_de || localizedTitle) : locale === 'pl' ? (post.meta_title_pl || localizedTitle) : (post.meta_title || localizedTitle)
  const description = locale === 'en' ? (post.meta_description_en || localizedExcerpt) : locale === 'de' ? (post.meta_description_de || localizedExcerpt) : locale === 'pl' ? (post.meta_description_pl || localizedExcerpt) : (post.meta_description || localizedExcerpt)
  
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
    robots: post.status === 'draft' ? { index: false, follow: false } : undefined,
  }
}

export async function generateStaticParams() {
  const posts = blogData as BlogPost[]
  return posts
    .filter((post) => post.status !== 'draft')
    .map((post) => ({
      slug: post.slug,
    }))
}

export default function BlogDetailPage({ params, searchParams }: BlogDetailProps) {
  const locale = (searchParams?.lang as Locale) || 'tr'
  const t = getTranslations(locale)
  const post = getBlogPost(params.slug)
  const isPreview = (searchParams as any)?.preview === 'true'

  if (!post || (post.status === 'draft' && !isPreview)) {
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

  // Diğer yazıları bul (sadece yayında olanlar)
  const otherPosts = (blogData as BlogPost[])
    .filter(p => p.id !== post.id && p.status !== 'draft')
    .slice(0, 3)

  // İçeriği markdown olarak render et
  const htmlContent = renderMarkdown(content)

  // Biçimlendirilmiş yayın tarihi
  const formattedDate = new Date(post.published_at).toLocaleDateString(
    locale === 'tr' ? 'tr-TR' : locale === 'de' ? 'de-DE' : locale === 'pl' ? 'pl-PL' : 'en-GB',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  )

  return (
    <>
      {/* Draft Preview Warning Banner */}
      {post.status === 'draft' && (
        <aside aria-label="Draft preview warning" className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white font-semibold py-3 px-4 text-center text-xs sm:text-sm shadow-md sticky top-0 z-50 flex items-center justify-center gap-2">
          <span>⚠️ Draft Preview Mode: This article is currently unpublished and hidden from public visitors and search engines.</span>
        </aside>
      )}
      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": locale === 'en' ? post.excerpt_en : locale === 'de' ? (post.excerpt_de || post.excerpt_en || post.excerpt) : locale === 'pl' ? (post.excerpt_pl || post.excerpt_en || post.excerpt) : post.excerpt,
            "image": post.featured_image.startsWith('http') ? post.featured_image : `https://www.phevs.eu${post.featured_image}`,
            "datePublished": post.published_at,
            "dateModified": post.updated_at,
            "author": {
              "@type": "Person",
              "name": author
            },
            "publisher": {
              "@type": "Organization",
              "name": "PHEVs.eu",
              "url": "https://www.phevs.eu",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.phevs.eu/favicon.svg"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://www.phevs.eu/blog/${params.slug}`
            }
          })
        }}
      />

      <div className="min-h-screen bg-slate-100/70 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors">
        {/* Breadcrumb */}
        <div className="bg-white/90 dark:bg-[#131b2e]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 py-3.5 sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              {/* Language Selector */}
              <div className="flex justify-center sm:justify-end sm:order-2">
                <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200/60 dark:border-slate-700/60">
                  {[
                    { code: 'en' as Locale, flag: 'gb' },
                    { code: 'de' as Locale, flag: 'de' },
                    { code: 'tr' as Locale, flag: 'tr' },
                    { code: 'pl' as Locale, flag: 'pl' }
                  ].map((lang) => {
                    const isActive = locale === lang.code
                    return (
                      <Link
                        key={lang.code}
                        href={`/blog/${params.slug}?lang=${lang.code}`}
                        className={`p-1.5 px-2 rounded-md transition-all duration-200 ${
                          isActive
                            ? 'bg-white dark:bg-slate-700 shadow-sm'
                            : 'hover:bg-white/50 dark:hover:bg-slate-700/50'
                        }`}
                        title={lang.code.toUpperCase()}
                      >
                        <span className={`fi fi-${lang.flag} text-sm`}></span>
                      </Link>
                    )
                  })}
                </div>
              </div>
              
              {/* Breadcrumb Links */}
              <nav className="flex items-center space-x-2 text-sm flex-wrap sm:order-1 min-w-0">
                <Link href={`/?lang=${locale}`} className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap">
                  {t.blog.home}
                </Link>
                <span className="text-slate-400">/</span>
                <Link href={`/blog?lang=${locale}`} className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap">
                  {t.blog.title}
                </Link>
                <span className="text-slate-400">/</span>
                <span className="text-slate-900 dark:text-slate-200 font-medium truncate max-w-xs">{title}</span>
              </nav>
            </div>
          </div>
        </div>

        {/* Article Container */}
        <article className="py-8 sm:py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Editorial Header Section (Title & Meta) */}
            <header className="mb-8">
              {/* Category Pill & Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600 text-white shadow-sm">
                  {category}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formattedDate}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {post.read_time} {t.blog.readTime}
                </span>
              </div>

              {/* Editorial Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.2] mb-6">
                {title}
              </h1>

              {/* Author Byline Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200/80 dark:border-slate-800 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-sm">
                    {author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{author}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">PHEVs.eu Editorial • Automotive Technical Review</div>
                  </div>
                </div>

                <Link
                  href={`/blog?lang=${locale}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>←</span>
                  <span>{t.blog.title}</span>
                </Link>
              </div>
            </header>

            {/* Featured Image */}
            <div className="mb-10 rounded-2xl overflow-hidden shadow-md border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
              <div className="relative aspect-[16/9] w-full">
                <BlogImage
                  src={post.featured_image}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* WordPress-style Editorial Paper Card Container */}
            <div className="bg-white dark:bg-[#131b2e] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-10 md:p-14 mb-12">
              <div 
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />

              {/* Tags inside card footer */}
              {post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                    Tags & Topics
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-default border border-slate-200/60 dark:border-slate-700/60"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Related Cars */}
            {relatedCars.length > 0 && (
              <div className="mb-12 bg-white dark:bg-[#131b2e] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  {t.blog.relatedModels}
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {relatedCars.map((car: any) => (
                    <Link
                      key={car.id}
                      href={`/models/${car.slug || car.id}`}
                      className="group block bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-4 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all"
                    >
                      <div className="aspect-video mb-3 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
                        <BlogImage
                          src={car.image_url}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {car.brand} {car.model}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
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

