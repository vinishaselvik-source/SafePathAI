/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#12161f', // Matte Charcoal Dark
          900: '#1a202c', // Slate Charcoal Card
          850: '#222a3a',
          800: '#2d3748',
          700: '#4a5568',
          600: '#718096',
        },
        cyan: {
          400: '#34d399', // Mint Green Highlight
          500: '#2dd4bf', // Fresh Teal Accent
          600: '#0d9488',
        },
        accent: {
          emerald: '#34d399', // Mint Green
          amber: '#fbbf24',   // Warm Gold
          rose: '#f87171',    // Coral Crimson SOS
          violet: '#a78bfa',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -3px rgba(52, 211, 153, 0.35)',
        'glow-rose': '0 0 25px -3px rgba(248, 113, 113, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
}
