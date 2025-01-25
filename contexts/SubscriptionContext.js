import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../supabase'
import { getUserSubscriptionStatus } from '../utils/supabase-client'

const SubscriptionContext = createContext()

export function SubscriptionProvider({ children }) {
  const [subscriptionStatus, setSubscriptionStatus] = useState('loading')
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Check user and subscription status on mount and auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        checkSubscription(session.user.id)
      } else {
        setSubscriptionStatus('free')
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          checkSubscription(session.user.id)
        } else {
          setSubscriptionStatus('free')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (user?.id) {
      // Listen for changes to user's subscription using realtime
      const channel = supabase
        .channel('subscription-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'subscriptions',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            checkSubscription(user.id)
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [user])

  const checkSubscription = async (userId) => {
    const status = await getUserSubscriptionStatus(userId)
    setSubscriptionStatus(status)
  }

  return (
    <SubscriptionContext.Provider value={{ subscriptionStatus, user, checkSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
} 