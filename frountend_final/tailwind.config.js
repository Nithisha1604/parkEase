/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0a0a0b',
          lighter: '#161618',
          card: '#1c1c1e',
        },
        neon: {
          blue: '#00f2ff',
          purple: '#bc13fe',
          pink: '#ff00ea',
        },
      },
      backgroundImage: {
        'neon-gradient': 'linear-gradient(to right, #00f2ff, #bc13fe)',
        'neon-gradient-vertical': 'linear-gradient(to bottom, #00f2ff, #bc13fe)',
      },
      boxShadow: {
        'neon-blue': '0 0 10px rgba(0, 242, 255, 0.5)',
        'neon-purple': '0 0 10px rgba(188, 19, 254, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
