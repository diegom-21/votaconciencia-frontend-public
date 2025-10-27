// ========================================
// UTILIDADES PARA MANEJO DE FECHAS
// ========================================

/**
 * Calcula la diferencia de días entre una fecha y hoy
 */
export const getDaysDifference = (dateString) => {
  if (!dateString) return null;
  
  const today = new Date();
  const eventDate = new Date(dateString);
  
  // Resetear horas para comparar solo fechas
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);
  
  const diffTime = eventDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Obtiene el estado de un evento basado en su fecha
 */
export const getEventStatus = (dateString) => {
  const diffDays = getDaysDifference(dateString);
  
  if (diffDays === null) {
    return { 
      text: 'Fecha por confirmar', 
      className: 'status-pending',
      priority: 999 
    };
  }
  
  if (diffDays < 0) {
    return { 
      text: `Evento realizado hace ${Math.abs(diffDays)} día(s)`, 
      className: 'status-past',
      priority: 100 + Math.abs(diffDays) // Eventos pasados van al final
    };
  } else if (diffDays === 0) {
    return { 
      text: '¡HOY!', 
      className: 'status-today',
      priority: 1 // Máxima prioridad
    };
  } else if (diffDays === 1) {
    return { 
      text: '¡MAÑANA!', 
      className: 'status-tomorrow',
      priority: 2
    };
  } else if (diffDays <= 7) {
    return { 
      text: `En ${diffDays} días`, 
      className: 'status-soon',
      priority: 3 + diffDays
    };
  } else {
    return { 
      text: `En ${diffDays} días`, 
      className: 'status-future',
      priority: 20 + diffDays
    };
  }
};

/**
 * Formatea una fecha para mostrar en español
 */
export const formatDateSpanish = (dateString) => {
  if (!dateString) return 'Fecha por confirmar';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Ordena eventos por proximidad a la fecha actual
 */
export const sortEventsByProximity = (events) => {
  if (!Array.isArray(events)) return [];
  
  return events.sort((a, b) => {
    const statusA = getEventStatus(a.fecha_evento);
    const statusB = getEventStatus(b.fecha_evento);
    
    // Ordenar por prioridad (menor número = mayor prioridad)
    return statusA.priority - statusB.priority;
  });
};

/**
 * Obtiene el próximo evento de una lista
 */
export const getNextEvent = (events) => {
  if (!Array.isArray(events) || events.length === 0) return null;
  
  const sortedEvents = sortEventsByProximity(events);
  return sortedEvents[0];
};

/**
 * Filtra eventos futuros (incluyendo hoy)
 */
export const getFutureEvents = (events) => {
  if (!Array.isArray(events)) return [];
  
  return events.filter(event => {
    const diffDays = getDaysDifference(event.fecha_evento);
    return diffDays !== null && diffDays >= 0;
  });
};

/**
 * Filtra eventos pasados
 */
export const getPastEvents = (events) => {
  if (!Array.isArray(events)) return [];
  
  return events.filter(event => {
    const diffDays = getDaysDifference(event.fecha_evento);
    return diffDays !== null && diffDays < 0;
  });
};

// ========================================
// UTILIDADES ADICIONALES PARA CALENDARIO
// ========================================

/**
 * Obtiene los días de un mes específico
 * @param {number} year - Año
 * @param {number} month - Mes (0-11)
 * @returns {Array} Array de objetos día
 */
export const getDaysInMonth = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  
  const days = [];
  
  // Días del mes anterior para completar la primera semana
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
  
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isToday: false,
      date: new Date(prevYear, prevMonth, daysInPrevMonth - i)
    });
  }
  
  // Días del mes actual
  const today = new Date();
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isToday = date.toDateString() === today.toDateString();
    
    days.push({
      day,
      isCurrentMonth: true,
      isToday,
      date
    });
  }
  
  // Días del mes siguiente para completar la última semana
  const remainingDays = 42 - days.length; // 6 semanas * 7 días
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  
  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      day,
      isCurrentMonth: false,
      isToday: false,
      date: new Date(nextYear, nextMonth, day)
    });
  }
  
  return days;
};

/**
 * Formatea una fecha de forma corta
 * @param {Date|string} date - Fecha a formatear  
 * @returns {string} Fecha formateada corta
 */
export const formatDateShort = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];
  
  return `${months[dateObj.getMonth()]} ${dateObj.getDate()}`;
};

/**
 * Obtiene los nombres de los meses en español
 * @returns {Array} Array de nombres de meses
 */
export const getMonthNames = () => [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

/**
 * Obtiene los nombres de los días de la semana
 * @returns {Array} Array de nombres de días
 */
export const getDayNames = () => ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

/**
 * Calcula los días restantes hasta una fecha (alias para getDaysDifference)
 * @param {Date|string} targetDate - Fecha objetivo
 * @returns {number} Días restantes (negativo si es pasado)
 */
export const getDaysUntil = (targetDate) => {
  const dateString = typeof targetDate === 'string' ? targetDate : targetDate.toISOString().split('T')[0];
  return getDaysDifference(dateString);
};

/**
 * Determina si una fecha tiene eventos
 * @param {Date} date - Fecha a verificar
 * @param {Array} eventos - Array de eventos
 * @returns {boolean} True si tiene eventos
 */
export const hasEvents = (date, eventos) => {
  if (!eventos || eventos.length === 0) return false;
  
  const dateString = date.toISOString().split('T')[0];
  return eventos.some(evento => {
    const eventoDate = new Date(evento.fecha_evento);
    const eventoDateString = eventoDate.toISOString().split('T')[0];
    return eventoDateString === dateString;
  });
};

/**
 * Obtiene los eventos de una fecha específica
 * @param {Date} date - Fecha a verificar
 * @param {Array} eventos - Array de eventos
 * @returns {Array} Eventos de esa fecha
 */
export const getEventsForDate = (date, eventos) => {
  if (!eventos || eventos.length === 0) return [];
  
  const dateString = date.toISOString().split('T')[0];
  return eventos.filter(evento => {
    const eventoDate = new Date(evento.fecha_evento);
    const eventoDateString = eventoDate.toISOString().split('T')[0];
    return eventoDateString === dateString;
  });
};

/**
 * Determina el color del tipo de evento
 * @param {string} tipoEvento - Tipo de evento
 * @returns {Object} Objeto con colores y configuración
 */
export const getEventTypeConfig = (tipoEvento) => {
  const configs = {
    'Debate': {
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      borderColor: '#60A5FA',
      icon: '🎙️',
      label: 'Debate'
    },
    'Inscripción': {
      color: '#10B981',
      bgColor: '#ECFDF5',
      borderColor: '#34D399',
      icon: '📝',
      label: 'Inscripción'
    },
    'Elección': {
      color: '#DC2626',
      bgColor: '#FEF2F2',
      borderColor: '#F87171',
      icon: '🗳️',
      label: 'Elección'
    },
    'Hito': {
      color: '#7C3AED',
      bgColor: '#F3E8FF',
      borderColor: '#A78BFA',
      icon: '🏆',
      label: 'Hito'
    },
    'Otro': {
      color: '#6B7280',
      bgColor: '#F9FAFB',
      borderColor: '#9CA3AF',
      icon: '📅',
      label: 'Evento'
    }
  };
  
  return configs[tipoEvento] || configs['Otro'];
};