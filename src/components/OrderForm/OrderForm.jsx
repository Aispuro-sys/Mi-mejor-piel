import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Truck, MapPin, ShoppingBag, Plus, Minus, MessageCircle } from 'lucide-react';
import { CONFIG } from '../../utils/config';
import { Button } from '../UI';
import './OrderForm.css';

export default function OrderForm() {
  const navigate = useNavigate();
  const [selectedQty, setSelectedQty] = useState(1);
  const [customQty, setCustomQty] = useState(4);
  const [useCustomQty, setUseCustomQty] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState('pickup');

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

  const handleProceedToCheckout = () => {
    // Navegar a la página de checkout con los parámetros
    navigate(`/checkout?qty=${actualQty}&delivery=${selectedDelivery}`);
  };

  return (
    <section className="section section-order" id="ordenar">
      <div className="container">
        <div className="section-title center fade-in">
          <div className="section-label">Ordena Ahora</div>
          <h2>Tu mejor piel está<br />a un mensaje de distancia</h2>
        </div>
        
        <div className="order-layout">
          <div className="order-form-wrapper fade-in-left">
            <h3>Haz tu pedido</h3>
            <p className="subtitle">Selecciona la cantidad y el tipo de entrega para continuar.</p>

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

            {/* Order Summary */}
            <div className="order-summary">
              <div className="order-summary-row">
                <span>{actualQty} frasco{actualQty > 1 ? 's' : ''} × $300</span>
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

            <Button variant="verde" onClick={handleProceedToCheckout}>
              <ShoppingBag size={20} /> Continuar con el pedido
            </Button>
            
            <p className="order-note">
              Puedes pagar con tarjeta o en efectivo al recibir tu pedido.
            </p>
          </div>

          {/* Map Side */}
          <div className="map-side fade-in-right">
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
