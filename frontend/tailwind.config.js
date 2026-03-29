/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          gold: '#f1c27d',
          dark: '#0b0f19',
        },
      },
      boxShadow: {
        glow: '0 20px 80px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
};

