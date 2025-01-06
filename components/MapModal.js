import { Fragment, useEffect, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function MapModal({ isOpen, onClose, location }) {
  const mapRef = useRef(null)
  const geocoder = useRef(null)
  const circle = useRef(null)

  useEffect(() => {
    // Initialize map when modal opens
    if (isOpen && location && window.google) {
      geocoder.current = new window.google.maps.Geocoder()
      
      geocoder.current.geocode({ address: location }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const map = new window.google.maps.Map(mapRef.current, {
            center: results[0].geometry.location,
            zoom: 13,
            mapTypeControl: false,
            streetViewControl: false
          })

          // Add circle overlay
          circle.current = new window.google.maps.Circle({
            map: map,
            center: results[0].geometry.location,
            radius: 800, // 800 meters radius
            strokeColor: '#4F46E5',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#4F46E5',
            fillOpacity: 0.1
          })
        }
      })
    }
  }, [isOpen, location])

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white shadow-xl transition-all">
                <div className="relative">
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                  <div className="h-[500px] w-full" ref={mapRef}>
                    {/* Map will be rendered here */}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
} 