import React, { useState, useEffect } from 'react';
import { getCronogramaOrdenado, formatDate } from '../api';
import {
    getDaysInMonth,
    getMonthNames,
    getDayNames,
    formatDateSpanish,
    formatDateShort,
    getDaysUntil,
    hasEvents,
    getEventsForDate,
    getEventTypeConfig
} from '../utils/dateUtils';
import {
    CalendarDaysIcon,
    ClockIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';

/**
 * Página del cronograma electoral con calendario interactivo y línea de tiempo
 */
const CronogramaPage = () => {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    /**
     * Cargar eventos del cronograma
     */
    useEffect(() => {
        const fetchEventos = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getCronogramaOrdenado();

                // El backend devuelve { success: true, data: eventos }
                const eventosData = data.success ? data.data : data;

                setEventos(Array.isArray(eventosData) ? eventosData : []);

            } catch (error) {
                setError('Error al cargar el cronograma. Por favor intenta de nuevo.');
                setEventos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEventos();
    }, []);

    /**
     * Función para reintentar carga de datos
     */
    const handleRetry = () => {
        window.location.reload();
    };

    /**
     * Navegar entre meses
     */
    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
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

                    {/* Timeline skeleton */}
                    <div className="mb-12">
                        <div className="h-6 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
                        <div className="flex gap-4 overflow-x-auto pb-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex-shrink-0 w-80 bg-white rounded-xl p-6 shadow-sm animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                    <div className="h-6 bg-gray-200 rounded w-full mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Calendar skeleton */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-6"></div>
                        <div className="grid grid-cols-7 gap-2">
                            {Array.from({ length: 42 }).map((_, i) => (
                                <div key={i} className="h-10 bg-gray-200 rounded"></div>
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
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Error al cargar cronograma</h1>
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
                        Cronograma de las Elecciones
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Mantente informado sobre las fechas clave y eventos importantes que llevan a las elecciones presidenciales 2026.
                    </p>
                </div>

                {/* Timeline de eventos próximos */}
                <EventTimeline eventos={eventos} />

                {/* Calendario */}
                <div className="mt-12">
                    <CalendarView
                        currentDate={currentDate}
                        eventos={eventos}
                        onNavigateMonth={navigateMonth}
                        selectedDate={selectedDate}
                        onSelectDate={setSelectedDate}
                    />
                </div>

            </div>
        </div>
    );
};

/**
 * Componente de línea de tiempo de eventos
 */
const EventTimeline = ({ eventos }) => {
    const eventosProximos = eventos
        .filter(evento => getDaysUntil(evento.fecha_evento) >= -30) // Eventos de los últimos 30 días o futuros
        .slice(0, 5); // Mostrar máximo 5 eventos

    const proximoEvento = eventos.find(evento => getDaysUntil(evento.fecha_evento) >= 0);

    if (eventosProximos.length === 0) {
        return (
            <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-8 font-['Outfit'] text-center">Próximos Eventos</h2>
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center max-w-md mx-auto">
                    <CalendarDaysIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No hay eventos próximos programados</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-['Outfit'] text-center">Próximos Eventos</h2>

            <div className="flex justify-center mt-2">
                <div className="flex gap-6 overflow-x-auto pb-6 px-4 scrollbar-hide max-w-full">
                    {eventosProximos.map((evento, index) => {
                        const diasRestantes = getDaysUntil(evento.fecha_evento);
                        const esProximo = proximoEvento && proximoEvento.evento_id === evento.evento_id;
                        const config = getEventTypeConfig(evento.tipo_evento);

                        return (
                            <EventCard
                                key={evento.evento_id}
                                evento={evento}
                                diasRestantes={diasRestantes}
                                esProximo={esProximo}
                                config={config}
                                index={index}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

/**
 * Componente de tarjeta de evento
 */
const EventCard = ({ evento, diasRestantes, esProximo, config, index }) => {
    let estadoTexto = '';
    let estadoColor = '';

    if (diasRestantes < 0) {
        estadoTexto = `Hace ${Math.abs(diasRestantes)} días`;
        estadoColor = 'text-gray-500';
    } else if (diasRestantes === 0) {
        estadoTexto = 'Hoy';
        estadoColor = 'text-red-600 font-bold';
    } else if (diasRestantes === 1) {
        estadoTexto = 'Mañana';
        estadoColor = 'text-orange-600 font-semibold';
    } else {
        estadoTexto = `En ${diasRestantes} días`;
        estadoColor = 'text-blue-600';
    }

    return (
        <div
            className={`mt-4 flex-shrink-0 w-80 bg-white rounded-xl shadow-sm border-2 p-6 transition-all duration-300 hover:shadow-lg ${esProximo
                    ? 'border-blue-500 bg-blue-50 transform scale-105'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
        >
            {/* Badge de tipo */}
            <div className="flex items-center justify-between mb-3">
                <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                        backgroundColor: config.bgColor,
                        color: config.color,
                        border: `1px solid ${config.borderColor}`
                    }}
                >
                    <span>{config.icon}</span>
                    <span>{config.label}</span>
                </div>

                {esProximo && (
                    <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Próximo
                    </div>
                )}
            </div>

            {/* Título del evento */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                {evento.titulo_evento}
            </h3>

            {/* Fecha */}
            <div className="flex items-center gap-2 text-gray-600 mb-3">
                <CalendarDaysIcon className="w-4 h-4" />
                <span className="text-sm">{formatDateSpanish(evento.fecha_evento)}</span>
            </div>

            {/* Estado temporal */}
            <div className="flex items-center gap-2 mb-4">
                <ClockIcon className="w-4 h-4 text-gray-400" />
                <span className={`text-sm ${estadoColor}`}>{estadoTexto}</span>
            </div>

            {/* Descripción */}
            {evento.descripcion && (
                <p className="text-sm text-gray-600 line-clamp-3">
                    {evento.descripcion}
                </p>
            )}
        </div>
    );
};

/**
 * Componente del calendario
 */
const CalendarView = ({ currentDate, eventos, onNavigateMonth, selectedDate, onSelectDate }) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthNames = getMonthNames();
    const dayNames = getDayNames();
    const days = getDaysInMonth(year, month);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">

            {/* Header del calendario */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 font-['Outfit']">
                    {monthNames[month]} {year}
                </h2>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onNavigateMonth(-1)}
                        className="p-2 bg-gray-800 hover:bg-white-700 rounded-lg transition-colors"
                    >
                        <ChevronLeftIcon className="w-5 h-5 text-white" />
                    </button>
                    <button
                        onClick={() => onNavigateMonth(1)}
                        className="p-2 bg-gray-800 hover:bg-white-700 rounded-lg transition-colors"
                    >
                        <ChevronRightIcon className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-2 mb-4">
                {dayNames.map(day => (
                    <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Días del mes */}
            <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => {
                    const tieneEventos = hasEvents(day.date, eventos);
                    const eventosDelDia = getEventsForDate(day.date, eventos);
                    const esSeleccionado = selectedDate && day.date.toDateString() === selectedDate.toDateString();

                    return (
                        <CalendarDay
                            key={index}
                            day={day}
                            tieneEventos={tieneEventos}
                            eventosDelDia={eventosDelDia}
                            esSeleccionado={esSeleccionado}
                            onSelect={() => day.isCurrentMonth && onSelectDate(day.date)}
                        />
                    );
                })}
            </div>

            {/* Eventos del día seleccionado */}
            {selectedDate && (
                <SelectedDateEvents
                    selectedDate={selectedDate}
                    eventos={getEventsForDate(selectedDate, eventos)}
                    onClose={() => onSelectDate(null)}
                />
            )}
        </div>
    );
};

/**
 * Componente de día del calendario
 */
const CalendarDay = ({ day, tieneEventos, eventosDelDia, esSeleccionado, onSelect }) => {
    let dayClasses = "relative w-full h-12 sm:h-14 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 ";

    if (!day.isCurrentMonth) {
        dayClasses += "text-gray-300 ";
    } else if (day.isToday) {
        dayClasses += "bg-blue-600 text-white shadow-md ";
    } else if (tieneEventos) {
        dayClasses += "bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer ";
    } else {
        dayClasses += "text-gray-700 hover:bg-gray-100 cursor-pointer ";
    }

    if (esSeleccionado) {
        dayClasses += "ring-2 ring-blue-500 ring-offset-2 ";
    }

    return (
        <div className={dayClasses} onClick={onSelect}>
            <span>{day.day}</span>

            {/* Indicadores de eventos */}
            {tieneEventos && eventosDelDia.length > 0 && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {eventosDelDia.slice(0, 3).map((evento, index) => {
                        const config = getEventTypeConfig(evento.tipo_evento);
                        return (
                            <div
                                key={index}
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: config.color }}
                            />
                        );
                    })}
                    {eventosDelDia.length > 3 && (
                        <span className="text-xs">+{eventosDelDia.length - 3}</span>
                    )}
                </div>
            )}
        </div>
    );
};

/**
 * Componente para mostrar eventos del día seleccionado
 */
const SelectedDateEvents = ({ selectedDate, eventos, onClose }) => {
    if (eventos.length === 0) return null;

    return (
        <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                    Eventos del {formatDateSpanish(selectedDate)}
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <span className="sr-only">Cerrar</span>
                    ✕
                </button>
            </div>

            <div className="space-y-3">
                {eventos.map((evento) => {
                    const config = getEventTypeConfig(evento.tipo_evento);

                    return (
                        <div
                            key={evento.evento_id}
                            className="flex items-start gap-3 p-4 rounded-lg border-l-4"
                            style={{
                                borderLeftColor: config.color,
                                backgroundColor: config.bgColor
                            }}
                        >
                            <div className="flex-shrink-0 text-lg">
                                {config.icon}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{evento.titulo_evento}</h4>
                                {evento.descripcion && (
                                    <p className="text-sm text-gray-600 mt-1">{evento.descripcion}</p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                    <span
                                        className="text-xs px-2 py-1 rounded-full font-medium"
                                        style={{
                                            backgroundColor: config.color,
                                            color: 'white'
                                        }}
                                    >
                                        {config.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CronogramaPage;