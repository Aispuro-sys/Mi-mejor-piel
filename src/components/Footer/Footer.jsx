import { CONFIG } from '../../utils/config';
import './Footer.css';

const navLinks = [
  { href: '#home', label: 'Inicio' },
  { href: '#historia', label: 'Mi Historia' },
  { href: '#producto', label: 'El Producto' },
  { href: '#como-usar', label: 'Cómo Usar' },
  { href: '#testimonios', label: 'Testimonios' },
  { href: '#ordenar', label: 'Ordenar' }
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand fade-in">
            <span className="logo-footer">
              <img src="/logo.png" alt="Mi Mejor Piel" className="logo-footer-img" />
              Mi Mejor <em>Piel</em>
            </span>
            <p>
              Suero de Ácido Hialurónico puro, formulado con amor en Tijuana 
              para darte resultados reales. Descubre tu mejor versión.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href={CONFIG.socialMedia.whatsapp} aria-label="WhatsApp">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-col fade-in delay-1">
            <h4>Navegar</h4>
            <ul>
              {navLinks.map(link => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="footer-col fade-in delay-2">
            <h4>Contacto</h4>
            <ul>
              <li>
                <a href={CONFIG.socialMedia.whatsapp}>
                  <i className="fab fa-whatsapp icon-green"></i> WhatsApp
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fab fa-instagram icon-pink"></i> Instagram
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fas fa-map-marker-alt icon-rosa"></i> Tijuana / Rosarito
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2025 Mi Mejor Piel · Todos los derechos reservados.</p>
          <p>Hecho con ❤️ en Tijuana, B.C., México</p>
        </div>
      </div>
    </footer>
  );
}
