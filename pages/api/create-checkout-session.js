import Stripe from 'stripe';

// Add error handling for missing API key
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16' // Add explicit API version
});

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  // Debug log for environment variables
  console.log('Environment check:', {
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    keyLength: process.env.STRIPE_SECRET_KEY?.length,
    nodeEnv: process.env.NODE_ENV
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
      payment_method_types: ['card'],
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