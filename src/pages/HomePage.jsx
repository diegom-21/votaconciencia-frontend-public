import React from 'react';
import HeroSection from '../components/home/HeroSection';
import CandidatesSection from '../components/home/CandidatesSection';
import ScheduleSection from '../components/home/ScheduleSection';
import CtaSection from '../components/home/CtaSection';
import ResourcesSection from '../components/home/ResourcesSection';
import TriviaSection from '../components/home/TriviaSection';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 no-scroll-x eliminate-black-bar">
      <HeroSection />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 constrain-width contain-all">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            <span className="text-gray-900">Herramientas para un </span>
            <span style={{ color: '#0070C0' }}>Voto Informado</span>
          </h2>
        </div>
        <CandidatesSection />
        <ScheduleSection />
      </div>

      <CtaSection />
      <div id="recursos">
        <ResourcesSection />
      </div>
      <div id="trivias">
        <TriviaSection />
      </div>
    </div>
  );
};

export default HomePage;