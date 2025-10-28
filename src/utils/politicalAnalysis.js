/**
 * Utilidades para el análisis político de propuestas
 * Extrae métricas políticas del texto generado por IA y calcula posiciones en el espectro político
 */

// Tipos de orientaciones políticas según el modelo de brújula política
export const ORIENTACIONES_POLITICAS = {
  'Izquierda Autoritaria': { x: -1, y: 1, color: '#DC2626', label: 'Izquierda Autoritaria' },
  'Izquierda Libertaria': { x: -1, y: -1, color: '#16A34A', label: 'Izquierda Libertaria' },
  'Derecha Autoritaria': { x: 1, y: 1, color: '#1D4ED8', label: 'Derecha Autoritaria' },
  'Derecha Libertaria': { x: 1, y: -1, color: '#CA8A04', label: 'Derecha Libertaria' },
  'Centro': { x: 0, y: 0, color: '#6B7280', label: 'Centro' }
};

/**
 * Extrae las métricas políticas del texto de la propuesta
 * @param {string} resumenCompleto - Texto completo generado por la IA
 * @returns {Object} Objeto con orientación, afinidad, explicación y texto limpio
 */
export const extraerMetricasPoliticas = (resumenCompleto) => {
  if (!resumenCompleto) {
    return {
      orientacion: '',
      afinidad: 0,
      explicacion: '',
      textoLimpio: ''
    };
  }

  try {
    // Extraer orientación política
    const orientacionMatch = resumenCompleto.match(/Orientación política:\s*([^\n\r]+)/i);
    const orientacion = orientacionMatch?.[1]?.trim() || '';

    // Extraer nivel de afinidad (número)
    const afinidadMatch = resumenCompleto.match(/Nivel de afinidad:\s*(\d+)/i);
    const afinidad = afinidadMatch?.[1] ? parseInt(afinidadMatch[1]) : 0;

    // Extraer explicación
    const explicacionMatch = resumenCompleto.match(/Explicacion:\s*([^\n\r]*(?:\n[^\n\r]*)*?)(?=\n\s*$|$)/i);
    const explicacion = explicacionMatch?.[1]?.trim() || '';

    // Crear texto limpio removiendo todas las métricas
    let textoLimpio = resumenCompleto;
    
    // Remover "Orientación política: ..."
    textoLimpio = textoLimpio.replace(/\n\s*Orientación política:\s*[^\n\r]+/gi, '');
    
    // Remover "Nivel de afinidad: ..."
    textoLimpio = textoLimpio.replace(/\n\s*Nivel de afinidad:\s*\d+/gi, '');
    
    // Remover "Explicacion: ..."
    textoLimpio = textoLimpio.replace(/\n?\s*Explicaci[oó]n:\s*[^\n\r]*(?:\n[^\n\r]*)*/gi, '');
    
    // Limpiar espacios extra y saltos de línea
    textoLimpio = textoLimpio.trim().replace(/\n\s*\n/g, '\n');

    const resultado = {
      orientacion,
      afinidad,
      explicacion,
      textoLimpio
    };
    
    return resultado;

  } catch (error) {
    return {
      orientacion: '',
      afinidad: 0,
      explicacion: '',
      textoLimpio: resumenCompleto
    };
  }
};

/**
 * Calcula la posición política promedio de un candidato basado en todas sus propuestas
 * @param {Array} propuestas - Array de propuestas del candidato
 * @returns {Object} Posición política calculada con coordenadas y orientación dominante
 */
