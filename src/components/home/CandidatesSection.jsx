import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCandidatos, getImageUrl } from '../../api';

const CandidatesSection = () => {
  const [candidatos, setCandidatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidatos = async () => {
      try {
        const data = await getCandidatos();
        // Mostrar solo los primeros 4 candidatos
        const candidatosList = Array.isArray(data) ? data.slice(0, 4) : [];
        setCandidatos(candidatosList);
        
        // Debug: ver la estructura de datos de candidatos
        console.log('📊 Candidatos cargados:', candidatosList);
        candidatosList.forEach((candidato, index) => {
          console.log(`Candidato ${index + 1}:`, {
            nombre: candidato.nombre,
            apellido: candidato.apellido,
            imagen: candidato.imagen,
            foto_url: candidato.foto_url,
            foto: candidato.foto,
            imagenCompleta: candidato
          });
        });
      } catch (error) {
        console.error('Error al cargar candidatos:', error);
        setCandidatos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidatos();
  }, []);

  if (loading) {
    return (
      <section className="mb-16">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="text-center text-gray-600">Cargando candidatos...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
          Candidatos Presidenciales 2026
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {candidatos.map((candidato, index) => {
            // El backend devuelve foto_url con formato: /uploads/images/filename.jpg
            const imagePath = candidato.foto_url;
            // Variable de seguridad para la URL de la imagen
            const imageUrl = imagePath ? `http://localhost:3000${imagePath}` : null;
            
            console.log(`🖼️ Candidato ${candidato.nombre}:`, {
              foto_url: candidato.foto_url,
              imageUrl: imageUrl,
              nombre: candidato.nombre
            });

            return (
              <div key={candidato.candidato_id || index} className="text-center group">
                <div className="relative mb-4">
                  {imageUrl ? (
                    <img 
                      src={imageUrl}
                      alt={`${candidato.nombre} ${candidato.apellido}`}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mx-auto border-4 border-gray-200 group-hover:border-blue-300 transition-all duration-300"
                      onError={(e) => {
                        console.log('❌ Error cargando imagen:', imageUrl);
                        // Ocultar la imagen y mostrar placeholder con signo de interrogación
                        e.target.style.display = 'none';
                        const placeholder = e.target.parentElement.querySelector('.candidate-placeholder') || 
                                          document.createElement('div');
                        placeholder.className = 'w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto border-4 border-gray-200';
                        placeholder.innerHTML = '<span class="text-2xl font-bold text-gray-500">?</span>';
                        e.target.parentElement.appendChild(placeholder);
                      }}
                      onLoad={() => {
                        console.log('✅ Imagen cargada correctamente:', imageUrl);
                      }}
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto border-4 border-gray-200">
                      <span className="text-lg sm:text-xl font-bold text-gray-500">
                        {candidato.nombre?.[0]}{candidato.apellido?.[0]}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {candidato.nombre} {candidato.apellido}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {candidato.partido_nombre || candidato.nombre_partido || 'Partido por definir'}
                </p>
              </div>
            );
          })}

          {/* Rellenar con placeholders si hay menos de 4 candidatos */}
          {candidatos.length < 4 && Array.from({ length: 4 - candidatos.length }).map((_, index) => (
            <div key={`placeholder-${index}`} className="text-center group">
              <div className="relative mb-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto border-4 border-gray-200">
                  <span className="text-lg sm:text-xl font-bold text-gray-400">?</span>
                </div>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-400">Candidato por definir</h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Partido por definir</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link 
            to="/candidatos" 
            className="inline-flex items-center px-6 py-3 text-white font-medium rounded-lg hover:opacity-90 transition-colors"
            style={{ backgroundColor: '#0070C0' }}
          >
            Ver todos los perfiles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CandidatesSection;