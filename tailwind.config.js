/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#e11d48',   // rose-600
        'primary-light': '#fb7185',
      },
      // Adding these animations makes the "Aesthetic" transitions work
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
      animation: {
        'fade-in': 'fade-in 0.7s ease-out forwards',
        'zoom-in': 'zoom-in 0.5s ease-out forwards',
      }
    }
  },
  plugins: [],
}