import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import AnalysisView from '../../components/AnalysisView'

export default function SharedAnalysis() {
  const router = useRouter()
  const { id } = router.query
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      fetchAnalysis()
    }
  }, [id])

  const fetchAnalysis = async () => {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setAnalysis(data)
    } catch (error) {
      console.error('Error fetching analysis:', error)
      setError(error.message)
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

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Analysis Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The analysis you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <AnalysisView
      listingUrl={analysis.listing_url}
      listingImage={analysis.image_url}
      listingDetails={analysis.details}
      analysisId={id}
      isAnalyzing={false}
      analysisStep={4}
      onClose={() => router.push('/')}
      setListingUrl={() => {}} // No-op for shared view
      handleAnalyze={() => {}} // No-op for shared view
      user={null} // Or pass the current user if needed
      router={router}
      setShowEmailAuth={() => {}} // No-op for shared view
    />
  )
} 