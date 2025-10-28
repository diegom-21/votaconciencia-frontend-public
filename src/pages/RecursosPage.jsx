import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecursos, getTrivias, getImageUrl } from '../api';
import RecursoModal from '../components/RecursoModal';
import {
  BookOpenIcon,
  AcademicCapIcon,
  PlayIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  LightBulbIcon,
  StarIcon
} from '@heroicons/react/24/outline';

/**
 * Página de recursos educativos y trivias
 * Muestra todo el contenido educativo disponible para el votante
 */
const RecursosPage = () => {
  const navigate = useNavigate();
  
  // Estados principales
  const [recursos, setRecursos] = useState([]);
  const [trivias, setTrivias] = useState([]);
  
  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados del modal
  const [selectedRecurso, setSelectedRecurso] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Cargar datos al montar el componente
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar recursos y trivias en paralelo
        const [recursosData, triviasData] = await Promise.all([
          getRecursos(),
          getTrivias()
        ]);

        // Filtrar solo los publicados
        const recursosPublicados = recursosData.filter(recurso => recurso.esta_publicado === 1);
        const triviasPublicadas = triviasData.filter(trivia => trivia.esta_activo === 1);

        setRecursos(recursosPublicados);
        setTrivias(triviasPublicadas);

      } catch (error) {
        setError('Error al cargar el contenido educativo. Por favor intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Función para reintentar carga de datos
   */
  const handleRetry = () => {
    window.location.reload();
  };

  /**
   * Abrir modal con recurso seleccionado
   */
  const handleOpenRecurso = (recurso) => {
    setSelectedRecurso(recurso);
    setIsModalOpen(true);
  };

  /**
   * Cerrar modal
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecurso(null);
  };

  /**
   * Navegar a trivia
   */
  const handleIrATrivia = (triviaId) => {
    navigate(`/trivia/${triviaId}`);
  };

  /**
   * Renderizar estado de carga
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 no-scroll-x eliminate-black-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 constrain-width contain-all">
          
          {/* Hero skeleton */}
          <div className="rounded-2xl p-12 mb-12 animate-pulse"
               style={{
                 background: 'linear-gradient(135deg, #0070C0 0%, #005a9e 50%, #004080 100%)'
               }}>
            <div className="text-center text-white">
              <div className="h-12 bg-white bg-opacity-20 rounded w-96 mx-auto mb-6"></div>
              <div className="h-6 bg-white bg-opacity-20 rounded w-64 mx-auto mb-8"></div>
              <div className="flex justify-center gap-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="text-center">
                    <div className="h-8 bg-white bg-opacity-20 rounded w-12 mx-auto mb-2"></div>
                    <div className="h-4 bg-white bg-opacity-20 rounded w-24 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sections skeleton */}
          {Array.from({ length: 2 }).map((_, sectionIndex) => (
            <div key={sectionIndex} className="mb-16">
              <div className="bg-gray-100 rounded-2xl p-8 mb-8 animate-pulse">
                <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>
    );
  }

  /**
   * Renderizar estado de error
   */
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 no-scroll-x eliminate-black-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 constrain-width contain-all">
          <div className="text-center">
            <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Error al cargar contenido</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center px-6 py-3 text-white font-medium rounded-lg hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#0070C0' }}
            >
              <ArrowPathIcon className="w-5 h-5 mr-2" />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 no-scroll-x eliminate-black-bar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 constrain-width contain-all">

        {/* Hero Section */}
        <HeroSection recursos={recursos} trivias={trivias} />

        {/* Recursos Educativos Section */}
        <RecursosSection recursos={recursos} onRecursoClick={handleOpenRecurso} />

        {/* Trivias Educativas Section */}
        <TriviasSection trivias={trivias} onTriviaClick={handleIrATrivia} />

        {/* Modal de Recurso */}
        <RecursoModal 
          recurso={selectedRecurso}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />

      </div>
    </div>
  );
};

/**
 * Sección Hero con estadísticas
 */
