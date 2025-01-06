import { SparklesIcon } from '@heroicons/react/24/outline'
import AnalysisProgress from './AnalysisProgress'
import Link from 'next/link'
import Logo from './Logo'

export default function AnalysisView({ 
  listingUrl, 
  setListingUrl, 
  isAnalyzing,
  handleAnalyze,
  analysisStep,
  listingImage,
  listingDetails,
  onClose,
  user,
  handleLogout,
  router,
  setShowEmailAuth
}) {
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Keep original navbar */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <Logo className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-semibold">KleinanzeigenGPT</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
              <Link href="/api-docs" className="text-gray-600 hover:text-gray-900">
                API
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                About us
              </Link>
              {user ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowEmailAuth(true)}
                  className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Login / Sign-Up
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Analysis Input Bar */}
      <div className="sticky top-0 bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex-1">
              <input
                type="text"
                value={listingUrl}
                onChange={(e) => setListingUrl(e.target.value)}
                placeholder="https://www.kleinanzeigen.de/s-anzeige/iphone-12-pro-128-gb/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isAnalyzing}
              />
            </div>
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !listingUrl}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SparklesIcon className="h-5 w-5" />
              <span>{isAnalyzing ? 'Analyzing...' : 'Analyze'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnalysisProgress 
          currentStep={analysisStep}
          isComplete={analysisStep === 4}
          listingImage={listingImage}
          listingDetails={listingDetails}
        />
      </div>
    </div>
  )
} 