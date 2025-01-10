import { useState, useRef, useEffect } from 'react'
import { SparklesIcon, MapPinIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const thumbnailsRef = useRef(null)
  
  // Use the fetched images or fallback to single listingImage
  const images = listingDetails?.images || (listingImage ? [listingImage] : [])

  // Function to handle image navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const scrollThumbnails = (direction) => {
    const container = thumbnailsRef.current;
    const scrollAmount = direction === 'left' ? -200 : 200;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  // Add effect to scroll thumbnails into view when currentImageIndex changes
  useEffect(() => {
    if (thumbnailsRef.current && images.length > 6) {
      const container = thumbnailsRef.current;
      const thumbnail = container.children[currentImageIndex];
      if (thumbnail) {
        const containerWidth = container.offsetWidth;
        const thumbnailLeft = thumbnail.offsetLeft;
        const thumbnailWidth = thumbnail.offsetWidth;
        
        // Calculate the center position for the current thumbnail
        const scrollPosition = thumbnailLeft - (containerWidth / 2) + (thumbnailWidth / 2);
        
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [currentImageIndex, images.length]);

  return (
    <div className="flex h-full bg-gray-50">
      {/* Left side: Kleinanzeigen replica */}
      <div className="w-1/2 bg-white shadow-lg overflow-y-auto">
        {/* Title and Price Section - Moved above gallery */}
        <div className="bg-white p-6 border-b">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">{listingDetails?.title}</h1>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-[#86b817]">{listingDetails?.price}</span>
                {listingDetails?.delivery_type && (
                  <span className="text-gray-600 text-sm font-medium">{listingDetails.delivery_type}</span>
                )}
              </div>
              <span className="text-sm text-gray-500">{listingDetails?.date}</span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="relative h-[450px] bg-gray-900 group">
          {/* Main Image */}
          <img
            src={images[currentImageIndex]}
            alt={listingDetails?.title}
            className="w-full h-full object-contain bg-black bg-opacity-95"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-image.png';
            }}
          />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={previousImage}
                className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-r opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-l opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </>
          )}
          
          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="relative bg-gray-100 p-2">
            {/* Left scroll button */}
            {images.length > 6 && (
              <button
                onClick={() => scrollThumbnails('left')}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
            )}

            {/* Scrollable thumbnail container */}
            <div
              ref={thumbnailsRef}
              className="flex overflow-x-auto gap-2 px-8 scrollbar-hide scroll-smooth"
              style={{
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              {images.map((img, index) => (
                <button
                  key={img}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === currentImageIndex ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Optional: Add image number overlay */}
                  <div className="absolute bottom-0 right-0 bg-black/50 text-white text-xs px-1">
                    {index + 1}
                  </div>
                </button>
              ))}
            </div>

            {/* Right scroll button */}
            {images.length > 6 && (
              <button
                onClick={() => scrollThumbnails('right')}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Main Content Sections */}
        <div className="space-y-8 p-6">
          {/* Location Section */}
          <button
            onClick={() => setIsMapOpen(true)}
            className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-sm hover:bg-gray-50 rounded-lg transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <MapPinIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
              <span className="text-gray-600 group-hover:text-gray-900">{listingDetails?.location}</span>
            </div>
            <svg className="h-5 w-5 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Seller Information Section */}
          {listingDetails?.sellerName && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  {/* User Avatar */}
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl font-medium text-gray-600">
                    {listingDetails.sellerName[0].toUpperCase()}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{listingDetails.sellerName}</h3>
                    </div>

                    <div className="flex items-center space-x-4 text-gray-600 text-sm mb-2">
                      <div className="flex items-center space-x-1">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Privater Nutzer</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Aktiv seit {listingDetails.registeredSince}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      {listingDetails.activeListings > 0 && listingDetails.userId && (
                        <a 
                          href={`https://www.kleinanzeigen.de/s-bestandsliste.html?userId=${listingDetails.userId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-900 hover:text-gray-700"
                        >
                          {listingDetails.activeListings} Anzeigen online
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Description Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Beschreibung</h2>
            <div 
              className="prose prose-sm max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: listingDetails?.description }}
            />
          </div>

          {/* Details Grid Section */}
          {listingDetails?.details && Object.keys(listingDetails.details).length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
              <div className="grid grid-cols-2 gap-6">
                {Object.entries(listingDetails.details).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <span className="text-sm font-medium text-gray-500">{key}</span>
                    <div className="text-gray-900">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info Section */}
          {listingDetails?.additional_info && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Zusätzliche Informationen</h2>
              <div className="text-sm text-gray-600">
                {listingDetails.additional_info}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Analysis */}
      <div className="w-1/2 p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-8 p-4 bg-blue-50 rounded-xl">
            <SparklesIcon className="h-6 w-6 text-blue-600 animate-pulse" />
            <span className="ml-2 text-lg font-semibold text-blue-900">AI Analysis in Progress</span>
          </div>
          
          {/* Progress Steps */}
          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`p-5 rounded-xl border shadow-sm transition-all ${
                  step.id < currentStep
                    ? 'bg-green-50 border-green-200'
                    : step.id === currentStep
                    ? 'bg-blue-50 border-blue-200 shadow-md'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                      step.id < currentStep
                        ? 'bg-green-100'
                        : step.id === currentStep
                        ? 'bg-blue-100'
                        : 'bg-gray-100'
                    }`}
                  >
                    {step.id < currentStep ? (
                      <svg
                        className="h-6 w-6 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : step.id === currentStep ? (
                      <SparklesIcon className="h-6 w-6 text-blue-600 animate-pulse" />
                    ) : (
                      <span className="text-gray-400 font-medium">{step.id}</span>
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      step.id < currentStep
                        ? 'text-green-900'
                        : step.id === currentStep
                        ? 'text-blue-900'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>

                {/* Analysis results */}
                {step.id < currentStep && step.result && (
                  <div className="mt-4 ml-14 prose prose-sm text-gray-600">
                    {step.result}
                  </div>
                )}

                {/* Loading animation */}
                {step.id === currentStep && (
                  <div className="mt-4 ml-14">
                    <div className="animate-pulse flex space-x-3">
                      <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                      <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Final Analysis */}
            {isComplete && (
              <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Analysis Complete
                </h3>
                {/* Final analysis content */}
              </div>
            )}
          </div>
        </div>
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