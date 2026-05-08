import Stripe from 'stripe';
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    
    // Verificar que la key existe
    if (!secretKey) {
      return res.status(500).json({ 
        error: 'STRIPE_SECRET_KEY no configurada',
        hint: 'Agrega STRIPE_SECRET_KEY en Vercel Environment Variables'
      });
    }

    // Verificar que es una secret key (sk_) no publishable (pk_)
    if (!secretKey.startsWith('sk_')) {
      return res.status(500).json({ 
        error: 'STRIPE_SECRET_KEY inválida',
        hint: 'La key debe empezar con sk_test_ o sk_live_'
      });
    }

    const stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
    });

    const { amount, customerInfo, orderInfo } = req.body;

    // Validar datos requeridos
    if (!amount || !customerInfo || !orderInfo) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    // Crear Payment Intent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'mxn',
      metadata: {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        orderId: orderInfo.id,
      },
      receipt_email: customerInfo.email,
    });

    // Guardar en base de datos (opcional)
    if (process.env.DATABASE_URL) {
      try {
        const sql = neon(process.env.DATABASE_URL);
        await sql`
          INSERT INTO orders (
            id, customer_name, customer_email, customer_phone, 
            quantity, unit_price, total_amount, currency, status, payment_status,
            payment_intent_id, delivery_method, shipping_address, created_at
          ) VALUES (
            ${orderInfo.id}, 
            ${customerInfo.name}, 
            ${customerInfo.email}, 
            ${customerInfo.phone || ''}, 
            ${orderInfo.quantity || 1}, 
            300,
            ${amount}, 
            'mxn',
            'pending', 
            'pending',
            ${paymentIntent.id}, 
            ${orderInfo.delivery || 'pickup'},
            ${customerInfo.address || ''},
            NOW()
          )
        `;
      } catch (dbError) {
        console.error('DB Error:', dbError.message);
      }
    }

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      orderId: orderInfo.id,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Stripe Error:', error);
    console.error('Error message:', error.message);
    console.error('Error type:', error.type);
    console.error('Error raw:', error.raw);
    res.status(500).json({ 
      error: 'Error al crear el pago',
      details: error.message,
      type: error.type || 'unknown',
      code: error.code || 'unknown'
    });
  }
}
