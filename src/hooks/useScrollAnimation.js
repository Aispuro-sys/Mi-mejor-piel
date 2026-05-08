import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollAnimation() {
  const location = useLocation();
  
  useEffect(() => {
    // Pequeño delay para asegurar que el DOM esté listo
    const timeoutId = setTimeout(() => {
      const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, observerOptions);

      // Observar todos los elementos con clases de animación
      const animatedElements = document.querySelectorAll(
        '.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale'
      );

      animatedElements.forEach(el => observer.observe(el));

      return () => {
        animatedElements.forEach(el => observer.unobserve(el));
      };
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]); // Re-ejecutar cuando cambie la ruta
}

export default useScrollAnimation;
