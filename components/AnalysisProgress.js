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

export default function AnalysisProgress({ currentStep, isComplete, listingImage }) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-center mb-4">
        <SparklesIcon className="h-6 w-6 text-blue-600 animate-pulse" />
        <span className="ml-2 text-lg font-semibold">AI Analysis in Progress</span>
      </div>

      {listingImage && (
        <div className="mb-6 rounded-lg overflow-hidden bg-gray-100">
          <img 
            src={listingImage} 
            alt="Listing" 
            className="w-full h-48 object-contain mx-auto"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-image.png'; // Add a placeholder image if needed
            }}
          />
        </div>
      )}

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