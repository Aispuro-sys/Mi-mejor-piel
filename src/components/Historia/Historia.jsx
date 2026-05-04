import { Leaf } from 'lucide-react';
import { Button } from '../UI';
import './Historia.css';

export default function Historia() {
  return (
    <section className="section section-historia" id="historia">
      <div className="container">
        <div className="historia-grid">
          <div className="historia-img-wrapper fade-in-left">
            <div className="historia-img-frame">
              <img 
                src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&h=800&fit=crop" 
                alt="Mujer con piel radiante"
              />
            </div>
            <div className="historia-deco-card">
              <span className="big-num">13</span>
              <small>años de investigación</small>
            </div>
          </div>
          
          <div className="historia-text fade-in-right">
            <div className="section-title">
              <div className="section-label">Nuestra Historia</div>
              <h2>El descubrimiento que cambió todo</h2>
            </div>
            
            <p>
              Hace 13 años, mientras atendía a una paciente, quedé impresionada por 
              la calidad y luminosidad de su piel. Cuando le pregunté su edad, 
              descubrí que era 15 años mayor de lo que aparentaba.
            </p>
            
            <div className="historia-quote">
              <p>"Llevo 25 años usando ácido hialurónico" — me respondió con una sonrisa.</p>
            </div>
            
            <p>
              Ese momento marcó el inicio de mi investigación y pasión por este 
              ingrediente extraordinario. Después de años de estudio y perfeccionamiento, 
              creé <strong>Mi Mejor Piel</strong> — un suero de ácido hialurónico puro, 
              diseñado para darte resultados reales.
            </p>
            
            <p>
              <strong>Resultados visibles en solo 2 semanas, aplicándolo 2 veces al día.</strong>
            </p>
            
            <Button href="#ordenar" variant="verde" icon={<Leaf size={18} />}>
              Quiero el mío
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
