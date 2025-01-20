import '../styles/globals.css'
import CustomHead from '../components/Head'
import CookieConsent from '../components/CookieConsent'
import { CookieProvider } from '../contexts/CookieContext'

// Add error boundary for environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error(
    'Missing environment variables NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'
  )
}

function MyApp({ Component, pageProps }) {
  return (
    <CookieProvider>
      <CustomHead />
      <Component {...pageProps} />
      <CookieConsent />
    </CookieProvider>
  )
}

export default MyApp 