import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import Logo from '../components/Logo'
import AuthForm from '../components/AuthForm'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { SparklesIcon } from '@heroicons/react/24/outline'
import AuthModal from '../components/AuthModal'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import AnalysisProgress from '../components/AnalysisProgress'
import AnalysisView from '../components/AnalysisView'
import { URL_PREFIX } from '../utils/constants'
import { nanoid } from 'nanoid'
import { ChartBarIcon, ShieldCheckIcon, PhotoIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [showEmailAuth, setShowEmailAuth] = useState(false)
  const [exampleListings, setExampleListings] = useState([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [listingUrl, setListingUrl] = useState('')
  const [listingImage, setListingImage] = useState(null)
  const [listingDetails, setListingDetails] = useState(null)
  const [showAnalysisView, setShowAnalysisView] = useState(false)
  const [currentAnalysisId, setCurrentAnalysisId] = useState(null)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [isRandomLoading, setIsRandomLoading] = useState(false)
  const [lastAnalysisTime, setLastAnalysisTime] = useState(null)
  const COOLDOWN_PERIOD = 60000 // 60 seconds in milliseconds

  useEffect(() => {
    const session = supabase.auth.getSession()
    setUser(session?.user)

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user)
    })

    return () => subscription?.unsubscribe()
  }, [])

  useEffect(() => {
    async function fetchExampleListings() {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          iphone_analysis (
            iphone_model,
            storage_gb,
            rating
          )
        `)
        .not('iphone_analysis', 'is', null)
        .limit(3)
        .order('last_seen', { ascending: false })

      if (!error && data) {
        setExampleListings(data)
      }
    }

    fetchExampleListings()
  }, [])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error logging out:', error)
    router.push('/')
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo: `${window.location.origin}/dashboard`
      },
    })
    if (error) console.error('Error logging in:', error.message)
  }

  const isAnalyzeDisabled = () => {
    if (isAnalyzing || !listingUrl) return true
    if (!lastAnalysisTime) return false
    
    const timeSinceLastAnalysis = Date.now() - lastAnalysisTime
    return timeSinceLastAnalysis < COOLDOWN_PERIOD
  }

  const handleAnalyze = async () => {
    if (isAnalyzeDisabled()) return
    
    const analysisId = nanoid(10)
    setCurrentAnalysisId(analysisId)
    setLastAnalysisTime(Date.now())
    
    setShowAnalysisView(true)
    setIsAnalyzing(true)
    setAnalysisStep(1)
    setListingImage(null)
    setListingDetails(null)

    try {
      const { error } = await supabase
        .from('analyses')
        .insert({
          id: analysisId,
          listing_url: listingUrl,
          user_id: user?.id,
          status: 'processing',
          created_at: new Date().toISOString()
        })

      if (error) throw error

      const response = await fetch('/api/fetch-listing-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: listingUrl, analysisId })
      })

      if (response.ok) {
        const { imageUrl, details } = await response.json()
        if (imageUrl) setListingImage(imageUrl)
        if (details) setListingDetails(details)

        await supabase
          .from('analyses')
          .update({
            image_url: imageUrl,
            details,
            status: 'completed'
          })
          .eq('id', analysisId)
      }

      for (let step = 1; step <= 5; step++) {
        await new Promise(resolve => setTimeout(resolve, 3000))
        setAnalysisStep(step)
      }

      setIsAnalyzing(false)
      
    } catch (error) {
      console.error('Analysis failed:', error)
      await supabase
        .from('analyses')
        .update({ status: 'failed' })
        .eq('id', analysisId)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAnalyze();
    }
  };

  const handleRandomAnalysis = async () => {
    try {
      setIsRandomLoading(true)
      const response = await fetch('/api/get-random-listing')
      if (response.ok) {
        const { url } = await response.json()
        if (url !== listingUrl) {
          await new Promise(resolve => setTimeout(resolve, 1500))
          setListingUrl(url)
        } else {
          handleRandomAnalysis()
        }
      } else {
        console.error('Failed to get random listing')
      }
    } catch (error) {
      console.error('Error getting random listing:', error)
    } finally {
      setIsRandomLoading(false)
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full top-0 bg-white z-30 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <Logo className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-semibold">KleinanzeigenGPT</span>
              </Link>
            </div>

            {/* Mobile menu button - Make sure this is visible */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" />
                )}
              </button>
            </div>

            {/* Desktop menu */}
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

        {/* Mobile menu panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Navigation Links */}
              <Link
                href="/pricing"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/api-docs"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                API
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About us
              </Link>

              {/* Auth Buttons */}
              {user ? (
                <>
                  <button
                    onClick={() => {
                      router.push('/dashboard')
                      setIsMobileMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowEmailAuth(true)
                    setIsMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Login / Sign-Up
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              AI-Powered iPhone Listing Analyzer
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Track and analyze iPhone listings on Kleinanzeigen with advanced AI technology
            </p>
            <div className="flex flex-col items-center space-y-2 max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row w-full sm:space-x-4 space-y-4 sm:space-y-0">
                <div className="flex-1">
                  <div className="relative flex items-center max-w-[800px]">
                    <textarea
                      placeholder="Paste Kleinanzeigen URL here..."
                      className="w-full min-h-[48px] px-4 py-3 text-lg border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 overflow-hidden"
                      value={listingUrl}
                      onChange={(e) => {
                        setListingUrl(e.target.value);
                        if (isInputFocused) {
                          const newHeight = e.target.scrollHeight;
                          e.target.style.height = '48px';
                          e.target.style.height = newHeight + 'px';
                          // Update divider and button height
                          const divider = e.target.nextElementSibling;
                          const button = divider.nextElementSibling;
                          divider.style.height = `${newHeight}px`;
                          button.style.height = `${newHeight}px`;
                        }
                      }}
                      onKeyDown={handleKeyDown}
                      disabled={isAnalyzing || isRandomLoading}
                      rows="1"
                      style={{
                        height: '48px',
                        lineHeight: '24px',
                        whiteSpace: isInputFocused ? 'pre-wrap' : 'nowrap',
                        overflow: isInputFocused ? 'hidden' : 'ellipsis',
                        textOverflow: 'ellipsis'
                      }}
                      onFocus={(e) => {
                        setIsInputFocused(true);
                        e.target.style.whiteSpace = 'pre-wrap';
                        e.target.style.overflow = 'hidden';
                        const newHeight = e.target.scrollHeight;
                        e.target.style.height = newHeight + 'px';
                        // Update divider and button height
                        const divider = e.target.nextElementSibling;
                        const button = divider.nextElementSibling;
                        divider.style.height = `${newHeight}px`;
                        button.style.height = `${newHeight}px`;
                      }}
                      onBlur={(e) => {
                        setIsInputFocused(false);
                        e.target.style.whiteSpace = 'nowrap';
                        e.target.style.overflow = 'hidden';
                        e.target.style.height = '48px';
                        // Reset divider and button height
                        const divider = e.target.nextElementSibling;
                        const button = divider.nextElementSibling;
                        divider.style.height = '48px';
                        button.style.height = '48px';
                      }}
                    />
                    <div className="flex items-center transition-all duration-200" style={{ height: '48px' }}>
                      <div className="h-full w-px bg-gray-300"></div>
                    </div>
                    <button
                      onClick={handleRandomAnalysis}
                      disabled={isAnalyzing || isRandomLoading}
                      className="px-4 bg-white border-t border-r border-b border-gray-300 rounded-r-lg hover:bg-gray-50 transition-all duration-200 inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ height: '48px' }}
                      title="Try a random listing"
                    >
                      <svg 
                        className={`h-5 w-5 text-gray-500 ${isRandomLoading ? 'animate-spin' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Paste the URL of any iPhone listing from kleinanzeigen.de or try with random iPhone
                  </p>
                </div>
                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzeDisabled()}
                  className="h-12 bg-blue-600 text-white px-8 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SparklesIcon className="h-5 w-5" />
                  <span>
                    {isAnalyzing ? 'Analyzing...' : 
                     isAnalyzeDisabled() && lastAnalysisTime ? 
                     `Wait ${Math.ceil((COOLDOWN_PERIOD - (Date.now() - lastAnalysisTime)) / 1000)}s` : 
                     'Analyze'}
                  </span>
                </button>
              </div>

              {/* Analysis Progress Section */}
              {isAnalyzing && (
                <div className="w-full mt-8 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <AnalysisProgress 
                    currentStep={analysisStep}
                    isComplete={analysisStep === 4}
                    listingImage={listingImage}
                    listingDetails={listingDetails}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sales Funnel Section */}
          <div className="mt-32 max-w-7xl mx-auto">
            {/* Value Proposition */}
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Make Smarter iPhone Buying Decisions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI-powered analysis helps you spot great deals and avoid overpriced listings
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <ChartBarIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Price Analysis</h3>
                <p className="text-gray-600">
                  Get instant market comparisons and know if you're getting a fair deal
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Scam Protection</h3>
                <p className="text-gray-600">
                  AI-powered detection of suspicious listings and common scam patterns
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
                <div className="absolute -top-3 right-3">
                  <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs px-3 py-1 rounded-full font-medium">
                    Pro
                  </span>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <PhotoIcon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Image Analysis</h3>
                <p className="text-gray-600">
                  Verify iPhone condition and authenticity through advanced image recognition. Exclusive for Pro users.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <DocumentMagnifyingGlassIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Deal Classification</h3>
                <p className="text-gray-600">
                  Smart analysis of listing details to categorize deals as Great, Fair, or Overpriced
                </p>
              </div>
            </div>

            {/* Social Proof */}
            <div className="bg-gray-50 rounded-2xl p-8 mb-16">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Trusted by iPhone Buyers
                </h3>
                <div className="flex justify-center items-center space-x-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">1,000+</div>
                    <div className="text-sm text-gray-600">Listings Analyzed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">€250</div>
                    <div className="text-sm text-gray-600">Avg. Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">98%</div>
                    <div className="text-sm text-gray-600">Accuracy Rate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">
                Start Making Smarter iPhone Purchases Today
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of smart buyers who trust our AI to find the best iPhone deals
              </p>
              <button
                onClick={() => setShowEmailAuth(true)}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Create Free Account
              </button>
              <p className="mt-4 text-sm opacity-75">
                No credit card required • Free analysis credits included
              </p>
            </div>
          </div>

          {/* Example Cards Section */}
          <div className={`mt-${isAnalyzing ? '32' : '24'}`}>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Recent Analysis Examples
              </h2>
              <p className="text-gray-600">
                See how our AI analyzes iPhone listings in real-time
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exampleListings.map((listing) => (
                <div key={listing.article_id} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="flex justify-end mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <SparklesIcon className="h-3 w-3 mr-1" />
                      AI Analyzed
                    </span>
                  </div>

                  <div className="flex items-start space-x-4">
                    {listing.thumbnail_url ? (
                      <img
                        src={listing.thumbnail_url}
                        alt={listing.title}
                        className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-400 text-sm">No image</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {listing.title}
                      </h3>
                      <p className="mt-1 text-green-600 font-medium">{listing.price}</p>
                    </div>
                  </div>
                  
                  {listing.iphone_analysis && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {listing.iphone_analysis.iphone_model}
                        </span>
                        <span className="text-gray-600">
                          {listing.iphone_analysis.storage_gb}GB
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          Rating: {listing.iphone_analysis.rating}/5
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal 
          isOpen={showEmailAuth}
          onClose={() => setShowEmailAuth(false)}
        />

        {/* Analysis View */}
        {showAnalysisView && (
          <div className="relative">
            <div 
              className="fade-in fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => {
                setShowAnalysisView(false)
              }}
            />
            <div className="slide-in fixed inset-0 bg-white z-50 overflow-y-auto">
              <AnalysisView
                listingUrl={listingUrl}
                setListingUrl={setListingUrl}
                isAnalyzing={isAnalyzing}
                handleAnalyze={handleAnalyze}
                analysisStep={analysisStep}
                listingImage={listingImage}
                listingDetails={listingDetails}
                onClose={() => {
                  setShowAnalysisView(false)
                }}
                user={user}
                handleLogout={handleLogout}
                router={router}
                setShowEmailAuth={setShowEmailAuth}
                analysisId={currentAnalysisId}
              />
            </div>
          </div>
        )}
      </main>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Real-time Tracking</h3>
              <p className="text-gray-600">Monitor iPhone prices as they change</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">AI Analysis</h3>
              <p className="text-gray-600">Get intelligent insights on listings</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Market Trends</h3>
              <p className="text-gray-600">Stay informed about price trends</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 