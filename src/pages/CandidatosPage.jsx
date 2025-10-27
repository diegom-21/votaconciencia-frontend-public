import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCandidatos, getImageUrl } from '../api';
import {
  MagnifyingGlassIcon,
  UserIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

/**
 * Página principal de candidatos que muestra todos los candidatos registrados
 * con funcionalidad de búsqueda y filtrado, completamente responsive
 */
const CandidatosPage = () => {
  // Estados del componente
  const [candidatos, setCandidatos] = useState([]);
  const [candidatosFiltrados, setCandidatosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Cargar candidatos desde el backend al montar el componente
   */
  useEffect(() => {
    const fetchCandidatos = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 Cargando candidatos desde API...');
        const data = await getCandidatos();

        // Validar que los datos sean un array
        const candidatosList = Array.isArray(data) ? data : [];

        console.log('📊 Candidatos obtenidos:', candidatosList.length);
        console.log('📄 Estructura de candidatos:', candidatosList[0]);

        setCandidatos(candidatosList);
        setCandidatosFiltrados(candidatosList);

      } catch (error) {
        console.error('❌ Error al cargar candidatos:', error);
        setError('Error al cargar los candidatos. Por favor intenta de nuevo.');
        setCandidatos([]);
        setCandidatosFiltrados([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidatos();
  }, []);

  /**
   * Filtrar candidatos según el término de búsqueda
   */
  useEffect(() => {
    if (!searchTerm.trim()) {
      setCandidatosFiltrados(candidatos);
      return;
    }

    const filtrados = candidatos.filter(candidato => {
      const nombreCompleto = `${candidato.nombre || ''} ${candidato.apellido || ''}`.toLowerCase();
      const partido = (candidato.partido_nombre || candidato.nombre_partido || '').toLowerCase();
      const termino = searchTerm.toLowerCase();

      return nombreCompleto.includes(termino) || partido.includes(termino);
    });

    console.log(`🔍 Filtrado: "${searchTerm}" - ${filtrados.length} resultados`);
    setCandidatosFiltrados(filtrados);
  }, [searchTerm, candidatos]);

  /**
   * Función para reintentar carga de datos
   */
  const handleRetry = () => {
    window.location.reload();
  };

  /**
   * Limpiar búsqueda
   */
  const clearSearch = () => {
    setSearchTerm('');
  };

  /**
   * Renderizar estado de carga
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 no-scroll-x eliminate-black-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 constrain-width contain-all">
          {/* Header con skeleton */}
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>

          {/* Buscador skeleton */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="h-12 bg-gray-200 rounded-full animate-pulse"></div>
          </div>

          {/* Grid de candidatos skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Error al cargar candidatos</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
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

        {/* Header Section */}
        <div className="text-center mt-20 mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-['Outfit']">
            Candidatos Presidenciales 2026
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Conoce a todos los candidatos que buscan la presidencia del Perú.
            Explora sus propuestas, trayectorias y planes de gobierno.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre o partido político..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-4 text-base border border-gray-300 rounded-full 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                 bg-white shadow-sm transition-all duration-200
                 placeholder:text-gray-500"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                // 👇 CLASE MODIFICADA
                className="absolute inset-y-0 right-0 h-full w-12 flex items-center justify-center 
                   bg-gray-900 rounded-r-full text-white"
              >
                <span className="text-xl leading-none">x</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Section */}
        {candidatosFiltrados.length === 0 && !searchTerm ? (
          /* No hay candidatos registrados */
          <div className="text-center py-16">
            <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay candidatos registrados
            </h3>
            <p className="text-gray-500">
              Los candidatos aparecerán aquí cuando sean registrados en el sistema.
            </p>
          </div>
        ) : candidatosFiltrados.length === 0 && searchTerm ? (
          /* No hay resultados para la búsqueda */
          <div className="text-center py-16">
            <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No se encontraron candidatos
            </h3>
            <p className="text-gray-500 mb-4">
              Intenta con otros términos de búsqueda o verifica la ortografía.
            </p>
            <button
              onClick={clearSearch}
              className="text-blue-600 hover:text-blue-700 font-medium"
              style={{ backgroundColor: "white", borderColor: "blue" }}
            >
              Ver todos los candidatos
            </button>
          </div>
        ) : (
          /* Grid de candidatos */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {candidatosFiltrados.map((candidato, index) => {
              return (
                <CandidatoCard
                  key={candidato.candidato_id || index}
                  candidato={candidato}
                />
              );
            })}
          </div>
        )}

        {/* Stats Section (solo si hay candidatos) */}
        {candidatosFiltrados.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Total de candidatos registrados: <span className="font-semibold text-gray-900">{candidatos.length}</span>
              {searchTerm && candidatosFiltrados.length !== candidatos.length && (
                <> | Mostrando: <span className="font-semibold text-blue-600">{candidatosFiltrados.length}</span></>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Componente individual para cada candidato
 */
const CandidatoCard = ({ candidato }) => {
  const [imageError, setImageError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleImageError = () => {
    console.log('❌ Error cargando imagen para:', candidato.nombre);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('✅ Imagen cargada correctamente para:', candidato.nombre);
  };

  const handleLogoError = () => {
    console.log('❌ Error cargando logo del partido para:', candidato.partido_nombre);
    setLogoError(true);
  };

  const handleLogoLoad = () => {
    console.log('✅ Logo del partido cargado correctamente para:', candidato.partido_nombre);
  };

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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg 
                    transition-all duration-300 hover:-translate-y-1 p-6 group">

      {/* Imagen del candidato */}
      <div className="relative mb-6">
        <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full overflow-hidden 
                        ring-4 ring-white shadow-lg bg-gradient-to-br from-blue-100 to-blue-200">
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={`${candidato.nombre} ${candidato.apellido}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br 
                            from-blue-500 to-blue-600 text-white text-xl sm:text-2xl font-bold">
              {getInitials()}
            </div>
          )}
        </div>
      </div>

      {/* Información del candidato */}
      <div className="text-center space-y-4">
        {/* Nombre completo */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight font-['Outfit']">
          {candidato.nombre} {candidato.apellido}
        </h3>

        {/* Logo del partido */}
        <div className="flex justify-center mb-3">
          {logoUrl && !logoError ? (
            <img
              src={logoUrl}
              alt={`Logo ${candidato.partido_nombre || 'del partido'}`}
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-lg shadow-sm 
                         bg-white border border-gray-100 p-1"
              onError={handleLogoError}
              onLoad={handleLogoLoad}
            />
          ) : (
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg shadow-sm bg-gradient-to-br 
                            from-gray-100 to-gray-200 border border-gray-200 
                            flex items-center justify-center">
              <span className="text-xs font-medium text-gray-500">
                {candidato.partido_nombre?.[0] || '?'}
              </span>
            </div>
          )}
        </div>

        {/* Nombre del partido */}
        <p className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-full inline-block">
          {candidato.partido_nombre || candidato.nombre_partido || 'Partido Independiente'}
        </p>

        {/* Información adicional si está disponible */}
        {candidato.lugar_nacimiento && (
          <p className="text-xs text-gray-500 mt-3">
            📍 {candidato.lugar_nacimiento}
          </p>
        )}
      </div>

      {/* Botón de acción */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <Link
          to={`/candidatos/${candidato.candidato_id}`}
          className="w-full inline-flex items-center justify-center px-4 py-3 
                     bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium 
                     rounded-xl hover:from-blue-700 hover:to-blue-800 
                     transform hover:scale-105 transition-all duration-200 
                     shadow-sm hover:shadow-md group-hover:shadow-lg"
        >
          <span>Ver perfil completo</span>
          <ChevronRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default CandidatosPage;