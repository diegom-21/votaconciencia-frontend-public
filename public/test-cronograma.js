// Script de prueba para verificar las rutas del cronograma
const testCronogramaEndpoints = async () => {
  const baseURL = `${import.meta.env.VITE_API_URL}/api`;
  
  console.log('🧪 Iniciando pruebas de endpoints del cronograma...\n');
  
  // Prueba 1: Obtener todos los eventos
  try {
    console.log('📅 Probando GET /cronograma');
    const response1 = await fetch(`${baseURL}/cronograma`);
    const data1 = await response1.json();
    console.log('✅ Respuesta:', data1);
    console.log('📊 Cantidad de eventos:', data1.data?.length || 0);
  } catch (error) {
    console.error('❌ Error en GET /cronograma:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Prueba 2: Obtener eventos ordenados
  try {
    console.log('📅 Probando GET /cronograma/ordenados');
    const response2 = await fetch(`${baseURL}/cronograma/ordenados`);
    const data2 = await response2.json();
    console.log('✅ Respuesta:', data2);
    console.log('📊 Cantidad de eventos ordenados:', data2.data?.length || 0);
    
    if (data2.data && data2.data.length > 0) {
      console.log('🎯 Primer evento (más próximo):');
      console.log('  - Título:', data2.data[0].titulo_evento);
      console.log('  - Fecha:', data2.data[0].fecha_evento);
      console.log('  - Días diferencia:', data2.data[0].dias_diferencia);
      console.log('  - Es pasado:', data2.data[0].es_pasado);
    }
  } catch (error) {
    console.error('❌ Error en GET /cronograma/ordenados:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Prueba 3: Obtener próximo evento
  try {
    console.log('📅 Probando GET /cronograma/proximo');
    const response3 = await fetch(`${baseURL}/cronograma/proximo`);
    const data3 = await response3.json();
    console.log('✅ Respuesta:', data3);
    
    if (data3.data) {
      console.log('🎯 Próximo evento:');
      console.log('  - Título:', data3.data.titulo_evento);
      console.log('  - Fecha:', data3.data.fecha_evento);
      console.log('  - Tipo:', data3.data.tipo_evento);
      console.log('  - Descripción:', data3.data.descripcion);
      console.log('  - Días diferencia:', data3.data.dias_diferencia);
    }
  } catch (error) {
    console.error('❌ Error en GET /cronograma/proximo:', error.message);
  }
  
  console.log('\n🏁 Pruebas completadas.');
};

// Función para ser llamada desde el navegador
window.testCronograma = testCronogramaEndpoints;

console.log('🚀 Script de prueba cargado. Ejecuta: testCronograma()');