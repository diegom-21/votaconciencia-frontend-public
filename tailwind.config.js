/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      screens: {
        'xs': '375px',
        'iphone-se': '375px',
        'iphone-xr': '414px',
        'iphone-12': '390px',
        'iphone-14-max': '430px',
        'pixel-7': '412px',
        'galaxy-s8': '360px',
        'galaxy-s20': '412px',
        'ipad-mini': '768px',
        'ipad-air': '820px',
        'ipad-pro': '1024px',
        'surface-pro': '912px',
        'nest-hub': '1024px',
      },
    },
  },
  plugins: [],
}