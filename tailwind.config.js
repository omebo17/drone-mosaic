/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Raleway', 'sans-serif'],
        'serif': ['Bellefair', 'Georgia', 'Cambria', "Times New Roman", 'Times', 'serif'],
      },
      colors: {
        gold: 'rgb(193, 153, 87)',
      },
    },
  },
  plugins: [],
}

