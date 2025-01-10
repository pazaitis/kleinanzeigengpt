import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { 
  UserIcon,
  TruckIcon,
  BoltIcon
} from '@heroicons/react/24/solid'

export default function MapModal({ isOpen, onClose, location }) {
  const mapRef = useRef(null)
  const geocoder = useRef(null)
  const [distances, setDistances] = useState(null)
  const [userLocation, setUserLocation] = useState(null)

  useEffect(() => {
    if (isOpen && location && window.google) {
      geocoder.current = new window.google.maps.Geocoder()
      
      // Get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            })
          },
          (error) => console.error('Error getting location:', error)
        )
      }
    }
  }, [isOpen, location])

  useEffect(() => {
    if (location && userLocation && window.google) {
      // Initialize Distance Matrix Service
      const service = new window.google.maps.DistanceMatrixService()
      
      // Get distances for different travel modes
      const modes = [
        { mode: 'WALKING', label: 'Walking' },
        { mode: 'DRIVING', label: 'Driving' },
        { mode: 'TRANSIT', label: 'Public Transit' }
      ]

      Promise.all(
        modes.map(({ mode }) =>
          new Promise((resolve) => {
            service.getDistanceMatrix(
              {
                origins: [userLocation],
                destinations: [location],
                travelMode: mode,
              },
              (response, status) => {
                if (status === 'OK') {
                  resolve({
                    mode,
                    distance: response.rows[0].elements[0].distance.text,
                    duration: response.rows[0].elements[0].duration.text
                  })
                } else {
                  resolve({ mode, error: status })
                }
              }
            )
          })
        )
      ).then(results => {
        setDistances(results)
      })
    }
  }, [location, userLocation])

  useEffect(() => {
    if (isOpen && location && window.google) {
      geocoder.current.geocode({ address: location }, (results, status) => {
        if (status === 'OK' && results[0].geometry) {
          const map = new window.google.maps.Map(mapRef.current, {
            center: results[0].geometry.location,
            zoom: 15,
          })

          new window.google.maps.Marker({
            map,
            position: results[0].geometry.location,
          })
        }
      })
    }
  }, [isOpen, location])

  const openGoogleMaps = (mode) => {
    if (userLocation && location) {
      const origin = `${userLocation.lat},${userLocation.lng}`;
      const travelMode = mode.toLowerCase();
      const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${encodeURIComponent(location)}&travelmode=${travelMode}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                    Location: {location}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-full p-1 hover:bg-gray-100 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                  </button>
                </div>

                <div ref={mapRef} className="w-full h-[400px] rounded-lg mb-4" />

                {/* Distance Information */}
                {distances && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Distance from your location:</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {distances.map(({ mode, distance, duration, error }) => (
                        <button
                          key={mode}
                          onClick={() => openGoogleMaps(mode)}
                          className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left w-full cursor-pointer"
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            {mode === 'WALKING' && (
                              <UserIcon className="h-5 w-5 text-blue-600" />
                            )}
                            {mode === 'DRIVING' && (
                              <TruckIcon className="h-5 w-5 text-green-600" />
                            )}
                            {mode === 'TRANSIT' && (
                              <BoltIcon className="h-5 w-5 text-purple-600" />
                            )}
                            <div className="text-sm font-medium text-gray-600">
                              {mode === 'WALKING' && 'By Walk'}
                              {mode === 'DRIVING' && 'By Car'}
                              {mode === 'TRANSIT' && 'Public Transit'}
                            </div>
                          </div>
                          {error ? (
                            <div className="text-red-500 text-sm">Not available</div>
                          ) : (
                            <div>
                              <div className="text-lg font-semibold text-gray-900">{distance}</div>
                              <div className="text-sm text-gray-500">{duration}</div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
} 