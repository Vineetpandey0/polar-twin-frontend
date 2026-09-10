/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090D14",
        surface: "#0F1722",
        card: "#0F1722",
        panel: {
          DEFAULT: "#0F1722",
          subtle: "#131D2B",
          header: "#162233",
          border: "#1E2C3D",
          borderLight: "#2A3B4F",
        },
        glacial: {
          ice: "#E2EAF4",
          steel: "#8CA1B6",
          dim: "#5B7086",
          muted: "#415164",
        },
        operational: {
          nominal: "#34D399",
          advisory: "#FBBF24",
          critical: "#F87171",
          cryo: "#38BDF8",
        },
        accent: "#38BDF8",
        maitri: "#FBBF24",
        bharati: "#38BDF8",
      },
      fontFamily: {
        sans: ["var(--font-rajdhani)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
        tech: ["var(--font-rajdhani)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "3px",
        md: "4px",
      },
    },
  },
  plugins: [],
};

