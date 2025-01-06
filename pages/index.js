import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import Logo from '../components/Logo'
import AuthForm from '../components/AuthForm'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { SparklesIcon } from '@heroicons/react/24/outline'
import AuthModal from '../components/AuthModal'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [showEmailAuth, setShowEmailAuth] = useState(false)
  const [exampleListings, setExampleListings] = useState([])

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

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full top-0 bg-white z-10 border-b">
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
              <div className="flex w-full space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="https://www.kleinanzeigen.de/s-anzeige/iphone-12-pro-128-gb/2968640621-173-3905"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Paste the URL of any iPhone listing from Kleinanzeigen.de
                  </p>
                </div>
                <button 
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2 h-[46px]"
                >
                  <SparklesIcon className="h-5 w-5" />
                  <span>Analyze</span>
                </button>
              </div>
            </div>
          </div>

          {/* Example Cards Section */}
          <div className="mt-24">
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