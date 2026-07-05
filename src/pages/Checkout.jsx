import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Store, Truck, CreditCard, ArrowLeft, Lock, CheckCircle, Download, Home } from 'lucide-react';
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
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const receiptRef = useRef(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    ciudad: '',
    direccion: '',
    colonia: '',
    cp: '',
    notas: ''
  });
  const [errors, setErrors] = useState({});

  const subtotal = qty * CONFIG.pricePerUnit;
  const taxAmount = qty * CONFIG.taxPerUnit;
  const shippingAmount = delivery === 'delivery' ? CONFIG.shippingCost : 0;
  const totalPrice = subtotal + taxAmount + shippingAmount;

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
      // Validar que se haya seleccionado una zona de envío
      if (!formData.ciudad) {
        newErrors.ciudad = 'Selecciona una zona de entrega válida';
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

  const generateOrderId = () => {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
Envío: ${delivery === 'pickup' ? 'Recolección en tienda (Gratis)' : `A domicilio ($${shippingAmount} MXN)`}
${delivery === 'delivery' ? `Dirección: ${formData.direccion}, ${formData.colonia}, CP ${formData.cp}, ${formData.ciudad}` : ''}

TOTAL: $${totalPrice} MXN
───────────────────────────────────────────

Método de pago: Tarjeta de crédito/débito
Estado: PAGADO

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
            
            <div className="success-message">
              <h3>Pago Completado</h3>
              <p>
                Hemos enviado un comprobante a <strong>{formData.email}</strong>.
                Tu pedido será preparado y enviado en las próximas 24-48 horas.
              </p>
            </div>
            
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

  const orderData = {
    amount: totalPrice,
    subtotal: subtotal,
    taxAmount: taxAmount,
    shippingAmount: shippingAmount,
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
      delivery: delivery,
      shippingAddress: delivery === 'delivery'
        ? `${formData.direccion}, ${formData.colonia}, CP ${formData.cp}, ${formData.ciudad}`
        : null
    }
  };

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
            <span className="step-label">Pago</span>
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
          <div className="summary-item">
            <span>Envío</span>
            <span>{delivery === 'pickup' ? 'Gratis' : `$${shippingAmount} MXN`}</span>
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
                    <label>Zona de entrega *</label>
                    <select
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleInputChange}
                      className={errors.ciudad ? 'error' : ''}
                    >
                      <option value="">Selecciona una zona</option>
                      <option value="Tijuana Centro">Tijuana Centro</option>
                      <option value="Tijuana 5 y 10">Tijuana 5 y 10</option>
                      <option value="Rosarito Centro">Rosarito Centro</option>
                    </select>
                    {errors.ciudad && <span className="error-msg">{errors.ciudad}</span>}
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
              Continuar al Pago con Tarjeta
            </Button>
          </div>
        )}

        {/* Step 2: Card Payment */}
        {step === 2 && (
          <div className="checkout-step">
            <div className="payment-methods">
              <div className="payment-method-card selected">
                <div className="method-icon">
                  <CreditCard size={32} />
                </div>
                <div className="method-info">
                  <h3>Pago con Tarjeta</h3>
                  <p>Pago seguro con confirmación inmediata</p>
                  <div className="method-badges">
                    <span className="badge secure"><Lock size={12} /> Pago Seguro</span>
                    <span className="badge instant">Confirmación Inmediata</span>
                  </div>
                </div>
              </div>
            </div>

            <PaymentForm
              orderData={orderData}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </div>
        )}
      </div>
    </div>
  );
}
