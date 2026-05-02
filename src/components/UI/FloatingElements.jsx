import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { CONFIG } from '../../utils/config';
import './FloatingElements.css';

export default function FloatingElements() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* WhatsApp Float */}
      <a 
        href={CONFIG.socialMedia.whatsapp}
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
      >
        <div className="pulse-ring"></div>
        <i className="fab fa-whatsapp"></i>
      </a>

      {/* Scroll to Top */}
      <button 
        className={`scroll-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Volver arriba"
      >
        <ArrowUp size={18} />
      </button>
    </>
  );
}
