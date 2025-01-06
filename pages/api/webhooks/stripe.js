import Stripe from 'stripe';
import { buffer } from 'micro';
import { supabase } from '../../../supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      // Update user's subscription status in your database
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'active',
          stripe_customer_id: session.customer,
          subscription_id: session.subscription
        })
        .eq('id', session.client_reference_id);

      if (error) {
        console.error('Error updating subscription status:', error);
      }
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
} 