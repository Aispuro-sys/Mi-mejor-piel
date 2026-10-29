import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CONFIG } from '../utils/config';
import './Legal.css';

export default function AvisoPrivacidad() {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-container">
          <div className="legal-header">
            <span className="section-label">Legal</span>
            <h1>Aviso de Privacidad</h1>
            <p className="legal-updated">Última actualización: octubre de 2026</p>
          </div>

          <div className="legal-body">
            <p>
              {CONFIG.siteName} (en adelante, "el Responsable"), con domicilio para oír y recibir
              notificaciones en la ciudad de Tijuana, Baja California, México, es responsable del
              tratamiento de tus datos personales conforme a la Ley Federal de Protección de Datos
              Personales en Posesión de los Particulares (LFPDPPP), su reglamento y los lineamientos
              aplicables emitidos por la autoridad competente.
            </p>

            <h2>1. Datos personales que recabamos</h2>
            <p>
              Cuando realizas un pedido o te pones en contacto con nosotros, podemos recabar los
              siguientes datos personales:
            </p>
            <ul>
              <li><strong>Identificación y contacto:</strong> nombre completo, número de teléfono y dirección de correo electrónico.</li>
              <li><strong>Datos de entrega:</strong> calle y número, colonia, código postal y zona de entrega, únicamente cuando seleccionas envío a domicilio.</li>
              <li><strong>Datos del pedido:</strong> cantidad de producto, tipo de entrega, notas o instrucciones adicionales que proporciones de forma voluntaria.</li>
              <li><strong>Datos de pago:</strong> los datos de tu tarjeta de crédito o débito son capturados y procesados directamente por Stripe, Inc. El Responsable no almacena números de tarjeta ni datos bancarios completos en sus sistemas.</li>
            </ul>

            <h2>2. Finalidades del tratamiento</h2>
            <h3>Finalidades primarias (necesarias)</h3>
            <ul>
              <li>Procesar, confirmar y dar seguimiento a tu pedido.</li>
              <li>Coordinar la entrega del producto a domicilio o en punto de recolección.</li>
              <li>Enviarte el comprobante de compra al correo electrónico proporcionado.</li>
              <li>Atender preguntas, aclaraciones, devoluciones y servicio al cliente, incluyendo la comunicación por WhatsApp.</li>
              <li>Cumplir con obligaciones fiscales, contables y contractuales.</li>
            </ul>
            <h3>Finalidades secundarias</h3>
            <ul>
              <li>Enviar promociones, novedades y comunicaciones de mercadotecnia relacionadas con {CONFIG.siteName}, únicamente cuando nos compartes tus datos con ese propósito.</li>
            </ul>
            <p>
              Si no deseas que tus datos sean tratados para finalidades secundarias, puedes manifestarlo
              en cualquier momento por los medios indicados en la sección de derechos ARCO.
            </p>

            <h2>3. Transferencias de datos personales</h2>
            <p>
              Para cumplir las finalidades descritas, tus datos pueden ser compartidos con los
              siguientes terceros, quienes los tratan conforme a sus propias políticas de privacidad:
            </p>
            <ul>
              <li><strong>Stripe, Inc.</strong> — procesamiento seguro de pagos con tarjeta.</li>
              <li><strong>Vercel Inc. y Neon, Inc.</strong> — infraestructura de hospedaje y base de datos donde se registran los pedidos.</li>
              <li><strong>WhatsApp / Meta Platforms, Inc.</strong> — cuando eliges comunicarte con nosotros mediante esta plataforma.</li>
              <li><strong>Personal de reparto o mensajería</strong> — exclusivamente los datos necesarios para entregar tu pedido.</li>
              <li><strong>Autoridades competentes</strong> — cuando así lo requiera la ley.</li>
            </ul>
            <p>
              No vendemos, alquilamos ni comercializamos tus datos personales con fines ajenos a los
              aquí descritos.
            </p>

            <h2>4. Medios para ejercer derechos ARCO y revocar el consentimiento</h2>
            <p>
              Tienes derecho a conocer qué datos personales tenemos de ti, para qué los utilizamos y las
              condiciones del uso que les damos (Acceso). Asimismo, es tu derecho solicitar la corrección
              de tu información personal en caso de que esté desactualizada, sea inexacta o incompleta
              (Rectificación); que la eliminemos cuando consideres que no está siendo utilizada conforme
              a las finalidades establecidas (Cancelación), así como oponerte al uso de tus datos para
              finalidades específicas (Oposición).
            </p>
            <p>
              Para ejercer tus derechos ARCO, revocar el consentimiento otorgado o limitar el uso y
              divulgación de tus datos, envía tu solicitud por WhatsApp al número de contacto publicado
              en este sitio, indicando: nombre completo, datos utilizados en tu pedido, descripción clara
              del derecho que deseas ejercer y un medio para responderte. Daremos respuesta en un plazo
              máximo de 20 días hábiles conforme a la legislación vigente.
            </p>

            <h2>5. Cookies y tecnologías de rastreo</h2>
            <p>
              Este sitio no utiliza cookies propias de rastreo con fines publicitarios. Algunos servicios
              de terceros integrados en la página (como el mapa de OpenStreetMap y el procesador de pagos
              Stripe) pueden emplear tecnologías propias sujetas a sus respectivas políticas de
              privacidad.
            </p>

            <h2>6. Medios de comunicación y cambios al aviso</h2>
            <p>
              El presente aviso de privacidad puede sufrir modificaciones, cambios o actualizaciones
              derivadas de nuevos requerimientos legales, mejoras de nuestros procesos u otros motivos.
              Cualquier cambio será publicado en esta misma página con su fecha de actualización, por lo
              que te recomendamos consultarla periódicamente.
            </p>

            <h2>7. Quejas ante la autoridad</h2>
            <p>
              Si consideras que tu derecho a la protección de datos personales ha sido lesionado por
              alguna conducta de nuestra parte, podrás interponer tu queja o procedimiento ante la
              autoridad competente en materia de protección de datos personales en México.
            </p>

            <div className="legal-note">
              <p>
                <strong>Contacto del Responsable:</strong> {CONFIG.siteName} · Tijuana, Baja California, México.
              </p>
              <p>
                WhatsApp: <a href={CONFIG.socialMedia.whatsapp} target="_blank" rel="noopener noreferrer">+1 (619) 341-4647</a>
              </p>
            </div>

            <Link to="/" className="legal-back">
              <ArrowLeft size={16} /> Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
