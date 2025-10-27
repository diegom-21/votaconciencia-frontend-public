import React from 'react';
import { XMarkIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { getImageUrl } from '../api';

/**
 * Modal para mostrar el contenido completo de un recurso educativo
 */
const RecursoModal = ({ recurso, isOpen, onClose }) => {
  if (!isOpen || !recurso) return null;

  // Manejar click en el overlay para cerrar
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Referencia para el modal
  const modalRef = React.useRef(null);

  // Manejar tecla ESC para cerrar y posicionamiento del modal
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
      
      // Centrar el modal en el viewport después de un breve delay
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        }
      }, 150);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto"
      onClick={handleOverlayClick}
      style={{ paddingTop: '100px' }} // Espacio para evitar el navbar
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg sm:rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-300 my-6"
        style={{ 
          maxHeight: 'calc(100vh - 140px)',
          minHeight: 'auto'
        }}>
        
        {/* Header del modal */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-3 sm:p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0070C0' }}>
              <BookOpenIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 line-clamp-1">
                {recurso.titulo}
              </h2>
              <p className="text-xs text-gray-500">
                Recurso educativo
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            title="Cerrar"
          >
            <XMarkIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 260px)' }}>
          
          {/* Imagen del recurso */}
          {recurso.imagen_url && (
            <div className="relative h-48 bg-gray-100">
              <img
                src={getImageUrl(recurso.imagen_url)}
                alt={recurso.titulo}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Contenido HTML */}
          <div className="p-3 sm:p-4">
            <div 
              className="prose prose-sm max-w-none"
              style={{
                '--tw-prose-headings': '#0070C0',
                '--tw-prose-links': '#0070C0',
                '--tw-prose-bold': '#1f2937',
                '--tw-prose-code': '#0070C0',
                lineHeight: '1.6',
                fontSize: '14px'
              }}
              dangerouslySetInnerHTML={{ 
                __html: recurso.contenido_html 
              }}
            />
          </div>

          {/* Footer con información adicional */}
          {recurso.fecha_creacion && (
            <div className="border-t border-gray-200 px-3 sm:px-4 py-3 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
                <span>Publicado: {formatDate(recurso.fecha_creacion)}</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Contenido educativo
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Botón de acción en la parte inferior */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3 sm:p-4">
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-2 text-white font-medium rounded-lg hover:opacity-90 transition-colors text-sm"
              style={{ backgroundColor: '#0070C0' }}
            >
              Cerrar contenido
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

/**
 * Formatear fecha para mostrar
 */
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default RecursoModal;