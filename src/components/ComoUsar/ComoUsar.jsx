import { Shield } from 'lucide-react';
import './ComoUsar.css';

const steps = [
  {
    num: '01',
    title: 'Limpia',
    subtitle: 'tu rostro',
    desc: 'Lava tu cara con tu limpiador habitual. Sécala suavemente con una toalla limpia dando pequeños toquecitos.'
  },
  {
    num: '02',
    title: 'Aplica',
    subtitle: 'el suero',
    desc: 'Con la piel seca, aplica unas gotas del suero como primer producto. Masajea suavemente hasta que se absorba por completo.'
  },
  {
    num: '03',
    title: 'Hidrata',
    subtitle: 'y protege',
    desc: 'Después aplica tu crema hidratante habitual. En el día, siempre finaliza con bloqueador solar.'
  }
];

export default function ComoUsar() {
  return (
    <section className="section section-como-usar" id="como-usar">
      <div className="container">
        <div className="section-title fade-in">
          <div className="section-label">Modo de Uso</div>
          <h2>Así de fácil</h2>
        </div>
        
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div className={`step-item fade-in delay-${index + 1}`} key={index}>
              <div className="step-header">
                <div className="step-num">{step.num}</div>
                <div className="step-title-group">
                  <h3>{step.title}</h3>
                  <span className="step-subtitle">{step.subtitle}</span>
                </div>
              </div>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="sensibilidad-nota fade-in">
          <div className="icon">
            <Shield size={22} />
          </div>
          <p>
            <strong>Prueba de sensibilidad:</strong> Aunque no hemos tenido ningún 
            reporte de reacción adversa, te recomendamos colocar una pequeña muestra 
            en un área discreta de piel —como la parte interna del codo— y esperar 
            24 horas antes de la aplicación completa.
          </p>
        </div>
      </div>
    </section>
  );
}
