import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import Logo from '../components/Logo'
import AuthForm from '../components/AuthForm'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [showEmailAuth, setShowEmailAuth] = useState(false)

  useEffect(() => {
    // Check for existing session
    const session = supabase.auth.getSession()
    setUser(session?.user)

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user)
    })

    return () => subscription?.unsubscribe()
  }, [])

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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error logging out:', error.message)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Logo className="mx-auto h-12 w-auto text-blue-600" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          KleinanzeigenGPT
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Logo className="w-12 h-12 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900 ml-4">
                KleinanzeigenGPT
              </h1>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
              <p className="text-xl text-gray-700">
                AI-Powered Price Tracking for Kleinanzeigen
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Automatically track and analyze iPhone prices using machine learning
              </p>
            </div>
          </div>

          {!user && (
            <div className="flex flex-col items-center space-y-4 mb-8">
              <button
                onClick={handleGoogleLogin}
                className="flex items-center bg-white border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors shadow-sm w-full max-w-md justify-center"
              >
                <img 
                  src="https://www.google.com/favicon.ico" 
                  alt="Google" 
                  className="w-5 h-5 mr-2"
                />
                <span className="text-gray-700">Sign in with Google</span>
              </button>
              
              <div className="flex items-center w-full max-w-md my-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <div className="px-4 text-gray-500">or</div>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              <AuthForm />
            </div>
          )}

          {user && (
            <div className="flex justify-center mb-8">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          )}

          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">API Endpoints</h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md mr-2">POST</span>
                <code className="bg-gray-100 px-2 py-1 rounded">/api/scrape</code>
                <span className="ml-2">- Trigger scraping</span>
              </li>
              <li className="flex items-center">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md mr-2">GET</span>
                <code className="bg-gray-100 px-2 py-1 rounded">/api/data</code>
                <span className="ml-2">- Get scraped data</span>
              </li>
            </ul>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <div>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 