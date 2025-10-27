import React from 'react';
import { Link } from 'react-router-dom';

const CtaSection = () => {
  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-content">
          <h2 className="cta-title">La democracia te necesita informado.</h2>
          <p className="cta-description">
            Deja atrás las dudas y las noticias falsas. Toma el control de tu decisión con<br/>
            datos claros y herramientas fáciles de usar.
          </p>
          <Link to="/comparador" className="cta-button">
            Empezar a Comparar Candidatos
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;