import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'PHEV Blog & Guides | PHEVs.eu',
  description: 'Expert insights, guides, and latest news about plug-in hybrid electric vehicles. Learn everything about PHEVs, charging, maintenance, and more.',
  robots: {
    index: true,
    follow: true,
  },
}

const blogPosts = [
  {
    id: 'phev-buying-guide-2025',
    title: 'Complete PHEV Buying Guide 2025',
    excerpt: 'Everything you need to know before buying a plug-in hybrid electric vehicle in 2025. Compare models, understand incentives, and make the right choice.',
    date: '2025-01-15',
    readTime: '8 min read',
    category: 'Buying Guide',
    image: '/images/blog/phev-buying-guide.jpg'
  },
  {
    id: 'phev-charging-guide',
    title: 'PHEV Charging: Everything You Need to Know',
    excerpt: 'Learn about different charging options, charging times, costs, and how to optimize your PHEV charging experience at home and on the road.',
    date: '2025-01-10',
    readTime: '6 min read',
    category: 'Charging',
    image: '/images/blog/phev-charging.jpg'
  },
  {
    id: 'phev-vs-ev-comparison',
    title: 'PHEV vs EV: Which is Right for You?',
    excerpt: 'Detailed comparison between plug-in hybrids and fully electric vehicles. Understand the pros and cons of each technology for your lifestyle.',
    date: '2025-01-05',
    readTime: '7 min read',
    category: 'Comparison',
    image: '/images/blog/phev-vs-ev.jpg'
  },
  {
    id: 'phev-maintenance-tips',
    title: 'PHEV Maintenance: Tips for Longevity',
    excerpt: 'Keep your plug-in hybrid running smoothly with these essential maintenance tips. Battery care, engine maintenance, and cost-saving strategies.',
    date: '2024-12-28',
    readTime: '5 min read',
    category: 'Maintenance',
    image: '/images/blog/phev-maintenance.jpg'
  },
  {
    id: 'phev-incentives-europe-2025',
    title: 'PHEV Incentives and Tax Benefits in Europe 2025',
    excerpt: 'Complete overview of government incentives, tax benefits, and subsidies available for PHEV buyers across European countries.',
    date: '2024-12-20',
    readTime: '9 min read',
    category: 'Incentives',
    image: '/images/blog/phev-incentives.jpg'
  },
  {
    id: 'phev-range-optimization',
    title: 'How to Maximize Your PHEV Electric Range',
    excerpt: 'Practical tips and techniques to get the most electric range from your plug-in hybrid. Driving habits, weather considerations, and more.',
    date: '2024-12-15',
    readTime: '6 min read',
    category: 'Tips & Tricks',
    image: '/images/blog/phev-range.jpg'
  }
]

const categories = ['All', 'Buying Guide', 'Charging', 'Comparison', 'Maintenance', 'Incentives', 'Tips & Tricks']

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">PHEV Blog & Guides</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Expert insights, practical guides, and the latest news about plug-in hybrid electric vehicles. 
            Learn everything you need to know about PHEVs.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === 'All'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        <div className="mb-12">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="h-64 md:h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4">🚗</div>
                    <p className="text-lg font-semibold">Featured Article</p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {blogPosts[0].category}
                  </span>
                  <span className="text-slate-500 text-sm">{blogPosts[0].readTime}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  {blogPosts[0].title}
                </h2>
                <p className="text-slate-600 mb-6">
                  {blogPosts[0].excerpt}
                </p>
                <Link
                  href={`/blog/${blogPosts[0].id}`}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Read Article
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-sm">Blog Image</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded">
                    {post.category}
                  </span>
                  <span className="text-slate-500 text-xs">{post.readTime}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs">{post.date}</span>
                  <Link
                    href={`/blog/${post.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Get the latest PHEV news, reviews, and buying guides delivered to your inbox. 
            No spam, just valuable insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
