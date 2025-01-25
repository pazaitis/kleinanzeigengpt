import '../styles/globals.css'
import CustomHead from '../components/Head'
import CookieConsent from '../components/CookieConsent'
import { CookieProvider } from '../contexts/CookieContext'
import { SubscriptionProvider } from '../contexts/SubscriptionContext'

// Add error boundary for environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error(
    'Missing environment variables NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'
  )
}

function MyApp({ Component, pageProps }) {
  return (
    <SubscriptionProvider>
      <CookieProvider>
        <CustomHead />
        <Component {...pageProps} />
        <CookieConsent />
      </CookieProvider>
    </SubscriptionProvider>
  )
}

export default MyApp 