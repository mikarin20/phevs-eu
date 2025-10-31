import { Metadata } from 'next'
import Link from 'next/link'
import blogData from '@/data/blog.json'
import BlogImage from '@/components/BlogImage'
import { getTranslations, type Locale } from '@/lib/i18n'
import LanguageSelector from '@/components/LanguageSelector'

export const metadata: Metadata = {
  title: 'PHEV Haberleri ve İncelemeler | PHEVs.eu Blog',
  description: 'Avrupa\'daki en güncel plug-in hibrit araç haberleri, detaylı incelemeler, pazar analizleri ve rehberler. PHEV dünyasından son gelişmeleri takip edin.',
  keywords: [
    'PHEV haberleri',
    'plug-in hibrit haberler',
    'PHEV incelemeler',
    'hibrit araç testleri',
    'elektrikli araç haberleri',
    'PHEV pazar analizi',
    'avrupa PHEV haberleri'
  ],
  openGraph: {
    title: 'PHEV Haberleri ve İncelemeler | PHEVs.eu Blog',
    description: 'Avrupa\'daki en güncel plug-in hibrit araç haberleri, detaylı incelemeler ve pazar analizleri.',
    type: 'website',
    url: 'https://phevs.eu/blog',
    siteName: 'PHEVs.eu',
    images: [
      {
        url: 'https://phevs.eu/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PHEVs.eu Blog - PHEV Haberleri ve İncelemeler',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PHEV Haberleri ve İncelemeler | PHEVs.eu Blog',
    description: 'Avrupa\'daki en güncel plug-in hibrit araç haberleri, detaylı incelemeler ve pazar analizleri.',
    images: ['https://phevs.eu/images/og-image.jpg'],
    creator: '@phevs_eu',
    site: '@phevs_eu',
  },
  alternates: {
    canonical: 'https://phevs.eu/blog',
    languages: {
      'x-default': 'https://phevs.eu/blog',
      en: 'https://phevs.eu/blog',
      tr: 'https://phevs.eu/blog?lang=tr',
      de: 'https://phevs.eu/blog?lang=de',
      pl: 'https://phevs.eu/blog?lang=pl',
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
}

interface BlogPageProps {
  searchParams: {
    lang?: string
  }
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  const locale = (searchParams?.lang as Locale) || 'tr'
  const t = getTranslations(locale)
  const posts = blogData as BlogPost[]

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-slate-800 dark:to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative">
            <div className="absolute top-0 right-0">
              <LanguageSelector currentLocale={locale} basePath="/blog" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t.blog.title}
            </h1>
            <p className="text-xl text-blue-100 dark:text-slate-300 max-w-3xl mx-auto">
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
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      <div className="relative h-64 md:h-full aspect-video">
                        <BlogImage
                          src={sortedPosts[0].featured_image}
                          alt={sortedPosts[0].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {t.blog.featured}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="md:w-1/2 p-8 flex flex-col justify-center">
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
                    alt={post.title}
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
