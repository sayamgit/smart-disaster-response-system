/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf4ff', 100: '#fae8ff', 200: '#f5d0fe', 300: '#e879f9',
          400: '#d946ef', 500: '#c026d3', 600: '#a21caf', 700: '#86198f',
          800: '#701a75', 900: '#4a044e', // Neon Magenta/Purple tones
        },
        danger: { 50: '#fff1f2', 400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c' },
        warning: { 50: '#fffbeb', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706' },
        success: { 50: '#f0fdf4', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a' },
        surface: {
          50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1',
          400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155',
          800: '#1e293b', 850: '#151f2f', 900: '#020617', // Very deep slate/black
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        'glass-hover': '0 12px 40px 0 rgba(192, 38, 211, 0.15)',
        'neon-primary': '0 0 10px rgba(192, 38, 211, 0.5), 0 0 20px rgba(192, 38, 211, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
      }
    }
  },
  plugins: []
};
