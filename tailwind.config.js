/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'detective-primary': '#1E3A8A',
        'detective-secondary': '#38BDF8',
        'detective-accent': '#F59E0B',
        'detective-dark': '#0F172A',
        'detective-light': '#F8FAFC',
      },
      fontFamily: {
        detective: ['Montserrat', 'sans-serif'],
        handwritten: ['Indie Flower', 'cursive'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
