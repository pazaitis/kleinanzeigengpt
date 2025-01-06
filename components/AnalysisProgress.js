import { useState } from 'react'
import { SparklesIcon, MapPinIcon } from '@heroicons/react/24/outline'
import MapModal from './MapModal'

const steps = [
  {
    id: 1,
    title: 'Analyzing listing title and description...',
  },
  {
    id: 2,
    title: 'Pricing analysis against fair market prices...',
  },
  {
    id: 3,
    title: 'Analyzing uploaded pictures...',
  },
  {
    id: 4,
    title: 'Summarizing result...',
  },
]

export default function AnalysisProgress({ currentStep, isComplete, listingImage, listingDetails }) {
  const [isMapOpen, setIsMapOpen] = useState(false)

  return (
    <div className="p-6">
      <div className="flex items-center justify-center mb-4">
        <SparklesIcon className="h-6 w-6 text-blue-600 animate-pulse" />
        <span className="ml-2 text-lg font-semibold">AI Analysis in Progress</span>
      </div>

      {/* Listing Details Section */}
      {(listingImage || listingDetails) && (
        <div className="mb-8 overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm">
          {listingImage && (
            <div className="relative h-64">
              <a
                href={`https://www.kleinanzeigen.de/s-anzeige/${listingDetails?.articleId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative group h-full"
              >
                <img
                  src={listingImage}
                  alt="Listing"
                  className="w-full h-full object-contain p-4 transition-opacity group-hover:opacity-95"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.png';
                  }}
                />
                {/* Overlay with icon on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-20">
                  <svg 
                    className="h-8 w-8 text-white" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                    />
                  </svg>
                </div>
              </a>
            </div>
          )}
          
          {listingDetails && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 leading-tight">
                  {listingDetails.title}
                </h3>
                <span className="text-xs text-gray-500">
                  ID: {listingDetails.articleId}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-green-50 text-green-700 font-medium text-lg">
                    {listingDetails.price}
                  </span>
                </div>
                <a
                  href={`https://www.kleinanzeigen.de/s-anzeige/${listingDetails.articleId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <svg 
                    className="h-4 w-4 mr-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                    />
                  </svg>
                  View Original
                </a>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500 text-sm">
                  <svg className="h-4 w-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {listingDetails.date}
                </div>
              </div>

              <button
                onClick={() => setIsMapOpen(true)}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors group"
              >
                <MapPinIcon className="h-5 w-5 mr-2 group-hover:text-blue-600" />
                <span className="text-sm font-medium group-hover:text-blue-600">
                  {listingDetails.location}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Progress Steps */}
      <div className="space-y-4 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center space-x-3 ${
              step.id < currentStep ? 'text-green-600' : 
              step.id === currentStep ? 'text-blue-600' : 
              'text-gray-400'
            }`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 border-2 rounded-full flex items-center justify-center
                ${
                  step.id < currentStep ? 'border-green-600 bg-green-50' :
                  step.id === currentStep ? 'border-blue-600 bg-blue-50' :
                  'border-gray-300'
                }
              `}
            >
              {step.id < currentStep ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span>{step.id}</span>
              )}
            </div>
            <span className="text-sm font-medium">{step.title}</span>
            {step.id === currentStep && (
              <div className="flex-shrink-0 h-2 w-2 bg-blue-600 rounded-full animate-bounce" />
            )}
          </div>
        ))}
      </div>

      {/* Map Modal */}
      <MapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        location={listingDetails?.location}
      />
    </div>
  )
} 