import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../supabase'

export default function AdminProtected({ children }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setIsAuthenticated(false)
        setIsAdmin(false)
      } else {
        setIsAuthenticated(true)

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        setIsAdmin(profile?.role === 'admin')
      }
    } catch (error) {
      console.error('Error checking user:', error)
      setIsAuthenticated(false)
      setIsAdmin(false)
    } finally {
      setIsLoading(false)
      setHasChecked(true)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!hasChecked) {
    return null
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Login</h2>
            <p className="text-gray-500 mb-6">Please sign in to access the admin area.</p>
            <button
              onClick={() => router.push('/login?redirect=/admin')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-500 mb-6">
              You don't have permission to access this area. Please contact an administrator if you believe this is a mistake.
            </p>
            <button
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Return to Homepage
            </button>
          </div>
        </div>
      </div>
    )
  }

  return children
} 