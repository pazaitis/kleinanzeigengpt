import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCookieSettings } from '../contexts/CookieContext'

export default function CookiePolicy() {
  const { openCookieSettings } = useCookieSettings()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
          
          <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. About Cookies</h2>
              <p className="text-gray-600 mb-4">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-gray-600">
                This Cookie Policy explains how KleinanzeigenGPT uses cookies and similar technologies 
                to recognize you when you visit our website. It explains what these technologies are 
                and why we use them, as well as your rights to control our use of them.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. What are cookies?</h2>
              <p className="text-gray-600">
                Cookies are small data files that are placed on your computer or mobile device when 
                you visit a website. They are widely used by website owners in order to make their 
                websites work, or to work more efficiently, as well as to provide reporting information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">3.1 Essential Cookies</h3>
                  <p className="text-gray-600">
                    These cookies are strictly necessary to provide you with services available through our 
                    website and to use some of its features, such as access to secure areas. Because these 
                    cookies are strictly necessary to deliver the website, you cannot refuse them without 
                    impacting how our website functions.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">3.2 Analytics Cookies</h3>
                  <p className="text-gray-600">
                    These cookies allow us to count visits and traffic sources so we can measure and improve 
                    the performance of our site. They help us to know which pages are the most and least 
                    popular and see how visitors move around the site.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">3.3 Marketing Cookies</h3>
                  <p className="text-gray-600">
                    These cookies may be set through our site by our advertising partners. They may be used 
                    by those companies to build a profile of your interests and show you relevant adverts 
                    on other sites.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Cookie Control</h2>
              <p className="text-gray-600">
                You can set or amend your web browser controls to accept or refuse cookies. If you choose 
                to reject cookies, you may still use our website though your access to some functionality 
                may be restricted. You can also control your cookie preferences through our{' '}
                <button 
                  onClick={openCookieSettings}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Cookie Settings
                </button>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Policy Updates</h2>
              <p className="text-gray-600">
                We may update this Cookie Policy from time to time in order to reflect changes to the 
                cookies we use or for other operational, legal, or regulatory reasons. Please re-visit 
                this Cookie Policy regularly to stay informed about our use of cookies and related 
                technologies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Contact Information</h2>
              <p className="text-gray-600">
                If you have any questions about our use of cookies or other technologies, please contact us at:<br />
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