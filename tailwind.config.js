/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./store/templates/**/*.{html,js}",
    "./store/scripts/**/*.js",
    "./store/js-loader/*.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'icon-pop': 'icon-pop 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)',
        loading: 'loading 1.5s infinite'
      },
      colors: {
        primary: {
          DEFAULT: '#4f46e5',
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81'
        },
        dark: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155'
        }
      },
      fontFamily: {
        sans: ['Vazirmatn', 'sans-serif'],
        vazir: ['Vazirmatn', 'sans-serif']
      },
      keyframes: {
        'icon-pop': {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '60%': { opacity: '1', transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        loading: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        }
      }
    }
  },
  plugins: [],
}