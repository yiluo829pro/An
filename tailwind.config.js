/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        mood: {
          heavy: '#1a1a2e',
          low: '#2d3561',
          quiet: '#4a5568',
          okay: '#6b7c5e',
          steady: '#8b7355',
          good: '#c4a862',
          light: '#e8c547',
          bright: '#f5e642',
        }
      }
    },
  },
  plugins: [],
}
