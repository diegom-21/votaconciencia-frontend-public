import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook personalizado para scroll automático al cambiar de página
 * Se ejecuta cada vez que cambia la ruta
 * MODIFICADO: Maneja enlaces con hash para scroll a secciones específicas
 */
const useScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // FUNCIONALIDAD AÑADIDA: Si hay un hash (ej: #recursos-educativos), hacer scroll a esa sección
    if (hash) {
      // Esperar un poco más para que la página y los componentes carguen completamente
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          // Calcular offset para compensar el header fijo
          const headerOffset = 100; // ajustar según el height del header
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        } else {
          // Si no encuentra el elemento, intentar de nuevo un poco más tarde
          setTimeout(() => {
            const retryElement = document.getElementById(hash.substring(1));
            if (retryElement) {
              const headerOffset = 100;
              const elementPosition = retryElement.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            }
          }, 300);
        }
      }, 200);
    } else {
      // Si no hay hash, hacer scroll al inicio
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
};

export default useScrollToTop;