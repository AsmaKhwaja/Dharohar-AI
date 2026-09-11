/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep charcoal/navy page
        page: {
          DEFAULT: '#0c0e14',
          100: '#111520',
          200: '#161b2a',
          300: '#1c2338',
        },
        // Surface panels
        surface: {
          DEFAULT: '#101420',
          100: '#141828',
          200: '#181e30',
          300: '#1e2538',
        },
        // Sandstone gold accent
        gold: {
          50:  '#fdf8ec',
          100: '#faedcc',
          200: '#f4d68c',
          300: '#ecbc4e',
          400: '#e8b84b',
          500: '#c9952a',
          600: '#a87420',
          700: '#845818',
          800: '#634014',
          900: '#4a2e10',
        },
        // Keep sand alias for compat
        sand: {
          300: '#ecbc4e',
          400: '#e8b84b',
          500: '#c9952a',
        },
        // Muted text
        muted: {
          DEFAULT: '#6b6456',
          100: '#8a8070',
          200: '#a89e8c',
        },
      },
      fontFamily: {
        sans:  ['"Inter"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'page-gradient': 'linear-gradient(160deg, #0c0e14 0%, #0e1220 50%, #0c0f18 100%)',
        'hero-gradient': 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(201,149,42,0.15) 0%, transparent 60%)',
        'card-glow':     'linear-gradient(135deg, rgba(201,149,42,0.06) 0%, rgba(201,149,42,0.02) 100%)',
      },
      animation: {
        'pulse-slow':  'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in':     'fadeIn 0.45s ease-out both',
        'slide-up':    'slideUp 0.45s ease-out both',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      boxShadow: {
        'gold-sm': '0 4px 16px rgba(201,149,42,0.15)',
        'gold-md': '0 8px 32px rgba(201,149,42,0.2)',
        'gold-lg': '0 16px 64px rgba(201,149,42,0.25)',
        'dark-lg': '0 16px 64px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
