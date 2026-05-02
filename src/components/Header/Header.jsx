import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import './Header.css';

const navLinks = [
  { href: '#home', label: 'Inicio' },
  { href: '#historia', label: 'Mi Historia' },
  { href: '#producto', label: 'Producto' },
  { href: '#como-usar', label: 'Cómo Usar' },
  { href: '#testimonios', label: 'Testimonios' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <a href="#home" className="logo">
          Mi Mejor <em>Piel</em>
        </a>
        
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menú"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`nav ${isMobileMenuOpen ? 'show' : ''}`}>
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={handleLinkClick}>
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#ordenar" className="nav-cta" onClick={handleLinkClick}>
                Ordenar
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
