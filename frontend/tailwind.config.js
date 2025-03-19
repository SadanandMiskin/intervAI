// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          600: '#007BFF',
          700: '#0056b3',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      transitionDuration: {
        '2000': '2000ms',
      },
    },
  },
  plugins: [],
}