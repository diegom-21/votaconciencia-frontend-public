import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProximoEvento, getCronogramaOrdenado } from '../../api';
import { getEventStatus, formatDateSpanish, getNextEvent } from '../../utils/dateUtils';
import {
  CalendarDaysIcon,
  ClockIcon,
  MicrophoneIcon,
  ArchiveBoxIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const ScheduleSection = () => {
  const [nextEvent, setNextEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNextEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Intentar obtener el próximo evento desde el endpoint específico
        try {
          const response = await getProximoEvento();
          console.log('📅 Respuesta del próximo evento (endpoint específico):', response);
          
          if (response && response.data) {
            setNextEvent(response.data);
            return;
          }
        } catch (specificError) {
          console.log('⚠️ Endpoint específico no disponible, intentando con lista completa...');
        }
        
        // Fallback: obtener lista completa y ordenar en frontend
        try {
          const cronogramaResponse = await getCronogramaOrdenado();
          console.log('📅 Respuesta del cronograma ordenado:', cronogramaResponse);
          
          if (cronogramaResponse && cronogramaResponse.data && Array.isArray(cronogramaResponse.data)) {
            const proximoEvento = getNextEvent(cronogramaResponse.data.filter(e => e.esta_publicado));
            if (proximoEvento) {
              setNextEvent(proximoEvento);
              return;
            }
          }
        } catch (ordenadoError) {
          console.log('⚠️ Cronograma ordenado no disponible, usando evento de ejemplo...');
        }
        
        // Evento de ejemplo si no hay datos
        setNextEvent({
          titulo_evento: 'Próximo Debate Presidencial',
          fecha_evento: '2025-10-25',
          descripcion: 'Debate entre candidatos presidenciales',
          tipo_evento: 'Debate'
        });
        
      } catch (error) {
        console.error('❌ Error al cargar próximo evento:', error);
        setError(error.message);
        
        // Evento de ejemplo en caso de error
        setNextEvent({
          titulo_evento: 'Próximo Debate Presidencial',
          fecha_evento: '2025-10-25',
          descripcion: 'Debate entre candidatos presidenciales',
          tipo_evento: 'Debate'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNextEvent();
  }, []);

  const getEventTypeIcon = (tipoEvento) => {
    switch (tipoEvento?.toLowerCase()) {
      case 'debate':
        return MicrophoneIcon;
      case 'elección':
      case 'eleccion':
        return ArchiveBoxIcon;
      case 'inscripción':
      case 'inscripcion':
        return DocumentCheckIcon;
      case 'cierre':
        return ClockIcon;
      default:
        return CalendarDaysIcon;
    }
  };

  const getEventTypeColor = (tipoEvento) => {
    switch (tipoEvento?.toLowerCase()) {
      case 'debate':
        return 'bg-purple-500';
      case 'elección':
      case 'eleccion':
        return 'bg-green-500';
      case 'inscripción':
      case 'inscripcion':
        return 'bg-blue-500';
      case 'cierre':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <section className="mb-16">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg border border-blue-100 p-6 sm:p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando próximo evento...</p>
          </div>
        </div>
      </section>
    );
  }

  const eventStatus = getEventStatus(nextEvent?.fecha_evento);

  return (
    <section className="mb-16">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
        {/* Event Type Icon */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4" style={{ backgroundColor: '#0070C0' }}>
            <span className="material-icons text-white text-2xl">
              {getEventTypeIcon(nextEvent?.tipo_evento)}
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">¡No te lo pierdas!</h2>
          
          {error && (
            <div className="text-center text-red-600 mb-4 flex items-center justify-center gap-2">
              <span className="text-xl">⚠️</span>
              <p>Error al cargar evento: {error}</p>
            </div>
          )}
          
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              {nextEvent?.titulo_evento || 'Próximo Debate Presidencial'}
            </h3>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-lg">📅</span>
                <span className="font-medium">
                  {formatDateSpanish(nextEvent?.fecha_evento)}
                </span>
              </div>
              
              {nextEvent?.tipo_evento && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-lg">📋</span>
                  <span className="font-medium">{nextEvent.tipo_evento}</span>
                </div>
              )}
            </div>
            
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${eventStatus.className === 'upcoming' ? 'bg-green-100 text-green-700' : 
              eventStatus.className === 'today' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
              <span>⏰</span>
              {eventStatus.text}
            </div>
            
            {nextEvent?.descripcion && (
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {nextEvent.descripcion}
              </p>
            )}
          </div>
          
          <div className="text-center">
            <Link 
              to="/cronograma" 
              className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-lg hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#0070C0' }}
            >
              <span>📅</span>
              Ver cronograma completo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;