import { useEffect, useState } from 'react'
import { SparklesIcon } from '@heroicons/react/24/outline'
import AnalysisProgress from './AnalysisProgress'
import Link from 'next/link'
import Logo from './Logo'
import { URL_PREFIX } from '../utils/constants'
import { nanoid } from 'nanoid'
import ShareButton from './ShareButton'

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
  setShowEmailAuth,
  analysisId
}) {
  // Prevent background scrolling when analysis view is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  useEffect(() => {
    // Update URL when analysis starts
    if (isAnalyzing && analysisId) {
      window.history.pushState({}, '', `/analysis/${analysisId}`)
    }
  }, [isAnalyzing, analysisId])

  const generateAnalysisId = () => {
    return nanoid(10) // Generates a unique 10-character ID
  }

  const shareUrl = `${window.location.origin}/analysis/${analysisId}`;

  // Add originalUrl state to track the initially analyzed URL
  const [originalUrl, setOriginalUrl] = useState(listingUrl);

  useEffect(() => {
    // Set the original URL when analysis view opens
    setOriginalUrl(listingUrl);
  }, []);

  // Function to check if analyze should be enabled
  const canAnalyze = () => {
    return listingUrl !== originalUrl && listingUrl.trim() !== '';
  };

  return (
    <>
      {/* Overlay with fade-in */}
      <div 
        className="fade-in fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => {
          setShowAnalysisView(false)
        }}
      />

      {/* Analysis Input Bar and Content Container */}
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto transform transition-transform duration-300 translate-y-0 slide-in">
        {/* Header Bar */}
        <div className="sticky top-0 bg-white border-b shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              {/* Logo Section */}
              <div className="flex items-center">
                <Link href="/" className="hover:opacity-80 transition-opacity">
                  <Logo className="h-8 w-8 text-blue-600" />
                </Link>
              </div>

              {/* Close Button and Input Section */}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex-1 flex items-center space-x-4">
                <input
                  type="text"
                  value={listingUrl}
                  onChange={(e) => setListingUrl(e.target.value)}
                  className="w-full h-10 px-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter Kleinanzeigen URL"
                  disabled={isAnalyzing}
                />
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !canAnalyze()}
                  className="h-10 bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SparklesIcon className="h-5 w-5" />
                  <span>{isAnalyzing ? 'Analyzing...' : 'Analyze'}</span>
                </button>
              </div>

              {/* User Settings */}
              <div className="flex items-center">
                {user ? (
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {user.email?.[0].toUpperCase()}
                      </span>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowEmailAuth(true)}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    <svg 
                      className="h-5 w-5 text-gray-500" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                      />
                    </svg>
                  </button>
                )}
              </div>

              <ShareButton 
                url={shareUrl} 
                listingDetails={listingDetails}
              />
            </div>
          </div>
        </div>

        {/* Analysis Content */}
        <div className="w-full px-4 py-8">
          <AnalysisProgress 
            currentStep={analysisStep}
            isComplete={analysisStep === 4}
            listingImage={listingImage}
            listingDetails={listingDetails}
          />
        </div>
      </div>
    </>
  )
} 