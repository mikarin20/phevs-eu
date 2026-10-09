import { Metadata } from 'next'
import Link from 'next/link'
import blogData from '@/data/blog.json'
import BlogImage from '@/components/BlogImage'
import { getTranslations, type Locale } from '@/lib/i18n'
import LanguageSelector from '@/components/LanguageSelector'
import { isPostLive } from '@/lib/blog'
import HybridLogo from '@/components/HybridLogo'

export const metadata: Metadata = {
  title: 'PHEV News, Real-World Tests & Technology Analysis',
  description: 'Europe\'s latest plug-in hybrid electric vehicle news, in-depth road tests, battery technology breakdowns, and market analyses.',
  keywords: [
    'PHEV news',
    'plug-in hybrid news',
    'PHEV reviews',
    'hybrid car tests',
    'electric vehicle news',
    'PHEV market analysis',
    'European PHEV news'
  ],
  openGraph: {
    title: 'PHEV News, Real-World Tests & Technology Analysis | PHEVs.eu',
    description: 'Europe\'s latest plug-in hybrid electric vehicle news, road tests, and market analyses.',
    type: 'website',
    url: 'https://www.phevs.eu/blog/',
    siteName: 'PHEVs.eu',
    images: [
      {
        url: 'https://www.phevs.eu/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PHEVs.eu Blog - PHEV News & Reviews',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PHEV News, Real-World Tests & Technology Analysis | PHEVs.eu',
    description: 'Europe\'s latest plug-in hybrid electric vehicle news, road tests, and market analyses.',
    images: ['https://www.phevs.eu/images/og-image.jpg'],
    creator: '@phevs_eu',
    site: '@phevs_eu',
  },
  alternates: {
    canonical: 'https://www.phevs.eu/blog/',
    languages: {
      'x-default': 'https://www.phevs.eu/blog/',
      en: 'https://www.phevs.eu/blog/',
      tr: 'https://www.phevs.eu/blog/',
      de: 'https://www.phevs.eu/blog/',
      pl: 'https://www.phevs.eu/blog/',
    },
  },
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
  author: string
  author_en: string
  author_de?: string
  author_pl?: string
  published_at: string
  category: string
  category_en: string
  category_de?: string
  category_pl?: string
  tags: string[]
  featured_image: string
  read_time: number
  status?: 'draft' | 'published'
}

interface BlogPageProps {
  searchParams: {
    lang?: string
  }
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  const locale = (searchParams?.lang as Locale) || 'en'
  const t = getTranslations(locale)
  const posts = (blogData as BlogPost[]).filter(isPostLive)

  // Tarihe göre sırala (en yeni önce)
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  )

  // Kategorilere göre grupla
  const categories = [...new Set(posts.map(post => post.category))]
  
  // Dil bazlı başlık ve içerik seçimi
  const getLocalizedTitle = (post: BlogPost) => {
    if (locale === 'en') return post.title_en
    if (locale === 'de') return post.title_de || post.title_en || post.title
    if (locale === 'pl') return post.title_pl || post.title_en || post.title
    return post.title
  }
  const getLocalizedExcerpt = (post: BlogPost) => {
    if (locale === 'en') return post.excerpt_en
    if (locale === 'de') return post.excerpt_de || post.excerpt_en || post.excerpt
    if (locale === 'pl') return post.excerpt_pl || post.excerpt_en || post.excerpt
    return post.excerpt
  }
  const getLocalizedCategory = (post: BlogPost) => {
    if (locale === 'en') return post.category_en
    if (locale === 'de') return post.category_de || post.category_en || post.category
    if (locale === 'pl') return post.category_pl || post.category_en || post.category
    return post.category
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': t.blog.title,
    'description': t.blog.subtitle,
    'url': 'https://www.phevs.eu/blog/',
    'hasPart': sortedPosts.map((post) => ({
      '@type': 'Article',
      'headline': getLocalizedTitle(post),
      'description': getLocalizedExcerpt(post),
      'url': `https://www.phevs.eu/blog/${post.slug}/`,
      'image': post.featured_image.startsWith('http') ? post.featured_image : `https://www.phevs.eu${post.featured_image}`,
      'datePublished': post.published_at,
    })),
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Sticky Top Header Navigation */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo and Brand */}
            <Link href={`/?lang=${locale}`} className="flex items-center space-x-2.5 sm:space-x-3 group shrink-0">
              <div className="relative">
                <HybridLogo size="md" className="text-slate-800 dark:text-slate-100 group-hover:scale-105 transition-transform" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50"></div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline space-x-0.5 sm:space-x-1">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">PHEVs</span>
                  <span className="text-xl sm:text-2xl font-light text-blue-600 dark:text-blue-400">.eu</span>
                </div>
                <span className="hidden sm:block text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide -mt-0.5">Europe&apos;s PHEV Platform</span>
              </div>
            </Link>

            {/* Center Navigation - Pill Capsule */}
            <nav className="hidden lg:flex items-center p-1 bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-full backdrop-blur-md shadow-xs space-x-1">
              <Link
                href={`/models${locale !== 'en' ? `?lang=${locale}` : ''}`}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs"
              >
                Models
              </Link>
              <Link
                href="/real-world-telemetry"
                className="text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Real Telemetry</span>
              </Link>
              <Link
                href="/range-calculator"
                className="text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs"
              >
                Range Calculator
              </Link>
              <Link
                href={`/faq${locale !== 'en' ? `?lang=${locale}` : ''}`}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs"
              >
                PHEV Guide
              </Link>
              <Link
                href="/videos"
                className="text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs"
              >
                Videos
              </Link>
              <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-blue-600 text-white shadow-xs">
                PHEV News
              </span>
            </nav>

            {/* Right Side: Back to Home + Language Selector */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              <Link
                href={`/?lang=${locale}`}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/80 dark:border-slate-700/80"
              >
                <span>←</span>
                <span>{locale === 'tr' ? 'Ana Sayfa' : locale === 'de' ? 'Startseite' : locale === 'pl' ? 'Strona główna' : 'Home'}</span>
              </Link>
              <LanguageSelector currentLocale={locale} basePath="/blog" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-slate-800 dark:to-slate-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              {t.blog.title}
            </h1>
            <p className="text-base sm:text-xl text-blue-100 dark:text-slate-300 max-w-3xl mx-auto">
              {t.blog.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Post (İlk yazı) */}
          {sortedPosts.length > 0 && (
            <div className="mb-16">
              <Link 
                href={`/blog/${sortedPosts[0].slug}?lang=${locale}`}
                className="block group"
              >
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="md:flex md:min-h-[400px]">
                    <div className="md:w-2/3 relative">
                      <div className="relative h-64 md:h-full min-h-[300px]">
                        <BlogImage
                          src={sortedPosts[0].featured_image}
                          alt={`${getLocalizedTitle(sortedPosts[0])} — PHEVs.eu Technical Guide`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {t.blog.featured}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="md:w-1/3 p-6 md:p-8 flex flex-col justify-center">
                      <div className="mb-4">
                        <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">
                          {getLocalizedCategory(sortedPosts[0])}
                        </span>
                        <span className="text-gray-400 mx-2">•</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          {new Date(sortedPosts[0].published_at).toLocaleDateString(locale === 'tr' ? 'tr-TR' : locale === 'de' ? 'de-DE' : locale === 'pl' ? 'pl-PL' : 'en-GB', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="text-gray-400 mx-2">•</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          {sortedPosts[0].read_time} {t.blog.readTime}
                        </span>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {getLocalizedTitle(sortedPosts[0])}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 line-clamp-3">
                        {getLocalizedExcerpt(sortedPosts[0])}
                      </p>
                      <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold">
                        {t.blog.readMore}
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Kategoriler */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold">
                {t.blog.all}
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-semibold hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border border-gray-200 dark:border-slate-700"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Diğer Yazılar */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPosts.slice(1).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}?lang=${locale}`}
                className="group block bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <BlogImage
                    src={post.featured_image}
                    alt={`${getLocalizedTitle(post)} — PHEVs.eu Technical Guide`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-3">
                    <span className="text-blue-600 dark:text-blue-400 text-xs font-semibold">
                      {getLocalizedCategory(post)}
                    </span>
                    <span className="text-gray-400 mx-2">•</span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      {new Date(post.published_at).toLocaleDateString(locale === 'tr' ? 'tr-TR' : locale === 'de' ? 'de-DE' : locale === 'pl' ? 'pl-PL' : 'en-GB', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="text-gray-400 mx-2">•</span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      {post.read_time} {t.blog.readTime.replace('dk', '').replace('min', '').trim()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {getLocalizedTitle(post)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {getLocalizedExcerpt(post)}
                  </p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-semibold">
                    {t.blog.readMore}
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
  )
}
