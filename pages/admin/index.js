import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { supabase } from '../../supabase'
import { 
  UserGroupIcon,
  DocumentMagnifyingGlassIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAnalyses: 0,
    userGrowth: {
      percentage: 0,
      isPositive: true
    }
  })
  const [userTimeData, setUserTimeData] = useState({
    labels: [],
    data: []
  })
  const [timeView, setTimeView] = useState('daily')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardStats()
  }, [timeView])

  const fetchDashboardStats = async () => {
    try {
      // Check if user is admin first
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (profile?.role !== 'admin') return

      if (timeView === 'monthly') {
        // Get user registration data for the last 12 months
        const last12Months = Array.from({ length: 12 }, (_, i) => {
          const date = new Date()
          date.setMonth(date.getMonth() - i)
          return date
        }).reverse()

        const userCounts = await Promise.all(
          last12Months.map(async (date) => {
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)

            const { count } = await supabase
              .from('profiles')
              .select('*', { count: 'exact', head: true })
              .gte('created_at', startOfMonth.toISOString())
              .lt('created_at', endOfMonth.toISOString())

            return {
              date: startOfMonth,
              count: count || 0
            }
          })
        )

        setUserTimeData({
          labels: userCounts.map(item => 
            new Date(item.date).toLocaleDateString('default', { month: 'short', year: 'numeric' })
          ),
          data: userCounts.map(item => item.count)
        })
      } else {
        // Daily data fetch for last 30 days
        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - i)
          return date
        }).reverse()

        const userCounts = await Promise.all(
          last30Days.map(async (date) => {
            const startOfDay = new Date(date.setHours(0, 0, 0, 0))
            const endOfDay = new Date(date.setHours(23, 59, 59, 999))

            const { count } = await supabase
              .from('profiles')
              .select('*', { count: 'exact', head: true })
              .gte('created_at', startOfDay.toISOString())
              .lt('created_at', endOfDay.toISOString())

            return {
              date: startOfDay,
              count: count || 0
            }
          })
        )

        setUserTimeData({
          labels: userCounts.map(item => 
            new Date(item.date).toLocaleDateString('default', { 
              month: 'short', 
              day: 'numeric'
            })
          ),
          data: userCounts.map(item => item.count)
        })
      }

      // Get current date and last month's date
      const now = new Date()
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      
      // Get total users count
      const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      if (usersError) throw usersError

      // Get last month's users count
      const { count: lastMonthUsers, error: lastMonthError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .lt('created_at', now.toISOString())
        .gte('created_at', lastMonth.toISOString())

      if (lastMonthError) throw lastMonthError

      // Calculate growth percentage
      const previousMonthTotal = totalUsers - lastMonthUsers
      const growthPercentage = previousMonthTotal === 0 
        ? 100 
        : ((lastMonthUsers / previousMonthTotal) * 100) - 100

      // Get total analyses count
      const { count: analysesCount, error: analysesError } = await supabase
        .from('iphone_analysis')
        .select('*', { count: 'exact', head: true })

      if (analysesError) throw analysesError

      setStats({
        totalUsers,
        totalAnalyses: analysesCount,
        userGrowth: {
          percentage: Math.abs(Math.round(growthPercentage)),
          isPositive: growthPercentage >= 0
        }
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: `User Registrations (${timeView === 'monthly' ? 'Monthly' : 'Daily'})`,
        color: '#111827',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  }

  const chartData = {
    labels: userTimeData.labels,
    datasets: [
      {
        data: userTimeData.data,
        borderColor: '#2563eb',
        backgroundColor: '#3b82f6',
        tension: 0.3,
        pointStyle: 'circle',
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {error ? (
          <div className="bg-red-50 p-4 rounded-lg mb-8">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Users Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100">
                      <UserGroupIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-5">
                      <p className="text-sm font-medium text-gray-500 truncate">
                        Total Users
                      </p>
                      <p className="mt-1 text-3xl font-semibold text-gray-900">
                        {stats.totalUsers}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center ${
                    stats.userGrowth.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats.userGrowth.isPositive ? (
                      <ArrowTrendingUpIcon className="h-5 w-5 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-5 w-5 mr-1" />
                    )}
                    <span className="text-sm font-medium">
                      {stats.userGrowth.percentage}%
                    </span>
                    <span className="text-xs text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
              </div>

              {/* Analyses Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100">
                    <DocumentMagnifyingGlassIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500 truncate">
                      Total Analyses
                    </p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">
                      {stats.totalAnalyses}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  User Registration Trends
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setTimeView('monthly')}
                    className={`px-3 py-1 text-sm font-medium rounded-md ${
                      timeView === 'monthly'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setTimeView('daily')}
                    className={`px-3 py-1 text-sm font-medium rounded-md ${
                      timeView === 'daily'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Daily
                  </button>
                </div>
              </div>
              <Line options={chartOptions} data={chartData} />
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
} 