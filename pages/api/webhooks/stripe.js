import { buffer } from 'micro'
import Stripe from 'stripe'
import { supabaseAdmin } from '../../../supabase'

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
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      throw profileError
    }

    if (!profiles) {
      throw new Error(`No user found with Stripe customer ID: ${customerId}`)
    }

    // Prepare subscription data
    const subscriptionData = {
      user_id: profiles.id,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customerId,
      status: subscription.status,
      plan_id: subscription.items.data[0]?.price.id,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
      trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
      trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
      updated_at: new Date().toISOString()
    }

    // Upsert subscription data
    const { error: subscriptionError } = await supabaseAdmin
      .from('subscriptions')
      .upsert(subscriptionData, {
        onConflict: 'stripe_subscription_id',
        returning: true,
      })

    if (subscriptionError) {
      console.error('Error upserting subscription:', subscriptionError)
      throw subscriptionError
    }

    console.log(`Successfully updated subscription ${subscription.id} for user ${profiles.id}`)
  } catch (error) {
    console.error('Error in updateSubscription:', error)
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
      
      case 'checkout.session.completed':
        const session = event.data.object
        if (session.mode === 'subscription') {
          // Fetch the subscription details
          const subscription = await stripe.subscriptions.retrieve(session.subscription)
          await updateSubscription(subscription, session.customer)
        }
        break
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    res.status(500).json({ error: 'Webhook handler failed' })
  }
} 