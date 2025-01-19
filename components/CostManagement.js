import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { CurrencyEuroIcon, ChartBarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'

export default function CostManagement() {
  const [costs, setCosts] = useState({
    totalCosts: 0,
    monthlyAnalyses: 0,
    averageCostPerAnalysis: 0,
    monthlyRevenue: 0,
    profit: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState('month') // month, quarter, year

  useEffect(() => {
    fetchCostData()
  }, [dateRange])

  const fetchCostData = async () => {
    try {
      setIsLoading(true)
      // Here you would fetch actual data from your database
      // This is example data
      const mockData = {
        totalCosts: 2345.67,
        monthlyAnalyses: 1234,
        averageCostPerAnalysis: 1.90,
        monthlyRevenue: 3456.78,
        profit: 1111.11
      }
      setCosts(mockData)
    } catch (error) {
      console.error('Error fetching cost data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const stats = [
    {
      name: 'Total Costs',
      value: `€${costs.totalCosts.toFixed(2)}`,
      icon: CurrencyEuroIcon,
      change: '+4.75%',
      changeType: 'negative'
    },
    {
      name: 'Monthly Analyses',
      value: costs.monthlyAnalyses,
      icon: ChartBarIcon,
      change: '+12.3%',
      changeType: 'positive'
    },
    {
      name: 'Cost per Analysis',
      value: `€${costs.averageCostPerAnalysis.toFixed(2)}`,
      icon: ArrowTrendingUpIcon,
      change: '-2.34%',
      changeType: 'positive'
    }
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-[#0a2540]">Cost Management</h2>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-[#635bff] focus:ring-[#635bff]"
        >
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-[#635bff]/10 rounded-lg">
                  <stat.icon className="h-6 w-6 text-[#635bff]" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#425466]">{stat.name}</p>
                  <p className="text-2xl font-semibold text-[#0a2540]">{stat.value}</p>
                </div>
              </div>
              <div className={`text-sm ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue vs Costs Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-[#0a2540] mb-4">Revenue vs Costs</h3>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-[#425466]">Revenue</p>
            <p className="text-2xl font-semibold text-[#0a2540]">
              €{costs.monthlyRevenue.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-[#425466]">Profit</p>
            <p className="text-2xl font-semibold text-green-600">
              €{costs.profit.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center text-[#425466]">
          [Chart Placeholder - Add your preferred charting library]
        </div>
      </div>
    </div>
  )
} 