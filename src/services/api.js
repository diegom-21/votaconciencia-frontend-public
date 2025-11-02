import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_BASE_URL = `${API_URL}/api`;

// Configuración global de axios
axios.defaults.baseURL = API_BASE_URL;

// Endpoints para consultas públicas
export const publicApi = {
    // Endpoints de Candidatos
    getCandidatos: () => axios.get('/candidatos'),
    
    // Endpoints de Temas
    getTemas: () => axios.get('/temas'),
    
    // Endpoints de Propuestas
    getPropuestasByCandidato: (candidatoId) => axios.get(`/propuestas/candidato/${candidatoId}`),
    
    // Endpoints de Recursos
    getRecursos: () => axios.get('/recursos'),
    
    // Endpoints de Cronograma
    getCronograma: () => axios.get('/cronograma'),
    
    // Endpoints de Trivias
    getTrivias: () => axios.get('/trivias'),
    getTriviaByTema: (temaId) => axios.get(`/preguntas/trivia/${temaId}`)
};

export default publicApi;