export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-200 dark:bg-slate-900 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            Last updated: October 18, 2025
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
          <p className="mb-4">
            We collect information you provide directly to us, such as when you use our comparison tools, 
            save favorites, or contact us. This may include:
          </p>
          <ul className="list-disc list-inside space-y-1 mb-6">
            <li>Search queries and filter preferences</li>
            <li>Favorited vehicles</li>
            <li>Contact information when you reach out to us</li>
            <li>Usage analytics to improve our service</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
          <p className="mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc list-inside space-y-1 mb-6">
            <li>Provide and improve our PHEV comparison services</li>
            <li>Remember your preferences and settings</li>
            <li>Respond to your inquiries and support requests</li>
            <li>Analyze usage patterns to enhance user experience</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Cookies and Local Storage</h2>
          <p className="mb-4">
            We use cookies and local storage to remember your preferences, such as:
          </p>
          <ul className="list-disc list-inside space-y-1 mb-6">
            <li>Selected filters and search terms</li>
            <li>Favorited vehicles</li>
            <li>Theme preferences (light/dark mode)</li>
            <li>Language settings</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Third-Party Services</h2>
          <p className="mb-4">
            We use Google AdSense to display advertisements. Google may use cookies to serve ads 
            based on your visits to this site and other sites on the Internet. You can opt out of 
            personalized advertising by visiting Google's Ad Settings.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
          <p className="mb-4">
            We implement appropriate security measures to protect your personal information against 
            unauthorized access, alteration, disclosure, or destruction.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="text-sm">
            Email: privacy@phevs.eu
          </p>
        </div>
      </div>
    </div>
  )
}
