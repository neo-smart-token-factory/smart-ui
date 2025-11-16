/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        neo: "#0ff",
        night: "#040404",
        zincsoft: "#cfcfcf"
      }
    }
  },
  plugins: []
};

