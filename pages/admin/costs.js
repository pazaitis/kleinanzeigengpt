import AdminLayout from '../../components/AdminLayout'
import { useState, useEffect } from 'react'
import { supabase } from '../../supabase'
import { CurrencyEuroIcon, SparklesIcon, CloudIcon } from '@heroicons/react/24/outline'

export default function CostManagement() {
  const [costs, setCosts] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Cost constants per API call
  const COSTS = {
    CLAUDE: 0.0015, // €0.0015 per 1K tokens for Claude-3 Haiku
    GOOGLE_MAPS: 0.0017, // €0.0017 per API call
  }

  // Usage statistics
  const [stats, setStats] = useState({
    totalCosts: 0,
    claudeCosts: 0,
    mapsCosts: 0,
    totalAnalyses: 0,
    totalTokens: 0,
    totalMapsCalls: 0,
  })

  // Add new state for Google Maps actual costs
  const [mapsActualCosts, setMapsActualCosts] = useState({
    totalCost: 0,
    lastUpdated: null,
    isLoading: true,
    error: null
  })

  useEffect(() => {
    fetchCosts()
    fetchMapsCosts()
  }, [])

  const fetchCosts = async () => {
    try {
      // Get analyses with token usage data
      const { data: analyses, error } = await supabase
        .from('analyses')
        .select(`
          id,
          created_at,
          status,
          tokens_used,
          maps_calls,
          listing_url
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Calculate actual costs based on usage
      const enrichedAnalyses = analyses.map(analysis => {
        const claudeCost = ((analysis.tokens_used || 0) * COSTS.CLAUDE) / 1000
        const mapsCost = (analysis.maps_calls || 0) * COSTS.GOOGLE_MAPS
        return {
          ...analysis,
          claudeCost,
          mapsCost,
          totalCost: claudeCost + mapsCost
        }
      })

      // Calculate totals
      const stats = enrichedAnalyses.reduce((acc, analysis) => ({
        totalCosts: acc.totalCosts + analysis.totalCost,
        claudeCosts: acc.claudeCosts + analysis.claudeCost,
        mapsCosts: acc.mapsCosts + analysis.mapsCost,
        totalAnalyses: acc.totalAnalyses + 1,
        totalTokens: acc.totalTokens + (analysis.tokens_used || 0),
        totalMapsCalls: acc.totalMapsCalls + (analysis.maps_calls || 0)
      }), {
        totalCosts: 0,
        claudeCosts: 0,
        mapsCosts: 0,
        totalAnalyses: 0,
        totalTokens: 0,
        totalMapsCalls: 0
      })

      setStats(stats)
      setCosts(enrichedAnalyses)
    } catch (error) {
      console.error('Error fetching costs:', error)
    } finally {
      setLoading(false)
    }
  }

  // Add function to fetch actual Maps costs
  const fetchMapsCosts = async () => {
    try {
      const response = await fetch('/api/fetch-maps-costs')
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error)
      
      setMapsActualCosts({
        totalCost: data.totalCost,
        lastUpdated: data.lastUpdated,
        isLoading: false,
        error: null
      })
    } catch (error) {
      console.error('Error fetching Maps costs:', error)
      setMapsActualCosts(prev => ({
        ...prev,
        isLoading: false,
        error: error.message
      }))
    }
  }

  const CostCard = ({ title, amount, icon: Icon, description }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-[#635bff]" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-[#425466] truncate">
                {title}
              </dt>
              <dd className="text-lg font-semibold text-[#0a2540]">
                €{amount.toFixed(3)}
              </dd>
              {description && (
                <dd className="text-xs text-[#425466] mt-1">
                  {description}
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-[#0a2540]">Cost Management</h1>
            <p className="mt-2 text-sm text-[#425466]">
              Overview of API usage costs and analysis expenses.
            </p>
          </div>
        </div>

        {/* Updated Cost Summary Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <CostCard
            title="Total API Costs"
            amount={stats.totalCosts}
            icon={CurrencyEuroIcon}
            description={`${stats.totalAnalyses} analyses`}
          />
          <CostCard
            title="Claude API Costs"
            amount={stats.claudeCosts}
            icon={SparklesIcon}
            description={`${stats.totalTokens.toLocaleString()} tokens used`}
          />
          <CostCard
            title="Maps API Costs"
            amount={stats.mapsCosts}
            icon={CloudIcon}
            description={
              <div className="space-y-1">
                <p>{stats.totalMapsCalls} API calls (estimated)</p>
                {mapsActualCosts.isLoading ? (
                  <p className="text-gray-400">Loading actual costs...</p>
                ) : mapsActualCosts.error ? (
                  <p className="text-red-500 text-xs">Error loading actual costs</p>
                ) : (
                  <div className="flex items-center space-x-1">
                    <p>Actual cost: €{mapsActualCosts.totalCost.toFixed(3)}</p>
                    <span className="text-xs text-gray-400">
                      (as of {new Date(mapsActualCosts.lastUpdated).toLocaleString()})
                    </span>
                  </div>
                )}
              </div>
            }
          />
        </div>

        {/* Updated Cost Details Table */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-[#0a2540] mb-4">Cost Breakdown</h2>
          <div className="bg-white shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-[#0a2540]">Date</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-[#0a2540]">Analysis ID</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-[#0a2540]">Tokens Used</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-[#0a2540]">Maps Calls</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-[#0a2540]">Total Cost</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-[#0a2540]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {costs.map((analysis) => (
                  <tr key={analysis.id}>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-[#425466]">
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-[#425466]">
                      <a 
                        href={analysis.listing_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {analysis.id}
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-[#425466]">
                      {analysis.tokens_used?.toLocaleString() || '0'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-[#425466]">
                      {analysis.maps_calls || '0'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-[#425466]">
                      €{analysis.totalCost.toFixed(4)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        analysis.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {analysis.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 