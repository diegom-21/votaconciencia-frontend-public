import React, { useState, useEffect, useRef } from 'react';
import { consultarIA } from '../api';
import {
  PaperAirplaneIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  UserIcon,
  CpuChipIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

/**
 * Componente ChatIA para consultas interactivas sobre planes de gobierno
 * Widget flotante activado por botón
 */
const ChatIA = ({ candidatoId, candidatoNombre = 'el candidato' }) => {
  // Estado para controlar la visibilidad del chat
  const [chatAbierto, setChatAbierto] = useState(false);
  
  // Estados principales
  const [conversacion, setConversacion] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  
  // Cache interno para evitar consultas repetidas
  const [cachePreguntas, setCachePreguntas] = useState({});
  
  // Referencia para auto-scroll
  const chatContainerRef = useRef(null);

  // Preguntas sugeridas por tema
  const preguntasSugeridas = [
    {
      tema: 'Salud',
      pregunta: '¿Cuáles son las principales propuestas en salud?',
      icono: '🏥'
    },
    {
      tema: 'Educación',
      pregunta: '¿Qué planes tiene para mejorar la educación?',
      icono: '📚'
    },
    {
      tema: 'Economía',
      pregunta: '¿Cuáles son las propuestas económicas principales?',
      icono: '💼'
    },
    {
      tema: 'Seguridad',
      pregunta: '¿Cómo planea mejorar la seguridad ciudadana?',
      icono: '🛡️'
    },
    {
      tema: 'Medio Ambiente',
      pregunta: '¿Qué propuestas tiene para el cuidado del medio ambiente?',
      icono: '🌱'
    }
  ];

  /**
   * Auto-scroll al final del chat cuando hay nuevos mensajes
   */
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversacion, cargando]);

  /**
   * Mensaje de bienvenida al cargar el componente
   */
  useEffect(() => {
    setConversacion([
      {
        id: Date.now(),
        tipo: 'ia',
        mensaje: `¡Hola! Soy la IA asistente de VotaConCiencia. Puedo ayudarte a conocer mejor las propuestas de ${candidatoNombre}. Haz una pregunta o selecciona un tema de interés.`,
        timestamp: new Date().toISOString()
      }
    ]);
  }, [candidatoNombre]);

  /**
   * Debug: Verificar que recibimos los props correctos
   */
  useEffect(() => {
    console.log('🔍 ChatIA props recibidas:', { candidatoId, candidatoNombre });
    if (!candidatoId) {
      console.error('❌ ADVERTENCIA: candidatoId no está definido');
    }
  }, [candidatoId, candidatoNombre]);

  /**
   * Normalizar pregunta para cache (minúsculas, sin espacios extra)
   */
  const normalizarPregunta = (pregunta) => {
    return pregunta.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  /**
   * Enviar pregunta a la IA
   */
  const enviarPregunta = async (pregunta) => {
    if (!pregunta.trim() || cargando) return;

    // Verificar que tenemos candidatoId
    if (!candidatoId) {
      console.error('❌ Error: candidatoId no está definido');
      setError('Error: ID del candidato no disponible');
      return;
    }

    const preguntaNormalizada = normalizarPregunta(pregunta);
    
    // Verificar cache local primero
    if (cachePreguntas[preguntaNormalizada]) {
      console.log('📋 Respuesta encontrada en cache local');
      
      // Agregar pregunta del usuario
      const nuevaPreguntaUsuario = {
        id: Date.now(),
        tipo: 'usuario',
        mensaje: pregunta,
        timestamp: new Date().toISOString()
      };

      // Agregar respuesta cacheada de la IA
      const respuestaCacheada = {
        id: Date.now() + 1,
        tipo: 'ia',
        mensaje: cachePreguntas[preguntaNormalizada],
        timestamp: new Date().toISOString(),
        esCacheada: true
      };

      setConversacion(prev => [...prev, nuevaPreguntaUsuario, respuestaCacheada]);
      setPreguntaActual('');
      return;
    }

    // Agregar pregunta del usuario inmediatamente
    const nuevaPreguntaUsuario = {
      id: Date.now(),
      tipo: 'usuario',
      mensaje: pregunta,
      timestamp: new Date().toISOString()
    };

    setConversacion(prev => [...prev, nuevaPreguntaUsuario]);
    setPreguntaActual('');
    setCargando(true);
    setError(null);

    try {
      console.log('🤖 Enviando consulta a la IA:', { candidatoId, pregunta });
      
      const response = await consultarIA(candidatoId, pregunta);

      console.log('✅ Respuesta de la IA recibida:', response);

      if (response && response.respuesta) {
        const respuestaIA = {
          id: Date.now() + 1,
          tipo: 'ia',
          mensaje: response.respuesta,
          timestamp: new Date().toISOString(),
          esCacheada: false
        };

        // Guardar en cache local
        setCachePreguntas(prev => ({
          ...prev,
          [preguntaNormalizada]: response.respuesta
        }));

        setConversacion(prev => [...prev, respuestaIA]);
      } else {
        throw new Error('Respuesta inválida del servidor');
      }

    } catch (error) {
      console.error('❌ Error al consultar IA:', error);
      
      let mensajeError = 'Lo siento, no pude procesar tu pregunta en este momento. ';
      
      if (error.message.includes('sobrecargado')) {
        mensajeError += error.message;
      } else if (error.message.includes('servidor')) {
        mensajeError += error.message;
      } else if (error.message.includes('404')) {
        mensajeError += 'El servicio de consultas IA no está disponible. Verifica que el servidor esté ejecutándose.';
      } else {
        mensajeError += 'Por favor intenta con una pregunta diferente.';
      }

      const errorRespuesta = {
        id: Date.now() + 1,
        tipo: 'error',
        mensaje: mensajeError,
        timestamp: new Date().toISOString()
      };

      setConversacion(prev => [...prev, errorRespuesta]);
      setError('Error en la consulta');
    } finally {
      setCargando(false);
    }
  };

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    enviarPregunta(preguntaActual);
  };

  /**
   * Manejar click en pregunta sugerida
   */
  const handlePreguntaSugerida = (pregunta) => {
    enviarPregunta(pregunta);
  };

  /**
   * Formatear timestamp para mostrar
   */
  const formatearTiempo = (timestamp) => {
    const fecha = new Date(timestamp);
    return fecha.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Botón Flotante para abrir el chat */}
      {!chatAbierto && (
        <button
          onClick={() => setChatAbierto(true)}
          className="fixed top-24 right-6 z-50 group"
          aria-label="Abrir chat con IA"
        >
          {/* Botón principal con efecto de pulso en hover */}
          <div className="relative">
            {/* Anillo de pulso animado - solo en hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-75 group-hover:animate-ping transition-opacity"></div>
            
            {/* Botón principal */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 hover:shadow-blue-500/50 group-active:scale-95">
              <SparklesIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>

          {/* Tooltip descriptivo */}
          <div className="absolute top-full right-0 mt-2 hidden group-hover:block">
            <div className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-xl whitespace-nowrap">
              🤖 Pregúntame sobre el plan de gobierno
              <div className="absolute bottom-full right-8 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-900"></div>
            </div>
          </div>
        </button>
      )}

      {/* Ventana del Chat (Modal Flotante) */}
      {chatAbierto && (
        <div className="fixed top-24 right-6 z-50 w-[95vw] sm:w-[450px] md:w-[500px] max-w-[500px] animate-in slide-in-from-top-5 fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 120px)' }}>
      
            {/* Header del Chat */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-5 text-white flex-shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <SparklesIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold truncate">🤖 Chat IA</h3>
                    <p className="text-blue-100 text-xs sm:text-sm truncate">
                      Plan de {candidatoNombre}
                    </p>
                  </div>
                </div>
                
                {/* Botón cerrar */}
                <button
                  onClick={() => setChatAbierto(false)}
                  className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ml-2"
                  aria-label="Cerrar chat"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contenedor del Chat */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50"
              style={{ maxHeight: 'calc(100vh - 450px)', minHeight: '250px' }}
            >
        {conversacion.map((mensaje) => (
          <div
            key={mensaje.id}
            className={`flex ${mensaje.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                mensaje.tipo === 'usuario'
                  ? 'bg-blue-600 text-white'
                  : mensaje.tipo === 'error'
                  ? 'bg-red-50 border border-red-200 text-red-800'
                  : 'bg-white border border-gray-200 text-gray-800'
              }`}
            >
              {/* Icono y contenido */}
              <div className="flex items-start gap-3">
                {mensaje.tipo === 'ia' && (
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CpuChipIcon className="w-4 h-4 text-purple-600" />
                  </div>
                )}
                {mensaje.tipo === 'usuario' && (
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <UserIcon className="w-4 h-4 text-blue-600" />
                  </div>
                )}
                {mensaje.tipo === 'error' && (
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
                  </div>
                )}
                
                <div className="flex-1">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {mensaje.mensaje}
                  </p>
                  
                  {/* Timestamp y badges */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs opacity-70 ${
                      mensaje.tipo === 'usuario' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatearTiempo(mensaje.timestamp)}
                    </span>
                    
                    {mensaje.esCacheada && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Respuesta instantánea
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Indicador de carga */}
        {cargando && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <ClockIcon className="w-4 h-4 text-purple-600 animate-spin" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-sm">La IA está pensando</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preguntas Sugeridas */}
      <div className="p-3 sm:p-4 bg-white border-t border-gray-200 flex-shrink-0">
        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 font-medium">Preguntas sugeridas:</p>
        <div className="flex flex-wrap gap-2">
          {preguntasSugeridas.map((sugerencia, index) => (
            <button
              key={index}
              onClick={() => handlePreguntaSugerida(sugerencia.pregunta)}
              disabled={cargando}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{sugerencia.icono}</span>
              <span className="hidden sm:inline">{sugerencia.tema}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input de Pregunta */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-white border-t border-gray-200 flex-shrink-0">
        <div className="flex gap-2 sm:gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={preguntaActual}
              onChange={(e) => setPreguntaActual(e.target.value)}
              placeholder="Escribe tu pregunta..."
              disabled={cargando}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              maxLength={500}
            />
          </div>
          <button
            type="submit"
            disabled={!preguntaActual.trim() || cargando}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <PaperAirplaneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline text-sm">Enviar</span>
          </button>
        </div>
        
        {/* Contador de caracteres */}
        <div className="mt-2 text-right">
          <span className={`text-xs ${preguntaActual.length > 450 ? 'text-red-500' : 'text-gray-400'}`}>
            {preguntaActual.length}/500
          </span>
        </div>
      </form>

      {/* Footer informativo */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4 bg-white flex-shrink-0">
        <p className="text-xs text-gray-500 text-center">
          💡 Las respuestas se basan en el plan de gobierno oficial.
        </p>
      </div>

          </div>
        </div>
      )}
    </>
  );
};

export default ChatIA;