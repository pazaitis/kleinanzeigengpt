import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-600 mb-4">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-gray-600">
                By accessing or using KleinanzeigenGPT, you agree to be bound by these Terms of Service 
                and all applicable laws and regulations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Use License</h2>
              <p className="text-gray-600">
                We grant you a limited, non-exclusive, non-transferable license to use our service 
                for personal or business purposes in accordance with these terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Service Description</h2>
              <p className="text-gray-600">
                KleinanzeigenGPT provides AI-powered analysis of Kleinanzeigen listings. The service 
                includes:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-600">
                <li>Automated price analysis</li>
                <li>Market trend insights</li>
                <li>Listing recommendations</li>
                <li>Historical data tracking</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. User Obligations</h2>
              <p className="text-gray-600">
                Users must:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-600">
                <li>Provide accurate information</li>
                <li>Maintain account security</li>
                <li>Comply with all applicable laws</li>
                <li>Not misuse the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Contact Information</h2>
              <p className="text-gray-600">
                For any questions regarding these terms, please contact us at:<br />
                Email: legal@kleinanzeigengpt.com<br />
                Postal address: Werderstrasse 1, 50672 Köln, Germany
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 