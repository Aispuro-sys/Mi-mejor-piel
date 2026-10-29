import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CONFIG } from '../utils/config';
import './Legal.css';

export default function TerminosCondiciones() {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-container">
          <div className="legal-header">
            <span className="section-label">Legal</span>
            <h1>Términos y Condiciones de Uso y Compra</h1>
            <p className="legal-updated">Última actualización: octubre de 2026</p>
          </div>

          <div className="legal-body">
            <h2>1. Objeto</h2>
            <p>
              Los presentes Términos y Condiciones regulan el acceso, navegación y uso del sitio web de{' '}
              {CONFIG.siteName} (en adelante, "el Sitio"), así como la compra de productos ofrecidos a
              través de él. Al utilizar el Sitio o realizar un pedido, declaras haber leído y aceptado
              estos términos en su totalidad. Si no estás de acuerdo, te pedimos abstenerte de usar el
              Sitio.
            </p>

            <h2>2. Responsable y contacto</h2>
            <p>
              El Sitio es operado por {CONFIG.siteName}, con operaciones en Tijuana y Rosarito, Baja
              California, México. Puedes contactarnos por WhatsApp al{' '}
              <a href={CONFIG.socialMedia.whatsapp} target="_blank" rel="noopener noreferrer">
                +1 (619) 341-4647
              </a>{' '}
              o a través de nuestras redes sociales publicadas en el Sitio.
            </p>

            <h2>3. Uso permitido del sitio</h2>
            <p>Te comprometes a utilizar el Sitio únicamente para fines lícitos. Queda prohibido:</p>
            <ul>
              <li>Utilizar el Sitio para actividades fraudulentas o contrarias a la ley.</li>
              <li>Interferir con el funcionamiento del Sitio o intentar acceder a áreas restringidas.</li>
              <li>Proporcionar información falsa o de terceros sin su consentimiento al realizar un pedido.</li>
              <li>Reproducir, distribuir o explotar comercialmente el contenido del Sitio sin autorización escrita.</li>
            </ul>

            <h2>4. Productos y descripción</h2>
            <p>
              El producto ofrecido es el {CONFIG.productName}, un producto cosmético de uso tópico. Las
              imágenes, descripciones y testimonios mostrados en el Sitio tienen fines ilustrativos e
              informativos; los resultados individuales pueden variar de persona a persona.
            </p>
            <div className="legal-note">
              <p>
                <strong>Aviso importante:</strong> este producto no es un medicamento y no está destinado
                a diagnosticar, tratar, curar o prevenir enfermedad alguna. Si presentas una condición
                dermatológica, consulta a un profesional de la salud antes de su uso. Suspende su
                aplicación en caso de irritación o reacción adversa.
              </p>
            </div>

            <h2>5. Precios, impuestos y pagos</h2>
            <ul>
              <li>Todos los precios se muestran en pesos mexicanos (MXN) e incluyen el desglose de impuestos y cargos aplicables antes de confirmar el pedido.</li>
              <li>El precio por unidad es de $300 MXN, más el impuesto por transacción indicado en el resumen del pedido.</li>
              <li>El envío a domicilio tiene un costo adicional de $70 MXN en las zonas habilitadas.</li>
              <li>Los pagos se procesan de forma segura a través de Stripe. No almacenamos datos completos de tarjetas bancarias.</li>
              <li>Nos reservamos el derecho de modificar precios y promociones en cualquier momento; el precio aplicable será el mostrado al momento de realizar tu pedido.</li>
            </ul>

            <h2>6. Pedidos y confirmación</h2>
            <p>
              Al completar el proceso de compra y confirmarse el pago, recibirás un número de pedido y
              un comprobante en el correo electrónico proporcionado. El pedido se considera confirmado
              una vez que el pago ha sido aprobado por el procesador de pagos. Nos reservamos el derecho
              de rechazar o cancelar pedidos con información incorrecta, sospecha de fraude o falta de
              disponibilidad, notificándote y reembolsando el importe pagado cuando corresponda.
            </p>

            <h2>7. Entregas</h2>
            <h3>Envío a domicilio</h3>
            <ul>
              <li>Zonas habilitadas: Tijuana Zona Centro, Tijuana 5 y 10, y Zona Centro de Rosarito, B.C.</li>
              <li>Tiempo estimado de entrega: 24 a 48 horas hábiles posteriores a la confirmación del pago.</li>
              <li>Es responsabilidad del cliente proporcionar una dirección completa y correcta. No nos hacemos responsables por retrasos o pérdidas derivadas de datos de entrega erróneos.</li>
            </ul>
            <h3>Recolección en punto de encuentro</h3>
            <ul>
              <li>Sin costo adicional. Las instrucciones del punto de encuentro se coordinan contigo por WhatsApp después de la confirmación del pedido.</li>
            </ul>

            <h2>8. Devoluciones y reembolsos</h2>
            <ul>
              <li>Si el producto llega defectuoso, dañado o no corresponde con lo solicitado, contáctanos por WhatsApp dentro de las 72 horas siguientes a la entrega, adjuntando evidencia fotográfica.</li>
              <li>Verificado el caso, se procederá al reemplazo del producto o al reembolso del importe correspondiente por el mismo medio de pago utilizado.</li>
              <li>Por razones de higiene y seguridad, no se aceptan devoluciones de productos cosméticos que hayan sido abiertos o utilizados, salvo defecto de fabricación.</li>
            </ul>

            <h2>9. Propiedad intelectual</h2>
            <p>
              Todos los contenidos del Sitio —incluyendo, sin limitarse a, logotipos, textos, fotografías,
              diseño y código— son propiedad de {CONFIG.siteName} o se utilizan con autorización, y están
              protegidos por la legislación mexicana e internacional en materia de propiedad intelectual.
              Queda prohibida su reproducción total o parcial sin consentimiento previo por escrito.
            </p>

            <h2>10. Limitación de responsabilidad</h2>
            <p>
              {CONFIG.siteName} no será responsable por daños indirectos derivados del uso o imposibilidad
              de uso del Sitio, por interrupciones técnicas ajenas a nuestro control, ni por el contenido
              de sitios de terceros enlazados desde esta página (incluyendo WhatsApp, Stripe y servicios
              de mapas).
            </p>

            <h2>11. Protección de datos personales</h2>
            <p>
              El tratamiento de tus datos personales se rige por nuestro{' '}
              <Link to="/aviso-de-privacidad">Aviso de Privacidad</Link>, que forma parte integral de
              estos Términos y Condiciones.
            </p>

            <h2>12. Modificaciones</h2>
            <p>
              Nos reservamos el derecho de actualizar estos Términos y Condiciones en cualquier momento.
              La versión vigente será la publicada en esta página con su fecha de actualización. El uso
              continuo del Sitio después de dichos cambios constituye tu aceptación de los términos
              modificados.
            </p>

            <h2>13. Legislación aplicable y jurisdicción</h2>
            <p>
              Estos Términos y Condiciones se rigen por las leyes de los Estados Unidos Mexicanos y, en
              lo aplicable, por la Ley Federal de Protección al Consumidor. Para cualquier controversia
              derivada del uso del Sitio o de las compras realizadas en él, las partes se someten a la
              jurisdicción de los tribunales competentes en la ciudad de Tijuana, Baja California,
              renunciando a cualquier otro fuero que pudiera corresponderles. Como consumidor, también
              cuentas con la facultad de acudir a la Procuraduría Federal del Consumidor (PROFECO).
            </p>

            <Link to="/" className="legal-back">
              <ArrowLeft size={16} /> Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
