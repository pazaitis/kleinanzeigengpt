import { buffer } from 'micro'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

// Create a Supabase client with the service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export const config = {
  api: {
    bodyParser: false,
  },
}

async function updateSubscription(subscription, customerId) {
  console.log('Updating subscription:', { subscription, customerId })
  try {
    // First get the user profile by customer ID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      throw profileError
    }

    if (!profile) {
      throw new Error(`No profile found for customer ID: ${customerId}`)
    }

    console.log('Found profile:', profile)

    // Update or create subscription
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: profile.id,
        tier: 'pro',
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customerId,
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id',
        returning: true
      })

    if (subscriptionError) {
      console.error('Error upserting subscription:', subscriptionError)
      throw subscriptionError
    }

    console.log('Subscription updated successfully:', subscriptionData)
    return subscriptionData
  } catch (error) {
    console.error('Error in updateSubscription:', error)
    throw error
  }
}

async function handleCheckoutSession(session) {
  console.log('Handling checkout session:', session)
  try {
    // First update the stripe_customer_id in profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        stripe_customer_id: session.customer,
        updated_at: new Date().toISOString()
      })
      .eq('id', session.client_reference_id)

    if (profileError) {
      console.error('Error updating profile:', profileError)
      throw profileError
    }

    // Get the subscription details
    const subscription = await stripe.subscriptions.retrieve(session.subscription)
    console.log('Retrieved subscription:', subscription)

    // Create/update subscription record
    const subscriptionData = await updateSubscription(subscription, session.customer)
    console.log('Subscription record created/updated:', subscriptionData)

    return subscriptionData
  } catch (error) {
    console.error('Error handling checkout session:', error)
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
      console.log('Received webhook event:', event.type)
    } catch (err) {
      console.error(`Webhook signature verification failed:`, err.message)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        console.log('Checkout session completed:', session)
        if (session.mode === 'subscription') {
          await handleCheckoutSession(session)
        }
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object
        console.log('Subscription event:', event.type, subscription)
        await updateSubscription(subscription, subscription.customer)
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