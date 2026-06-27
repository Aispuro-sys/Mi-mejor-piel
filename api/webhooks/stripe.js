import Stripe from 'stripe';
import { neon } from '@neondatabase/serverless';
import sgMail from '@sendgrid/mail';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const sql = neon(process.env.DATABASE_URL);

// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
    // Obtener detalles del pedido
    const order = await sql`
      SELECT * FROM orders 
      WHERE payment_intent_id = ${paymentIntent.id}
    `;
    
    if (order.length === 0) {
      console.error('Order not found for payment intent:', paymentIntent.id);
      return;
    }

    const orderData = order[0];

    // Actualizar orden en la base de datos
    await sql`
      UPDATE orders 
      SET status = 'completed', payment_status = 'succeeded', updated_at = NOW()
      WHERE payment_intent_id = ${paymentIntent.id}
    `;

    // Enviar email de confirmación
    await sendConfirmationEmail(orderData);
    
    console.log('Payment succeeded:', paymentIntent.id);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailed(paymentIntent) {
  try {
    // Obtener detalles del pedido
    const order = await sql`
      SELECT * FROM orders 
      WHERE payment_intent_id = ${paymentIntent.id}
    `;
    
    if (order.length === 0) {
      console.error('Order not found for payment intent:', paymentIntent.id);
      return;
    }

    const orderData = order[0];

    // Actualizar orden en la base de datos
    await sql`
      UPDATE orders 
      SET status = 'failed', payment_status = 'failed', updated_at = NOW()
      WHERE payment_intent_id = ${paymentIntent.id}
    `;

    // Enviar email de pago fallido
    await sendFailedPaymentEmail(orderData);

    console.log('Payment failed:', paymentIntent.id);
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

// Función para enviar email de confirmación
async function sendConfirmationEmail(orderData) {
  try {
    const msg = {
      to: orderData.customer_email,
      from: process.env.FROM_EMAIL || 'noreply@mi-mejor-piel.com',
      subject: '¡Pedido Confirmado - Mi Mejor Piel',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4e5c44;">¡Gracias por tu compra!</h1>
          </div>
          
          <div style="background: #f8f5f2; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-bottom: 15px;">Detalles del Pedido</h2>
            <p><strong>Número de pedido:</strong> ${orderData.order_id}</p>
            <p><strong>Producto:</strong> Suero de Ácido Hialurónico x${orderData.quantity}</p>
            <p><strong>Subtotal:</strong> $${orderData.unit_price * orderData.quantity} MXN</p>
            <p><strong>Impuesto por transacción:</strong> $${(orderData.amount - (orderData.unit_price * orderData.quantity)).toFixed(2)} MXN</p>
            <p><strong>Total:</strong> $${orderData.amount} MXN</p>
            <p><strong>Método de pago:</strong> Tarjeta de crédito/débito</p>
            <p><strong>Estado:</strong> <span style="color: #28a745;">Pagado y Confirmado</span></p>
          </div>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #4e5c44; margin-top: 0;">¿Qué sigue?</h3>
            <p>Tu pedido será procesado y enviado en las próximas 24-48 horas hábiles.</p>
            <p>Recibirás un email cuando tu pedido haya sido enviado.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; font-size: 14px;">
              Si tienes alguna pregunta, contáctanos:<br>
              📧 Email: contacto@mi-mejor-piel.com<br>
              📱 WhatsApp: +52 619 341 4647
            </p>
          </div>
        </div>
      `
    };

    await sgMail.send(msg);
    console.log('Confirmation email sent to:', orderData.customer_email);
    
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
}

// Función para enviar email de pago fallido
async function sendFailedPaymentEmail(orderData) {
  try {
    const msg = {
      to: orderData.customer_email,
      from: process.env.FROM_EMAIL || 'noreply@mi-mejor-piel.com',
      subject: 'Problema con tu pago - Mi Mejor Piel',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #dc3545;">Hubo un problema con tu pago</h1>
          </div>
          
          <div style="background: #f8d7da; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #721c24; margin-bottom: 15px;">Detalles del Intento</h2>
            <p><strong>Número de pedido:</strong> ${orderData.order_id}</p>
            <p><strong>Producto:</strong> Suero de Ácido Hialurónico x${orderData.quantity}</p>
            <p><strong>Subtotal:</strong> $${orderData.unit_price * orderData.quantity} MXN</p>
            <p><strong>Impuesto por transacción:</strong> $${(orderData.amount - (orderData.unit_price * orderData.quantity)).toFixed(2)} MXN</p>
            <p><strong>Total:</strong> $${orderData.amount} MXN</p>
            <p><strong>Estado:</strong> <span style="color: #dc3545;">Pago no procesado</span></p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #856404; margin-top: 0;">¿Qué puedes hacer?</h3>
            <ul style="color: #856404;">
              <li>Intenta realizar el pago nuevamente con otra tarjeta</li>
              <li>Verifica que tengas fondos disponibles</li>
              <li>Contacta a tu banco para autorizar la transacción</li>
            </ul>
          </div>
          
          <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #0c5460; margin-top: 0;">¿Necesitas ayuda?</h3>
            <p style="color: #0c5460;">Estamos aquí para ayudarte. Contáctanos directamente:</p>
            <p style="color: #0c5460;">
              📧 Email: contacto@mi-mejor-piel.com<br>
              📱 WhatsApp: +52 619 341 4647
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.SITE_URL || 'https://mi-mejor-piel.vercel.app'}/checkout" 
               style="background: #4e5c44; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
              Intentar Pago Nuevamente
            </a>
          </div>
        </div>
      `
    };

    await sgMail.send(msg);
    console.log('Failed payment email sent to:', orderData.customer_email);
    
  } catch (error) {
    console.error('Error sending failed payment email:', error);
  }
}
