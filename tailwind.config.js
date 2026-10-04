/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#fff8d6',
        teal: '#7fd3d6',
        purple: '#8a4a7a',
        pink: '#ff9ccb',
        'pink-bright': '#ff7eb6',
        'blue-soft': '#8fc6f0',
        mint: '#bff0c8',
      },
      fontFamily: {
        jua: ['Jua', 'sans-serif'],
        gaegu: ['Gaegu', 'cursive'],
      },
      fontSize: {
        bubble: 'clamp(36px, 10vw, 56px)',
      },
    },
  },
  plugins: [],
}
