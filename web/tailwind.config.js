/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        daily: {
          bg: '#090D16',
          panel: '#101622',
          card: '#161F30',
          border: 'rgba(255, 255, 255, 0.08)',
          accent: '#10B981', // Emerald
          os: '#34D399',     // Emerald green
          ai: '#A855F7',     // Violet
          news: '#38BDF8',   // Sky blue
          custom: '#F59E0B'  // Amber
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace']
      }
    },
  },
  plugins: [],
}
