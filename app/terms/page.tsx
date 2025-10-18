import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | PHEVs.eu',
  description: 'Terms of Service for PHEVs.eu - Rules and guidelines for using our vehicle comparison platform.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-8">Terms of Service</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-sm text-slate-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-700 mb-4">
                By accessing and using PHEVs.eu ("the Website"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">2. Description of Service</h2>
              <p className="text-slate-700 mb-4">
                PHEVs.eu provides a comprehensive platform for comparing plug-in hybrid electric vehicles (PHEVs) from various manufacturers. Our service includes:
              </p>
              <ul className="list-disc pl-6 text-slate-700 mb-4">
                <li>Vehicle comparison tools and specifications</li>
                <li>Pricing information and market data</li>
                <li>Performance metrics and range calculations</li>
                <li>User reviews and ratings</li>
                <li>Educational content about PHEV technology</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">3. User Responsibilities</h2>
              <p className="text-slate-700 mb-4">As a user of our service, you agree to:</p>
              <ul className="list-disc pl-6 text-slate-700 mb-4">
                <li>Provide accurate and truthful information when using our services</li>
                <li>Use the website only for lawful purposes</li>
                <li>Not attempt to gain unauthorized access to our systems</li>
                <li>Respect intellectual property rights</li>
                <li>Not use automated systems to access our content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">4. Data Accuracy and Disclaimers</h2>
              <p className="text-slate-700 mb-4">
                While we strive to provide accurate and up-to-date information, we make no warranties about:
              </p>
              <ul className="list-disc pl-6 text-slate-700 mb-4">
                <li>The accuracy, completeness, or timeliness of vehicle data</li>
                <li>Pricing information, which may vary by location and dealer</li>
                <li>Availability of vehicles or features</li>
                <li>Performance claims made by manufacturers</li>
              </ul>
              <p className="text-slate-700">
                Users should verify all information independently before making purchasing decisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">5. Intellectual Property</h2>
              <p className="text-slate-700 mb-4">
                The content on PHEVs.eu, including but not limited to text, graphics, logos, images, and software, is the property of PHEVs.eu or its content suppliers and is protected by copyright and other intellectual property laws.
              </p>
              <p className="text-slate-700">
                You may not reproduce, distribute, or create derivative works from our content without express written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">6. Limitation of Liability</h2>
              <p className="text-slate-700 mb-4">
                PHEVs.eu shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from:
              </p>
              <ul className="list-disc pl-6 text-slate-700 mb-4">
                <li>Use or inability to use the service</li>
                <li>Unauthorized access to or alteration of your data</li>
                <li>Any other matter relating to the service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">7. Third-Party Links</h2>
              <p className="text-slate-700">
                Our website may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of these external sites. Use them at your own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">8. Privacy Policy</h2>
              <p className="text-slate-700">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the website, to understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">9. Prohibited Uses</h2>
              <p className="text-slate-700 mb-4">You may not use our website:</p>
              <ul className="list-disc pl-6 text-slate-700 mb-4">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">10. Termination</h2>
              <p className="text-slate-700">
                We may terminate or suspend your access to our website immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">11. Governing Law</h2>
              <p className="text-slate-700">
                These Terms shall be interpreted and governed by the laws of [Your Country/Jurisdiction], without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">12. Changes to Terms</h2>
              <p className="text-slate-700">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">13. Contact Information</h2>
              <p className="text-slate-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-slate-700">
                  <strong>Email:</strong> legal@phevs.eu<br />
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
