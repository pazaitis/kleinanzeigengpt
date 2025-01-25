import { useSubscription } from '../contexts/SubscriptionContext'
import Link from 'next/link'

export default function RequiresPro({ children }) {
  const { subscriptionStatus } = useSubscription()

  if (subscriptionStatus === 'loading') {
    return <div>Loading...</div>
  }

  if (subscriptionStatus === 'free') {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Pro Feature
        </h3>
        <p className="text-gray-600 mb-4">
          This feature requires a Pro subscription
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Upgrade to Pro
        </Link>
      </div>
    )
  }

  return children
} 