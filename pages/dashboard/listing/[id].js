import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../../supabase'
import { SparklesIcon } from '@heroicons/react/24/outline'
import Logo from '../../../components/Logo'
import Link from 'next/link'
import Navbar from '../../../components/Navbar'

export default function ListingAnalysis() {
  const router = useRouter()
  const { id } = router.query
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchListing()
    }
  }, [id])

  const fetchListing = async () => {
    try {
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
        .eq('article_id', id)
        .single()

      if (error) throw error
      setListing(data)
    } catch (error) {
      console.error('Error fetching listing:', error)
    } finally {
      setLoading(false)
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
    <div className="min-h-screen bg-white">
      <Navbar user={user} />
      <div className="pt-16">
        {listing && (
          <div className="bg-white shadow rounded-lg">
            {/* Add your detailed analysis UI here */}
            <div className="p-6 space-y-6">
              {/* Title Section */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
                <p className="mt-1 text-sm text-gray-500">Article ID: {listing.article_id}</p>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Images and Basic Info */}
                <div className="space-y-6">
                  {/* Images */}
                  {listing.listing_images?.length > 0 && (
                    <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
                      <img
                        src={listing.listing_images[0].image_url}
                        alt={listing.title}
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Basic Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500">Price</h3>
                      <p className="mt-1 text-lg font-semibold text-green-600">{listing.price}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500">Location</h3>
                      <p className="mt-1 text-lg text-gray-900">{listing.location}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Analysis */}
                <div className="space-y-6">
                  {/* GPT Analysis */}
                  {listing.iphone_analysis && (
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                      <div className="flex items-center space-x-2 mb-4">
                        <SparklesIcon className="h-6 w-6 text-blue-600" />
                        <h2 className="text-lg font-semibold text-blue-900">
                          AI Analysis Results
                        </h2>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-blue-700">Model</h3>
                          <p className="mt-1 text-lg text-blue-900">
                            {listing.iphone_analysis.iphone_model}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-blue-700">Storage</h3>
                          <p className="mt-1 text-lg text-blue-900">
                            {listing.iphone_analysis.storage_gb} GB
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-blue-700">Condition Rating</h3>
                          <p className="mt-1 text-lg text-blue-900">
                            {listing.iphone_analysis.rating}/5
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-blue-700">Analysis Highlights</h3>
                          <p className="mt-1 text-sm text-blue-800 whitespace-pre-wrap">
                            {listing.iphone_analysis.highlights}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Full Description */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Full Description</h3>
                    <div className="prose prose-sm max-w-none">
                      {listing.long_desc?.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-2">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 