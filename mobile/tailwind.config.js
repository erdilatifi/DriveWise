/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ce76c9',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#35565f',
          foreground: '#FFFFFF',
        },
        background: '#FFFFFF',
        surface: '#e2e3e3',
        text: '#35565f',
      },
    },
  },
  plugins: [],
};
