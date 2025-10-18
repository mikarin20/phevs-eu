import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | PHEVs.eu',
  description: 'Privacy Policy for PHEVs.eu - How we collect, use, and protect your personal information.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-sm text-slate-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">1. Introduction</h2>
              <p className="text-slate-700 mb-4">
                PHEVs.eu ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <strong>phevs.eu</strong>.
              </p>
              <p className="text-slate-700">
                By using our website, you consent to the data practices described in this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-lg font-medium text-slate-700 mb-3">2.1 Personal Information</h3>
              <p className="text-slate-700 mb-4">
                We may collect personal information that you voluntarily provide to us, including:
              </p>
              <ul className="list-disc pl-6 text-slate-700 mb-4">
                <li>Name and email address (when you contact us or subscribe to our newsletter)</li>
                <li>Vehicle preferences and comparison data</li>
                <li>Feedback and suggestions</li>
              </ul>

              <h3 className="text-lg font-medium text-slate-700 mb-3">2.2 Automatically Collected Information</h3>
              <p className="text-slate-700 mb-4">
                We automatically collect certain information when you visit our website:
              </p>
              <ul className="list-disc pl-6 text-slate-700 mb-4">
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referring website</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">3. How We Use Your Information</h2>
              <p className="text-slate-700 mb-4">We use the collected information for:</p>
              <ul className="list-disc pl-6 text-slate-700 mb-4">
                <li>Providing and improving our vehicle comparison services</li>
                <li>Personalizing your experience on our website</li>
                <li>Responding to your inquiries and feedback</li>
                <li>Analyzing website usage and performance</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">4. Cookies and Tracking Technologies</h2>
              <p className="text-slate-700 mb-4">
                We use cookies and similar tracking technologies to enhance your browsing experience:
              </p>
              <ul className="list-disc pl-6 text-slate-700 mb-4">
                <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
              <p className="text-slate-700">
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">5. Third-Party Services</h2>
              <p className="text-slate-700 mb-4">
                We may use third-party services that collect information about you:
              </p>
              <ul className="list-disc pl-6 text-slate-700 mb-4">
                <li><strong>Google Analytics:</strong> Website traffic analysis</li>
                <li><strong>Google AdSense:</strong> Advertising services (when implemented)</li>
                <li><strong>CDN Services:</strong> Content delivery and performance optimization</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">6. Data Security</h2>
              <p className="text-slate-700 mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">7. Your Rights (GDPR)</h2>
              <p className="text-slate-700 mb-4">
                If you are a resident of the European Economic Area, you have certain rights regarding your personal data:
              </p>
              <ul className="list-disc pl-6 text-slate-700 mb-4">
                <li>Right to access your personal data</li>
                <li>Right to rectify inaccurate data</li>
                <li>Right to erasure ("right to be forgotten")</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">8. Data Retention</h2>
              <p className="text-slate-700">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">9. Children's Privacy</h2>
              <p className="text-slate-700">
                Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-slate-700">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">11. Contact Us</h2>
              <p className="text-slate-700 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-slate-700">
                  <strong>Email:</strong> privacy@phevs.eu<br />
                  <strong>Website:</strong> https://phevs.eu<br />
                  <strong>Address:</strong> [Your Business Address]
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
