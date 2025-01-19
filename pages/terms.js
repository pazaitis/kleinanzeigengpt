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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-4">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-gray-600">
                These Terms of Service ("Terms") govern your access to and use of KleinanzeigenGPT's website and services 
                ("Service"). Please read these Terms carefully before using the Service. By using the Service, you agree 
                to be bound by these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Service Provider</h2>
              <p className="text-gray-600">
                KleinanzeigenGPT<br />
                Werderstrasse 1<br />
                50672 Köln, Germany<br />
                Email: legal@kleinanzeigengpt.com<br />
                Registered at: Amtsgericht Köln
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Service Description</h2>
              <p className="text-gray-600">
                KleinanzeigenGPT provides an AI-powered analysis service for iPhone listings on Kleinanzeigen. 
                The Service includes automated analysis of listing details, images, and seller information to help 
                users make informed purchasing decisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. User Accounts</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  4.1. You must register for an account to access certain features of the Service.
                </p>
                <p>
                  4.2. You are responsible for maintaining the security of your account credentials.
                </p>
                <p>
                  4.3. You must provide accurate and complete information when creating an account.
                </p>
                <p>
                  4.4. You may not share your account credentials with third parties.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Subscription and Payments</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  5.1. Some features of the Service require a paid subscription.
                </p>
                <p>
                  5.2. Subscription fees are billed in advance on a monthly basis.
                </p>
                <p>
                  5.3. You can cancel your subscription at any time. The cancellation will take effect at the end of 
                  your current billing period.
                </p>
                <p>
                  5.4. We reserve the right to change subscription fees upon reasonable notice.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Acceptable Use</h2>
              <div className="space-y-4 text-gray-600">
                <p>You agree not to:</p>
                <ul className="list-disc pl-5">
                  <li>Use the Service for any illegal purpose</li>
                  <li>Attempt to circumvent any rate-limiting or access restrictions</li>
                  <li>Scrape or bulk download data from the Service</li>
                  <li>Share or resell access to the Service</li>
                  <li>Upload malicious content or attempt to compromise the Service</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
              <p className="text-gray-600">
                All content and software associated with the Service are protected by intellectual property rights. 
                You may not copy, modify, or create derivative works of the Service or its content without our 
                explicit permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  8.1. The Service is provided "as is" without any warranties, express or implied.
                </p>
                <p>
                  8.2. We are not liable for any indirect, incidental, or consequential damages arising from 
                  your use of the Service.
                </p>
                <p>
                  8.3. Our liability is limited to the amount you paid for the Service in the 12 months 
                  preceding the claim.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Data Protection</h2>
              <p className="text-gray-600">
                Our processing of personal data is governed by our Privacy Policy and complies with the EU General 
                Data Protection Regulation (GDPR) and German data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
              <p className="text-gray-600">
                We may modify these Terms at any time. We will notify you of material changes via email or through 
                the Service. Your continued use of the Service after such modifications constitutes acceptance of 
                the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
              <p className="text-gray-600">
                These Terms are governed by the laws of the Federal Republic of Germany. The courts of Köln, 
                Germany shall have exclusive jurisdiction for any disputes arising from or in connection with 
                these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Contact</h2>
              <p className="text-gray-600">
                For questions about these Terms, please contact us at:<br />
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