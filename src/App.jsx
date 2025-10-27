import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CandidatosPage from './pages/CandidatosPage';
import CandidateDetailPage from './pages/CandidateDetailPage';
import CronogramaPage from './pages/CronogramaPage';
import ComparadorPage from './pages/ComparadorPage';
import RecursosPage from './pages/RecursosPage';
import TriviaPage from './pages/TriviaPage';
import ComoFuncionaPage from './pages/ComoFuncionaPage';
import './styles/main.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/candidatos" element={<CandidatosPage />} />
          {/* Rutas futuras */}
          <Route path="/candidatos/:id" element={<CandidateDetailPage />} />
          <Route path="/comparador" element={<ComparadorPage />} />
          <Route path="/cronograma" element={<CronogramaPage />} />
          <Route path="/recursos" element={<RecursosPage />} />
          <Route path="/trivia/:temaId" element={<TriviaPage />} />
          <Route path="/trivias" element={<div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 eliminate-black-bar no-scroll-x"><div className="text-center constrain-width"><h2 className="text-3xl font-bold text-gray-900 mb-4">Trivias</h2><p className="text-gray-600">Próximamente</p></div></div>} />
          <Route path="/como-funciona" element={<ComoFuncionaPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
