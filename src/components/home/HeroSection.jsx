import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="mt-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Text Content */}
          <div className="text-left order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              <span className="text-gray-900">Tu voto es poderoso. </span>
              <span style={{ color: '#0070C0' }}>Úsalo con ciencia.</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              La desinformación y los planes de gobierno confusos son el mayor reto en las 
              elecciones peruanas. Te ayudamos a analizar, comparar y entender de forma simple 
              y neutral.
            </p>
            
            <Link 
              to="/como-funciona" 
              className="inline-flex items-center px-8 py-4 text-white font-semibold rounded-lg hover:opacity-90 transition-colors text-lg"
              style={{ backgroundColor: '#0070C0' }}
            >
              Descubre Cómo
            </Link>
          </div>

          {/* Hero Image */}
          <div className="order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                alt="Democracia y participación ciudadana" 
                className="w-full h-64 sm:h-80 lg:h-96 object-cover"
              />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default HeroSection;