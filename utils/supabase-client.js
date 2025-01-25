import { supabase } from '../supabase'

export async function getUserSubscriptionStatus(userId) {
  if (!userId) return 'free'

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()

  if (error || !subscription) return 'free'
  return 'pro'
} 