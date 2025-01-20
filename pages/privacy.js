import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-4">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-gray-600">
                At KleinanzeigenGPT, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, and protect your personal information when you use our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              <p className="text-gray-600">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-600">
                <li>Account information (email, password)</li>
                <li>Usage data and preferences</li>
                <li>Communication data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-600">
                We use the collected information to:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-600">
                <li>Provide and improve our services</li>
                <li>Communicate with you</li>
                <li>Analyze usage patterns</li>
                <li>Ensure security of our platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Contact Information</h2>
              <p className="text-gray-600">
                If you have any questions about this Privacy Policy, please contact us at:<br />
                Email: privacy@kleinanzeigengpt.com<br />
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