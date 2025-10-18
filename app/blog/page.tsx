export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-200 dark:bg-slate-900 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">PHEV Blog</h1>
        
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <p className="text-xl mb-6">
            Stay updated with the latest news, reviews, and insights about plug-in hybrid electric vehicles in Europe.
          </p>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-2">Coming Soon</h2>
            <p>
              We're working on bringing you comprehensive PHEV content including:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>In-depth vehicle reviews and comparisons</li>
              <li>Latest PHEV news and industry updates</li>
              <li>Charging infrastructure guides</li>
              <li>Real-world driving experiences</li>
              <li>Environmental impact analysis</li>
            </ul>
          </div>
          
          <h2 className="text-3xl font-semibold mt-8 mb-4">Why Follow Our Blog?</h2>
          <p className="mb-4">
            Our blog provides expert insights, practical advice, and the latest information 
            to help you make informed decisions about plug-in hybrid vehicles.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Expert Reviews</h3>
              <p>Detailed analysis of PHEV models with real-world testing and comparisons.</p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Industry News</h3>
              <p>Latest developments in the PHEV market and electric vehicle technology.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
