/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          darkblue: "#3F617E", // Based on "14. DARK BLUE PALETTE"
          lightblue: "#BBD6EF", // Based on "13. LIGHT BLUE PALETTE"
          yellow: "#FDCB58", // Based on "12. MEDIUM YELLOW PALETTE"
          gold: "#CFA037", // Based on "11. DARK GOLD PALETTE"
          dark: "#1e293b", // Slate-800 for high contrast text against the yellow
        },
      },
    },
  },
  plugins: [],
};
