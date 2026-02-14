/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(24px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'fade-in-slow': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'float-up': {
          '0%': { opacity: '0', transform: 'translateY(100vh)' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateY(-10vh)' },
        },
        'drift': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-8px) translateX(4px)' },
          '50%': { transform: 'translateY(-4px) translateX(-3px)' },
          '75%': { transform: 'translateY(-10px) translateX(2px)' },
        },
        'soft-glow': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.08)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(148, 200, 255, 0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(148, 200, 255, 0.3), 0 0 80px rgba(148, 200, 255, 0.1)' },
        },
        'glass-shine': {
          '0%': { transform: 'translateX(0)', opacity: '0' },
          '20%': { opacity: '0.35' },
          '50%': { transform: 'translateX(220%)', opacity: '0.15' },
          '100%': { transform: 'translateX(300%)', opacity: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 1s ease-out forwards',
        'fade-in-slow': 'fade-in-slow 2s ease-out forwards',
        'float-up': 'float-up linear infinite',
        'drift': 'drift ease-in-out infinite',
        'soft-glow': 'soft-glow ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'glass-shine': 'glass-shine 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
