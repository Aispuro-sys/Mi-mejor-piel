import Stripe from 'stripe';
import { neon } from '@neondatabase/serverless';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];
  
  if (!sig) {
    return res.status(400).json({ error: 'No signature' });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Manejar eventos
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handlePaymentSuccess(paymentIntent);
        break;
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await handlePaymentFailed(failedPayment);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: error.message });
  }
}

async function handlePaymentSuccess(paymentIntent) {
  try {
    // Actualizar orden en la base de datos
    await sql`
      UPDATE orders 
      SET status = 'completed', payment_status = 'succeeded', updated_at = NOW()
      WHERE payment_intent_id = ${paymentIntent.id}
    `;

    // Enviar email de confirmación (implementar después)
    console.log('Payment succeeded:', paymentIntent.id);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailed(paymentIntent) {
  try {
    // Actualizar orden en la base de datos
    await sql`
      UPDATE orders 
      SET status = 'failed', payment_status = 'failed', updated_at = NOW()
      WHERE payment_intent_id = ${paymentIntent.id}
    `;

    console.log('Payment failed:', paymentIntent.id);
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}
