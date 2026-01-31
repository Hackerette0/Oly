/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', 
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#e11d48',   
        'primary-light': '#fb7185',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'zoom-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      },
      fontFamily: {
        'serif-aesthetic': ['"Playfair Display"', 'serif'],
        'sans-aesthetic': ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fade-in 0.7s ease-out forwards',
        'zoom-in': 'zoom-in 0.5s ease-out forwards',
      }
    }
  },
  plugins: [],
}