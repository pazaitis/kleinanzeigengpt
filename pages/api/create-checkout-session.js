import Stripe from 'stripe';

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
    console.log('Creating checkout session...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal'],
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
      payment_method_options: {
        paypal: {
          setup_future_usage: 'on_session',
        },
      },
      billing_address_collection: 'required',
      customer_email: req.body.email,
    });

    console.log('Session created:', session.id);
    
    // Ensure we're sending a properly formatted JSON response
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      sessionId: session.id,
      success: true
    });

  } catch (error) {
    console.error('Stripe error:', error);
    // Ensure we're sending a properly formatted error response
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: error.message,
      success: false,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 