import { useState } from 'react'
import { supabase } from '../supabase'

export default function AuthForm({ onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isLogin, setIsLogin] = useState(true)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let result
      if (isLogin) {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        })
      } else {
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              email: email,
              created_at: new Date().toISOString(),
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        })
      }

      if (result.error) throw result.error

      if (!isLogin) {
        alert('Check your email for the confirmation link!')
      }
      
      onClose()
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setIsLogin(true)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            isLogin 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            !isLogin 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading 
            ? (isLogin ? 'Logging in...' : 'Signing up...') 
            : (isLogin ? 'Login' : 'Sign Up')}
        </button>
      </form>
    </div>
  )
} 