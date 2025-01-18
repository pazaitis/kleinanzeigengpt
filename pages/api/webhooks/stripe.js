import { buffer } from 'micro'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase with service role key for admin access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export const config = {
  api: {
    bodyParser: false,
  },
}

async function updateSubscriptionInDatabase(subscription, customerId) {
  try {
    // Get user by Stripe customer ID
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single()

    if (profileError) throw profileError

    // Update or insert subscription
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: profiles.id,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        plan_type: subscription.items.data[0].price.lookup_key,
        current_period_start: new Date(subscription.current_period_start * 1000),
        current_period_end: new Date(subscription.current_period_end * 1000),
        updated_at: new Date()
      })

    if (subscriptionError) throw subscriptionError

    // Update user profile with subscription status
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        is_subscribed: subscription.status === 'active',
        subscription_status: subscription.status,
        subscription_plan: subscription.items.data[0].price.lookup_key,
        updated_at: new Date()
      })
      .eq('id', profiles.id)

    if (updateError) throw updateError
  } catch (error) {
    console.error('Error updating subscription in database:', error)
    throw error
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end()
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
        await updateSubscriptionInDatabase(subscription, subscription.customer)
        break

      case 'checkout.session.completed':
        const session = event.data.object
        if (session.mode === 'subscription') {
          const subscription = await stripe.subscriptions.retrieve(session.subscription)
          await updateSubscriptionInDatabase(subscription, session.customer)
        }
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    res.status(500).json({ error: 'Webhook handler failed' })
  }
} 