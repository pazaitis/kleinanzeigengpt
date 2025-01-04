import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../supabase'
import Logo from '../components/Logo'

export default function Profile() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [profile, setProfile] = useState({
    email: '',
    address: '',
    mobile_number: ''
  })

  useEffect(() => {
    getProfile()
  }, [])

  const getProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Getting profile for session:', session)
      
      if (!session) {
        router.push('/')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      console.log('Profile fetch response:', { data, error })

      if (error) throw error

      setProfile({
        email: session.user.email,
        address: data?.address || '',
        mobile_number: data?.mobile_number || ''
      })

      console.log('Profile state set to:', {
        email: session.user.email,
        address: data?.address || '',
        mobile_number: data?.mobile_number || ''
      })
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Updating profile for session:', session) // Debug log
      
      if (!session) throw new Error('No session')

      // Try upsert instead of update/insert
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          email: session.user.email,
          address: profile.address,
          mobile_number: profile.mobile_number,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id',
          returning: 'minimal'
        })

      console.log('Upsert response:', { data, error }) // Debug log

      if (error) throw error

      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      await getProfile() // Refresh the profile data
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Logo className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">KleinanzeigenGPT</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-700 hover:text-gray-900"
              >
                Dashboard
              </button>
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  router.push('/')
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
              <p className="mt-1 text-sm text-gray-600">
                Update your personal information
              </p>
            </div>

            {message && (
              <div className={`mb-4 p-4 rounded-md ${
                message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={updateProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Email cannot be changed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={profile.mobile_number}
                  onChange={(e) => setProfile({ ...profile, mobile_number: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={saving}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    saving ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
} 