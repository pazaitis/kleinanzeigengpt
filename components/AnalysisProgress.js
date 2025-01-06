import { SparklesIcon } from '@heroicons/react/24/outline'

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
  return (
    <div className="p-6">
      <div className="flex items-center justify-center mb-4">
        <SparklesIcon className="h-6 w-6 text-blue-600 animate-pulse" />
        <span className="ml-2 text-lg font-semibold">AI Analysis in Progress</span>
      </div>

      {/* Listing Details Section */}
      {(listingImage || listingDetails) && (
        <div className="mb-6 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
          {listingImage && (
            <div className="aspect-w-16 aspect-h-9">
              <img 
                src={listingImage} 
                alt={listingDetails?.title || 'Listing'} 
                className="w-full h-48 object-contain mx-auto bg-white"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.png';
                }}
              />
            </div>
          )}
          
          {listingDetails && (
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {listingDetails.title}
              </h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600 font-medium text-lg">
                  {listingDetails.price}
                </span>
                <span className="text-gray-500">
                  {listingDetails.date}
                </span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <svg className="h-4 w-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {listingDetails.location}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Progress Steps */}
      <div className="space-y-4">
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
    </div>
  )
} 