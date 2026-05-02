import { Star, Gift } from 'lucide-react';
import { Button } from '../UI';
import './Testimonios.css';

const testimonios = [
  {
    text: 'En solo 2 semanas noté mi piel más hidratada y luminosa. ¡No puedo creer la diferencia que ha hecho en mi rutina diaria!',
    name: 'María G.',
    location: 'Tijuana, B.C.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face'
  },
  {
    text: 'Lo uso todas las mañanas y noches. Mi piel se siente suave como nunca y las líneas de expresión se han reducido notablemente.',
    name: 'Laura P.',
    location: 'Rosarito, B.C.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face'
  },
  {
    text: 'El mejor producto que he probado. Simple, efectivo y a un precio muy accesible. ¡100% recomendado para todas las edades!',
    name: 'Carmen R.',
    location: 'Tijuana, B.C.',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=80&h=80&fit=crop&crop=face'
  }
];

export default function Testimonios() {
  return (
    <section className="section section-testimonios" id="testimonios">
      <div className="container">
        <div className="section-title center">
          <div className="section-label">Testimonios</div>
          <h2>Lo que dicen nuestras clientas</h2>
        </div>
        
        <div className="testimonios-grid">
          {testimonios.map((testimonio, index) => (
            <div className="testimonio-card" key={index}>
              <div className="testimonio-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="testimonio-text">{testimonio.text}</p>
              <div className="testimonio-author">
                <img 
                  src={testimonio.avatar} 
                  alt={testimonio.name}
                  className="author-avatar"
                />
                <div className="author-info">
                  <strong>{testimonio.name}</strong>
                  <span>{testimonio.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="oferta-section">
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
