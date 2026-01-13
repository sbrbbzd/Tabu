/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary": "#f2f20d",
        "taboo-purple": "#2d1a47",
        "taboo-accent": "#5e3a99",
        "game-deep": "#1A0033",
        "game-yellow": "#F2F20D",
        "game-orange": "#FF8C00",
        "game-red": "#ef4444",
        "game-green": "#22c55e",
        "game-blue": "#3b82f6"
      },
    },
  },
  plugins: [],
}
