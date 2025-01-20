import { buffer } from 'micro'
import Stripe from 'stripe'
import { supabase } from '../../../supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export const config = {
  api: {
    bodyParser: false,
  },
}

async function updateSubscription(subscription, customerId) {
  try {
    // Get user by Stripe customer ID
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single()

    if (profileError) throw profileError

    // Update subscription status
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: profiles.id,
        tier: 'pro',
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customerId,
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString()
      })

    if (subscriptionError) throw subscriptionError
  } catch (error) {
    console.error('Error updating subscription:', error)
    throw error
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const buf = await buffer(req)
    const sig = req.headers['stripe-signature']

    let event
    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
    } catch (err) {
      console.error(`Webhook signature verification failed:`, err.message)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object
        await updateSubscription(subscription, subscription.customer)
        break
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    res.status(500).json({ error: 'Webhook handler failed' })
  }
} 