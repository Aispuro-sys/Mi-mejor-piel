import Stripe from 'stripe';
import { neon } from '@neondatabase/serverless';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, customerInfo, orderInfo } = req.body;

    // Crear Payment Intent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convertir a centavos
      currency: 'mxn',
      metadata: {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        orderId: orderInfo.id,
        quantity: orderInfo.quantity.toString(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Guardar orden en la base de datos
    await sql`
      INSERT INTO orders (
        id, customer_name, customer_email, customer_phone, 
        quantity, amount, status, payment_intent_id, created_at
      ) VALUES (
        ${orderInfo.id}, ${customerInfo.name}, ${customerInfo.email}, 
        ${customerInfo.phone}, ${orderInfo.quantity}, ${amount}, 
        'pending', ${paymentIntent.id}, NOW()
      )
    `;

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      orderId: orderInfo.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
}
