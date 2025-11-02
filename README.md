# 🗳️ VotaConciencia - Web Pública

Aplicación web pública para ciudadanos que permite consultar información electoral, candidatos, propuestas, cronograma y recursos educativos.

## 🚀 Configuración y Desarrollo

### Puertos de Desarrollo
- **Web Pública**: `http://localhost:5174/`
- **Panel Admin**: `http://localhost:5173/`
- **Backend API**: `http://localhost:3000/`

### 📦 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

### 🔗 Conexión con la API

La URL del backend se configura a través de la variable de entorno `VITE_API_URL` en el archivo `.env`. Por defecto apunta a `http://localhost:3000`.

1. Copia el archivo de configuración de ejemplo:
```bash
cp .env.example .env
```

2. Configura la URL del backend en el archivo `.env`:
```
VITE_API_URL=http://localhost:3000  # URL del backend
```

#### Funciones disponibles (`src/api.js`):

**Candidatos:**
- `getCandidatos()` - Obtener todos los candidatos
- `getCandidatoById(id)` - Obtener candidato por ID

**Partidos:**
- `getPartidos()` - Obtener todos los partidos políticos

**Temas:**
- `getTemas()` - Obtener todos los temas de gobierno

**Propuestas:**
- `getPropuestas(candidatoId?, temaId?)` - Obtener propuestas con filtros opcionales

**Cronograma:**
- `getCronograma()` - Obtener cronograma electoral

**Trivias:**
- `getTrivias()` - Obtener todas las trivias
- `getTriviaById(id)` - Obtener trivia específica

**Recursos:**
- `getRecursos()` - Obtener recursos educativos

**Utilidades:**
- `getImageUrl(path)` - Construir URL de imágenes
- `formatDate(dateString)` - Formatear fechas

### 🛡️ CORS

El backend está configurado para permitir conexiones desde:
- `http://localhost:5173` (Admin)
- `http://localhost:5174` (Público)
- `http://localhost:3001`
- `http://localhost:4173` (Preview Admin)
- `http://localhost:4174` (Preview Público)

### 📁 Estructura del Proyecto

```
src/
├── api.js          # Configuración y funciones de API
├── App.jsx         # Componente principal (demo actual)
├── App.css         # Estilos principales
├── main.jsx        # Punto de entrada
└── assets/         # Recursos estáticos
```

### 🎯 Características Implementadas

- ✅ Conexión configurada con backend
- ✅ Manejo de errores en peticiones API
- ✅ Componente de prueba con datos reales
- ✅ Visualización de candidatos, partidos y temas
- ✅ Soporte para imágenes de candidatos y logos de partidos
- ✅ Timeout y interceptores configurados
- ✅ Formateo de fechas y utilidades

### 🚧 Próximos Pasos

La aplicación está lista para implementar:
- Navegación con React Router
- Componentes específicos para cada sección
- Interfaz de usuario completa
- Filtros y búsquedas
- Trivias interactivas
- Cronograma visual
- Comparador de propuestas

### 🔧 Dependencias

- **React 19.1.1** - Framework principal
- **Vite 7.1.7** - Build tool y dev server
- **Axios** - Cliente HTTP para API
- **React Router DOM** - Navegación (instalado, listo para usar)

### 📞 API Endpoints Disponibles

Base URL: `http://localhost:3000/api/`

- `GET /candidatos` - Lista de candidatos
- `GET /candidatos/:id` - Candidato específico
- `GET /partidos` - Lista de partidos
- `GET /temas` - Lista de temas
- `GET /propuestas` - Lista de propuestas
- `GET /propuestas?candidato_id=X&tema_id=Y` - Propuestas filtradas
- `GET /cronograma` - Cronograma electoral
- `GET /trivias` - Lista de trivias
- `GET /trivias/:id` - Trivia específica
- `GET /recursos` - Recursos educativos

### 🌐 Imágenes y Archivos

Las imágenes se sirven desde: `http://localhost:3000/uploads/`

Usa la función `getImageUrl(path)` para construir las URLs correctamente.

---

**Estado**: ✅ Configurado y funcionando
**Última actualización**: Octubre 2025

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
