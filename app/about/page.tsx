export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-200 dark:bg-slate-900 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">About PHEVs.eu</h1>
        
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <p className="text-xl mb-6">
            Welcome to PHEVs.eu, Europe's most comprehensive platform for plug-in hybrid electric vehicles. 
            Our mission is to help you find the perfect PHEV that matches your lifestyle and driving needs.
          </p>
          
          <h2 className="text-3xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p className="mb-4">
            We believe that plug-in hybrid electric vehicles represent the perfect bridge between 
            traditional combustion engines and fully electric vehicles. Our platform provides 
            detailed, accurate, and easy-to-understand information about PHEV models available in Europe.
          </p>
          
          <h2 className="text-3xl font-semibold mt-8 mb-4">What We Offer</h2>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>Comprehensive database of 87+ PHEV models from 28+ brands</li>
            <li>Detailed specifications including electric range, battery capacity, and performance data</li>
            <li>Interactive comparison tools to help you make informed decisions</li>
            <li>Real-world range simulator based on driving conditions</li>
            <li>Up-to-date pricing information for the European market</li>
            <li>Euro NCAP safety ratings and environmental impact data</li>
          </ul>
          
          <h2 className="text-3xl font-semibold mt-8 mb-4">Why PHEVs?</h2>
          <p className="mb-4">
            Plug-in hybrid vehicles offer the best of both worlds: electric driving for daily commutes 
            and the flexibility of a combustion engine for longer journeys. They're perfect for drivers 
            who want to reduce their environmental impact while maintaining the convenience of traditional fueling.
          </p>
          
          <h2 className="text-3xl font-semibold mt-8 mb-4">Our Commitment</h2>
          <p className="mb-4">
            We are committed to providing accurate, unbiased information to help you make the best 
            decision for your needs. Our data is regularly updated and verified against manufacturer 
            specifications and official testing results.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
            <p className="mb-2">
              Have questions or suggestions? We'd love to hear from you!
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Email: info@phevs.eu
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
