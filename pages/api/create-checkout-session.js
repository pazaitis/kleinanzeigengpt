import Stripe from 'stripe';
import { supabaseAdmin } from '../../../supabase';

// More explicit error checking for the API key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
console.log('API Key check:', {
  exists: !!stripeSecretKey,
  length: stripeSecretKey?.length,
  firstChars: stripeSecretKey?.substring(0, 7)
});

if (!stripeSecretKey || typeof stripeSecretKey !== 'string') {
  throw new Error(`Invalid Stripe API key: ${typeof stripeSecretKey}`);
}

// Initialize Stripe with explicit string type
const stripe = new Stripe(String(stripeSecretKey), {
  apiVersion: '2023-10-16'
});

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  // Debug log for environment check
  console.log('Full environment check:', {
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    keyLength: process.env.STRIPE_SECRET_KEY?.length,
    nodeEnv: process.env.NODE_ENV,
    stripeInstance: !!stripe
  });

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ 
      error: 'Method not allowed',
      method: req.method,
      allowedMethods: ['POST']
    });
  }

  try {
    const { userId } = req.body

    // Get user's profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single()

    if (profileError) {
      throw new Error(`Error fetching user profile: ${profileError.message}`)
    }

    let customerId = profile?.stripe_customer_id

    // If user doesn't have a Stripe customer ID, create one
    if (!customerId) {
      const { data: userData, error: userError } = await supabaseAdmin
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single()

      if (userError) {
        throw new Error(`Error fetching user data: ${userError.message}`)
      }

      const customer = await stripe.customers.create({
        email: userData.email,
        metadata: {
          supabase_user_id: userId
        }
      })

      customerId = customer.id

      // Update user profile with Stripe customer ID
      await supabaseAdmin
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId)
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'KleinanzeigenGPT Pro',
              description: 'Monthly subscription to KleinanzeigenGPT Pro plan',
            },
            unit_amount: 2000,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/pricing`,
    })

    res.status(200).json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ error: error.message })
  }
} 