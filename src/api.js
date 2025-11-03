import axios from 'axios';

// Configuración base de la API
const API_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = `${API_URL}/api`;

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Manejar errores específicos sin mostrar en consola
        return Promise.reject(error);
    }
);

// ========================================
// FUNCIONES DE API PARA LA WEB PÚBLICA
// ========================================

// Obtener todos los candidatos con información básica
export const getCandidatos = async () => {
    try {
        const response = await api.get('/candidatos');
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener candidatos: ' + error.message);
    }
};

// Obtener un candidato específico por ID
export const getCandidatoById = async (id) => {
    try {
        const response = await api.get(`/candidatos/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener candidato: ' + error.message);
    }
};

// Obtener todos los partidos políticos
export const getPartidos = async () => {
    try {
        const response = await api.get('/partidos');
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener partidos: ' + error.message);
    }
};

// Obtener todos los temas disponibles
export const getTemas = async () => {
    try {
        const response = await api.get('/temas');
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener temas: ' + error.message);
    }
};

// Obtener propuestas por candidato y/o tema
export const getPropuestas = async (candidatoId = null, temaId = null) => {
    try {
        let url = '/propuestas';
        const params = new URLSearchParams();
        
        if (candidatoId) params.append('candidato_id', candidatoId);
        if (temaId) params.append('tema_id', temaId);
        
        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener propuestas: ' + error.message);
    }
};

// Obtener cronograma electoral
export const getCronograma = async () => {
    try {
        const response = await api.get('/cronograma');
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener cronograma: ' + error.message);
    }
};

// Obtener cronograma electoral ordenado por proximidad
export const getCronogramaOrdenado = async () => {
    try {
        const response = await api.get('/cronograma/ordenados');
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener cronograma ordenado: ' + error.message);
    }
};

// Obtener el próximo evento más cercano
export const getProximoEvento = async () => {
    try {
        const response = await api.get('/cronograma/proximo');
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener próximo evento: ' + error.message);
    }
};

// Obtener trivias disponibles (temas de trivia)
export const getTrivias = async () => {
    try {
        const response = await api.get('/trivias/temas');
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener trivias: ' + error.message);
    }
};

// Obtener una trivia específica por ID
export const getTriviaById = async (id) => {
    try {
        const response = await api.get(`/trivias/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener trivia: ' + error.message);
    }
};

// Obtener preguntas de una trivia específica
export const getPreguntasByTema = async (temaId) => {
    try {
        const response = await api.get(`/trivias/preguntas/tema/${temaId}`);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener preguntas de trivia: ' + error.message);
    }
};

// Obtener opciones de una pregunta específica
export const getOpcionesByPregunta = async (preguntaId) => {
    try {
        const response = await api.get(`/trivias/opciones/pregunta/${preguntaId}`);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener opciones de pregunta: ' + error.message);
    }
};

// Obtener recursos educativos
export const getRecursos = async () => {
    try {
        const response = await api.get('/recursos');
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener recursos: ' + error.message);
    }
};

// Obtener historial político de un candidato
export const getHistorialPolitico = async (candidatoId) => {
    try {
        const url = `/historial/candidato/${candidatoId}`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener historial político: ' + error.message);
    }
};

// Consultar a la IA sobre un candidato específico
export const consultarIA = async (candidatoId, pregunta) => {
    try {
        const response = await api.post('/openai/consultar', {
            candidatoId: candidatoId,
            pregunta: pregunta
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 429) {
            throw new Error('Servicio temporalmente sobrecargado. Intenta nuevamente en unos minutos.');
        } else if (error.response?.status >= 500) {
            throw new Error('Error interno del servidor. Intenta más tarde.');
        } else {
            throw new Error('Error al consultar IA: ' + error.message);
        }
    }
};

// ========================================
// UTILIDADES
// ========================================

// Función para construir URL de imágenes
export const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return null;
    }
    
    // Si la ruta ya es completa (comienza con http), devolverla tal como está
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // Si la ruta comienza con /uploads/, construir URL completa
    if (imagePath.startsWith('/uploads/')) {
        const fullUrl = `${API_URL}${imagePath}`;
        return fullUrl;
    }
    
    // Limpiar la ruta si ya incluye "uploads/" o "images/"
    let cleanPath = imagePath;
    if (imagePath.startsWith('uploads/')) {
        cleanPath = imagePath.substring(8); // Remover "uploads/"
    }
    if (imagePath.startsWith('images/')) {
        cleanPath = `images/${cleanPath}`;
    } else if (!cleanPath.startsWith('images/')) {
        cleanPath = `images/${cleanPath}`;
    }
    
    const fullUrl = `http://localhost:3000/uploads/${cleanPath}`;
    
    return fullUrl;
};

// Función para formatear fechas
export const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export default api;