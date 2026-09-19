/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
    scrollRestoration: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { dev, isServer }) => {
    // JSON import support
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
    })

    // Optimize bundle size
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 70000,
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
              priority: 40,
              enforce: true,
            },
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                if (!module.context) return 'lib.unknown'
                const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)
                if (!match) return 'lib.unknown'
                return `lib.${match[1].replace('@', '')}`
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
            },
            shared: {
              name(module, chunks) {
                if (!chunks || chunks.length === 0) return 'shared.unknown'
                return `shared.${chunks.map((chunk) => chunk.name || 'unknown').join('.')}`
              },
              priority: 10,
              minChunks: 2,
              reuseExistingChunk: true,
            },
          },
        },
      }
    }

    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-698245a4878b4d6596cd62322fdc9c75.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
    // Disabled to avoid Vercel's image optimization quota now that assets are served from R2
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    loader: 'default',
    domains: ['phevs.eu'],
    path: '/_next/image',
    disableStaticImages: false,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      // Yerel araç görseli isteklerini Cloudflare R2'ye yönlendir (404 koruması)
      {
        source: '/images/cars/brands/:path*',
        destination: 'https://pub-698245a4878b4d6596cd62322fdc9c75.r2.dev/cars/brands/:path*',
        permanent: true,
      },
      {
        source: '/images/placeholder-car.jpg',
        destination: 'https://pub-698245a4878b4d6596cd62322fdc9c75.r2.dev/placeholder-car.jpg',
        permanent: true,
      },
      // Silinen/Eski model slug'ları için 301 yönlendirmeleri (404 önleyici)
      {
        source: '/models/omoda-7-phev',
        destination: '/models/omoda-7-super-hybrid-phev',
        permanent: true,
      },
      {
        source: '/models/omoda-7-phev/',
        destination: '/models/omoda-7-super-hybrid-phev/',
        permanent: true,
      },
      {
        source: '/models/omoda-9-phev',
        destination: '/models/omoda-9-super-hybrid-phev',
        permanent: true,
      },
      {
        source: '/models/omoda-9-phev/',
        destination: '/models/omoda-9-super-hybrid-phev/',
        permanent: true,
      },
      {
        source: '/models/lexus-es-300h',
        destination: '/models/lexus-nx-450h-plus-phev',
        permanent: true,
      },
      {
        source: '/models/lexus-es-300h/',
        destination: '/models/lexus-nx-450h-plus-phev',
        permanent: true,
      },
      {
        source: '/models/lexus-ux-300e',
        destination: '/models/lexus-nx-450h-plus-phev',
        permanent: true,
      },
      {
        source: '/models/lexus-ux-300e/',
        destination: '/models/lexus-nx-450h-plus-phev',
        permanent: true,
      },
      {
        source: '/models/seat-1',
        destination: '/models/seat-leon-sportstourer-1-4-e-hybrid',
        permanent: true,
      },
      {
        source: '/models/seat-1/',
        destination: '/models/seat-leon-sportstourer-1-4-e-hybrid',
        permanent: true,
      },
      // Silinen uyumsuz karşılaştırma slug'ları için 301 yönlendirmeleri (SEO 404 koruması)
      {
        source: '/compare/peugeot-508-phev-vs-audi-a3-sportback-phev',
        destination: '/compare/',
        permanent: true,
      },
      {
        source: '/compare/peugeot-508-phev-vs-audi-a3-sportback-phev/',
        destination: '/compare/',
        permanent: true,
      },
      {
        source: '/compare/renault-rafale-phev-vs-renault-captur-e-tech-phev',
        destination: '/compare/',
        permanent: true,
      },
      {
        source: '/compare/renault-rafale-phev-vs-renault-captur-e-tech-phev/',
        destination: '/compare/',
        permanent: true,
      },
      {
        source: '/compare/jeep-wrangler-4xe-rubicon-phev-vs-jeep-compass-4xe-240hp-phev',
        destination: '/compare/',
        permanent: true,
      },
      {
        source: '/compare/jeep-wrangler-4xe-rubicon-phev-vs-jeep-compass-4xe-240hp-phev/',
        destination: '/compare/',
        permanent: true,
      },
      {
        source: '/compare/land-rover-defender-110-phev-vs-land-rover-discovery-sport-phev',
        destination: '/compare/',
        permanent: true,
      },
      {
        source: '/compare/land-rover-defender-110-phev-vs-land-rover-discovery-sport-phev/',
        destination: '/compare/',
        permanent: true,
      },
      {
        source: '/compare/peugeot-508-phev-vs-peugeot-308-phev',
        destination: '/compare/',
        permanent: true,
      },
      {
        source: '/compare/peugeot-508-phev-vs-peugeot-308-phev/',
        destination: '/compare/',
        permanent: true,
      },
      {
        source: '/compare/renault-rafale-phev-vs-mg-hs-ii-1-5t',
        destination: '/compare/',
        permanent: true,
      },
      {
        source: '/compare/renault-rafale-phev-vs-mg-hs-ii-1-5t/',
        destination: '/compare/',
        permanent: true,
      },
      // Sitemap ve robots.txt trailing slash redirect'lerini önle
      {
        source: '/sitemap.xml/',
        destination: '/sitemap.xml',
        permanent: true,
      },
      {
        source: '/robots.txt/',
        destination: '/robots.txt',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
      // Dil bazlı redirects - ana sayfaya yönlendir
      {
        source: '/pl',
        destination: '/',
        permanent: true,
      },
      {
        source: '/de',
        destination: '/',
        permanent: true,
      },
      {
        source: '/tr',
        destination: '/',
        permanent: true,
      },
      {
        source: '/en',
        destination: '/',
        permanent: true,
      },
      // FAQ: Old Turkish slugs → New English slugs (301 permanent)
      {
        source: '/faq/phev-nedir-nasil-calisir',
        destination: '/faq/what-is-phev-how-it-works',
        permanent: true,
      },
      {
        source: '/faq/phev-nedir-nasil-calisir/',
        destination: '/faq/what-is-phev-how-it-works/',
        permanent: true,
      },
      {
        source: '/faq/phev-bev-farki-nedir',
        destination: '/faq/phev-vs-bev-differences',
        permanent: true,
      },
      {
        source: '/faq/phev-bev-farki-nedir/',
        destination: '/faq/phev-vs-bev-differences/',
        permanent: true,
      },
      {
        source: '/faq/phev-avantajlari-nelerdir',
        destination: '/faq/phev-benefits-and-advantages',
        permanent: true,
      },
      {
        source: '/faq/phev-avantajlari-nelerdir/',
        destination: '/faq/phev-benefits-and-advantages/',
        permanent: true,
      },
      {
        source: '/faq/phev-satin-alma-rehberi',
        destination: '/faq/phev-buying-guide',
        permanent: true,
      },
      {
        source: '/faq/phev-satin-alma-rehberi/',
        destination: '/faq/phev-buying-guide/',
        permanent: true,
      },
      {
        source: '/faq/phev-fiyat-araligi-nedir',
        destination: '/faq/phev-price-ranges',
        permanent: true,
      },
      {
        source: '/faq/phev-fiyat-araligi-nedir/',
        destination: '/faq/phev-price-ranges/',
        permanent: true,
      },
      {
        source: '/faq/phev-menzil-hesaplama-nasil',
        destination: '/faq/phev-range-wltp-calculation',
        permanent: true,
      },
      {
        source: '/faq/phev-menzil-hesaplama-nasil/',
        destination: '/faq/phev-range-wltp-calculation/',
        permanent: true,
      },
      {
        source: '/faq/phev-sarj-sureleri-ne-kadar',
        destination: '/faq/phev-charging-times-ac-vs-dc',
        permanent: true,
      },
      {
        source: '/faq/phev-sarj-sureleri-ne-kadar/',
        destination: '/faq/phev-charging-times-ac-vs-dc/',
        permanent: true,
      },
      {
        source: '/faq/phev-batarya-omru-ne-kadar',
        destination: '/faq/phev-battery-life-degradation',
        permanent: true,
      },
      {
        source: '/faq/phev-batarya-omru-ne-kadar/',
        destination: '/faq/phev-battery-life-degradation/',
        permanent: true,
      },
      {
        source: '/faq/phev-sarj-tipleri-nelerdir',
        destination: '/faq/phev-charging-types-connectors',
        permanent: true,
      },
      {
        source: '/faq/phev-sarj-tipleri-nelerdir/',
        destination: '/faq/phev-charging-types-connectors/',
        permanent: true,
      },
      {
        source: '/faq/ev-phev-sarj-cihazi-gerekli-mi',
        destination: '/faq/phev-home-charging-wallbox-vs-outlet',
        permanent: true,
      },
      {
        source: '/faq/ev-phev-sarj-cihazi-gerekli-mi/',
        destination: '/faq/phev-home-charging-wallbox-vs-outlet/',
        permanent: true,
      },
      {
        source: '/faq/phev-sarj-istasyonu-nasil-bulunur',
        destination: '/faq/phev-find-charging-stations',
        permanent: true,
      },
      {
        source: '/faq/phev-sarj-istasyonu-nasil-bulunur/',
        destination: '/faq/phev-find-charging-stations/',
        permanent: true,
      },
      {
        source: '/faq/phev-bakim-maliyeti-nedir',
        destination: '/faq/phev-maintenance-costs',
        permanent: true,
      },
      {
        source: '/faq/phev-bakim-maliyeti-nedir/',
        destination: '/faq/phev-maintenance-costs/',
        permanent: true,
      },
      // FAQ: Deleted pages → /faq (301 permanent)
      {
        source: '/faq/phev-tesvikler-hangi-ulkelerde',
        destination: '/faq',
        permanent: true,
      },
      {
        source: '/faq/phev-tesvikler-hangi-ulkelerde/',
        destination: '/faq/',
        permanent: true,
      },
      {
        source: '/faq/phev-garanti-suresi-ne-kadar',
        destination: '/faq',
        permanent: true,
      },
      {
        source: '/faq/phev-garanti-suresi-ne-kadar/',
        destination: '/faq/',
        permanent: true,
      },
      {
        source: '/faq/phev-servis-aglari-yeterli-mi',
        destination: '/faq',
        permanent: true,
      },
      {
        source: '/faq/phev-servis-aglari-yeterli-mi/',
        destination: '/faq/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
