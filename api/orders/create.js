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
    const sql = neon(process.env.DATABASE_URL);

    const { orderId, customerInfo, orderInfo, amount, paymentMethod, paymentStatus } = req.body;

    // Validar datos requeridos
    if (!orderId || !customerInfo || !orderInfo || !amount) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    // Guardar orden en la base de datos
    await sql`
      INSERT INTO orders (
        id, customer_name, customer_email, customer_phone, 
        quantity, unit_price, total_amount, currency, status, payment_status,
        payment_method, delivery_method, shipping_address, notes, created_at
      ) VALUES (
        ${orderId}, 
        ${customerInfo.name}, 
        ${customerInfo.email}, 
        ${customerInfo.phone}, 
        ${orderInfo.quantity}, 
        300,
        ${amount}, 
        'mxn',
        'pending', 
        ${paymentStatus || 'pending'},
        ${paymentMethod || 'cash'},
        ${orderInfo.delivery || 'pickup'},
        ${orderInfo.address || ''},
        ${orderInfo.notes || ''},
        NOW()
      )
    `;

    res.status(200).json({
      success: true,
      orderId: orderId,
      message: 'Pedido creado exitosamente'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
}
