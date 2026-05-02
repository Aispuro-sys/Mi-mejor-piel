import { Droplets, Hand, Sun, Shield } from 'lucide-react';
import './ComoUsar.css';

const steps = [
  {
    num: '01',
    icon: <Droplets size={22} />,
    title: 'Limpia tu rostro',
    desc: 'Lava tu cara con tu limpiador habitual. Sécala suavemente con una toalla limpia dando pequeños toquecitos.'
  },
  {
    num: '02',
    icon: <Hand size={22} />,
    title: 'Aplica el suero',
    desc: 'Con la piel seca, aplica unas gotas del suero como primer producto. Masajea suavemente hasta que se absorba por completo.'
  },
  {
    num: '03',
    icon: <Sun size={22} />,
    title: 'Hidrata y protege',
    desc: 'Después aplica tu crema hidratante habitual. En el día, siempre finaliza con bloqueador solar.'
  }
];

export default function ComoUsar() {
  return (
    <section className="section section-como-usar" id="como-usar">
      <div className="container">
        <div className="section-title">
          <div className="section-label">Modo de Uso</div>
          <h2>Así de fácil</h2>
        </div>
        
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div className="step-item" key={index}>
              <div className="step-num">{step.num}</div>
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="sensibilidad-nota">
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
