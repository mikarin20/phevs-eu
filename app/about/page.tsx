import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | PHEVs.eu',
  description: 'Learn about PHEVs.eu - Europe\'s most comprehensive plug-in hybrid vehicle comparison platform. Our mission, team, and commitment to helping you find the perfect PHEV.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-8">About PHEVs.eu</h1>
          
          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Our Mission</h2>
              <p className="text-slate-700 mb-4">
                At PHEVs.eu, we believe that the future of transportation is electric, and plug-in hybrid electric vehicles (PHEVs) are the perfect bridge between traditional combustion engines and fully electric vehicles. Our mission is to make PHEV research and comparison as simple and comprehensive as possible.
              </p>
              <p className="text-slate-700">
                We provide detailed, accurate, and up-to-date information about PHEVs available in Europe, helping consumers make informed decisions about their next vehicle purchase.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">What We Do</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-slate-800 mb-2">Comprehensive Comparisons</h3>
                  <p className="text-slate-700 text-sm">
                    Compare 87+ PHEV models from 28+ brands with detailed specifications, pricing, and performance data.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-slate-800 mb-2">Range Calculator</h3>
                  <p className="text-slate-700 text-sm">
                    Advanced range simulation tool that considers weather, driving conditions, and usage patterns.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-slate-800 mb-2">Real-World Data</h3>
                  <p className="text-slate-700 text-sm">
                    WLTP testing results, Euro NCAP safety ratings, and verified manufacturer specifications.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-slate-800 mb-2">Market Intelligence</h3>
                  <p className="text-slate-700 text-sm">
                    Up-to-date pricing information and availability across European markets.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Why PHEVs?</h2>
              <p className="text-slate-700 mb-4">
                Plug-in hybrid electric vehicles offer the best of both worlds:
              </p>
              <ul className="list-disc pl-6 text-slate-700 mb-4">
                <li><strong>Zero-emission driving</strong> for daily commutes and short trips</li>
                <li><strong>Extended range</strong> with gasoline backup for longer journeys</li>
                <li><strong>Lower operating costs</strong> compared to traditional vehicles</li>
                <li><strong>Government incentives</strong> and tax benefits in many countries</li>
                <li><strong>Reduced environmental impact</strong> while maintaining convenience</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Our Data Sources</h2>
              <p className="text-slate-700 mb-4">
                We ensure accuracy by sourcing data from multiple reliable sources:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">EV-Database</h4>
                  <p className="text-blue-700 text-sm">Comprehensive EV specifications and testing data</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Euro NCAP</h4>
                  <p className="text-green-700 text-sm">Official safety ratings and crash test results</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Manufacturers</h4>
                  <p className="text-purple-700 text-sm">Direct specifications from vehicle manufacturers</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Our Commitment</h2>
              <div className="bg-slate-50 p-6 rounded-lg">
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3">✓</span>
                    <span><strong>Accuracy:</strong> We verify all data from multiple sources and update regularly</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3">✓</span>
                    <span><strong>Transparency:</strong> We clearly indicate data sources and update dates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3">✓</span>
                    <span><strong>Independence:</strong> We are not affiliated with any vehicle manufacturer</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3">✓</span>
                    <span><strong>Privacy:</strong> We respect your privacy and protect your personal data</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Contact Us</h2>
              <p className="text-slate-700 mb-4">
                Have questions, suggestions, or found an error? We'd love to hear from you!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-800 mb-2">General Inquiries</h4>
                  <p className="text-slate-700 text-sm mb-2">info@phevs.eu</p>
                  <p className="text-slate-600 text-xs">For general questions and feedback</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-800 mb-2">Data Corrections</h4>
                  <p className="text-slate-700 text-sm mb-2">data@phevs.eu</p>
                  <p className="text-slate-600 text-xs">Report errors or outdated information</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-800 mb-2">Partnerships</h4>
                  <p className="text-slate-700 text-sm mb-2">partnerships@phevs.eu</p>
                  <p className="text-slate-600 text-xs">Business and collaboration opportunities</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-800 mb-2">Press & Media</h4>
                  <p className="text-slate-700 text-sm mb-2">press@phevs.eu</p>
                  <p className="text-slate-600 text-xs">Media inquiries and press releases</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Join Our Community</h2>
              <p className="text-slate-700 mb-4">
                Stay updated with the latest PHEV news, reviews, and market insights:
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="https://twitter.com/phevs_eu" 
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center"
                >
                  Follow us on Twitter
                </a>
                <a 
                  href="https://linkedin.com/company/phevs-eu" 
                  className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-center"
                >
                  Connect on LinkedIn
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
