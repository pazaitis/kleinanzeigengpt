import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import Logo from '../components/Logo'
import AuthForm from '../components/AuthForm'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { SparklesIcon } from '@heroicons/react/24/outline'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [showEmailAuth, setShowEmailAuth] = useState(false)

  useEffect(() => {
    const session = supabase.auth.getSession()
    setUser(session?.user)

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user)
    })

    return () => subscription?.unsubscribe()
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
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#api" className="text-gray-600 hover:text-gray-900">API</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900">About us</a>
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
              AI-Powered iPhone Price Tracking
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

          {/* Example Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[1, 2, 3].map((card) => (
              <div key={card} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Card Example {card}</h3>
                <p className="text-gray-600">
                  Sample content showcasing the features and capabilities of our platform.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Auth Modal */}
        {showEmailAuth && !user && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Login / Sign Up</h2>
                <button 
                  onClick={() => setShowEmailAuth(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Google Login Button */}
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors mb-4"
              >
                <img 
                  src="https://www.google.com/favicon.ico" 
                  alt="Google" 
                  className="w-5 h-5"
                />
                <span className="text-gray-700">Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <AuthForm />
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

      {/* API Section */}
      <section id="api" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">API Access</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <pre className="bg-black text-green-400 p-4 rounded overflow-x-auto">
              <code>
                GET /api/data - Get scraped data{'\n'}
                POST /api/scrape - Trigger scraping
              </code>
            </pre>
          </div>
        </div>
      </section>
    </div>
  )
} 