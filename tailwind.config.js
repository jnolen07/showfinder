/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Movie-night palette
        pop: { DEFAULT: '#FFD23F', soft: '#FFE68A', deep: '#C99700' }, // popcorn yellow
        cherry: { DEFAULT: '#FF4D7A', deep: '#C8235A' },
        sky: { DEFAULT: '#45C4F5', deep: '#1F8FC4' },
        grape: { DEFAULT: '#9B7BFF', deep: '#6A48E0' },
        mint: { DEFAULT: '#2EE6A8', deep: '#14A97A' },
        ink: { DEFAULT: '#0E0B1F', surface: '#18132F', raised: '#231C44' },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
