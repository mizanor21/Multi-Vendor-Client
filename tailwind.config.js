/** @type {import('tailwindcss').Config} */
import { heroui } from "@heroui/react";

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "loader-spin": "loader-spin 1s infinite steps(12)",
      },
    },
    keyframes: {
      "loader-spin": {
        "100%": { transform: "rotate(360deg)" },
      },
    },
  },
  plugins: [heroui()],
};
