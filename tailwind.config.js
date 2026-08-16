/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zomato: "#e23744",
        "zomato-dark": "#c12836",
      },
    },
  },
  plugins: [],
}
