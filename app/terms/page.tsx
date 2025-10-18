export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-200 dark:bg-slate-900 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            Last updated: October 18, 2025
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using PHEVs.eu, you accept and agree to be bound by the terms 
            and provision of this agreement. If you do not agree to abide by the above, 
            please do not use this service.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Use License</h2>
          <p className="mb-4">
            Permission is granted to temporarily download one copy of the materials on PHEVs.eu 
            for personal, non-commercial transitory viewing only. This is the grant of a license, 
            not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc list-inside space-y-1 mb-6">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained on the website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Disclaimer</h2>
          <p className="mb-4">
            The materials on PHEVs.eu are provided on an 'as is' basis. PHEVs.eu makes no warranties, 
            expressed or implied, and hereby disclaims and negates all other warranties including 
            without limitation, implied warranties or conditions of merchantability, fitness for a 
            particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Accuracy of Information</h2>
          <p className="mb-4">
            While we strive to provide accurate and up-to-date information about PHEV specifications, 
            pricing, and availability, we cannot guarantee the accuracy of all information. 
            Vehicle specifications and pricing may vary by region and are subject to change without notice.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Limitations</h2>
          <p className="mb-4">
            In no event shall PHEVs.eu or its suppliers be liable for any damages (including, without 
            limitation, damages for loss of data or profit, or due to business interruption) arising 
            out of the use or inability to use the materials on PHEVs.eu, even if PHEVs.eu or an 
            authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Revisions</h2>
          <p className="mb-4">
            PHEVs.eu may revise these terms of service for its website at any time without notice. 
            By using this website, you are agreeing to be bound by the then current version of 
            these terms of service.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Information</h2>
          <p className="mb-4">
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <p className="text-sm">
            Email: legal@phevs.eu
          </p>
        </div>
      </div>
    </div>
  )
}
