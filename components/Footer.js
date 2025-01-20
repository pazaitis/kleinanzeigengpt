import Link from 'next/link'
import Logo from './Logo'
import { useCookieSettings } from '../contexts/CookieContext'

export default function Footer() {
  const { openCookieSettings } = useCookieSettings()

  return (
    <footer className="py-12 bg-gradient-to-b from-[#635bff]/[0.05] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo className="h-8 w-8 text-[#635bff]" />
            <p className="mt-4 text-[#425466]">
              AI-powered iPhone listing analysis for safer purchases.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-gray-600 hover:text-gray-900">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-[#425466] hover:text-[#0a2540]">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
              <li>
                <button
                  onClick={openCookieSettings}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Cookie Settings
                </button>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-gray-600 hover:text-gray-900">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-gray-600">
          <p>© {new Date().getFullYear()} KleinanzeigenGPT. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 