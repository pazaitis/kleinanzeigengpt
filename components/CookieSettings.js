import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition, Switch } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function CookieSettings({ isOpen, onClose }) {
  const [settings, setSettings] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  })

  useEffect(() => {
    const savedConsent = localStorage.getItem('cookie-consent')
    if (savedConsent) {
      setSettings(JSON.parse(savedConsent))
    }
  }, [isOpen])

  const handleSave = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      ...settings,
      timestamp: new Date().toISOString()
    }))
    onClose()
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="absolute right-0 top-0 pr-4 pt-4">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                  onClick={onClose}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                    Cookie Settings
                  </Dialog.Title>
                  
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Necessary Cookies</h4>
                        <p className="text-sm text-gray-500">Required for the website to function properly.</p>
                      </div>
                      <Switch
                        checked={settings.necessary}
                        disabled={true}
                        className="bg-blue-600 relative inline-flex h-6 w-11 items-center rounded-full"
                      >
                        <span className="translate-x-6 inline-block h-4 w-4 rounded-full bg-white" />
                      </Switch>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Analytics Cookies</h4>
                        <p className="text-sm text-gray-500">Help us understand how visitors interact with our website.</p>
                      </div>
                      <Switch
                        checked={settings.analytics}
                        onChange={(checked) => setSettings(s => ({ ...s, analytics: checked }))}
                        className={`${settings.analytics ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
                      >
                        <span className={`${settings.analytics ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 rounded-full bg-white`} />
                      </Switch>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Marketing Cookies</h4>
                        <p className="text-sm text-gray-500">Used to deliver personalized advertisements.</p>
                      </div>
                      <Switch
                        checked={settings.marketing}
                        onChange={(checked) => setSettings(s => ({ ...s, marketing: checked }))}
                        className={`${settings.marketing ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
                      >
                        <span className={`${settings.marketing ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 rounded-full bg-white`} />
                      </Switch>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto"
                      onClick={handleSave}
                    >
                      Save Settings
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
} 