import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from '../../assets/votaconciencialogo.png';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Función para determinar si un link está activo
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Función para cerrar menú móvil
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Función para toggle del menú móvil
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
              onClick={closeMobileMenu}
            >
              {/* Logo Image */}
              <img 
                src={logo} 
                alt="VotaConCiencia Logo" 
                className="h-12 w-auto sm:h-14"
              />
              
              {/* Logo Text - Siempre visible */}
              <span 
                className="text-lg sm:text-xl md:text-2xl font-bold font-['Outfit']"
                style={{ color: '#0070C0' }}
              >
                VotaConCiencia
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/comparador"
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive('/comparador')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              style={isActive('/comparador') ? { color: '#0070C0', borderColor: '#0070C0' } : {}}
            >
              Comparador
            </Link>
            <Link
              to="/cronograma"
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive('/cronograma')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              style={isActive('/cronograma') ? { color: '#0070C0', borderColor: '#0070C0' } : {}}
            >
              Cronograma
            </Link>
            <Link
              to="/recursos"
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive('/recursos')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              style={isActive('/recursos') ? { color: '#0070C0', borderColor: '#0070C0' } : {}}
            >
              Recursos
            </Link>
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:block">
            <Link
              to="/candidatos"
              className={`inline-flex items-center px-4 lg:px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                isActive('/candidatos') || location.pathname.startsWith('/candidatos/')
                  ? 'bg-blue-700 text-white shadow-lg'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
              }`}
              style={{ 
                backgroundColor: isActive('/candidatos') || location.pathname.startsWith('/candidatos/') 
                  ? '#005a9e' 
                  : '#0070C0'
              }}
            >
              <span className="hidden lg:inline">Explorar Candidatos</span>
              <span className="lg:hidden">Candidatos</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">


            <Link
              to="/comparador"
              className={`block px-3 py-3 text-base font-medium rounded-md transition-colors duration-200 ${
                isActive('/comparador')
                  ? 'bg-blue-50 border-l-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
              }`}
              style={isActive('/comparador') ? { 
                color: '#0070C0', 
                backgroundColor: '#f0f8ff',
                borderColor: '#0070C0'
              } : {}}
              onClick={closeMobileMenu}
            >
              Comparador
            </Link>

            <Link
              to="/cronograma"
              className={`block px-3 py-3 text-base font-medium rounded-md transition-colors duration-200 ${
                isActive('/cronograma')
                  ? 'bg-blue-50 border-l-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
              }`}
              style={isActive('/cronograma') ? { 
                color: '#0070C0', 
                backgroundColor: '#f0f8ff',
                borderColor: '#0070C0'
              } : {}}
              onClick={closeMobileMenu}
            >
              Cronograma
            </Link>

            <Link
              to="/recursos"
              className={`block px-3 py-3 text-base font-medium rounded-md transition-colors duration-200 ${
                isActive('/recursos')
                  ? 'bg-blue-50 border-l-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
              }`}
              style={isActive('/recursos') ? { 
                color: '#0070C0', 
                backgroundColor: '#f0f8ff',
                borderColor: '#0070C0'
              } : {}}
              onClick={closeMobileMenu}
            >
              Recursos
            </Link>

            <Link
              to="/como-funciona"
              className={`block px-3 py-3 text-base font-medium rounded-md transition-colors duration-200 ${
                isActive('/como-funciona')
                  ? 'bg-blue-50 border-l-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
              }`}
              style={isActive('/como-funciona') ? { 
                color: '#0070C0', 
                backgroundColor: '#f0f8ff',
                borderColor: '#0070C0'
              } : {}}
              onClick={closeMobileMenu}
            >
              Cómo Funciona
            </Link>

            {/* Mobile CTA Section */}
            <div className="pt-4 pb-2">
              <div className="px-3">
                <p className="text-xs text-center font-medium text-gray-500 uppercase tracking-wider mb-3">
                  ¡Empieza ahora!
                </p>
                <Link
                  to="/candidatos"
                  className="block w-full text-center px-4 py-3 text-base font-semibold text-white rounded-lg transition-all duration-200 hover:shadow-md"
                  style={{ backgroundColor: '#0070C0' }}
                  onClick={closeMobileMenu}
                >
                  Explorar Candidatos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
