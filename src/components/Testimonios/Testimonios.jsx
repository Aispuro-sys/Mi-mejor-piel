import { Star, Gift } from 'lucide-react';
import { Button } from '../UI';
import './Testimonios.css';

// Importar imágenes de testimonios record
import record1 from '../../assets/images/imagenes-testimonios-record/record 1.png';
import record2 from '../../assets/images/imagenes-testimonios-record/record 2.png';
import record3 from '../../assets/images/imagenes-testimonios-record/record 3.png';
import record4 from '../../assets/images/imagenes-testimonios-record/record 4.png';
import record5 from '../../assets/images/imagenes-testimonios-record/record 5.png';
import record6 from '../../assets/images/imagenes-testimonios-record/record 6.png';
import record7 from '../../assets/images/imagenes-testimonios-record/record 7.png';
import record8 from '../../assets/images/imagenes-testimonios-record/record 8.png';

// Testimonios combinados con imágenes de resultados
const testimonios = [
  {
    text: 'En solo 2 semanas noté mi piel más hidratada y luminosa. ¡No puedo creer la diferencia!',
    name: 'María G.',
    location: 'Tijuana, B.C.',
    image: record1
  },
  {
    text: 'Lo uso todas las mañanas y noches. Mi piel se siente suave como nunca.',
    name: 'Laura P.',
    location: 'Rosarito, B.C.',
    image: record2
  },
  {
    text: 'El mejor producto que he probado. Simple, efectivo y a un precio accesible.',
    name: 'Carmen R.',
    location: 'Tijuana, B.C.',
    image: record3
  },
  {
    text: 'Las líneas de expresión se han reducido notablemente. ¡Increíble!',
    name: 'Rosa M.',
    location: 'Tijuana, B.C.',
    image: record4
  },
  {
    text: 'Mi piel luce más joven y radiante. Lo recomiendo totalmente.',
    name: 'Patricia S.',
    location: 'Rosarito, B.C.',
    image: record5
  },
  {
    text: 'Resultados visibles desde la primera semana. ¡Estoy encantada!',
    name: 'Ana L.',
    location: 'Tijuana, B.C.',
    image: record6
  },
  {
    text: 'Mi piel ha recuperado su elasticidad. Se ve mucho más joven y saludable.',
    name: 'Sofia M.',
    location: 'Rosarito, B.C.',
    image: record7
  },
  {
    text: 'El suero ha transformado mi piel. Más firme, suave y con un brillo natural.',
    name: 'Beatriz T.',
    location: 'Tijuana, B.C.',
    image: record8
  }
];

export default function Testimonios() {
  return (
    <section className="section section-testimonios" id="testimonios">
      <div className="container">
        <div className="section-title center fade-in">
          <div className="section-label">Testimonios</div>
          <h2>Lo que dicen nuestras clientas</h2>
        </div>
        
        <div className="testimonios-grid">
          {testimonios.map((testimonio, index) => (
            <div className="testimonio-card" key={index}>
              <div className="testimonio-image">
                <img 
                  src={testimonio.image} 
                  alt={`Resultado de ${testimonio.name}`}
                  loading="lazy"
                />
              </div>
              <div className="testimonio-content">
                <div className="testimonio-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="testimonio-text">"{testimonio.text}"</p>
                <div className="testimonio-author">
                  <div className="author-info">
                    <strong>{testimonio.name}</strong>
                    <span>{testimonio.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="oferta-section fade-in-scale">
          <h3>🎁 Oferta Especial</h3>
          <p><strong>¿Eres madre jefa de familia?</strong></p>
          <p>Pregunta por nuestra oferta especial, solo disponible en Tijuana y Rosarito.</p>
          <Button href="#ordenar" variant="primary" icon={<Gift size={18} />}>
            Preguntar por la oferta
          </Button>
        </div>
      </div>
    </section>
  );
}
