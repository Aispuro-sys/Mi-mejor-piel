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
          <div className="hero-eyebrow">Suero de Ácido Hialurónico</div>
          <h1>Descubre Tu<br />Mejor <em>Piel</em></h1>
          <p className="hero-desc">
            Nuestro suero está diseñado con activos de alta calidad, para trabajar principalmente 
            en arruga profunda y pieles maduras que van perdiendo firmeza con el paso de los años. 
            ¿Los resultados? Increíbles a tan pocas 2 semanas de uso.
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
              <strong>Resultados en 1-2 semanas</strong>
              Aplicando 2 veces al día
              <small>Solo como mantenimiento, 1 vez por día</small>
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
