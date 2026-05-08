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
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/100px-Visa_Inc._logo.svg.png" alt="Visa" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/100px-Mastercard-logo.svg.png" alt="Mastercard" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/100px-American_Express_logo_%282018%29.svg.png" alt="Amex" />
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
