/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b1120",
        surface: "#152035",
        card: "#1e2d4a",
        accent: "#38bdf8",
        maitri: "#f59e0b",
        bharati: "#06b6d4",
      },
    },
  },
  plugins: [],
};
