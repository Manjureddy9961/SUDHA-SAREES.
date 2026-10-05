/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          maroon: '#7B1E3A',
          'maroon-dark': '#561226',
          'maroon-light': '#9B2C4D',
          gold: '#C9A24B',
          'gold-light': '#DFC06C',
          'gold-dark': '#A47F2E',
          blush: '#F7E1E7',
          'blush-soft': '#FDF5F7',
          ivory: '#FFF8F0',
          'ivory-warm': '#FAF3EA',
          peacock: '#0D5C5A',
          'peacock-light': '#147573',
          charcoal: '#231F20',
          silk: '#1A0E13',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(201, 162, 75, 0.35)',
        'maroon-glow': '0 0 30px rgba(123, 30, 58, 0.35)',
        'card-hover': '0 20px 35px -10px rgba(123, 30, 58, 0.15)',
        'royal': '0 10px 40px -10px rgba(86, 18, 38, 0.25)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(3deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.85, transform: 'scale(1.02)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        'shimmer': 'shimmer 2.5s infinite linear',
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'marquee': 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}
