// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // enables class-based dark mode (using `.dark`)
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // keep empty in v4, use @theme in CSS for tokens
  },
  plugins: [
    // add plugins here if needed
    require("tailwindcss-animate"),
  ],
};
