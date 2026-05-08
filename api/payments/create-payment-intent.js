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
    // Verificar que la key existe
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY no está configurada');
      return res.status(500).json({ error: 'Error de configuración del servidor' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });

    const { amount, customerInfo, orderInfo } = req.body;

    // Validar datos requeridos
    if (!amount || !customerInfo || !orderInfo) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    // Crear Payment Intent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convertir a centavos
      currency: 'mxn',
      metadata: {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        orderId: orderInfo.id,
        quantity: orderInfo.quantity.toString(),
        delivery: orderInfo.delivery || 'pickup',
      },
      receipt_email: customerInfo.email,
      description: `Suero de Ácido Hialurónico x${orderInfo.quantity} - Mi Mejor Piel`,
    });

    // Guardar orden en la base de datos
    try {
      await sql`
        INSERT INTO orders (
          id, customer_name, customer_email, customer_phone, 
          quantity, unit_price, total_amount, currency, status, payment_status,
          payment_intent_id, delivery_method, shipping_address, created_at
        ) VALUES (
          ${orderInfo.id}, 
          ${customerInfo.name}, 
          ${customerInfo.email}, 
          ${customerInfo.phone}, 
          ${orderInfo.quantity}, 
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
      console.error('Error guardando en DB:', dbError);
      // Continuar aunque falle la DB - el pago es más importante
    }

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      orderId: orderInfo.id,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error.message);
    console.error('Error type:', error.type);
    console.error('Error code:', error.code);
    res.status(500).json({ 
      error: 'Error al crear el pago',
      details: error.message,
      type: error.type || 'unknown'
    });
  }
}
