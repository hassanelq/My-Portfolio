/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#000",
        white: "#fff",
        dark: "#1A1A1A",
        darkLight: "#B3B3B3",
        light: "#D4D4D4",
      },
    },
  },
  plugins: [],
};
