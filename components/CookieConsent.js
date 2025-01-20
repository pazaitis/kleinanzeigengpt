import { useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import CookieSettings from './CookieSettings'
import { useCookieSettings } from '../contexts/CookieContext'

export default function CookieConsent() {
  const { showBanner, setShowBanner, showSettings, setShowSettings } = useCookieSettings()

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowBanner(true)
    }
  }, [setShowBanner])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }))
    setShowBanner(false)
  }

  const handleReject = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true, // Required cookies are always accepted
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }))
    setShowBanner(false)
  }

  const handleCustomize = () => {
    setShowBanner(false)
    setShowSettings(true)
  }

  const handleCloseSettings = () => {
    setShowSettings(false)
  }

  return (
    <>
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 border-t">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="mb-4 md:mb-0 pr-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  We value your privacy
                </h3>
                <p className="text-gray-600 text-sm">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                  By clicking "Accept All", you consent to our use of cookies. Read our{' '}
                  <a href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a href="/cookie-policy" className="text-blue-600 hover:underline">
                    Cookie Policy
                  </a>{' '}
                  to learn more.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCustomize}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Customize
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Reject All
                </button>
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CookieSettings 
        isOpen={showSettings} 
        onClose={handleCloseSettings}
      />
    </>
  )
} 