const HeroSection = ({ recursos, trivias }) => {
  return (
    <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 rounded-2xl p-8 sm:p-12 mt-20 mb-12 overflow-hidden relative"
         style={{
           background: 'linear-gradient(135deg, #0070C0 0%, #005a9e 50%, #004080 100%)'
         }}>
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 bg-blue-900 bg-opacity-20"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-white bg-opacity-5 rounded-full transform translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white bg-opacity-5 rounded-full transform -translate-x-16 translate-y-16"></div>
      
      <div className="relative z-10 text-center text-white">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 font-['Outfit']">
          Contenido Educativo
        </h1>
        <p className="text-lg sm:text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
          Conoce cómo funciona el sistema electoral peruano y pon a prueba
          tus conocimientos con recursos interactivos y educativos.
        </p>

        {/* Estadísticas */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
          
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold mb-2">{recursos.length}+</div>
            <div className="text-sm sm:text-base opacity-80">Recursos disponibles</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold mb-2">{trivias.length}</div>
            <div className="text-sm sm:text-base opacity-80">Trivias educativas</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold mb-2">100%</div>
            <div className="text-sm sm:text-base opacity-80">Contenido gratuito</div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

/**
 * Sección de Recursos Educativos
 */
const RecursosSection = ({ recursos, onRecursoClick }) => {
  return (
    <div className="mb-16">
      
      {/* Header de la sección - SCROLL TARGET: recursos-educativos */}
      <div id="recursos-educativos" className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-6 sm:p-8 mb-8 border border-gray-200">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 font-['Outfit']" style={{ color: '#0070C0' }}>
            Recursos Educativos
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explora contenido interactivo diseñado sobre el proceso electoral y los roles de los diferentes órganos de gobierno en el Perú.
          </p>
        </div>
      </div>

      {/* Grid de recursos */}
      {recursos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recursos.map((recurso) => (
            <RecursoCard 
              key={recurso.recurso_id} 
              recurso={recurso} 
              onClick={() => onRecursoClick(recurso)}
            />
          ))}
        </div>
      ) : (
        <EmptyResourcesState type="recursos" />
      )}

    </div>
  );
};

/**
 * Sección de Trivias Educativas
 */
const TriviasSection = ({ trivias, onTriviaClick }) => {
  return (
    <div className="mb-16">
      
      {/* Header de la sección - SCROLL TARGET: trivias-educativas */}
      <div id="trivias-educativas" className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-6 sm:p-8 mb-8 border border-gray-200">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 font-['Outfit']" style={{ color: '#0070C0' }}>
            Trivias Educativas
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Desafía tus conocimientos con cuestionarios interactivos sobre el proceso electoral
            y la democracia.
          </p>
        </div>
      </div>

      {/* Grid de trivias */}
      {trivias.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trivias.map((trivia) => (
            <TriviaCard 
              key={trivia.tema_trivia_id} 
              trivia={trivia} 
              onClick={() => onTriviaClick(trivia.tema_trivia_id)}
            />
          ))}
        </div>
      ) : (
        <EmptyResourcesState type="trivias" />
      )}

    </div>
  );
};

/**
 * Tarjeta de recurso educativo
 */
