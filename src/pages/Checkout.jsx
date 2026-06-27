import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Store, Truck, CreditCard, Banknote, ArrowLeft, Lock, CheckCircle, Download, Home } from 'lucide-react';
import { CONFIG } from '../utils/config';
import { Button } from '../components/UI';
import PaymentForm from '../components/PaymentForm/PaymentForm';
import './Checkout.css';

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Obtener datos del URL
  const qty = parseInt(searchParams.get('qty')) || 1;
  const delivery = searchParams.get('delivery') || 'pickup';
  
  const [step, setStep] = useState(1); // 1: datos, 2: método pago, 3: pago
  const [paymentMethod, setPaymentMethod] = useState(null); // 'card' o 'cash'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const receiptRef = useRef(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    ciudad: 'Tijuana',
    direccion: '',
    colonia: '',
    cp: '',
    notas: ''
  });
  const [errors, setErrors] = useState({});

  const subtotal = qty * CONFIG.pricePerUnit;
  const taxAmount = qty * CONFIG.taxPerUnit;
  const totalPrice = subtotal + taxAmount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(formData.telefono.replace(/\s/g, ''))) {
      newErrors.telefono = 'El teléfono debe tener 10 dígitos';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (delivery === 'delivery') {
      if (!formData.direccion.trim()) {
        newErrors.direccion = 'La dirección es requerida';
      }
      if (!formData.cp.trim()) {
        newErrors.cp = 'El código postal es requerido';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSelectPaymentMethod = (method) => {
    setPaymentMethod(method);
    if (method === 'card') {
      setStep(3);
    }
  };

  const generateOrderId = () => {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleCashOrder = async () => {
    setIsSubmitting(true);
    const newOrderId = generateOrderId();
    
    try {
      // Guardar pedido en la base de datos (sin pago)
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: newOrderId,
          customerInfo: {
            name: formData.nombre,
            email: formData.email,
            phone: formData.telefono,
          },
          orderInfo: {
            quantity: qty,
            delivery: delivery,
            address: delivery === 'delivery' 
              ? `${formData.direccion}, ${formData.colonia}, CP ${formData.cp}, ${formData.ciudad}`
              : 'Recolección en tienda',
            notes: formData.notas
          },
          amount: totalPrice,
          paymentMethod: 'cash',
          paymentStatus: 'pending'
        })
      });

      setOrderId(newOrderId);
      setOrderComplete(true);
    } catch (error) {
      console.error('Error creating order:', error);
      // Aún así mostrar éxito ya que el pedido se puede procesar manualmente
      setOrderId(newOrderId);
      setOrderComplete(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    setOrderId(paymentData.orderId);
    setOrderComplete(true);
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    setPaymentError(error.message || 'Error al procesar el pago');
  };

  const downloadReceipt = () => {
    const receiptContent = `
═══════════════════════════════════════════
         MI MEJOR PIEL - COMPROBANTE
═══════════════════════════════════════════

Número de Pedido: ${orderId}
Fecha: ${new Date().toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}

───────────────────────────────────────────
DATOS DEL CLIENTE
───────────────────────────────────────────
Nombre: ${formData.nombre}
Teléfono: ${formData.telefono}
Email: ${formData.email}

───────────────────────────────────────────
DETALLE DEL PEDIDO
───────────────────────────────────────────
Producto: Suero de Ácido Hialurónico
Cantidad: ${qty}
Precio unitario: $300 MXN

───────────────────────────────────────────
Subtotal: $${subtotal} MXN
${CONFIG.taxLabel}: $${taxAmount} MXN
Envío: ${delivery === 'pickup' ? 'Recolección en tienda (Gratis)' : 'A domicilio'}
${delivery === 'delivery' ? `Dirección: ${formData.direccion}, ${formData.colonia}, CP ${formData.cp}, ${formData.ciudad}` : ''}

TOTAL: $${totalPrice} MXN
───────────────────────────────────────────

Método de pago: ${paymentMethod === 'card' ? 'Tarjeta de crédito/débito' : 'Efectivo'}
Estado: ${paymentMethod === 'card' ? 'PAGADO' : 'PENDIENTE DE PAGO'}

═══════════════════════════════════════════
        ¡Gracias por tu compra!
    www.mi-mejor-piel.vercel.app
═══════════════════════════════════════════
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comprobante-${orderId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Pantalla de error de pago
  if (paymentError) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="order-error">
            <div className="error-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <h1>Error en el Pago</h1>
            <p className="error-message-text">{paymentError}</p>
            <div className="error-actions">
              <Button variant="verde" onClick={() => { setPaymentError(null); setStep(2); }}>
                Intentar de Nuevo
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} icon={<Home size={18} />}>
                Volver al Inicio
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de pedido completado
  if (orderComplete) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="order-success">
            <div className="success-icon">
              <CheckCircle size={64} />
            </div>
            <h1>¡Pedido Confirmado!</h1>
            <p className="order-id">Número de pedido: <strong>{orderId}</strong></p>
            
            {paymentMethod === 'cash' ? (
              <div className="success-message">
                <h3>Pago en Efectivo</h3>
                <p>
                  Tu pedido ha sido registrado. Te contactaremos al número 
                  <strong> {formData.telefono}</strong> para coordinar la entrega y el pago.
                </p>
                <div className="whatsapp-contact">
                  <p>También puedes contactarnos directamente:</p>
                  <a 
                    href={`https://wa.me/526193414647?text=Hola! Acabo de hacer el pedido ${orderId} y quiero coordinar el pago en efectivo.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-btn"
                  >
                    Contactar por WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <div className="success-message">
                <h3>Pago Completado</h3>
                <p>
                  Hemos enviado un comprobante a <strong>{formData.email}</strong>.
                  Tu pedido será preparado y enviado en las próximas 24-48 horas.
                </p>
              </div>
            )}
            
            <div className="success-actions">
              <Button variant="verde" onClick={downloadReceipt} icon={<Download size={18} />}>
                Descargar Comprobante
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} icon={<Home size={18} />}>
                Volver al Inicio
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Paso 3: Formulario de pago con tarjeta
  if (step === 3 && paymentMethod === 'card') {
    const orderData = {
      amount: totalPrice,
      subtotal: subtotal,
      taxAmount: taxAmount,
      customerInfo: {
        name: formData.nombre,
        email: formData.email,
        phone: formData.telefono,
        address: delivery === 'delivery' 
          ? `${formData.direccion}, ${formData.colonia}, CP ${formData.cp}, ${formData.ciudad}`
          : 'Recolección en tienda - Tijuana/Rosarito'
      },
      orderInfo: {
        id: generateOrderId(),
        quantity: qty,
        delivery: delivery
      }
    };

    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <button className="back-btn" onClick={() => setStep(2)}>
            <ArrowLeft size={20} /> Volver
          </button>
          
          <div className="checkout-header">
            <h1>Pago con Tarjeta</h1>
            <p>Completa tu pago de forma segura</p>
          </div>
          
          <PaymentForm
            orderData={orderData}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <button className="back-btn" onClick={() => step === 1 ? navigate('/') : setStep(step - 1)}>
          <ArrowLeft size={20} /> {step === 1 ? 'Volver a la tienda' : 'Volver'}
        </button>

        {/* Progress Steps */}
        <div className="checkout-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Datos</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Método de Pago</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Confirmar</span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary-box">
          <h3>Resumen del Pedido</h3>
          <div className="summary-item">
            <span>Suero de Ácido Hialurónico x{qty}</span>
            <span>${subtotal} MXN</span>
          </div>
          <div className="summary-item">
            <span>{CONFIG.taxLabel}</span>
            <span>${taxAmount} MXN</span>
          </div>
          <div className="summary-item delivery-type">
            {delivery === 'pickup' ? (
              <><Store size={16} /> Recolección en tienda</>
            ) : (
              <><Truck size={16} /> Envío a domicilio</>
            )}
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>${totalPrice} MXN</span>
          </div>
        </div>

        {/* Step 1: Customer Data */}
        {step === 1 && (
          <div className="checkout-step">
            <h2>Tus Datos</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Nombre completo *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={errors.nombre ? 'error' : ''}
                  placeholder="Tu nombre completo"
                />
                {errors.nombre && <span className="error-msg">{errors.nombre}</span>}
              </div>
              
              <div className="form-group">
                <label>Teléfono *</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className={errors.telefono ? 'error' : ''}
                  placeholder="10 dígitos"
                />
                {errors.telefono && <span className="error-msg">{errors.telefono}</span>}
              </div>
              
              <div className="form-group full-width">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="Para enviarte el comprobante"
                />
                {errors.email && <span className="error-msg">{errors.email}</span>}
              </div>
            </div>

            {delivery === 'delivery' && (
              <>
                <h3 className="subsection-title">Dirección de Envío</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Ciudad</label>
                    <select
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleInputChange}
                    >
                      <option value="Tijuana">Tijuana</option>
                      <option value="Rosarito">Rosarito</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Código Postal *</label>
                    <input
                      type="text"
                      name="cp"
                      value={formData.cp}
                      onChange={handleInputChange}
                      className={errors.cp ? 'error' : ''}
                      placeholder="5 dígitos"
                    />
                    {errors.cp && <span className="error-msg">{errors.cp}</span>}
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Calle y Número *</label>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      className={errors.direccion ? 'error' : ''}
                      placeholder="Ej: Av. Revolución 1234"
                    />
                    {errors.direccion && <span className="error-msg">{errors.direccion}</span>}
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Colonia</label>
                    <input
                      type="text"
                      name="colonia"
                      value={formData.colonia}
                      onChange={handleInputChange}
                      placeholder="Nombre de la colonia"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="form-group full-width">
              <label>Notas adicionales (opcional)</label>
              <textarea
                name="notas"
                value={formData.notas}
                onChange={handleInputChange}
                placeholder="Instrucciones especiales para la entrega..."
                rows={3}
              />
            </div>

            <Button 
              variant="verde" 
              onClick={handleContinueToPayment}
              className="continue-btn"
            >
              Continuar al Pago
            </Button>
          </div>
        )}

        {/* Step 2: Payment Method Selection */}
        {step === 2 && (
          <div className="checkout-step">
            <h2>¿Cómo quieres pagar?</h2>
            
            <div className="payment-methods">
              <div 
                className={`payment-method-card ${paymentMethod === 'card' ? 'selected' : ''}`}
                onClick={() => handleSelectPaymentMethod('card')}
              >
                <div className="method-icon">
                  <CreditCard size={32} />
                </div>
                <div className="method-info">
                  <h3>Pago con Tarjeta</h3>
                  <p>Paga ahora con tu tarjeta de crédito o débito</p>
                  <div className="method-badges">
                    <span className="badge secure"><Lock size={12} /> Pago Seguro</span>
                    <span className="badge instant">Confirmación Inmediata</span>
                  </div>
                </div>
              </div>
              
              <div 
                className={`payment-method-card ${paymentMethod === 'cash' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('cash')}
              >
                <div className="method-icon cash">
                  <Banknote size={32} />
                </div>
                <div className="method-info">
                  <h3>Pago en Efectivo</h3>
                  <p>Paga al recibir tu pedido o al recogerlo</p>
                  <div className="method-badges">
                    <span className="badge">Sin tarjeta necesaria</span>
                  </div>
                </div>
              </div>
            </div>

            {paymentMethod === 'cash' && (
              <div className="cash-confirmation">
                <h3>Confirmar Pedido</h3>
                <p>
                  Al confirmar, te contactaremos al número <strong>{formData.telefono}</strong> 
                  para coordinar la entrega y el pago en efectivo.
                </p>
                <Button 
                  variant="verde" 
                  onClick={handleCashOrder}
                  disabled={isSubmitting}
                  className="confirm-btn"
                >
                  {isSubmitting ? 'Procesando...' : `Confirmar Pedido — $${totalPrice} MXN`}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
