import { useState } from 'react';
import { Store, Truck, MapPin, Plus, Minus, CreditCard } from 'lucide-react';
import { CONFIG } from '../../utils/config';
import { Button } from '../UI';
import PaymentForm from '../PaymentForm/PaymentForm';
import './OrderForm.css';

export default function OrderFormNew() {
  const [selectedQty, setSelectedQty] = useState(2);
  const [customQty, setCustomQty] = useState(4);
  const [useCustomQty, setUseCustomQty] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState('pickup');
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    ciudad: 'Tijuana',
    direccion: '',
    colonia: '',
    cp: ''
  });
  const [errors, setErrors] = useState({});

  const actualQty = useCustomQty ? customQty : selectedQty;
  const selectedPrice = actualQty * CONFIG.pricePerUnit;

  const handleQtySelect = (qty) => {
    setSelectedQty(qty);
    setUseCustomQty(false);
  };

  const handleCustomQtySelect = () => {
    setUseCustomQty(true);
  };

  const incrementCustomQty = () => {
    setCustomQty(prev => prev + 1);
  };

  const decrementCustomQty = () => {
    setCustomQty(prev => (prev > 4 ? prev - 1 : 4));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
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
    
    if (selectedDelivery === 'delivery') {
      if (!formData.direccion.trim()) {
        newErrors.direccion = 'La dirección es requerida';
      }
      if (!formData.cp.trim()) {
        newErrors.cp = 'El código postal es requerido';
      } else if (!/^\d{5}$/.test(formData.cp)) {
        newErrors.cp = 'El código postal debe tener 5 dígitos';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setShowPayment(true);
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    // Redirigir a página de éxito
    window.location.href = `/payment/success?order_id=${paymentData.orderId}`;
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    // Mostrar mensaje de error
    alert('Error al procesar el pago. Por favor intenta nuevamente.');
  };

  const generateOrderId = () => {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  if (showPayment) {
    const orderData = {
      amount: selectedPrice,
      customerInfo: {
        name: formData.nombre,
        email: formData.email,
        phone: formData.telefono,
        address: selectedDelivery === 'delivery' 
          ? `${formData.direccion}, ${formData.colonia}, ${formData.cp}, ${formData.ciudad}`
          : 'Recolección en tienda'
      },
      orderInfo: {
        id: generateOrderId(),
        quantity: actualQty,
        delivery: selectedDelivery
      }
    };

    return (
      <div className="order-form-wrapper">
        <div className="payment-container">
          <h2>Pagar con Tarjeta</h2>
          <PaymentForm
            orderData={orderData}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
          <Button
            variant="outline"
            onClick={() => setShowPayment(false)}
            className="back-button"
          >
            ← Volver al formulario
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-form-wrapper">
      <h3>Pide tu Suero de Ácido Hialurónico</h3>
      
      {/* Qty Selector */}
      <div className="form-label">¿Cuántos frascos?</div>
      <div className="qty-grid">
        {[1, 2, 3].map(qty => (
          <div 
            key={qty}
            className={`qty-card ${!useCustomQty && selectedQty === qty ? 'selected' : ''}`}
            onClick={() => handleQtySelect(qty)}
          >
            {qty === 2 && <div className="qty-popular">Popular</div>}
            <span className="qty-num">{qty}</span>
            <div className="qty-label">frasco{qty > 1 ? 's' : ''}</div>
            <div className="qty-price">${qty * CONFIG.pricePerUnit} MXN</div>
          </div>
        ))}
        <div 
          className={`qty-card qty-card-custom ${useCustomQty ? 'selected' : ''}`}
          onClick={handleCustomQtySelect}
        >
          <div className="qty-popular">Mayoreo</div>
          <span className="qty-num">4+</span>
          <div className="qty-label">frascos</div>
          <div className="qty-price">$300 c/u</div>
        </div>
      </div>

      {/* Custom Qty Selector */}
      {useCustomQty && (
        <div className="custom-qty-selector">
          <span className="custom-qty-label">Cantidad exacta:</span>
          <div className="custom-qty-controls">
            <button 
              type="button" 
              className="qty-btn" 
              onClick={decrementCustomQty}
              disabled={customQty <= 4}
            >
              <Minus size={18} />
            </button>
            <span className="custom-qty-value">{customQty}</span>
            <button 
              type="button" 
              className="qty-btn" 
              onClick={incrementCustomQty}
            >
              <Plus size={18} />
            </button>
          </div>
          <span className="custom-qty-total">${customQty * CONFIG.pricePerUnit} MXN</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="order-form">
        {/* Delivery Options */}
        <div className="form-label">¿Cómo quieres recibirlo?</div>
        <div className="delivery-options">
          <div 
            className={`delivery-option ${selectedDelivery === 'pickup' ? 'selected' : ''}`}
            onClick={() => setSelectedDelivery('pickup')}
          >
            <div className="delivery-option-content">
              <Store size={24} />
              <div>
                <div className="delivery-option-title">Recolección en tienda</div>
                <div className="delivery-option-desc">Pasa a recogerlo cuando quieras</div>
              </div>
            </div>
          </div>
          <div 
            className={`delivery-option ${selectedDelivery === 'delivery' ? 'selected' : ''}`}
            onClick={() => setSelectedDelivery('delivery')}
          >
            <div className="delivery-option-content">
              <Truck size={24} />
              <div>
                <div className="delivery-option-title">Envío a domicilio</div>
                <div className="delivery-option-desc">Te lo llevamos donde estés</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="form-label">Tus datos</div>
        <div className="form-grid">
          <div className="form-group">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre completo"
              value={formData.nombre}
              onChange={handleInputChange}
              className={`form-control ${errors.nombre ? 'error' : ''}`}
            />
            {errors.nombre && <span className="error-message">{errors.nombre}</span>}
          </div>
          
          <div className="form-group">
            <input
              type="tel"
              name="telefono"
              placeholder="Teléfono (10 dígitos)"
              value={formData.telefono}
              onChange={handleInputChange}
              className={`form-control ${errors.telefono ? 'error' : ''}`}
            />
            {errors.telefono && <span className="error-message">{errors.telefono}</span>}
          </div>
          
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email para comprobante"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-control ${errors.email ? 'error' : ''}`}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <select
              name="ciudad"
              value={formData.ciudad}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="Tijuana">Tijuana</option>
              <option value="Rosarito">Rosarito</option>
            </select>
          </div>
        </div>

        {/* Delivery Address */}
        {selectedDelivery === 'delivery' && (
          <>
            <div className="form-label">Dirección de envío</div>
            <div className="form-grid">
              <div className="form-group full-width">
                <input
                  type="text"
                  name="direccion"
                  placeholder="Calle y número"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  className={`form-control ${errors.direccion ? 'error' : ''}`}
                />
                {errors.direccion && <span className="error-message">{errors.direccion}</span>}
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  name="colonia"
                  placeholder="Colonia"
                  value={formData.colonia}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  name="cp"
                  placeholder="Código postal"
                  value={formData.cp}
                  onChange={handleInputChange}
                  className={`form-control ${errors.cp ? 'error' : ''}`}
                />
                {errors.cp && <span className="error-message">{errors.cp}</span>}
              </div>
            </div>
          </>
        )}

        {/* Order Summary */}
        <div className="order-summary">
          <div className="summary-row">
            <span>Suero de Ácido Hialurónico x{actualQty}</span>
            <span>${selectedPrice} MXN</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${selectedPrice} MXN</span>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          icon={<CreditCard size={18} />}
          className="submit-button"
        >
          Pagar con Tarjeta — ${selectedPrice} MXN
        </Button>
      </form>
    </div>
  );
}
