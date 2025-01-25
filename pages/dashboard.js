import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../supabase'
import Logo from '../components/Logo'
import ListingsTable from '../components/ListingsTable'
import Link from 'next/link'
import RequiresPro from '../components/RequiresPro'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const router = useRouter()

  useEffect(() => {
    checkUser()
    fetchListings()
  }, [page, pageSize])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/')
    } else {
      setUser(session.user)
    }
  }

  const fetchListings = async () => {
    try {
      const { count, error: countError } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })

      if (countError) throw countError
      setTotalCount(count)

      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          iphone_analysis (
            iphone_model,
            storage_gb,
            rating,
            highlights
          ),
          listing_images (
            id,
            image_url,
            is_main
          )
        `)
        .order('last_seen', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (error) throw error
      setListings(data || [])
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
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
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <Logo className="w-8 h-8 text-blue-600" />
                <span className="ml-2 text-xl font-semibold text-gray-900">KleinanzeigenGPT</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.email}</span>
              <button
                onClick={() => router.push('/profile')}
                className="text-gray-700 hover:text-gray-900"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
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
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                All Listings
              </h3>
              <button
                onClick={fetchListings}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Refresh Data
              </button>
            </div>
            <ListingsTable 
              listings={listings}
              totalCount={totalCount}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        </div>
      </main>

      {/* Basic features available to all */}
      <BasicFeatures />

      {/* Premium features */}
      <RequiresPro>
        <PremiumFeatures />
      </RequiresPro>
    </div>
  )
} 