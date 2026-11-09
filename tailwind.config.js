/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Movie-theater palette: black, theater red, velvet red, marquee cream
        pop: { DEFAULT: '#E0283A', soft: '#FF7380', deep: '#8E0F1C' }, // theater red (main accent)
        cherry: { DEFAULT: '#9B1020', deep: '#5E0812' }, // velvet curtain red
        sky: { DEFAULT: '#F3E9D2', deep: '#C9B993' }, // marquee cream
        grape: { DEFAULT: '#2A2427', deep: '#1A1618' }, // charcoal
        mint: { DEFAULT: '#6E1420', deep: '#45080F' }, // maroon
        ink: { DEFAULT: '#0A0A0B', surface: '#141214', raised: '#1E1A1D' },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
