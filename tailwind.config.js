/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#03060f',
          900: '#060d1f',
          800: '#0a1433',
          700: '#0e1b47',
          600: '#122260',
        },
        gold: {
          100: '#fef9e7',
          200: '#fdf0c0',
          300: '#fce588',
          400: '#f9d44a',
          500: '#f5c518',
          600: '#d4a017',
          700: '#a37b10',
          800: '#7a5c0c',
          900: '#513d08',
        },
        parchment: {
          100: '#fefbf3',
          200: '#fdf5e0',
          300: '#faecc8',
          400: '#f5dfae',
          500: '#eed394',
        },
        crimson: {
          500: '#8b1a1a',
          400: '#b02020',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Libre Baskerville"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        cinzel: ['"Cinzel"', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
      },
      boxShadow: {
        'gold': '0 0 20px rgba(245, 197, 24, 0.3), 0 0 40px rgba(245, 197, 24, 0.15)',
        'gold-sm': '0 0 10px rgba(245, 197, 24, 0.25)',
        'gold-lg': '0 0 40px rgba(245, 197, 24, 0.4), 0 0 80px rgba(245, 197, 24, 0.2)',
        'parchment': '0 20px 60px rgba(0, 0, 0, 0.6), inset 0 0 80px rgba(245, 197, 24, 0.05)',
        'artifact': '0 4px 20px rgba(0,0,0,0.5)',
      },
      backgroundImage: {
        'stars': "radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 70%)",
        'parchment-grad': 'linear-gradient(135deg, #fef9e7 0%, #fdf0c0 30%, #faecc8 60%, #f5dfae 100%)',
        'gold-shimmer': 'linear-gradient(90deg, transparent, rgba(245,197,24,0.3), transparent)',
        'navy-grad': 'radial-gradient(ellipse at top, #0e1b47 0%, #060d1f 50%, #03060f 100%)',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(245,197,24,0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(245,197,24,0.6)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'twinkle': {
          '0%, 100%': { opacity: '0.2', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.3)' },
        },
        'modal-in': {
          '0%': { opacity: '0', transform: 'scale(0.8) translateY(20px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'unlock': {
          '0%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.2)' },
          '60%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'particle': {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-60px) scale(0)' },
        },
        'glow-rotate': {
          '0%': { filter: 'hue-rotate(0deg) brightness(1)' },
          '50%': { filter: 'hue-rotate(30deg) brightness(1.3)' },
          '100%': { filter: 'hue-rotate(0deg) brightness(1)' },
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-delay': 'float 3s ease-in-out 1.5s infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
        'modal-in': 'modal-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'unlock': 'unlock 0.5s ease-in-out',
        'glow-rotate': 'glow-rotate 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
