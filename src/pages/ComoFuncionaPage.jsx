import React from 'react';
import { Link } from 'react-router-dom';
import {
    MagnifyingGlassIcon,
    ScaleIcon,
    ChatBubbleLeftRightIcon,
    ArrowRightIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

/**
 * Página que explica cómo funciona VotaConCiencia en 3 simples pasos
 * Diseño moderno y responsive con información clara para los usuarios
 */
const ComoFuncionaPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-20 no-scroll-x eliminate-black-bar">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 constrain-width contain-all">

                {/* Header Section */}
                <div className="text-center mt-20 mb-12 sm:mb-16">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <SparklesIcon className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-['Outfit']">
                        Tu Guía para un Voto
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">
                            Informado en 3 Simples Pasos
                        </span>
                    </h1>
                    <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        Descubre cómo VotaConCiencia te ayuda a tomar la mejor decisión electoral
                        con información verificada y herramientas innovadoras.
                    </p>
                </div>

                {/* Pasos principales */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-16">

                    {/* Paso 1: Explora */}
                    <PasoCard
                        numero="1"
                        titulo="Explora toda la Información"
                        descripcion="Encuentra los perfiles completos de todos los candidatos en un solo lugar. Accede a su biografía, historial político y propuestas clave, todo verificado y sin sesgos."
                        icono={<MagnifyingGlassIcon className="w-12 h-12" />}
                        colorGradient="from-blue-600 to-blue-700"
                        colorBackground="bg-blue-50"
                        colorBorder="border-blue-300"
                        destacado={true}

                    />

                    {/* Paso 2: Compara */}
                    <PasoCard
                        numero="2"
                        titulo="Compara Propuestas Lado a Lado"
                        descripcion="No más documentos interminables. Usa nuestra herramienta de comparación para ver qué propone cada candidato sobre los temas que más te importan, como Economía, Salud o Seguridad."
                        icono={<ScaleIcon className="w-12 h-12" />}
                        colorGradient="from-blue-600 to-blue-700"
                        colorBackground="bg-blue-50"
                        colorBorder="border-blue-300"
                        destacado={true}

                    />

                    {/* Paso 3: Pregunta (destacado) */}
                    <PasoCard
                        numero="3"
                        titulo="Pregúntale a la IA"
                        descripcion="Nuestra funcionalidad estrella. ¿Tienes una duda específica? Chatea directamente con el plan de gobierno oficial de un candidato y obtén respuestas precisas al instante, generadas por Inteligencia Artificial."
                        icono={<ChatBubbleLeftRightIcon className="w-12 h-12" />}
                        colorGradient="from-blue-600 to-blue-700"
                        colorBackground="bg-blue-50"
                        colorBorder="border-blue-300"
                        destacado={true}
                    />

                </div>

                {/* Sección adicional de beneficios */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 sm:p-12 mb-16">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-['Outfit']">
                            ¿Por qué elegir VotaConCiencia?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Somos la primera plataforma en el Perú que combina información electoral verificada
                            con tecnología de Inteligencia Artificial para democratizar el acceso a la información política.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <BeneficioItem
                            titulo="100% Verificado"
                            descripcion="Toda la información es oficial y contrastada"
                        />
                        <BeneficioItem
                            titulo="Sin Sesgos"
                            descripcion="Presentamos los datos de forma neutral e imparcial"
                        />
                        <BeneficioItem
                            titulo="IA Avanzada"
                            descripcion="Tecnología GPT para respuestas precisas"
                        />
                        <BeneficioItem
                            titulo="Completamente Gratis"
                            descripcion="Acceso libre a toda la información electoral"
                        />
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 sm:p-12 text-white">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-['Outfit']">
                            ¿Listo para votar informado?
                        </h2>
                        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                            Comienza a explorar los candidatos y sus propuestas.
                            Tu voto informado es el futuro de nuestro país.
                        </p>
                        <Link
                            to="/candidatos"
                            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            <span>Empezar a Explorar</span>
                            <ArrowRightIcon className="w-6 h-6 ml-2" />
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

/**
 * Componente para cada paso del proceso
 */
const PasoCard = ({
    numero,
    titulo,
    descripcion,
    icono,
    colorGradient,
    colorBackground,
    colorBorder,
    destacado = false
}) => {
    return (
        <div className={`
      relative bg-white rounded-2xl shadow-lg border-2 p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2
      ${destacado ? 'border-blue-300 ring-4 ring-blue-100' : colorBorder}
    `}>



            {/* Número del paso */}
            <div className="flex justify-center mb-6">
                <div className={`
          w-16 h-16 rounded-full bg-gradient-to-br ${colorGradient} 
          flex items-center justify-center text-white font-bold text-2xl shadow-lg
        `}>
                    {numero}
                </div>
            </div>

            {/* Icono */}
            <div className="flex justify-center mb-6">
                <div className={`
          w-20 h-20 rounded-2xl ${colorBackground} border-2 ${colorBorder}
          flex items-center justify-center text-gray-700
        `}>
                    {icono}
                </div>
            </div>

            {/* Contenido */}
            <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 font-['Outfit']">
                    {titulo}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {descripcion}
                </p>
            </div>

            {/* Efecto de brillo en hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
        </div>
    );
};

/**
 * Componente para cada beneficio
 */
const BeneficioItem = ({ titulo, descripcion }) => {
    return (
        <div className="text-center p-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full"></div>
            </div>
            <h4 className="font-bold text-gray-900 mb-2">{titulo}</h4>
            <p className="text-sm text-gray-600">{descripcion}</p>
        </div>
    );
};

export default ComoFuncionaPage;