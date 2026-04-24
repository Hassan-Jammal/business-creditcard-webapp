/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

module.exports = {
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        grey: 'var(--grey-color)',
      },
      screens: {
        '2xl': '1536px',
        '3xl': '1792px',
        '4xl': '2048px',
        '5xl': '2304px',
        '6xl': '2688px',
        '7xl': '3072px',
        '8xl': '3584px',
        '9xl': '4096px',
      },
      fontFamily: {
        // Poppins: ['Poppins', 'sans-serif'],
        AeonikBlack: ['"Aeonik-Black"', 'sans-serif'],
        AeonikBold: ['"Aeonik-Bold"', 'sans-serif'], 
        AeonikMedium: ['"Aeonik-Medium"', 'sans-serif'],
        AeonikRegular: ['"Aeonik-Regular"', 'sans-serif'],
        AeonikMediumItalic: ['"Aeonik-MediumItalic"', 'sans-serif'],
      },
    }
  },
  // important: true,
  plugins: [],
  // safelist: [
  //   "to-[#2B6FF6]",
  //   "to-[#43516D]",
  //   "to-[#323D86]",
  // ],
}