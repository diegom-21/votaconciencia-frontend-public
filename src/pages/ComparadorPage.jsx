import React, { useState, useEffect } from 'react';
import { getCandidatos, getPropuestas, getTemas, getImageUrl } from '../api';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  UserIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

/**
 * Página del comparador de candidatos presidenciales
 * Permite seleccionar múltiples candidatos y comparar sus propuestas por temas
 */
const ComparadorPage = () => {
  // Estados principales
  const [candidatos, setCandidatos] = useState([]);
  const [temas, setTemas] = useState([]);
  const [candidatosSeleccionados, setCandidatosSeleccionados] = useState([]);
  const [propuestasPorCandidato, setPropuestasPorCandidato] = useState({});
  
  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingPropuestas, setLoadingPropuestas] = useState(false);

  /**
   * Cargar datos iniciales al montar el componente
   */
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar candidatos y temas en paralelo
        const [candidatosData, temasData] = await Promise.all([
          getCandidatos(),
          getTemas()
        ]);        setCandidatos(candidatosData.filter(c => c.esta_activo === 1));
        setTemas(temasData);

      } catch (error) {
        setError('Error al cargar los datos. Por favor intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  /**
   * Cargar propuestas cuando se seleccionan candidatos
   */
  useEffect(() => {
    const fetchPropuestas = async () => {
      if (candidatosSeleccionados.length === 0) {
        setPropuestasPorCandidato({});
        return;
      }

      try {
        setLoadingPropuestas(true);

        const propuestasPromesas = candidatosSeleccionados.map(async (candidato) => {
          try {
                        const propuestas = await getPropuestas(candidato.candidato_id);
            return { candidatoId: candidato.candidato_id, propuestas };
          } catch (error) {
            return { candidatoId: candidato.candidato_id, propuestas: [] };
          }
        });

        const resultados = await Promise.all(propuestasPromesas);
        
        const propuestasMap = {};
        resultados.forEach(({ candidatoId, propuestas }) => {
          propuestasMap[candidatoId] = propuestas;
        });

        setPropuestasPorCandidato(propuestasMap);

      } catch (error) {
        // Error silencioso
      } finally {
        setLoadingPropuestas(false);
      }
    };

    fetchPropuestas();
  }, [candidatosSeleccionados]);

  /**
   * Agregar un candidato a la comparación
   */
  const agregarCandidato = (candidato) => {
    if (candidatosSeleccionados.find(c => c.candidato_id === candidato.candidato_id)) {
      return; // Ya está seleccionado
    }
    
    if (candidatosSeleccionados.length >= 4) {
      alert('Máximo 4 candidatos para comparar');
      return;
    }

    setCandidatosSeleccionados([...candidatosSeleccionados, candidato]);
  };

  /**
   * Remover un candidato de la comparación
   */
  const removerCandidato = (candidatoId) => {
    setCandidatosSeleccionados(candidatosSeleccionados.filter(c => c.candidato_id !== candidatoId));
  };

  /**
   * Obtener propuesta de un candidato para un tema específico
   */
  const getPropuestaPorTema = (candidatoId, temaId) => {
    const propuestas = propuestasPorCandidato[candidatoId] || [];
    return propuestas.find(p => p.tema_id === temaId);
  };

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
          
          {/* Header skeleton */}
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-200 rounded w-96 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
          </div>

          {/* Selector skeleton */}
          <div className="mb-8">
            <div className="flex gap-4 justify-center">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="w-80 h-16 bg-white rounded-xl shadow-sm animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Table skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Error al cargar comparador</h1>
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
        <div className="text-center mt-20 mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-['Outfit']">
            Comparador de Candidatos
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Selecciona candidatos y compara sus propuestas por temas para tomar una decisión informada.
          </p>
        </div>

        {/* Selector de candidatos */}
        <CandidateSelector
          candidatos={candidatos}
          candidatosSeleccionados={candidatosSeleccionados}
          onAgregarCandidato={agregarCandidato}
          onRemoverCandidato={removerCandidato}
        />

        {/* Tabla de comparación */}
        {candidatosSeleccionados.length >= 2 ? (
          <ComparisonTable
            candidatosSeleccionados={candidatosSeleccionados}
            temas={temas}
            propuestasPorCandidato={propuestasPorCandidato}
            loading={loadingPropuestas}
            onRemoverCandidato={removerCandidato}
          />
        ) : (
          <EmptyComparison candidatosSeleccionados={candidatosSeleccionados} />
        )}

      </div>
    </div>
  );
};

/**
 * Componente para seleccionar candidatos
 */
