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
                We at KleinanzeigenGPT ("we", "us", "our") respect your privacy and are committed to protecting your personal data. 
                This privacy policy informs you about how we handle your personal data when you visit our website or use our services, 
                and tells you about your privacy rights under the EU General Data Protection Regulation (GDPR) and German Federal Data 
                Protection Act (BDSG).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Controller Information</h2>
              <p className="text-gray-600">
                Controller responsible for data processing:<br />
                KleinanzeigenGPT<br />
                Werderstrasse 1<br />
                50672 Köln, Germany<br />
                Email: privacy@kleinanzeigengpt.com
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Data We Collect</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">3.1 Data you provide to us:</h3>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>Email address (when registering or contacting us)</li>
                  <li>Name (when provided in contact forms)</li>
                  <li>Account information (if you create an account)</li>
                  <li>Communication data (when you contact us)</li>
                  <li>Payment information (handled by our payment processor)</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-900">3.2 Data we automatically collect:</h3>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Date and time of access</li>
                  <li>URLs analyzed through our service</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Purpose and Legal Basis</h2>
              <div className="space-y-4 text-gray-600">
                <p>We process your data for the following purposes:</p>
                <ul className="list-disc pl-5">
                  <li>To provide our services (Art. 6(1)(b) GDPR - Contract)</li>
                  <li>To improve our services (Art. 6(1)(f) GDPR - Legitimate interests)</li>
                  <li>To communicate with you (Art. 6(1)(b) GDPR - Contract)</li>
                  <li>To comply with legal obligations (Art. 6(1)(c) GDPR)</li>
                  <li>For marketing purposes, with your consent (Art. 6(1)(a) GDPR)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Recipients</h2>
              <p className="text-gray-600">
                We only share your personal data with:</p>
              <ul className="list-disc pl-5 text-gray-600">
                <li>Service providers necessary for our operations (e.g., hosting, payment processing)</li>
                <li>Public authorities when legally required</li>
                <li>Supabase (database provider)</li>
                <li>Stripe (payment processor)</li>
                <li>Anthropic (AI service provider)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Data Storage Period</h2>
              <p className="text-gray-600">
                We store your data only as long as necessary for the purposes for which it was collected, 
                or as required by law. Account data is stored until account deletion. Communication data 
                is stored for up to 3 years after the last contact.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
              <p className="text-gray-600 mb-4">Under the GDPR, you have the following rights:</p>
              <ul className="list-disc pl-5 text-gray-600">
                <li>Right to access (Art. 15 GDPR)</li>
                <li>Right to rectification (Art. 16 GDPR)</li>
                <li>Right to erasure (Art. 17 GDPR)</li>
                <li>Right to restriction of processing (Art. 18 GDPR)</li>
                <li>Right to data portability (Art. 20 GDPR)</li>
                <li>Right to object (Art. 21 GDPR)</li>
                <li>Right to withdraw consent (Art. 7(3) GDPR)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Data Security</h2>
              <p className="text-gray-600">
                We implement appropriate technical and organizational measures to protect your personal data 
                against accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Complaints</h2>
              <p className="text-gray-600">
                You have the right to lodge a complaint with a supervisory authority. The competent authority 
                for us is the State Commissioner for Data Protection and Freedom of Information North Rhine-Westphalia 
                (Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
              <p className="text-gray-600">
                We may update this privacy policy from time to time. The current version will always be 
                available on our website. Significant changes will be communicated to users directly 
                when possible.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Contact</h2>
              <p className="text-gray-600">
                For any questions about this privacy policy or our data protection practices, please contact 
                our data protection team at:<br />
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