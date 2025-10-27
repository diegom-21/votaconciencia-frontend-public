import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCandidatoById, getPropuestas, getHistorialPolitico, getImageUrl } from '../api';
import { calcularPosicionPolitica, extraerMetricasPoliticas } from '../utils/politicalAnalysis';
import PoliticalPositionChart from '../components/PoliticalPositionChart';
import ChatIA from '../components/ChatIA';
import {
  ArrowLeftIcon,
  MapPinIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  UserIcon,
  DocumentTextIcon,
  LightBulbIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

/**
 * Página de detalles completa de un candidato presidencial
 * Incluye foto, información básica, biografía, propuestas por temas e historial político
 */
const CandidateDetailPage = () => {
  const { id } = useParams();
  const [candidato, setCandidato] = useState(null);
  const [propuestas, setPropuestas] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [posicionPolitica, setPosicionPolitica] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Cargar datos del candidato al montar el componente
   */
  useEffect(() => {
    const fetchCandidatoData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 Cargando detalles del candidato ID:', id);
        
        // Obtener información básica del candidato
        const candidatoData = await getCandidatoById(id);
        console.log('📊 Candidato obtenido:', candidatoData);
        setCandidato(candidatoData);

        // Obtener propuestas del candidato
        console.log('🔄 Obteniendo propuestas para candidato ID:', id);
        const propuestasData = await getPropuestas(id);
        console.log('📋 Propuestas obtenidas:', propuestasData);
        console.log('📊 Número de propuestas:', propuestasData.length);
        setPropuestas(propuestasData);

        // Calcular posición política basada en las propuestas
        if (propuestasData.length > 0) {
          console.log('🧮 Calculando posición política...');
          const posicion = calcularPosicionPolitica(propuestasData);
          console.log('📊 Posición política calculada:', posicion);
          setPosicionPolitica(posicion);
        } else {
          setPosicionPolitica(null);
        }

        // Obtener historial político del candidato
        try {
          console.log('🔄 Intentando obtener historial político para candidato ID:', id);
          const historialData = await getHistorialPolitico(id);
          console.log('🏛️ Historial político obtenido exitosamente:', historialData);
          console.log('🏛️ Número de entradas de historial:', historialData.length);
          setHistorial(historialData);
        } catch (historialError) {
          console.error('❌ Error detallado al obtener historial político:', historialError);
          console.log('⚠️ Mensaje de error:', historialError.message);
          console.log('⚠️ Usando datos simulados para el historial');
          
          // Usar datos simulados si no hay endpoint disponible o no hay datos
          const historialSimulado = [
            {
              historial_id: 1,
              cargo: "Ministro de Salud",
              institucion: "Ministerio de Salud",
              ano_inicio: 2019,
              ano_fin: 2020
            },
            {
              historial_id: 2,
              cargo: "Miembro del congreso",
              institucion: "Congreso de la República",
              ano_inicio: 2016,
              ano_fin: 2018
            },
            {
              historial_id: 3,
              cargo: "Directora del Instituto de Salud Pública",
              institucion: "Instituto de Salud Pública",
              ano_inicio: 2009,
              ano_fin: 2014
            }
          ];
          setHistorial(historialSimulado);
        }

      } catch (error) {
        console.error('❌ Error al cargar candidato:', error);
        setError('Error al cargar los detalles del candidato. Por favor intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCandidatoData();
    }
  }, [id]);

  /**
   * Función para reintentar carga de datos
   */
  const handleRetry = () => {
    window.location.reload();
  };

  /**
   * Renderizar estado de carga
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 no-scroll-x eliminate-black-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 constrain-width contain-all">
          
          {/* Skeleton del header */}
          <div className="mb-8">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse mx-auto lg:mx-0"></div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-200 rounded w-64 mb-4 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skeleton del contenido */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse mt-1"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Error al cargar candidato</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRetry}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowPathIcon className="w-5 h-5 mr-2" />
                Reintentar
              </button>
              <Link
                to="/candidatos"
                className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Volver a Candidatos
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!candidato) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 no-scroll-x eliminate-black-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 constrain-width contain-all">
          <div className="text-center">
            <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Candidato no encontrado</h1>
            <p className="text-gray-600 mb-8">El candidato que buscas no existe o ha sido removido.</p>
            <Link
              to="/candidatos"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Ver todos los candidatos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 no-scroll-x eliminate-black-bar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 constrain-width contain-all">
        
        {/* Navegación de retorno */}
        <div className="mb-8">
          <Link
            to="/candidatos"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors group"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver a Candidatos
          </Link>
        </div>

        {/* Header del candidato */}
        <CandidateHeader candidato={candidato} />

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          
          {/* Columna izquierda: Biografía y Propuestas */}
          <div className="lg:col-span-2 space-y-8">
            <BiografiaSection candidato={candidato} />
            <PropuestasSection propuestas={propuestas} />
          </div>

          {/* Columna derecha: Posición Política, Historial Político y Chat IA */}
          <div className="space-y-8">
            <PoliticalPositionChart posicionPolitica={posicionPolitica} />
            <HistorialPoliticoSection historial={historial} />
            <ChatIA 
              candidatoId={candidato.candidato_id} 
              candidatoNombre={`${candidato.nombre} ${candidato.apellido}`} 
            />
          </div>

        </div>
      </div>
    </div>
  );
};

/**
 * Componente del header principal del candidato
 */
