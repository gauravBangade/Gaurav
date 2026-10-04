/** Theme colours are CSS variables (see src/index.css) so the night theme only swaps variables. */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: token("paper"),
        ink: token("ink"),
        card: token("card"),
        accent: token("accent"),
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', '"Courier New"', "monospace"],
      },
    },
  },
  plugins: [],
}
