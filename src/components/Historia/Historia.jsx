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
              Realizando la historia clínica a una paciente, descubrí que su edad cronológica 
              no correspondía a la que ella aparentaba, la tonicidad de su piel era fácilmente 
              la de una persona 20 años menor a la edad que ella tenía. Al notar que visiblemente 
              me sorprendí, me pregunto: ¿quieres saber cuál es mi secreto? Y le contesté que sí, 
              a lo que ella respondió con una sonrisa amable:
            </p>
            
            <div className="historia-quote">
              <p>"Llevo 25 años usando ácido hialurónico"</p>
            </div>
            
            <p>
              En ese momento, comenzó mi tarea de investigación acerca de este extraordinario 
              ingrediente, y después de años de estudio, lectura, análisis de producto, 
              perfeccionamos este suero para ti.
            </p>
            
            <p>
              <strong>Mi Mejor Piel</strong>, suero de ácido hialurónico, diseñado para darte 
              resultados reales en tan solo 2 semanas de uso diario.
            </p>
            
            <p className="historia-nota">
              Los resultados son visibles aplicándolo desde una vez por día, pero son mayormente 
              notorios, a las dos semanas y aplicándolo dos veces por día.
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
