import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTrivias, getImageUrl } from '../../api';

const TriviaSection = () => {
  const [trivias, setTrivias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrivias = async () => {
      try {
        const data = await getTrivias();
        
        // Verificar si viene en formato { data: [...] } o directamente [...]
        const triviasArray = data?.data || data;
        
        if (Array.isArray(triviasArray)) {
          // Mostrar solo las primeras 3 trivias
          const triviasLimitadas = triviasArray.slice(0, 3);
          setTrivias(triviasLimitadas);
        } else {
          setTrivias([]);
        }
      } catch (error) {
        // Trivias de ejemplo si no hay datos
        setTrivias([
          {
            tema_trivia_id: 1,
            nombre_tema: 'Descentralización en el Perú',
            imagen_url: null
          },
          {
            tema_trivia_id: 2,
            nombre_tema: 'Conozca su cédula',
            imagen_url: null
          },
          {
            tema_trivia_id: 3,
            nombre_tema: '¿Sabes cómo se elige al Presidente del Perú?',
            imagen_url: null
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrivias();
  }, []);

  const defaultColors = ['#FF4500', '#008080', '#800080'];

  return (
    <section className="trivia-section">
      <div className="trivia-container">
        {/* Background Elements */}
        <div className="trivia-bg-elements">
          <span className="trivia-question-mark trivia-q1">?</span>
          <span className="trivia-question-mark trivia-q2">?</span>
          <span className="trivia-question-mark trivia-q3">?</span>
          <span className="trivia-question-mark trivia-q4">?</span>
        </div>

        <div className="trivia-content">
          {/* Left Side - CTA */}
          <div className="trivia-cta">
            <h2 className="trivia-title">¡JUEGA AHORA!</h2>
            {/* ENLACE CORREGIDO: Va a trivias-educativas con scroll */}
            <Link to="/recursos#trivias-educativas" className="trivia-button">
              VER TODOS LAS TRIVIAS
            </Link>
          </div>

          {/* Right Side - Trivia Cards */}
          <div className="trivia-cards">
            {loading ? (
              <div className="trivia-loading">Cargando trivias...</div>
            ) : (
              /* CARDS CORREGIDAS: Van a trivias-educativas con scroll */
              trivias.map((trivia, index) => (
                <Link 
                  key={trivia.tema_trivia_id || trivia.id || index} 
                  to="/recursos#trivias-educativas" 
                  className="trivia-card trivia-card-clickable"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div 
                    className="trivia-image"
                    style={{ backgroundColor: defaultColors[index % defaultColors.length] }}
                  >
                    {trivia.imagen_url ? (
                      <img 
                        src={getImageUrl(trivia.imagen_url)} 
                        alt={trivia.nombre_tema || trivia.titulo}
                        className="trivia-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <div className="trivia-placeholder">
                        <span className="trivia-icon">🤔</span>
                      </div>
                    )}
                    {trivia.imagen_url && (
                      <div className="trivia-placeholder" style={{ display: 'none' }}>
                        <span className="trivia-icon">🤔</span>
                      </div>
                    )}
                  </div>
                  <div className="trivia-info">
                    <span className="trivia-label">QUIZ</span>
                    <h3 className="trivia-card-title">
                      {trivia.nombre_tema || trivia.titulo}
                    </h3>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TriviaSection;