export const calcularPosicionPolitica = (propuestas) => {
  if (!propuestas || propuestas.length === 0) {
    return {
      orientacionDominante: 'Centro',
      coordenadas: { x: 0, y: 0 },
      afinidadPromedio: 0,
      distribuciones: {},
      totalPropuestas: 0
    };
  }

  let totalX = 0;
  let totalY = 0;
  let totalAfinidad = 0;
  let propuestasValidas = 0;
  const distribuciones = {};

  propuestas.forEach((propuesta) => {
    const metricas = extraerMetricasPoliticas(propuesta.resumen_ia);
    
    if (metricas.orientacion && ORIENTACIONES_POLITICAS[metricas.orientacion]) {
      const coords = ORIENTACIONES_POLITICAS[metricas.orientacion];
      
      // Sumar coordenadas ponderadas por afinidad
      const peso = metricas.afinidad / 100; // Convertir a decimal
      totalX += coords.x * peso;
      totalY += coords.y * peso;
      totalAfinidad += metricas.afinidad;
      propuestasValidas++;

      // Contar distribución de orientaciones
      distribuciones[metricas.orientacion] = (distribuciones[metricas.orientacion] || 0) + 1;
    }
  });

  if (propuestasValidas === 0) {
    return {
      orientacionDominante: 'Centro',
      coordenadas: { x: 0, y: 0 },
      afinidadPromedio: 0,
      distribuciones: {},
      totalPropuestas: 0
    };
  }

  // Calcular promedios
  const coordenadasPromedio = {
    x: totalX / propuestasValidas,
    y: totalY / propuestasValidas
  };
  
  const afinidadPromedio = Math.round(totalAfinidad / propuestasValidas);

  // Determinar orientación dominante
  const orientacionDominante = determinarOrientacionDominante(coordenadasPromedio, distribuciones);

  const resultado = {
    orientacionDominante,
    coordenadas: coordenadasPromedio,
    afinidadPromedio,
    distribuciones,
    totalPropuestas: propuestasValidas
  };
  
  return resultado;
};

/**
 * Determina la orientación política dominante basada en coordenadas y distribución
 * @param {Object} coordenadas - Coordenadas promedio {x, y}
 * @param {Object} distribuciones - Conteo de cada orientación
 * @returns {string} Orientación dominante
 */
const determinarOrientacionDominante = (coordenadas, distribuciones) => {
  // Si hay una orientación que aparece en más del 50% de propuestas, es dominante
  const totalPropuestas = Object.values(distribuciones).reduce((sum, count) => sum + count, 0);
  
  for (const [orientacion, count] of Object.entries(distribuciones)) {
    if (count / totalPropuestas > 0.5) {
      return orientacion;
    }
  }

  // Si no hay dominancia clara, usar coordenadas para determinar cuadrante
  const { x, y } = coordenadas;
  
  // Definir umbrales para evitar clasificación en centro cuando hay tendencia clara
  const umbralMinimo = 0.2;
  
  if (Math.abs(x) < umbralMinimo && Math.abs(y) < umbralMinimo) {
    return 'Centro';
  }
  
  if (x < 0 && y > 0) return 'Izquierda Autoritaria';
  if (x < 0 && y < 0) return 'Izquierda Libertaria'; 
  if (x > 0 && y > 0) return 'Derecha Autoritaria';
  if (x > 0 && y < 0) return 'Derecha Libertaria';
  
  return 'Centro';
};

/**
 * Genera datos para gráfico de barras de distribución política
 * @param {Object} distribuciones - Conteo de orientaciones
 * @returns {Array} Array de datos para el gráfico
 */
export const generarDatosGraficoBarras = (distribuciones) => {
  const datos = Object.entries(ORIENTACIONES_POLITICAS).map(([orientacion, config]) => ({
    orientacion,
    cantidad: distribuciones[orientacion] || 0,
    porcentaje: 0,
    color: config.color,
    label: config.label
  }));

  const total = Object.values(distribuciones).reduce((sum, count) => sum + count, 0);
  
  // Calcular porcentajes
  datos.forEach(item => {
    item.porcentaje = total > 0 ? Math.round((item.cantidad / total) * 100) : 0;
  });

  return datos.filter(item => item.cantidad > 0); // Solo mostrar orientaciones con datos
};

/**
 * Genera descripción textual de la posición política
 * @param {Object} posicionPolitica - Resultado de calcularPosicionPolitica
 * @returns {string} Descripción legible de la posición
 */
export const generarDescripcionPolitica = (posicionPolitica) => {
  const { orientacionDominante, afinidadPromedio, totalPropuestas, distribuciones } = posicionPolitica;
  
  if (totalPropuestas === 0) {
    return 'No hay suficientes datos para determinar la orientación política.';
  }

  const config = ORIENTACIONES_POLITICAS[orientacionDominante];
  const porcentajeDominante = Math.round((distribuciones[orientacionDominante] / totalPropuestas) * 100);

  let descripcion = `Basado en el análisis de ${totalPropuestas} propuesta${totalPropuestas > 1 ? 's' : ''}, `;
  descripcion += `este candidato tiene una orientación política de **${config.label}** `;
  descripcion += `con un nivel de afinidad promedio de ${afinidadPromedio}%.`;
  
  if (porcentajeDominante < 100 && Object.keys(distribuciones).length > 1) {
    descripcion += ` Esta orientación representa el ${porcentajeDominante}% de sus propuestas.`;
  }

  return descripcion;
};