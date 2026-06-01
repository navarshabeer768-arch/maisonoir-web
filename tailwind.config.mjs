/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8D5A3',
          dark: '#9A7A35',
          50: '#FAF5E9',
          100: '#F5EBD3',
          200: '#E8D5A3',
          300: '#DBBF73',
          400: '#CEA943',
          500: '#C9A84C',
          600: '#9A7A35',
          700: '#7A5F28',
          800: '#5A451C',
          900: '#3A2C12',
        },
        ivory: { DEFAULT: '#F5F0E8', dark: '#E8E0D0' },
        obsidian: { DEFAULT: '#0A0A0A', light: '#141414' },
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.6s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #9A7A35 0%, #C9A84C 50%, #E8D5A3 100%)',
      },
    },
  },
  plugins: [],
}
