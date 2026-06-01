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
        cream: { DEFAULT: '#FAF7F2', dark: '#F0EBE2' },
        charcoal: { DEFAULT: '#2A2420', light: '#3D342C' },
        obsidian: '#0A0A0A',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.6s ease forwards',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #9A7A35 0%, #C9A84C 50%, #E8D5A3 100%)',
        'cream-gradient': 'linear-gradient(135deg, #FAF7F2 0%, #F0EBE2 100%)',
      },
    },
  },
  plugins: [],
}
