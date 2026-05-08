import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '../UI';
import './PaymentForm.css';

// Cargar Stripe con tu publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function PaymentFormContent({ orderData, onPaymentSuccess, onPaymentError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Crear Payment Intent en el backend
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: orderData.amount,
          customerInfo: orderData.customerInfo,
          orderInfo: orderData.orderInfo,
        }),
      });

      const { clientSecret, orderId } = await response.json();

      // Confirmar el pago
      const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
          payment_method_data: {
            billing_details: {
              name: orderData.customerInfo.name,
              email: orderData.customerInfo.email,
              phone: orderData.customerInfo.phone,
            },
          },
        },
      });

      if (paymentError) {
        setError(paymentError.message);
        onPaymentError(paymentError);
      } else {
        onPaymentSuccess({ paymentIntent, orderId });
      }
    } catch (err) {
      setError('Error al procesar el pago');
      onPaymentError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="payment-form-section">
        <h3>Información de Envío</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Nombre completo</label>
            <input
              type="text"
              value={orderData.customerInfo.name}
              disabled
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={orderData.customerInfo.email}
              disabled
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              value={orderData.customerInfo.phone}
              disabled
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Dirección de envío</label>
            <textarea
              value={orderData.customerInfo.address}
              disabled
              className="form-control"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="payment-form-section">
        <h3>Información de Pago</h3>
        <div className="card-element-container">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="payment-form-section">
        <h3>Resumen del Pedido</h3>
        <div className="order-summary">
          <div className="summary-row">
            <span>Suero de Ácido Hialurónico x{orderData.orderInfo.quantity}</span>
            <span>${orderData.amount} MXN</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${orderData.amount} MXN</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="payment-error">
          <p>{error}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        disabled={!stripe || isProcessing}
        className="payment-button"
      >
        {isProcessing ? 'Procesando...' : `Pagar $${orderData.amount} MXN`}
      </Button>
    </form>
  );
}

export default function PaymentForm({ orderData, onPaymentSuccess, onPaymentError }) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent
        orderData={orderData}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
      />
    </Elements>
  );
}