const CandidateSelector = ({ candidatos, candidatosSeleccionados, onAgregarCandidato, onRemoverCandidato }) => {
  const [showDropdown, setShowDropdown] = useState(null);

  const candidatosDisponibles = candidatos.filter(
    c => !candidatosSeleccionados.find(selected => selected.candidato_id === c.candidato_id)
  );

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-4 justify-center">
        
        {/* Candidatos ya seleccionados */}
        {candidatosSeleccionados.map((candidato) => (
          <SelectedCandidateCard
            key={candidato.candidato_id}
            candidato={candidato}
            onRemover={onRemoverCandidato}
          />
        ))}

        {/* Botón para agregar candidato */}
        {candidatosSeleccionados.length < 4 && candidatosDisponibles.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(showDropdown === 'add' ? null : 'add')}
              className="w-80 h-20 bg-white border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-3"
            >
              <PlusIcon className="w-6 h-6 text-blue-500" />
              <span className="text-blue-600 font-medium">
                {candidatosSeleccionados.length === 0 
                  ? 'Selecciona un candidato' 
                  : candidatosSeleccionados.length === 1 
                    ? 'Selecciona otro candidato'
                    : 'Agregar candidato'
                }
              </span>
              <ChevronDownIcon className={`w-5 h-5 text-blue-500 transition-transform ${showDropdown === 'add' ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {showDropdown === 'add' && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
                {candidatosDisponibles.map((candidato) => (
                  <button
                    key={candidato.candidato_id}
                    onClick={() => {
                      onAgregarCandidato(candidato);
                      setShowDropdown(null);
                    }}
                    className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      {candidato.foto_url ? (
                        <img 
                          src={getImageUrl(candidato.foto_url)} 
                          alt={`${candidato.nombre} ${candidato.apellido}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {candidato.nombre} {candidato.apellido}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {candidato.partido_nombre || 'Independiente'}
                      </p>
                    </div>
                  </button>
                ))}
                
                {candidatosDisponibles.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    No hay más candidatos disponibles
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

/**
 * Tarjeta de candidato seleccionado
 */
const SelectedCandidateCard = ({ candidato, onRemover }) => {
  return (
    <div className="relative w-80 h-20 bg-white rounded-xl shadow-sm border-2 border-blue-200 p-4 flex items-center gap-3">
      {/* Botón para remover */}
      <button
        onClick={() => onRemover(candidato.candidato_id)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
      >
        <XMarkIcon className="w-4 h-4 text-white" />
      </button>

      {/* Foto del candidato */}
      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
        {candidato.foto_url ? (
          <img 
            src={getImageUrl(candidato.foto_url)} 
            alt={`${candidato.nombre} ${candidato.apellido}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>

      {/* Información del candidato */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">
          {candidato.nombre} {candidato.apellido}
        </p>
        <p className="text-sm text-gray-500 truncate">
          {candidato.partido_nombre || 'Independiente'}
        </p>
      </div>
    </div>
  );
};

/**
 * Estado vacío cuando no hay suficientes candidatos seleccionados
 */
const EmptyComparison = ({ candidatosSeleccionados }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
      <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-6" />
      
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        {candidatosSeleccionados.length === 0 
          ? 'Selecciona candidatos para comenzar'
          : candidatosSeleccionados.length === 1
            ? 'Selecciona al menos 2 candidatos para comparar'
            : 'Comparación lista'
        }
      </h3>
      
      <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
        {candidatosSeleccionados.length === 0 
          ? 'Elige los candidatos que quieres comparar usando los selectores de arriba. Puedes comparar hasta 4 candidatos a la vez.'
          : candidatosSeleccionados.length === 1
            ? `Has seleccionado a ${candidatosSeleccionados[0].nombre} ${candidatosSeleccionados[0].apellido}. Selecciona al menos un candidato más para ver la comparación.`
            : 'La comparación aparecerá aquí una vez que hayas seleccionado al menos 2 candidatos.'
        }
      </p>
    </div>
  );
};

/**
 * Tabla de comparación de propuestas por temas
 */
const ComparisonTable = ({ candidatosSeleccionados, temas, propuestasPorCandidato, loading, onRemoverCandidato }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <div className="text-center">
          <ArrowPathIcon className="w-8 h-8 text-blue-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Cargando propuestas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* Header de la tabla */}
      <div className="bg-gray-50 p-6 sm:p-8 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Comparación por Temas</h2>
        <p className="text-gray-600">Propuestas de los candidatos organizadas por ejes temáticos</p>
      </div>

      {/* Tabla responsive */}
      <div className="overflow-x-auto">
        <table className="w-full">
          
          {/* Header de candidatos */}
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-4 sm:p-6 font-semibold text-gray-900 bg-gray-50 sticky left-0 z-10 border-r border-gray-200 min-w-[150px]">
                Tema
              </th>
              {candidatosSeleccionados.map((candidato) => (
                <th key={candidato.candidato_id} className="text-center p-4 sm:p-6 bg-gray-50 min-w-[300px] max-w-[400px]">
                  <CandidateHeader candidato={candidato} onRemover={onRemoverCandidato} />
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Cuerpo de la tabla */}
          <tbody>
            {temas.map((tema, index) => (
              <tr key={tema.tema_id} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                
                {/* Nombre del tema */}
                <td className="p-4 sm:p-6 font-medium text-gray-900 bg-gray-50 sticky left-0 z-10 border-r border-gray-200 align-top">
                  <div className="flex items-center gap-2">
                    {getThemeIcon(tema.nombre_tema)}
                    <span>{tema.nombre_tema}</span>
                  </div>
                </td>
                
                {/* Propuestas por candidato */}
                {candidatosSeleccionados.map((candidato) => {
                  const propuesta = getPropuestaPorTema(candidato.candidato_id, tema.tema_id, propuestasPorCandidato);
                  return (
                    <td key={candidato.candidato_id} className="p-4 sm:p-6 align-top">
                      <ProposalCell propuesta={propuesta} />
                    </td>
                  );
                })}
                
              </tr>
            ))}
          </tbody>
          
        </table>
      </div>
    </div>
  );
};

/**
 * Header de candidato en la tabla
 */
const CandidateHeader = ({ candidato, onRemover }) => {
  return (
    <div className="relative">
      {/* Botón para remover candidato */}
      <button
        onClick={() => onRemover(candidato.candidato_id)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-20"
      >
        <XMarkIcon className="w-3 h-3 text-white" />
      </button>

      <div className="flex flex-col items-center gap-3">
        {/* Foto del candidato */}
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
          {candidato.foto_url ? (
            <img 
              src={getImageUrl(candidato.foto_url)} 
              alt={`${candidato.nombre} ${candidato.apellido}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Información del candidato */}
        <div className="text-center">
          <p className="font-bold text-gray-900">
            {candidato.nombre} {candidato.apellido}
          </p>
          <p className="text-sm text-gray-500">
            {candidato.partido_nombre || 'Independiente'}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Celda de propuesta individual
 */
const ProposalCell = ({ propuesta }) => {
  if (!propuesta) {
    return (
      <div className="text-center py-8">
        <ExclamationTriangleIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-400">Sin propuesta disponible</p>
      </div>
    );
  }

  // Limpiar el texto de la propuesta
  const textoLimpio = limpiarTextoPropuesta(propuesta.resumen_ia);

  return (
    <div className="space-y-3">
      {/* Título de la propuesta */}
      {propuesta.titulo_propuesta && (
        <h4 className="font-semibold text-gray-900 text-sm leading-tight">
          {propuesta.titulo_propuesta}
        </h4>
      )}

      {/* Resumen de la IA - Texto limpio */}
      {textoLimpio && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-gray-700 leading-relaxed">
            {textoLimpio}
          </p>
        </div>
      )}

      {/* Indicador de disponibilidad */}
      <div className="flex items-center gap-2 text-xs">
        <CheckCircleIcon className="w-4 h-4 text-green-500" />
        <span className="text-green-600 font-medium">Propuesta disponible</span>
      </div>
    </div>
  );
};

/**
 * Obtener propuesta de un candidato para un tema específico
 */
const getPropuestaPorTema = (candidatoId, temaId, propuestasPorCandidato) => {
  const propuestas = propuestasPorCandidato[candidatoId] || [];
  return propuestas.find(p => p.tema_id === temaId);
};

/**
 * Limpiar texto de propuesta removiendo métricas políticas
 */
const limpiarTextoPropuesta = (resumenCompleto) => {
  if (!resumenCompleto) return '';

  // Crear texto limpio removiendo todas las métricas
  let textoLimpio = resumenCompleto;

  // Remover "Orientación política: ..."
  textoLimpio = textoLimpio.replace(/\n?\s*Orientación política:\s*[^\n\r]+/gi, '');

  // Remover "Nivel de afinidad: ..."
  textoLimpio = textoLimpio.replace(/\n?\s*Nivel de afinidad:\s*\d+/gi, '');

  // Remover "Explicación:" o "Explicacion:" (con o sin tilde)
  textoLimpio = textoLimpio.replace(/\n?\s*Explicaci[oó]n:\s*[^\n\r]*(?:\n[^\n\r]*)*/gi, '');

  // Limpiar espacios extra y saltos de línea
  textoLimpio = textoLimpio.trim().replace(/\n\s*\n/g, '\n');

  return textoLimpio;
};

/**
 * Obtener icono según el tema
 */
const getThemeIcon = (nombreTema) => {
  const iconMap = {
    'Economía': '💰',
    'Salud': '🏥',
    'Educación': '📚',
    'Seguridad': '🛡️',
    'Medio Ambiente': '🌱',
    'Defensa': '⚔️',
    'Trabajo': '💼',
    'Justicia': '⚖️',
    'Tecnología': '💻',
    'Vivienda': '🏠'
  };

  return <span className="text-lg">{iconMap[nombreTema] || '📋'}</span>;
};

export default ComparadorPage;