const RecursoCard = ({ recurso, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
      onClick={onClick}
    >
      
      {/* Imagen */}
      <div className="relative h-48 overflow-hidden"
           style={{
             background: 'linear-gradient(135deg, #e8f4ff 0%, #cce7ff 100%)'
           }}>
        {recurso.imagen_url ? (
          <img 
            src={getImageUrl(recurso.imagen_url)} 
            alt={recurso.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzU1IiBoZWlnaHQ9IjE4NyIgdmlld0JveD0iMCAwIDM1NSAxODciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNTUiIGhlaWdodD0iMTg3IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzcuNSA4MS41SDExNy41TDEzNy41IDExMS41TDE3Ny41IDgxLjVaIiBmaWxsPSIjOUM5Qzk5Ii8+Cjwvc3ZnPgo=';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <DocumentTextIcon className="w-16 h-16" style={{ color: '#0070C0', opacity: 0.3 }} />
          </div>
        )}
        
        {/* Overlay con play button */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="w-12 h-12 bg-white bg-opacity-0 group-hover:bg-opacity-90 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-all duration-300">
            <PlayIcon className="w-6 h-6" style={{ color: '#0070C0' }} />
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:opacity-90 transition-colors" style={{ color: '#0070C0' }}>
          {recurso.titulo}
        </h3>
        
        {/* Descripción extraída del contenido HTML */}
        {recurso.contenido_html && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
            {extractDescriptionFromHTML(recurso.contenido_html)}
          </p>
        )}

        {/* Fecha */}
        {recurso.fecha_creacion && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <StarIcon className="w-4 h-4" />
            <span>Publicado {formatDateRelative(recurso.fecha_creacion)}</span>
          </div>
        )}

        {/* Indicador de click */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Click para leer el contenido completo
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Tarjeta de trivia educativa
 */
const TriviaCard = ({ trivia, onClick }) => {
  const gradients = [
    'from-blue-100 to-blue-200',
    'from-green-100 to-green-200', 
    'from-purple-100 to-purple-200',
    'from-orange-100 to-orange-200',
    'from-pink-100 to-pink-200'
  ];
  
  const gradientClass = gradients[trivia.tema_trivia_id % gradients.length];

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
      onClick={onClick}
    >
      
      {/* Imagen */}
      <div className={`relative h-48 bg-gradient-to-br ${gradientClass} overflow-hidden`}>
        {trivia.imagen_url ? (
          <img 
            src={getImageUrl(trivia.imagen_url)} 
            alt={trivia.nombre_tema}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzU1IiBoZWlnaHQ9IjE4NyIgdmlld0JveD0iMCAwIDM1NSAxODciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNTUiIGhlaWdodD0iMTg3IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzcuNSA4MS41SDExNy41TDEzNy41IDExMS41TDE3Ny41IDgxLjVaIiBmaWxsPSIjOUM5Qzk5Ii8+Cjwvc3ZnPgo=';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <AcademicCapIcon className="w-16 h-16 text-purple-300" />
          </div>
        )}
        
        {/* Overlay con play button */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="w-12 h-12 bg-white bg-opacity-0 group-hover:bg-opacity-90 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-all duration-300">
            <PlayIcon className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        
        {/* Badge QUIZ */}
        <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-purple-600 uppercase tracking-wide mb-3">
          <LightBulbIcon className="w-3 h-3" />
          Quiz
        </div>
        
        <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:opacity-90 transition-colors" style={{ color: '#0070C0' }}>
          {trivia.nombre_tema}
        </h3>
        
        {/* Descripción */}
        {trivia.descripcion && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
            {trivia.descripcion}
          </p>
        )}

        {/* Indicador de click */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Click para comenzar la trivia
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Estado vacío para cuando no hay recursos o trivias
 */
const EmptyResourcesState = ({ type }) => {
  const isRecursos = type === 'recursos';
  
  return (
    <div className="text-center py-12">
      {isRecursos ? (
        <BookOpenIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      ) : (
        <AcademicCapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      )}
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {isRecursos ? 'No hay recursos disponibles' : 'No hay trivias disponibles'}
      </h3>
      
      <p className="text-gray-600 max-w-md mx-auto">
        {isRecursos 
          ? 'Los recursos educativos aparecerán aquí una vez que estén publicados.'
          : 'Las trivias educativas aparecerán aquí una vez que estén activadas.'
        }
      </p>
    </div>
  );
};

/**
 * Extraer descripción del contenido HTML
 */
const extractDescriptionFromHTML = (htmlContent) => {
  if (!htmlContent) return '';
  
  // Remover tags HTML y obtener texto plano
  const textContent = htmlContent.replace(/<[^>]*>/g, '').trim();
  
  // Limitar a 150 caracteres
  if (textContent.length > 150) {
    return textContent.substring(0, 150) + '...';
  }
  
  return textContent;
};

/**
 * Formatear fecha relativa
 */
const formatDateRelative = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'hace 1 día';
  if (diffDays < 7) return `hace ${diffDays} días`;
  if (diffDays < 30) return `hace ${Math.ceil(diffDays / 7)} semanas`;
  if (diffDays < 365) return `hace ${Math.ceil(diffDays / 30)} meses`;
  
  return `hace ${Math.ceil(diffDays / 365)} años`;
};

export default RecursosPage;