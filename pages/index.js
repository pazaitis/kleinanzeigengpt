import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import Logo from '../components/Logo'
import AuthForm from '../components/AuthForm'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { SparklesIcon, ShieldCheckIcon, CameraIcon, ChartBarIcon, ArrowPathIcon, StarIcon } from '@heroicons/react/24/outline'
import AuthModal from '../components/AuthModal'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import AnalysisProgress from '../components/AnalysisProgress'
import AnalysisView from '../components/AnalysisView'
import { URL_PREFIX } from '../utils/constants'
import { nanoid } from 'nanoid'
import { PhotoIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Footer from '../components/Footer'

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
  const [showAuthModal, setShowAuthModal] = useState(false)

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

  const features = [
    {
      title: 'AI-Powered Analysis',
      description: 'Get instant insights on iPhone listings with advanced AI technology',
      icon: SparklesIcon
    },
    {
      title: 'Fraud Detection',
      description: 'Automatically detect potential scams and suspicious listings',
      icon: ShieldCheckIcon
    },
    {
      title: 'Image Analysis',
      description: 'Verify iPhone condition through photo analysis',
      icon: CameraIcon
    },
    {
      title: 'Price Tracking',
      description: 'Track price history and market trends',
      icon: ChartBarIcon
    }
  ]

  const steps = [
    {
      title: 'Paste URL',
      description: 'Copy & paste any Kleinanzeigen iPhone listing URL'
    },
    {
      title: 'AI Analysis',
      description: 'Our AI analyzes the listing details, images, and seller profile'
    },
    {
      title: 'Get Results',
      description: 'Receive detailed insights and recommendations'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'iPhone Buyer',
      image: '/testimonials/sarah.jpg',
      content: 'KleinanzeigenGPT helped me avoid a scam listing and find a legitimate iPhone seller. The AI analysis is incredibly thorough!',
      rating: 5
    },
    {
      name: 'Marcus K.',
      role: 'Tech Enthusiast',
      image: '/testimonials/marcus.jpg',
      content: 'I use this tool for every iPhone purchase now. It\'s saved me both time and money by identifying overpriced listings.',
      rating: 5
    }
  ]

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
              <Link href="#features" className="text-gray-600 hover:text-gray-900">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900">
                How it Works
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/dashboard"
                    className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  Get Started
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
                href="#features"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How it Works
              </Link>
              <Link
                href="/pricing"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>

              {/* Auth Buttons */}
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
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
                    setShowAuthModal(true)
                    setIsMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section mit URL Input */}
      <section className="relative bg-gradient-to-b from-[#635bff]/[0.15] via-[#635bff]/[0.05] to-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-[#0a2540] sm:text-5xl md:text-6xl">
              <span className="block">Analyze iPhone Listings with</span>
              <span className="block text-[#635bff]">AI-Powered Insights</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-[#425466] sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Get instant analysis of Kleinanzeigen iPhone listings. Detect scams, verify prices, and make safer purchases.
            </p>

            {/* URL Input Section */}
            <div className="mt-8 max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="relative flex-grow max-w-2xl w-full">
                  <input
                    type="text"
                    value={listingUrl}
                    onChange={(e) => setListingUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    placeholder="Paste Kleinanzeigen iPhone URL here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#635bff] focus:border-[#635bff] bg-white"
                  />
                  
                  {/* Random URL Button */}
                  <button
                    onClick={handleRandomAnalysis}
                    disabled={isRandomLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <ArrowPathIcon className={`h-5 w-5 ${isRandomLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {/* Analyze Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !listingUrl}
                  className={`px-6 py-3 bg-[#635bff] text-white rounded-lg font-medium hover:bg-[#0a2540] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#635bff] disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 transition-colors duration-200 ${
                    isAnalyzing ? 'cursor-not-allowed' : ''
                  }`}
                >
                  {isAnalyzing ? (
                    <div className="flex items-center">
                      <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                      Analyzing...
                    </div>
                  ) : (
                    'Analyze Listing'
                  )}
                </button>
              </div>

              {/* URL Input Helper Text */}
              <p className="mt-2 text-sm text-gray-500">
                {isInputFocused ? 'Press Enter to start analysis' : 'Or click the refresh icon for a random listing'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div 
                key={feature.title}
                className="p-6 bg-white rounded-xl border hover:shadow-lg transition-shadow"
              >
                <feature.icon className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div 
                key={step.title}
                className="relative p-6 bg-white rounded-xl border"
              >
                <div className="absolute -top-4 left-6 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.name}
                className="p-6 bg-white rounded-xl border hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  {testimonial.content}
                </p>
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Buy Your Next iPhone Safely?
          </h2>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100"
          >
            Start Free Analysis
          </button>
        </div>
      </section>

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

      <Footer />

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
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
    </div>
  )
} 