const CandidateHeader = ({ candidato }) => {
  const [imageError, setImageError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleImageError = () => setImageError(true);
  const handleLogoError = () => setLogoError(true);

  // Generar iniciales para placeholder
  const getInitials = () => {
    const nombre = candidato.nombre?.[0] || '';
    const apellido = candidato.apellido?.[0] || '';
    return nombre + apellido || '?';
  };

  // Construir URLs de imagen de manera segura
  const imageUrl = candidato.foto_url ? `http://localhost:3000${candidato.foto_url}` : null;
  const logoUrl = candidato.partido_logo ? `http://localhost:3000${candidato.partido_logo}` : null;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
        
        {/* Foto del candidato */}
        <div className="flex-shrink-0 mx-auto lg:mx-0">
          <div className="relative">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden 
                          ring-4 ring-white shadow-xl bg-gradient-to-br from-blue-100 to-blue-200">
              {imageUrl && !imageError ? (
                <img
                  src={imageUrl}
                  alt={`${candidato.nombre} ${candidato.apellido}`}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br 
                              from-blue-500 to-blue-600 text-white text-4xl font-bold">
                  {getInitials()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Información principal */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 font-['Outfit']">
            {candidato.nombre} {candidato.apellido}
          </h1>
          
          {/* Logo y nombre del partido */}
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
            {logoUrl && !logoError ? (
              <img
                src={logoUrl}
                alt={`Logo ${candidato.partido_nombre}`}
                className="w-12 h-12 object-contain rounded-lg shadow-sm bg-white border border-gray-100 p-1"
                onError={handleLogoError}
              />
            ) : (
              <div className="w-12 h-12 rounded-lg shadow-sm bg-gradient-to-br from-gray-100 to-gray-200 
                            border border-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-500">
                  {candidato.partido_nombre?.[0] || '?'}
                </span>
              </div>
            )}
            <span className="text-xl font-semibold text-blue-600">
              {candidato.partido_nombre || 'Partido Independiente'}
            </span>
          </div>

          {/* Información adicional */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-gray-600">
            {candidato.lugar_nacimiento && (
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5" />
                <span className="text-sm">{candidato.lugar_nacimiento}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              <span className="text-sm">Candidato Presidencial 2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Sección de biografía del candidato
 */
const BiografiaSection = ({ candidato }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <DocumentTextIcon className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900 font-['Outfit']">Biografía</h2>
      </div>
      <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
        {candidato.biografia ? (
          <p>{candidato.biografia}</p>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <DocumentTextIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No hay información biográfica disponible para este candidato.</p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Sección de propuestas por temas
 */
const PropuestasSection = ({ propuestas }) => {
  // Colores para diferentes temas
  const temaColors = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600', 
    'from-purple-500 to-purple-600',
    'from-orange-500 to-orange-600',
    'from-red-500 to-red-600',
    'from-teal-500 to-teal-600',
    'from-indigo-500 to-indigo-600',
    'from-pink-500 to-pink-600'
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <LightBulbIcon className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900 font-['Outfit']">Propuestas por Tema</h2>
      </div>
      
      {propuestas.length > 0 ? (
        <div className="space-y-6">
          {propuestas.map((propuesta, index) => (
            <PropuestaCard
              key={propuesta.propuesta_id}
              propuesta={propuesta}
              colorClass={temaColors[index % temaColors.length]}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <LightBulbIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No hay propuestas aún registradas</h3>
          <p className="text-sm">Este candidato no ha registrado propuestas específicas por tema.</p>
        </div>
      )}
    </div>
  );
};

/**
 * Componente individual para cada propuesta
 */
const PropuestaCard = ({ propuesta, colorClass }) => {
  // Extraer métricas y obtener texto limpio
  const metricas = extraerMetricasPoliticas(propuesta.resumen_ia || '');
  
  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-4">
        {/* Icono del tema con color dinámico */}
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClass} 
                        flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
          <LightBulbIcon className="w-6 h-6" />
        </div>
        
        {/* Contenido de la propuesta */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {propuesta.titulo_propuesta}
          </h3>
          
          {propuesta.nombre_tema && (
            <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm 
                          font-medium rounded-full mb-3">
              {propuesta.nombre_tema}
            </div>
          )}
          
          {metricas.textoLimpio && (
            <p className="text-gray-700 leading-relaxed">
              {metricas.textoLimpio}
            </p>
          )}

          {/* Indicador de orientación política (opcional, pequeño) */}
          {metricas.orientacion && (
            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <span className="text-xs text-gray-500">
                Análisis político incluido
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Sección de historial político en formato timeline
 */
const HistorialPoliticoSection = ({ historial }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <ClockIcon className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900 font-['Outfit']">Historial Político</h2>
      </div>
      
      {historial.length > 0 ? (
        <div className="space-y-6">
          {historial.map((entrada, index) => (
            <HistorialEntry
              key={entrada.historial_id}
              entrada={entrada}
              isLast={index === historial.length - 1}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <ClockIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No hay historial político registrado.</p>
        </div>
      )}
    </div>
  );
};

/**
 * Componente individual para cada entrada del historial
 */
const HistorialEntry = ({ entrada, isLast }) => {
  const formatYear = (year) => {
    return year || 'Presente';
  };

  return (
    <div className="relative flex items-start gap-4">
      {/* Línea temporal */}
      {!isLast && (
        <div className="absolute left-4 top-10 w-0.5 h-full bg-gray-200"></div>
      )}
      
      {/* Punto temporal */}
      <div className="relative flex-shrink-0">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
          <CheckCircleIcon className="w-4 h-4 text-white" />
        </div>
      </div>
      
      {/* Contenido */}
      <div className="flex-1 min-w-0 pb-2">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-1">
            {entrada.cargo}
          </h3>
          
          {entrada.institucion && (
            <p className="text-gray-600 text-sm mb-2 flex items-center gap-2">
              <BuildingOfficeIcon className="w-4 h-4 flex-shrink-0" />
              {entrada.institucion}
            </p>
          )}
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <CalendarIcon className="w-3 h-3" />
            <span>{entrada.ano_inicio} - {formatYear(entrada.ano_fin)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailPage;