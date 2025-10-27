import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer eliminate-black-bar no-scroll-x clean-layout">
      <div className="footer-container constrain-width contain-all">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <h3 className="footer-brand-title">VotaConCiencia</h3>
            <p className="footer-brand-description">
              Promoviendo un voto informado en el Perú.
            </p>
          </div>

          {/* Navigation Section */}
          <div className="footer-nav-section">
            <h4 className="footer-nav-title">Navegación</h4>
            <nav className="footer-nav">
              <Link to="/candidatos" className="footer-link">Candidatos</Link>
              <Link to="/comparador" className="footer-link">Comparador</Link>
              <Link to="/cronograma" className="footer-link">Cronograma</Link>
              <Link to="/recursos#trivias-educativas" className="footer-link">Trivia Cívica</Link>
            </nav>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2025 VotaConCiencia. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
