export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-200 dark:bg-slate-900 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            Last updated: October 18, 2025
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">What Are Cookies?</h2>
          <p className="mb-4">
            Cookies are small text files that are stored on your device when you visit our website. 
            They help us provide you with a better experience by remembering your preferences and 
            understanding how you use our site.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Cookies</h2>
          <p className="mb-4">
            We use cookies for the following purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly</li>
            <li><strong>Preference Cookies:</strong> Remember your settings like theme, language, and filters</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
            <li><strong>Advertising Cookies:</strong> Used by Google AdSense to show relevant ads</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Types of Cookies We Use</h2>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-2">Essential Cookies</h3>
            <p className="mb-2">
              These cookies are necessary for the website to function and cannot be switched off. 
              They are usually only set in response to actions made by you which amount to a request for services.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Examples: User preferences, filter settings, favorite vehicles
            </p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-2">Analytics Cookies</h3>
            <p className="mb-2">
              These cookies allow us to count visits and traffic sources so we can measure and improve 
              the performance of our site. They help us to know which pages are the most and least popular.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Examples: Google Analytics, page view tracking
            </p>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-2">Advertising Cookies</h3>
            <p className="mb-2">
              These cookies are used to make advertising messages more relevant to you. They perform 
              functions like preventing the same ad from continuously reappearing and ensuring that ads 
              are properly displayed.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Examples: Google AdSense, personalized advertising
            </p>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Managing Your Cookie Preferences</h2>
          <p className="mb-4">
            You can control and/or delete cookies as you wish. You can delete all cookies that are 
            already on your computer and you can set most browsers to prevent them from being placed. 
            If you do this, however, you may have to manually adjust some preferences every time you visit a site.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Browser Settings</h3>
          <p className="mb-4">
            Most web browsers allow you to control cookies through their settings preferences. 
            You can set your browser to refuse cookies or delete certain cookies.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Third-Party Cookies</h3>
          <p className="mb-4">
            Some cookies on our site are set by third-party services. We use Google AdSense for advertising, 
            which may set cookies. You can opt out of personalized advertising by visiting 
            <a href="https://www.google.com/settings/ads" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
              Google's Ad Settings
            </a>.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Updates to This Policy</h2>
          <p className="mb-4">
            We may update this Cookie Policy from time to time. We will notify you of any changes by 
            posting the new Cookie Policy on this page and updating the "Last updated" date.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about our use of cookies, please contact us at:
          </p>
          <p className="text-sm">
            Email: privacy@phevs.eu
          </p>
        </div>
      </div>
    </div>
  )
}
