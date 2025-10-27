import React from 'react';
import { 
  generarDatosGraficoBarras, 
  generarDescripcionPolitica, 
  ORIENTACIONES_POLITICAS 
} from '../utils/politicalAnalysis';

/**
 * Componente que muestra la posición política del candidato
 * Incluye gráfico de barras y brújula política
 */
const PoliticalPositionChart = ({ posicionPolitica }) => {
  if (!posicionPolitica || posicionPolitica.totalPropuestas === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 font-['Outfit']">Posición Política</h3>
        </div>
        
        <div className="text-center py-8 text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"></path>
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-2">Análisis no disponible</p>
          <p className="text-xs text-gray-500">Se requieren propuestas para determinar la posición política</p>
        </div>
      </div>
    );
  }

  const datosGrafico = generarDatosGraficoBarras(posicionPolitica.distribuciones);
  const descripcion = generarDescripcionPolitica(posicionPolitica);
  const config = ORIENTACIONES_POLITICAS[posicionPolitica.orientacionDominante];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 font-['Outfit']">Posición Política</h3>
      </div>

      {/* Orientación dominante */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: config.color }}
          ></div>
          <span className="font-semibold text-gray-900">{config.label}</span>
          <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded-full">
            {posicionPolitica.afinidadPromedio}% afinidad
          </span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          {descripcion.replace(/\*\*(.*?)\*\*/g, '$1')} {/* Remover markdown */}
        </p>
      </div>

      {/* Gráfico de barras */}
      {datosGrafico.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Distribución de Propuestas</h4>
          
          {datosGrafico.map((item) => (
            <div key={item.orientacion} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">{item.cantidad}</span>
                  <span className="text-xs text-gray-500">({item.porcentaje}%)</span>
                </div>
              </div>
              
              {/* Barra de progreso */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: item.color,
                    width: `${item.porcentaje}%`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Brújula política simplificada */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Brújula Política</h4>
        <div className="relative w-full h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
          
          {/* Cuadrantes */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            <div className="border-r border-b border-gray-300 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">Izq. Auth.</span>
            </div>
            <div className="border-b border-gray-300 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">Der. Auth.</span>
            </div>
            <div className="border-r border-gray-300 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">Izq. Lib.</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">Der. Lib.</span>
            </div>
          </div>

          {/* Punto de posición */}
          <div 
            className="absolute w-3 h-3 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ 
              backgroundColor: config.color,
              left: `${((posicionPolitica.coordenadas.x + 1) / 2) * 100}%`,
              top: `${((1 - posicionPolitica.coordenadas.y) / 2) * 100}%`
            }}
          ></div>

          {/* Líneas de referencia */}
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-0 w-full h-px bg-gray-300 transform -translate-y-1/2"></div>
            <div className="absolute left-1/2 top-0 h-full w-px bg-gray-300 transform -translate-x-1/2"></div>
          </div>
        </div>
        
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-500">
            Coordenadas: ({posicionPolitica.coordenadas.x.toFixed(2)}, {posicionPolitica.coordenadas.y.toFixed(2)})
          </span>
        </div>
      </div>
    </div>
  );
};

export default PoliticalPositionChart;