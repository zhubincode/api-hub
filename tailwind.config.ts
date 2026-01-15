import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vaporwave 颜色系统
        void: {
          DEFAULT: "#090014",
          light: "#1a103c",
        },
        neon: {
          magenta: "#FF00FF",
          cyan: "#00FFFF",
          orange: "#FF9900",
        },
        chrome: {
          DEFAULT: "#E0E0E0",
          dark: "#2D1B4E",
        },
      },
      fontFamily: {
        heading: ["var(--font-orbitron)", "sans-serif"],
        mono: ["var(--font-share-tech)", "monospace"],
      },
      boxShadow: {
        "neon-magenta": "0 0 10px #FF00FF",
        "neon-magenta-lg": "0 0 20px #FF00FF",
        "neon-cyan": "0 0 20px rgba(0,255,255,0.2)",
        "neon-cyan-lg": "0 0 50px rgba(0,255,255,0.2)",
      },
      dropShadow: {
        "glow-white": "0 0 10px rgba(255,255,255,0.5)",
        "glow-magenta": "0 0 30px rgba(255,0,255,0.6)",
        "glow-cyan": "0 0 5px rgba(0,255,255,0.8)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
