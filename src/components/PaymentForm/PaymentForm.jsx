import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements, 
  CardNumberElement, 
  CardExpiryElement, 
  CardCvcElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';
import { Button } from '../UI';
import './PaymentForm.css';

// Cargar Stripe con tu publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1a1a1a',
      fontFamily: '"DM Sans", sans-serif',
      '::placeholder': {
        color: '#9ca3af',
      },
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
};

function PaymentFormContent({ orderData, onPaymentSuccess, onPaymentError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  });

  const handleCardChange = (event) => {
    setCardComplete(prev => ({
      ...prev,
      [event.elementType]: event.complete,
    }));
    
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  const isFormComplete = cardComplete.cardNumber && cardComplete.cardExpiry && cardComplete.cardCvc;

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    if (!isFormComplete) {
      setError('Por favor completa todos los campos de la tarjeta');
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

      if (!response.ok) {
        throw new Error('Error al crear el pago');
      }

      const { clientSecret, orderId } = await response.json();

      // Confirmar el pago con CardNumberElement
      const cardElement = elements.getElement(CardNumberElement);
      
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: orderData.customerInfo.name,
              email: orderData.customerInfo.email,
              phone: orderData.customerInfo.phone,
            },
          },
        }
      );

      if (paymentError) {
        setError(paymentError.message);
        if (onPaymentError) onPaymentError(paymentError);
      } else if (paymentIntent.status === 'succeeded') {
        // Redirigir a página de éxito
        window.location.href = `/payment/success?order_id=${orderId}&payment_intent=${paymentIntent.id}`;
      }
    } catch (err) {
      setError(err.message || 'Error al procesar el pago');
      if (onPaymentError) onPaymentError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="payment-header">
        <CreditCard size={32} />
        <h3>Pago Seguro con Tarjeta</h3>
        <p>Tus datos están protegidos con encriptación SSL</p>
      </div>

      <div className="payment-form-section">
        <h4>Resumen del Pedido</h4>
        <div className="order-summary-card">
          <div className="summary-item">
            <span>Suero de Ácido Hialurónico</span>
            <span>x{orderData.orderInfo.quantity}</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-total">
            <span>Total a pagar</span>
            <span className="total-amount">${orderData.amount} MXN</span>
          </div>
        </div>
      </div>

      <div className="payment-form-section">
        <h4>Información del Cliente</h4>
        <div className="customer-info-grid">
          <div className="info-item">
            <span className="info-label">Nombre:</span>
            <span className="info-value">{orderData.customerInfo.name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{orderData.customerInfo.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Teléfono:</span>
            <span className="info-value">{orderData.customerInfo.phone}</span>
          </div>
          <div className="info-item full-width">
            <span className="info-label">Entrega:</span>
            <span className="info-value">{orderData.customerInfo.address}</span>
          </div>
        </div>
      </div>

      <div className="payment-form-section">
        <h4>Datos de la Tarjeta</h4>
        <div className="card-fields">
          <div className="card-field">
            <label>Número de tarjeta</label>
            <div className="card-input-wrapper">
              <CardNumberElement 
                options={CARD_ELEMENT_OPTIONS} 
                onChange={handleCardChange}
              />
              {cardComplete.cardNumber && <CheckCircle size={18} className="check-icon" />}
            </div>
          </div>
          
          <div className="card-row">
            <div className="card-field">
              <label>Fecha de expiración</label>
              <div className="card-input-wrapper">
                <CardExpiryElement 
                  options={CARD_ELEMENT_OPTIONS} 
                  onChange={handleCardChange}
                />
                {cardComplete.cardExpiry && <CheckCircle size={18} className="check-icon" />}
              </div>
            </div>
            
            <div className="card-field">
              <label>CVC</label>
              <div className="card-input-wrapper">
                <CardCvcElement 
                  options={CARD_ELEMENT_OPTIONS} 
                  onChange={handleCardChange}
                />
                {cardComplete.cardCvc && <CheckCircle size={18} className="check-icon" />}
              </div>
            </div>
          </div>
        </div>
        
        <div className="accepted-cards">
          <span>Aceptamos:</span>
          <div className="card-logos">
            <svg viewBox="0 0 38 24" width="38" height="24" role="img" aria-labelledby="visa"><title id="visa">Visa</title><path fill="#1434CB" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/><path fill="#fff" d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z"/></svg>
            <svg viewBox="0 0 38 24" width="38" height="24" role="img" aria-labelledby="mastercard"><title id="mastercard">Mastercard</title><path fill="#000" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/><circle fill="#EB001B" cx="15" cy="12" r="7"/><circle fill="#F79E1B" cx="23" cy="12" r="7"/><path fill="#FF5F00" d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"/></svg>
            <svg viewBox="0 0 38 24" width="38" height="24" role="img" aria-labelledby="amex"><title id="amex">American Express</title><path fill="#006FCF" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/><path fill="#fff" d="M8.971 10.268l.774 1.876H8.203l.768-1.876zm16.075.078h-2.977v.827h2.929v1.239h-2.923v.922h2.977v.739l2.077-2.245-2.077-2.34-.006.858zm-14.063-2.34h3.995l.887 1.935.822-1.935h3.989v5.594l-3.132.012-1.442-3.36v3.36h-2.492l-.483-1.18H9.461l-.477 1.18H6.322l2.661-5.606zm11.685 0h2.89l1.947 2.381V8.006h1.828l1.428 2.381 1.476-2.381h1.875v5.594h-1.864V10.4l-1.673 2.7h-1.476l-1.673-2.7v3.2h-2.89l-.483-1.18h-2.89l-.483 1.18h-2.077l2.661-5.594z"/></svg>
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
        variant="verde"
        disabled={!stripe || isProcessing || !isFormComplete}
        className="payment-button"
      >
        <Lock size={18} />
        {isProcessing ? 'Procesando pago...' : `Pagar $${orderData.amount} MXN`}
      </Button>

      <div className="security-notice">
        <Lock size={14} />
        <span>Pago seguro procesado por Stripe. Tus datos están encriptados.</span>
      </div>
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
