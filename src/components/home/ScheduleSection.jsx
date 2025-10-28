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
          
          if (response && response.data) {
            setNextEvent(response.data);
            return;
          }
        } catch (specificError) {
          // Endpoint específico no disponible, intentar con lista completa
        }
        
        // Fallback: obtener lista completa y ordenar en frontend
        try {
          const cronogramaResponse = await getCronogramaOrdenado();
          
          if (cronogramaResponse && cronogramaResponse.data && Array.isArray(cronogramaResponse.data)) {
            const proximoEvento = getNextEvent(cronogramaResponse.data.filter(e => e.esta_publicado));
            if (proximoEvento) {
              setNextEvent(proximoEvento);
              return;
            }
          }
        } catch (ordenadoError) {
          // Cronograma ordenado no disponible, usar evento de ejemplo
        }
        
        // Evento de ejemplo si no hay datos
        setNextEvent({
          titulo_evento: 'Debate Presidencial',
          fecha_evento: '2025-11-25',
          descripcion: 'Debate entre todos los candidatos que buscan la presidencia del Perú',
          tipo_evento: 'Debate'
        });
        
      } catch (error) {
        setError('Error al cargar el próximo evento');
        
        // Evento de ejemplo en caso de error
        setNextEvent({
          titulo_evento: 'Debate Presidencial',
          fecha_evento: '2025-11-25',
          descripcion: 'Debate entre todos los candidatos que buscan la presidencia del Perú',
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
        return 'bg-blue-500';
      case 'elección':
      case 'eleccion':
        return 'bg-red-500';
      case 'inscripción':
      case 'inscripcion':
        return 'bg-green-500';
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
  const EventIcon = getEventTypeIcon(nextEvent?.tipo_evento);
  const iconColorClass = getEventTypeColor(nextEvent?.tipo_evento);

  return (
    <section className="mb-16">
      <div className="bg-gradient-to-br from-blue-50 to-blue-50 rounded-2xl shadow-lg border border-blue-100 p-6 sm:p-8 relative overflow-hidden">
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-100 rounded-full opacity-20 transform -translate-x-12 translate-y-12"></div>
        
        <div className="relative z-10">
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className={`w-16 h-16 ${iconColorClass} rounded-2xl flex items-center justify-center shadow-lg`}>
                <EventIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              ¡No te lo pierdas!
            </h2>
            <p className="text-gray-600">Mantente al día con el cronograma electoral</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
              <p className="text-red-700">Error al cargar evento: {error}</p>
            </div>
          )}
          
          {/* Event Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8">
            
            {/* Event Title */}
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-12 h-12 ${iconColorClass} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <EventIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {nextEvent?.titulo_evento || 'Debate Presidencial'}
                </h3>
                {nextEvent?.descripcion && (
                  <p className="text-gray-600 leading-relaxed">
                    {nextEvent.descripcion}
                  </p>
                )}
              </div>
            </div>
            
            {/* Event Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              
              {/* Date */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CalendarDaysIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Fecha</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDateSpanish(nextEvent?.fecha_evento)}
                  </p>
                </div>
              </div>
              
              {/* Event Type */}
              {nextEvent?.tipo_evento && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <EventIcon className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Tipo</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {nextEvent.tipo_evento}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Status */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <ClockIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Estado</p>
                  <p className={`text-sm font-semibold ${eventStatus.className === 'event-upcoming' ? 'text-green-600' : 
                                  eventStatus.className === 'event-today' ? 'text-orange-600' : 'text-red-600'}`}>
                    {eventStatus.text}
                  </p>
                </div>
              </div>
              
            </div>
            
            {/* Location if available */}
            {nextEvent?.ubicacion && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <MapPinIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-blue-600 uppercase tracking-wide font-medium">Ubicación</p>
                  <p className="text-sm font-semibold text-blue-900">{nextEvent.ubicacion}</p>
                </div>
              </div>
            )}
            
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link 
              to="/cronograma" 
              className="inline-flex items-center gap-3 px-8 py-4 text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
              style={{ backgroundColor: '#0070C0' }}
            >
              <CalendarDaysIcon className="w-5 h-5" />
              Ver cronograma completo
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;