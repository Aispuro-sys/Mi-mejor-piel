import { useState } from 'react';
import { Store, Truck, MapPin, MessageCircle, Lock } from 'lucide-react';
import { CONFIG, PRICES } from '../../utils/config';
import { Button } from '../UI';
import './OrderForm.css';

export default function OrderForm() {
  const [selectedQty, setSelectedQty] = useState(2);
  const [selectedDelivery, setSelectedDelivery] = useState('pickup');
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    ciudad: '',
    direccion: '',
    mensaje: ''
  });
  const [errors, setErrors] = useState({});

  const selectedPrice = PRICES[selectedQty] || 300;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'Por favor ingresa tu nombre';
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'Por favor ingresa tu teléfono';
    } else if (formData.telefono.replace(/\D/g, '').length < 10) {
      newErrors.telefono = 'Ingresa un número válido (mínimo 10 dígitos)';
    }
    if (!formData.ciudad) newErrors.ciudad = 'Por favor selecciona tu ciudad';
    if (selectedDelivery === 'delivery' && !formData.direccion.trim()) {
      newErrors.direccion = 'Por favor ingresa tu dirección de entrega';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const deliveryText = selectedDelivery === 'pickup' 
      ? 'Recolección en punto de encuentro' 
      : `Envío a domicilio: ${formData.direccion.trim()}`;
    
    let waMsg = `*NUEVO PEDIDO - Mi Mejor Piel*\n`;
    waMsg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    waMsg += `• *Nombre:* ${formData.nombre.trim()}\n`;
    waMsg += `• *Teléfono:* ${formData.telefono.trim()}\n`;
    waMsg += `• *Ciudad:* ${formData.ciudad}\n`;
    waMsg += `• *Cantidad:* ${selectedQty} frasco${selectedQty > 1 ? 's' : ''}\n`;
    waMsg += `• *Entrega:* ${deliveryText}\n`;
    waMsg += `• *Total:* $${selectedPrice} MXN\n`;
    if (formData.mensaje.trim()) {
      waMsg += `\n*Nota:* ${formData.mensaje.trim()}\n`;
    }
    waMsg += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
    waMsg += `Gracias por tu pedido!`;

    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(waMsg)}`, '_blank');
  };

  return (
    <section className="section section-order" id="ordenar">
      <div className="container">
        <div className="section-title center">
          <div className="section-label">Ordena Ahora</div>
          <h2>Tu mejor piel está<br />a un mensaje de distancia</h2>
        </div>
        
        <div className="order-layout">
          <div className="order-form-wrapper">
            <h3>Haz tu pedido</h3>
            <p className="subtitle">Completa el formulario y te contactamos por WhatsApp para confirmar.</p>

            {/* Qty Selector */}
            <div className="form-label">¿Cuántos frascos?</div>
            <div className="qty-grid">
              {[1, 2, 3].map(qty => (
                <div 
                  key={qty}
                  className={`qty-card ${selectedQty === qty ? 'selected' : ''}`}
                  onClick={() => setSelectedQty(qty)}
                >
                  {qty === 2 && <div className="qty-popular">Popular</div>}
                  <span className="qty-num">{qty}</span>
                  <div className="qty-label">frasco{qty > 1 ? 's' : ''}</div>
                  <div className="qty-price">${PRICES[qty]} MXN</div>
                </div>
              ))}
            </div>

            {/* Delivery Options */}
            <div className="form-label">Tipo de entrega</div>
            <div className="delivery-options">
              <div 
                className={`delivery-option ${selectedDelivery === 'pickup' ? 'selected' : ''}`}
                onClick={() => setSelectedDelivery('pickup')}
              >
                <div className="dicon"><Store size={20} /></div>
                <div className="dtext">
                  <strong>Recolección</strong>
                  <span>Punto de encuentro</span>
                </div>
              </div>
              <div 
                className={`delivery-option ${selectedDelivery === 'delivery' ? 'selected' : ''}`}
                onClick={() => setSelectedDelivery('delivery')}
              >
                <div className="dicon"><Truck size={20} /></div>
                <div className="dtext">
                  <strong>Envío a domicilio</strong>
                  <span>Preguntar costo</span>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="form-group">
              <label className="form-label" htmlFor="nombre">Nombre completo</label>
              <input 
                type="text" 
                id="nombre" 
                name="nombre"
                className={`form-control ${errors.nombre ? 'error' : ''}`}
                placeholder="Tu nombre"
                value={formData.nombre}
                onChange={handleInputChange}
              />
              {errors.nombre && <span className="error-msg">{errors.nombre}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="telefono">WhatsApp / Teléfono</label>
              <input 
                type="tel" 
                id="telefono" 
                name="telefono"
                className={`form-control ${errors.telefono ? 'error' : ''}`}
                placeholder="(664) 000-0000"
                value={formData.telefono}
                onChange={handleInputChange}
              />
              {errors.telefono && <span className="error-msg">{errors.telefono}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ciudad">Ciudad</label>
              <select 
                id="ciudad" 
                name="ciudad"
                className={`form-control ${errors.ciudad ? 'error' : ''}`}
                value={formData.ciudad}
                onChange={handleInputChange}
              >
                <option value="">Selecciona tu ciudad</option>
                <option value="Tijuana">Tijuana</option>
                <option value="Rosarito">Rosarito</option>
                <option value="Otra">Otra ciudad</option>
              </select>
              {errors.ciudad && <span className="error-msg">{errors.ciudad}</span>}
            </div>

            {selectedDelivery === 'delivery' && (
              <div className="form-group">
                <label className="form-label" htmlFor="direccion">Dirección de entrega</label>
                <input 
                  type="text" 
                  id="direccion" 
                  name="direccion"
                  className={`form-control ${errors.direccion ? 'error' : ''}`}
                  placeholder="Calle, número, colonia"
                  value={formData.direccion}
                  onChange={handleInputChange}
                />
                {errors.direccion && <span className="error-msg">{errors.direccion}</span>}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="mensaje">Mensaje o pregunta (opcional)</label>
              <textarea 
                id="mensaje" 
                name="mensaje"
                className="form-control"
                placeholder="¿Tienes alguna pregunta sobre el producto?"
                value={formData.mensaje}
                onChange={handleInputChange}
              />
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <div className="order-summary-row">
                <span>{selectedQty} frasco{selectedQty > 1 ? 's' : ''} × $300</span>
                <span>${selectedPrice} MXN</span>
              </div>
              <div className="order-summary-row">
                <span>Entrega: {selectedDelivery === 'pickup' ? 'Recolección' : 'A domicilio'}</span>
                <span>—</span>
              </div>
              <div className="order-summary-row total">
                <span>Total</span>
                <span>${selectedPrice} MXN</span>
              </div>
            </div>

            <Button variant="whatsapp" onClick={handleSubmit}>
              <MessageCircle size={20} /> Enviar pedido por WhatsApp
            </Button>
            
            <p className="order-note">
              <Lock size={12} /> Tu información es privada y solo se usará para coordinar tu pedido.
            </p>
          </div>

          {/* Map Side */}
          <div className="map-side">
            <div className="section-label">Ubicación</div>
            <h3>Tijuana & Rosarito</h3>
            <p className="desc">
              Servimos a toda la zona de Tijuana y Rosarito, Baja California. 
              Puedes recoger tu pedido en un punto de encuentro o recibir envío a domicilio.
            </p>

            <div className="map-container">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=-117.1600%2C32.4700%2C-116.8500%2C32.5600&layer=mapnik&marker=32.5149%2C-117.0382"
                title="Mapa Tijuana, Baja California"
                loading="lazy"
              />
            </div>

            <div className="location-cards">
              <div className="location-card">
                <div className="loc-icon verde"><MapPin size={20} /></div>
                <div className="loc-info">
                  <strong>Tijuana, B.C.</strong>
                  <span>Zona principal de cobertura</span>
                </div>
              </div>
              <div className="location-card">
                <div className="loc-icon rosa"><MapPin size={20} /></div>
                <div className="loc-info">
                  <strong>Rosarito, B.C.</strong>
                  <span>También disponible en Rosarito</span>
                </div>
              </div>
              <div className="location-card">
                <div className="loc-icon gold"><MessageCircle size={20} /></div>
                <div className="loc-info">
                  <strong>Contáctanos por WhatsApp</strong>
                  <a href={CONFIG.socialMedia.whatsapp} target="_blank" rel="noopener noreferrer">
                    Enviar mensaje
                  </a>
                </div>
              </div>
              <div className="location-card">
                <div className="loc-icon verde"><MessageCircle size={20} /></div>
                <div className="loc-info">
                  <strong>Instagram</strong>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    {CONFIG.socialMedia.instagram}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
