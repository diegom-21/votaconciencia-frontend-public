import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // Puerto diferente al admin (5173)
    host: true, // Permitir acceso desde cualquier IP
    cors: true  // Habilitar CORS en el dev server
  },
  preview: {
    port: 4174  // Puerto para preview también diferente
  },
  assetsInclude: ['**/*.ttf', '**/*.woff', '**/*.woff2'],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.ttf')) {
            return 'fonts/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  }
})
