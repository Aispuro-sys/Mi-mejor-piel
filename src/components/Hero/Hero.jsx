import { ShoppingBag } from 'lucide-react';
import { Button } from '../UI';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-bg"></div>
      <div className="hero-deco hero-deco-1"></div>
      <div className="hero-deco hero-deco-2"></div>
      <div className="hero-deco hero-deco-3"></div>
      
      <div className="container">
        <div className="hero-content">
          <div className="hero-eyebrow">Suero de Ácido Hialurónico Puro</div>
          <h1>Descubre Tu<br />Mejor <em>Piel</em></h1>
          <p className="hero-desc">
            Un suero diseñado con ingredientes puros para brindarte hidratación 
            profunda y resultados visibles desde la primera semana. Hecho con amor en Tijuana.
          </p>
          
          <div className="hero-price-row">
            <div className="hero-price">
              <span className="price-number">
                <span className="currency">$</span>300
              </span>
              <small>MXN · Precio fijo</small>
            </div>
            <div className="hero-divider"></div>
            <div className="hero-badge">
              <strong>Resultados en 2 semanas</strong>
              Aplicando 2 veces al día
            </div>
          </div>
          
          <div className="hero-actions">
            <Button href="#ordenar" variant="primary" icon={<ShoppingBag size={18} />}>
              Ordenar ahora
            </Button>
            <Button href="#producto" variant="outline">
              Conoce más
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
