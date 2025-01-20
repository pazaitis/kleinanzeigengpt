import '../styles/globals.css'
import CustomHead from '../components/Head'
import CookieConsent from '../components/CookieConsent'
import { CookieProvider } from '../contexts/CookieContext'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabase'

export const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await Promise.all([
          fetchUser(session.user),
          fetchSubscription(session.user.id)
        ])
      } else {
        setUser(null)
        setSubscription(null)
      }
      setLoading(false)
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  async function fetchUser(user) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setUser(data)
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  async function fetchSubscription(userId) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      setSubscription(data)
    } catch (error) {
      console.error('Error fetching subscription:', error)
    }
  }

  async function checkUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await Promise.all([
          fetchUser(session.user),
          fetchSubscription(session.user.id)
        ])
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <UserContext.Provider value={{ user, subscription, loading }}>
      {children}
    </UserContext.Provider>
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