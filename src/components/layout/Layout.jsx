import React from 'react';
import Header from './Header';
import Footer from './Footer';
import useScrollToTop from '../../hooks/useScrollToTop';

const Layout = ({ children }) => {
  // FUNCIONALIDAD AÑADIDA: Hook para scroll automático al cambiar de página
  useScrollToTop();

  return (
    <div className="layout eliminate-black-bar">
      <Header />
      <main className="main-content no-scroll-x contain-all">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;