export function getCookieConsent() {
  if (typeof window === 'undefined') return null
  
  const consent = localStorage.getItem('cookie-consent')
  if (!consent) return null
  
  return JSON.parse(consent)
}

export function hasAnalyticsConsent() {
  const consent = getCookieConsent()
  return consent?.analytics === true
}

export function hasMarketingConsent() {
  const consent = getCookieConsent()
  return consent?.marketing === true
} 