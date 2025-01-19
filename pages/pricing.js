import { useRouter } from 'next/router'
import Link from 'next/link'
import Logo from '../components/Logo'
import { CheckIcon } from '@heroicons/react/24/solid'
import Navbar from '../components/Navbar'
import { loadStripe } from '@stripe/stripe-js'
import { useState } from 'react'
import Footer from '../components/Footer'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

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
      'Price history tracking',
    ],
    buttonText: 'Get Started',
    buttonStyle: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    handleClick: () => {
      // Handle free plan signup
      router.push('/dashboard')
    }
  },
  {
    name: 'Pro',
    price: '€20',
    period: '/month',
    description: 'For power users who need more analyses',
    features: [
      'Unlimited analyses',
      'Advanced AI insights',
      'Bulk listing analysis',
      'Price history tracking',
      'Priority email support',
      'Market trend analysis',
      'API access',
      'Custom alerts',
    ],
    buttonText: 'Start Pro Trial',
    buttonStyle: 'bg-blue-600 text-white hover:bg-blue-700',
    popular: true,
    handleClick: async () => {
      // Will be defined in the component
    }
  }
]

export default function Pricing() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleProSubscription = async () => {
    try {
      setIsLoading(true);
      console.log('Starting checkout process...');
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({}) // Empty object as body
      });

      console.log('Response status:', response.status);
      
      // Get the full response text for debugging
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Invalid response from server');
      }

      if (!data.sessionId) {
        console.error('No sessionId in response:', data);
        throw new Error('No session ID received');
      }

      console.log('Session ID received:', data.sessionId);

      // Initialize Stripe
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Failed to initialize Stripe');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      });
      
      if (error) {
        console.error('Stripe redirect error:', error);
        throw error;
      }

    } catch (error) {
      console.error('Checkout error:', error);
      alert(error.message || 'Failed to start checkout process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-24 pb-16">
        <div className="bg-gradient-to-b from-[#635bff]/[0.15] via-[#635bff]/[0.05] to-white">
          <h1 className="text-4xl font-bold text-[#0a2540] mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-[#425466] max-w-2xl mx-auto">
            Choose the plan that best fits your needs. All plans include access to our core AI analysis features.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
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
                  onClick={plan.name === 'Pro' ? handleProSubscription : plan.handleClick}
                  disabled={isLoading && plan.name === 'Pro'}
                  className={`mt-8 w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    plan.buttonStyle
                  } ${isLoading && plan.name === 'Pro' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading && plan.name === 'Pro' ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    plan.buttonText
                  )}
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
      </main>
      <Footer />
    </div>
  )
} 