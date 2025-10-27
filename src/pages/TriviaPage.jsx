import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPreguntasByTema, getOpcionesByPregunta, getTrivias, getImageUrl } from '../api';
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  TrophyIcon,
  AcademicCapIcon,
  ClockIcon,
  StarIcon,
  HomeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

/**
 * Página para realizar una trivia específica
 */
const TriviaPage = () => {
  const { temaId } = useParams();
  const navigate = useNavigate();

  // Estados principales
  const [temaInfo, setTemaInfo] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
  const [triviaCompletada, setTriviaCompletada] = useState(false);
  const [puntuacion, setPuntuacion] = useState(0);
  
  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tiempoInicio, setTiempoInicio] = useState(null);
  const [duracionTotal, setDuracionTotal] = useState(0);

  /**
   * Cargar datos de la trivia
   */
  useEffect(() => {
    const cargarTrivia = async () => {
      try {
        setLoading(true);
        setError(null);
        setTiempoInicio(Date.now());

        console.log('🔄 Cargando trivia para tema:', temaId);

        // Obtener información del tema
        const temasData = await getTrivias();
        const tema = temasData.find(t => t.tema_trivia_id === parseInt(temaId));
        
        if (!tema) {
          throw new Error('Tema de trivia no encontrado');
        }

        setTemaInfo(tema);

        // Obtener preguntas del tema
        const preguntasData = await getPreguntasByTema(temaId);
        console.log('📋 Preguntas obtenidas:', preguntasData);

        // Cargar opciones para cada pregunta
        const preguntasConOpciones = await Promise.all(
          preguntasData.map(async (pregunta) => {
            const opciones = await getOpcionesByPregunta(pregunta.pregunta_id);
            return {
              ...pregunta,
              opciones: opciones || []
            };
          })
        );

        // Ordenar por orden_visualizacion
        preguntasConOpciones.sort((a, b) => (a.orden_visualizacion || 0) - (b.orden_visualizacion || 0));

        setPreguntas(preguntasConOpciones);
        console.log('✅ Trivia cargada:', { tema, preguntas: preguntasConOpciones });

      } catch (error) {
        console.error('❌ Error al cargar trivia:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (temaId) {
      cargarTrivia();
    }
  }, [temaId]);

  /**
   * Manejar selección de opción
   */
  const handleSeleccionOpcion = (opcionId, esCorrecta) => {
    if (mostrarRespuesta) return; // No permitir cambios si ya se mostró la respuesta

    setOpcionSeleccionada(opcionId);
    setMostrarRespuesta(true);

    // Guardar respuesta
    const nuevasRespuestas = {
      ...respuestas,
      [preguntaActual]: {
        opcionId,
        esCorrecta,
        preguntaId: preguntas[preguntaActual].pregunta_id
      }
    };
    setRespuestas(nuevasRespuestas);

    // Actualizar puntuación
    if (esCorrecta) {
      setPuntuacion(prev => prev + 1);
    }
  };

  /**
   * Ir a la siguiente pregunta
   */
  const siguientePregunta = () => {
    if (preguntaActual < preguntas.length - 1) {
      setPreguntaActual(prev => prev + 1);
      setOpcionSeleccionada(null);
      setMostrarRespuesta(false);
    } else {
      // Completar trivia
      setDuracionTotal(Math.round((Date.now() - tiempoInicio) / 1000));
      setTriviaCompletada(true);
    }
  };

  /**
   * Ir a la pregunta anterior
   */
  const preguntaAnterior = () => {
    if (preguntaActual > 0) {
      setPreguntaActual(prev => prev - 1);
      
      // Restaurar estado de la pregunta anterior
      const respuestaAnterior = respuestas[preguntaActual - 1];
      if (respuestaAnterior) {
        setOpcionSeleccionada(respuestaAnterior.opcionId);
        setMostrarRespuesta(true);
      } else {
        setOpcionSeleccionada(null);
        setMostrarRespuesta(false);
      }
    }
  };

  /**
   * Reiniciar trivia
   */
  const reiniciarTrivia = () => {
    setPreguntaActual(0);
    setRespuestas({});
    setOpcionSeleccionada(null);
    setMostrarRespuesta(false);
    setTriviaCompletada(false);
    setPuntuacion(0);
    setTiempoInicio(Date.now());
  };

  /**
   * Volver al inicio
   */
  const volverAlInicio = () => {
    navigate('/recursos');
  };

  /**
   * Renderizar estado de carga
   */
  if (loading) {
    return (
      <div className="min-h-screen mt-20 bg-gradient-to-br from-purple-50 to-blue-50 pt-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900">Cargando trivia...</h2>
          <p className="text-gray-600">Preparando las preguntas</p>
        </div>
      </div>
    );
  }

  /**
   * Renderizar estado de error
   */
  if (error) {
    return (
      <div className="min-h-screen mt-20 bg-gradient-to-br from-purple-50 to-blue-50 pt-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar trivia</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={volverAlInicio}
            className="inline-flex items-center px-6 py-3 text-white font-medium rounded-lg hover:opacity-90 transition-colors"
            style={{ backgroundColor: '#0070C0' }}
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Volver a recursos
          </button>
        </div>
      </div>
    );
  }

  /**
   * Renderizar pantalla de resultados
   */
  if (triviaCompletada) {
    const porcentaje = Math.round((puntuacion / preguntas.length) * 100);
    const esExcelente = porcentaje >= 80;
    const esBueno = porcentaje >= 60;

    return (
      <div className="min-h-screen mt-20 bg-gradient-to-br from-purple-50 to-blue-50 pt-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Resultados */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            
            {/* Icono de resultado */}
            <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
              esExcelente ? 'bg-green-100' : esBueno ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <TrophyIcon className={`w-10 h-10 ${
                esExcelente ? 'text-green-600' : esBueno ? 'text-yellow-600' : 'text-red-600'
              }`} />
            </div>

            {/* Título */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Trivia Completada!
            </h1>

            {/* Puntuación */}
            <div className="mb-8">
              <div className={`text-6xl font-bold mb-2 ${
                esExcelente ? 'text-green-600' : esBueno ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {puntuacion}/{preguntas.length}
              </div>
              <div className="text-xl text-gray-600">
                {porcentaje}% de respuestas correctas
              </div>
            </div>

            {/* Mensaje de resultado */}
            <div className="mb-8">
              {esExcelente && (
                <p className="text-lg text-green-700">
                  ¡Excelente! Tienes un gran conocimiento sobre {temaInfo?.nombre_tema.toLowerCase()}.
                </p>
              )}
              {esBueno && !esExcelente && (
                <p className="text-lg text-yellow-700">
                  ¡Bien hecho! Tienes un buen conocimiento, pero puedes mejorar.
                </p>
              )}
              {!esBueno && (
                <p className="text-lg text-red-700">
                  Sigue estudiando. Este tema requiere más práctica.
                </p>
              )}
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <ClockIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Tiempo total</div>
                <div className="text-lg font-bold">{Math.floor(duracionTotal / 60)}:{(duracionTotal % 60).toString().padStart(2, '0')}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <StarIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Correctas</div>
                <div className="text-lg font-bold text-green-600">{puntuacion}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <AcademicCapIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Total preguntas</div>
                <div className="text-lg font-bold">{preguntas.length}</div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={reiniciarTrivia}
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                <ArrowPathIcon className="w-5 h-5 mr-2" />
                Repetir trivia
              </button>
              <button
                onClick={volverAlInicio}
                className="inline-flex items-center px-6 py-3 text-white font-medium rounded-lg hover:opacity-90 transition-colors"
                style={{ backgroundColor: '#0070C0' }}
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                Volver a recursos
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  const pregunta = preguntas[preguntaActual];
  const progreso = ((preguntaActual + 1) / preguntas.length) * 100;

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-purple-50 to-blue-50 pt-1">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header con información del tema */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0070C0' }}>
                <AcademicCapIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{temaInfo?.nombre_tema}</h1>
                <p className="text-sm text-gray-600">Pregunta {preguntaActual + 1} de {preguntas.length}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: '#0070C0' }}>{puntuacion}</div>
              <div className="text-sm text-gray-600">puntos</div>
            </div>
          </div>
          
          {/* Barra de progreso */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${progreso}%`,
                  backgroundColor: '#0070C0'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Pregunta actual */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          
          {/* Texto de la pregunta */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">
              {pregunta?.texto_pregunta}
            </h2>
          </div>

          {/* Opciones */}
          <div className="space-y-4">
            {pregunta?.opciones?.map((opcion, index) => {
              const esSeleccionada = opcionSeleccionada === opcion.opcion_id;
              const esCorrecta = opcion.es_correcta;
              
              let claseBoton = "w-full p-4 text-left rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer";
              
              if (!mostrarRespuesta) {
                // Estado normal
                if (esSeleccionada) {
                  claseBoton += " border-purple-500 bg-purple-50 text-purple-900";
                } else {
                  claseBoton += " border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50";
                }
              } else {
                // Mostrar respuestas
                if (esCorrecta) {
                  claseBoton += " border-green-500 bg-green-50 text-green-900";
                } else if (esSeleccionada && !esCorrecta) {
                  claseBoton += " border-red-500 bg-red-50 text-red-900";
                } else {
                  claseBoton += " border-gray-200 bg-gray-50 text-gray-600";
                }
              }

              return (
                <div
                  key={opcion.opcion_id}
                  className={claseBoton}
                  onClick={() => handleSeleccionOpcion(opcion.opcion_id, esCorrecta)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        !mostrarRespuesta && esSeleccionada ? 'bg-purple-500 text-white' :
                        mostrarRespuesta && esCorrecta ? 'bg-green-500 text-white' :
                        mostrarRespuesta && esSeleccionada && !esCorrecta ? 'bg-red-500 text-white' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-lg">{opcion.texto_opcion}</span>
                    </div>
                    
                    {mostrarRespuesta && (
                      <div>
                        {esCorrecta && (
                          <CheckCircleIcon className="w-6 h-6 text-green-600" />
                        )}
                        {esSeleccionada && !esCorrecta && (
                          <XCircleIcon className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controles de navegación */}
        <div className="flex justify-between items-center">
          <button
            onClick={preguntaAnterior}
            disabled={preguntaActual === 0}
            className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              preguntaActual === 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Anterior
          </button>

          {mostrarRespuesta && (
            <button
              onClick={siguientePregunta}
              className="inline-flex items-center px-6 py-3 text-white font-medium rounded-lg hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#0070C0' }}
            >
              {preguntaActual < preguntas.length - 1 ? 'Siguiente' : 'Finalizar'}
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default TriviaPage;