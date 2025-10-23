/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,js}",
    "./dist/**/*.{html,js}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: { 
        primary: { 
          DEFAULT: '#1e90ff',
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8'
        },
        dark: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155'
        }
      },
      fontFamily: { 
        vazir: ['Vazirmatn', 'sans-serif'] 
      }
    }
  },
  plugins: [],
}