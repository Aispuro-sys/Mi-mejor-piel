import { Check, ShoppingBag } from 'lucide-react';
import { Button } from '../UI';
import './Producto.css';

const beneficios = [
  'Hidratación profunda que dura todo el día',
  'Resultados visibles en 2 semanas',
  'Fórmula pura sin químicos agresivos',
  'Para todo tipo de piel',
  'Reduce líneas de expresión',
  'Aporta luminosidad y firmeza',
  'Retiene 1000x su peso en agua',
  'Hecho en Tijuana, B.C.'
];

const faqs = [
  { q: '¿Con qué frecuencia se usa?', a: '2 veces al día: mañana y noche, antes de tu crema habitual.' },
  { q: '¿Tiene reacciones adversas?', a: 'No hemos tenido reportes. Aun así, recomendamos hacer prueba de parche primero.' },
  { q: '¿Dónde está disponible?', a: 'Tijuana y Rosarito, Baja California. ¡Envíos y recolección disponibles!' },
  { q: '¿Cuánto tiempo dura el frasco?', a: 'Con uso regular de 2 veces al día, dura aproximadamente un mes.' }
];

export default function Producto() {
  return (
    <section className="section section-producto" id="producto">
      <div className="container">
        <div className="producto-layout">
          <div className="producto-visual fade-in-scale">
            <div className="producto-img-container">
              <img 
                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=600&fit=crop" 
                alt="Suero de Ácido Hialurónico"
                className="producto-img"
              />
              <div className="producto-img-badge">✦ Ácido Hialurónico Puro ✦</div>
            </div>
          </div>
          
          <div className="producto-info fade-in">
            <div className="section-title">
              <div className="section-label">El Producto</div>
              <h2>Nuestro Suero</h2>
            </div>
            
            <div className="producto-price-display">
              <span className="precio-grande">$300</span>
              <span className="precio-moneda">MXN</span>
              <span className="precio-nota">· Precio fijo</span>
            </div>
            
            <ul className="beneficios-list">
              {beneficios.map((beneficio, index) => (
                <li key={index}>
                  <span className="icon-check">
                    <Check size={14} />
                  </span>
                  {beneficio}
                </li>
              ))}
            </ul>
            
            <Button href="#ordenar" variant="verde" icon={<ShoppingBag size={18} />}>
              Ordenar ahora — $300 MXN
            </Button>
            
            <div className="faq-grid">
              {faqs.map((faq, index) => (
                <div className="faq-item" key={index}>
                  <h4>{faq.q}</h4>
                  <p>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
