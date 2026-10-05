/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkmode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          darkblue: "#3F617E",
          lightblue: "#BBD6EF",
          yellow: "#FDCB58",
          gold: "#CFA037",
          dark: "#1e293b",
        },
      },
    },
  },
  plugins: [],
};
