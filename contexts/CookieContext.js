import { createContext, useContext, useState } from 'react'

const CookieContext = createContext()

export function CookieProvider({ children }) {
  const [showSettings, setShowSettings] = useState(false)
  const [showBanner, setShowBanner] = useState(false)

  const openCookieSettings = () => {
    setShowSettings(true)
  }

  return (
    <CookieContext.Provider value={{ showSettings, setShowSettings, showBanner, setShowBanner, openCookieSettings }}>
      {children}
    </CookieContext.Provider>
  )
}

export function useCookieSettings() {
  const context = useContext(CookieContext)
  if (!context) {
    throw new Error('useCookieSettings must be used within a CookieProvider')
  }
  return context
} 