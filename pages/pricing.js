import { useRouter } from 'next/router'
import Link from 'next/link'
import Logo from '../components/Logo'
import { CheckIcon } from '@heroicons/react/24/solid'
import Navbar from '../components/Navbar'

const pricingPlans = [
  {
    name: 'Free',
    price: '€0',
    period: '/month',
    description: 'Perfect for trying out our service',
    features: [
      '5 analyses per month',
      'Basic AI insights',
      'Single listing analysis',
      'Email support',
    ],
    buttonText: 'Get Started',
    buttonStyle: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  },
  {
    name: 'Pro',
    price: '€19',
    period: '/month',
    description: 'For power users who need more analyses',
    features: [
      '50 analyses per month',
      'Advanced AI insights',
      'Bulk listing analysis',
      'Price history tracking',
      'Priority email support',
      'Market trend analysis',
    ],
    buttonText: 'Start Pro Trial',
    buttonStyle: 'bg-blue-600 text-white hover:bg-blue-700',
    popular: true,
  },
  {
    name: 'Business',
    price: '€49',
    period: '/month',
    description: 'For businesses requiring full access',
    features: [
      'Unlimited analyses',
      'Premium AI insights',
      'Bulk listing analysis',
      'Price history tracking',
      'Priority 24/7 support',
      'Market trend analysis',
      'Custom API access',
      'Team collaboration',
    ],
    buttonText: 'Contact Sales',
    buttonStyle: 'bg-gray-900 text-white hover:bg-gray-800',
  },
]

export default function Pricing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16">
        {/* Pricing Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that best fits your needs. All plans include access to our core AI analysis features.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-lg bg-white shadow-lg overflow-hidden ${
                  plan.popular ? 'ring-2 ring-blue-600' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm">
                    Popular
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <p className="mt-4 text-gray-600">{plan.description}</p>

                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`mt-8 w-full py-3 px-4 rounded-lg font-medium transition-colors ${plan.buttonStyle}`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I switch plans later?
                </h3>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600">
                  We accept all major credit cards and PayPal. For Business plans, we also support bank transfers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 