import Link from 'next/link'
import Logo from '../components/Logo'
import { CodeBracketIcon, KeyIcon, BoltIcon } from '@heroicons/react/24/outline'
import Navbar from '../components/Navbar'

const endpoints = [
  {
    method: 'GET',
    path: '/api/data',
    description: 'Retrieve scraped iPhone listings',
    parameters: [
      { name: 'limit', type: 'number', description: 'Number of listings to return (default: 10)' },
      { name: 'history', type: 'boolean', description: 'Include price history (default: false)' }
    ],
    example: `// Example Response
{
  "listings": [
    {
      "article_id": "123456789",
      "title": "iPhone 13 Pro Max",
      "price": "899 €",
      "location": "Berlin",
      "iphone_analysis": {
        "model": "iPhone 13 Pro Max",
        "storage_gb": 256,
        "rating": 4
      }
    }
  ]
}`
  },
  {
    method: 'POST',
    path: '/api/scrape',
    description: 'Trigger a new scraping job',
    parameters: [],
    example: `// Example Response
{
  "success": true,
  "count": 25
}`
  },
  {
    method: 'POST',
    path: '/api/analyze',
    description: 'Analyze a specific iPhone listing',
    parameters: [
      { name: 'url', type: 'string', description: 'Kleinanzeigen listing URL' }
    ],
    example: `// Example Response
{
  "analysis": {
    "model": "iPhone 13 Pro",
    "storage_gb": 256,
    "rating": 4,
    "highlights": "Like new condition, original packaging"
  }
}`
  }
]

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              API Documentation
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Integrate KleinanzeigenGPT's powerful iPhone analysis capabilities into your own applications.
            </p>
          </div>

          {/* Getting Started */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting Started</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <KeyIcon className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold">Authentication</h3>
                </div>
                <p className="text-gray-600">
                  Use your API key in the Authorization header for all requests.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <BoltIcon className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold">Rate Limits</h3>
                </div>
                <p className="text-gray-600">
                  Limits vary by plan. See pricing page for details.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <CodeBracketIcon className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold">Response Format</h3>
                </div>
                <p className="text-gray-600">
                  All responses are returned in JSON format.
                </p>
              </div>
            </div>
          </div>

          {/* Endpoints */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">API Endpoints</h2>
            <div className="space-y-8">
              {endpoints.map((endpoint) => (
                <div key={endpoint.path} className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          endpoint.method === 'GET' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="text-gray-900 font-mono">{endpoint.path}</code>
                      </div>
                      <p className="mt-2 text-gray-600">{endpoint.description}</p>
                    </div>
                  </div>

                  {endpoint.parameters.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Parameters</h4>
                      <ul className="space-y-2">
                        {endpoint.parameters.map((param) => (
                          <li key={param.name} className="text-sm">
                            <code className="text-blue-600 font-mono">{param.name}</code>
                            <span className="text-gray-500"> ({param.type})</span>
                            <span className="text-gray-600"> - {param.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Example</h4>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                      <code>{endpoint.example}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 