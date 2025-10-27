import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecursos, getImageUrl } from '../../api';

const ResourcesSection = () => {
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecursos = async () => {
      try {
        const data = await getRecursos();
        console.log('🎓 Datos de recursos recibidos:', data);
        
        // Verificar si viene en formato { data: [...] } o directamente [...]
        const recursosArray = data?.data || data;
        console.log('🎓 Array de recursos:', recursosArray);
        
        if (Array.isArray(recursosArray)) {
          // Mostrar solo los primeros 3 recursos
          const recursosLimitados = recursosArray.slice(0, 3);
          console.log('🎓 Recursos limitados:', recursosLimitados);
          
          // Debug de cada recurso
          recursosLimitados.forEach((recurso, index) => {
            console.log(`🎓 Recurso ${index + 1}:`, {
              id: recurso.recurso_id,
              titulo: recurso.titulo,
              imagen_url: recurso.imagen_url,
              imagen: recurso.imagen,
              esta_publicado: recurso.esta_publicado
            });
          });
          
          setRecursos(recursosLimitados);
        } else {
          console.log('🎓 No se recibió un array válido de recursos');
          setRecursos([]);
        }
      } catch (error) {
        console.error('❌ Error al cargar recursos:', error);
        // Recursos de ejemplo si no hay datos
        setRecursos([
          {
            id: 1,
            titulo: 'Descentralización en el Perú: ¿Por qué es importante?',
            imagen: null,
            color: '#FDE047'
          },
          {
            id: 2,
            titulo: 'Fundamentos de la Democracia Peruana',
            imagen: null,
            color: '#60A5FA'
          },
          {
            id: 3,
            titulo: 'Su voto cuenta: válido, nulo o en blanco',
            imagen: null,
            color: '#86EFAC'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecursos();
  }, []);

  const defaultColors = ['#FDE047', '#60A5FA', '#86EFAC'];

  return (
    <section className="resources-section">
      <div className="resources-container">
        <h2 className="resources-title">RECURSOS EDUCATIVOS</h2>
        
        {loading ? (
          <div className="resources-loading">Cargando recursos...</div>
        ) : (
          <div className="resources-content">
            <div className="resources-grid">
              {recursos.length > 0 ? (
                recursos.map((recurso, index) => (
                  <div key={recurso.recurso_id || recurso.id || index} className="resource-item">
                    <div 
                      className="resource-image-container"
                      style={{ backgroundColor: defaultColors[index % defaultColors.length] }}
                    >
                      {recurso.imagen_url ? (
                        <img 
                          src={getImageUrl(recurso.imagen_url)} 
                          alt={recurso.titulo}
                          className="resource-image"
                          onError={(e) => {
                            console.log('❌ Error cargando imagen del recurso:', {
                              recurso_id: recurso.recurso_id,
                              imagen_url: recurso.imagen_url,
                              url_construida: getImageUrl(recurso.imagen_url),
                              error: e
                            });
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                          onLoad={() => {
                            console.log('✅ Imagen cargada correctamente:', {
                              recurso_id: recurso.recurso_id,
                              imagen_url: recurso.imagen_url,
                              url_construida: getImageUrl(recurso.imagen_url)
                            });
                          }}
                        />
                      ) : (
                        <div className="resource-placeholder">
                          <span className="resource-icon">📚</span>
                        </div>
                      )}
                      {recurso.imagen_url && (
                        <div className="resource-placeholder" style={{ display: 'none' }}>
                          <span className="resource-icon">📚</span>
                        </div>
                      )}
                    </div>
                    <h3 className="resource-title">
                      {recurso.titulo}
                    </h3>
                  </div>
                ))
              ) : (
                // Recursos de ejemplo si no hay datos
                <>
                  <div className="resource-item">
                    <div className="resource-image-container" style={{ backgroundColor: '#FDE047' }}>
                      <div className="resource-placeholder">
                        <span className="resource-icon">🏛️</span>
                      </div>
                    </div>
                    <h3 className="resource-title">
                      Descentralización en el Perú: ¿Por qué es importante?
                    </h3>
                  </div>
                  <div className="resource-item">
                    <div className="resource-image-container" style={{ backgroundColor: '#60A5FA' }}>
                      <div className="resource-placeholder">
                        <span className="resource-icon">⚖️</span>
                      </div>
                    </div>
                    <h3 className="resource-title">
                      Fundamentos de la Democracia Peruana
                    </h3>
                  </div>
                  <div className="resource-item">
                    <div className="resource-image-container" style={{ backgroundColor: '#86EFAC' }}>
                      <div className="resource-placeholder">
                        <span className="resource-icon">🗳️</span>
                      </div>
                    </div>
                    <h3 className="resource-title">
                      Su voto cuenta: válido, nulo o en blanco
                    </h3>
                  </div>
                </>
              )}
            </div>
            {/* ENLACE CORREGIDO: Va a recursos-educativos con scroll */}
            <Link to="/recursos#recursos-educativos" className="resources-cta">
              Ver mas recursos
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResourcesSection;