import { ShoppingBag } from 'lucide-react';
import { Button } from '../UI';
import { useState, useEffect } from 'react';
import './Hero.css';

import heroBg1 from '../../assets/images/images-moves/gemini4.png';
import heroBg2 from '../../assets/images/images-moves/1.png';
import heroBg3 from '../../assets/images/images-moves/gemini2.png';
import heroBg4 from '../../assets/images/images-moves/gemini5.png';
import heroBg5 from '../../assets/images/images-moves/gemini6.png';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 5;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero-bg">
        <div className={`hero-slide full ${currentSlide === 0 ? 'active' : ''}`} style={{opacity: currentSlide === 0 ? 1 : 0, zIndex: currentSlide === 0 ? 1 : 0}}>
          <div className="slide-item">
            <img src={heroBg1} alt="Mi Mejor Piel" />
          </div>
        </div>
        <div className={`hero-slide ${currentSlide === 1 ? 'active' : ''}`} style={{opacity: currentSlide === 1 ? 1 : 0, zIndex: currentSlide === 1 ? 1 : 0}}>
          <div className="slide-item">
            <img src={heroBg2} alt="Mi Mejor Piel" />
          </div>
        </div>
        <div className={`hero-slide ${currentSlide === 2 ? 'active' : ''}`} style={{opacity: currentSlide === 2 ? 1 : 0, zIndex: currentSlide === 2 ? 1 : 0}}>
          <div className="slide-item">
            <img src={heroBg3} alt="Mi Mejor Piel" />
          </div>
        </div>
        <div className={`hero-slide ${currentSlide === 3 ? 'active' : ''}`} style={{opacity: currentSlide === 3 ? 1 : 0, zIndex: currentSlide === 3 ? 1 : 0}}>
          <div className="slide-item">
            <img src={heroBg4} alt="Mi Mejor Piel" />
          </div>
        </div>
        <div className={`hero-slide ${currentSlide === 4 ? 'active' : ''}`} style={{opacity: currentSlide === 4 ? 1 : 0, zIndex: currentSlide === 4 ? 1 : 0}}>
          <div className="slide-item">
            <img src={heroBg5} alt="Mi Mejor Piel" />
          </div>
        </div>
        <div className="hero-overlay"></div>
      </div>
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
