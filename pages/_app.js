import '../styles/globals.css'
import CustomHead from '../components/Head'
import CookieConsent from '../components/CookieConsent'
import { CookieProvider } from '../contexts/CookieContext'

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