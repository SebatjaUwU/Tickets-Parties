/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand palette
        'electric-blue': {
          50:  '#e6f5ff',
          100: '#b3e0ff',
          200: '#80ccff',
          300: '#4db8ff',
          400: '#1aa3ff',
          500: '#0099FF',  // PRIMARY
          600: '#007acc',
          700: '#005c99',
          800: '#003d66',
          900: '#001f33',
        },
        'dark-blue': {
          50:  '#e6eaf0',
          100: '#bfcbd9',
          200: '#99abc3',
          300: '#738cac',
          400: '#4d6c96',
          500: '#264d80',
          600: '#1a3b6b',
          700: '#0f2a56',
          800: '#0A1F44',  // SECONDARY
          900: '#050f22',
        },
        'edm-orange': {
          50:  '#fff0e6',
          100: '#ffd6b3',
          200: '#ffbc80',
          300: '#ffa24d',
          400: '#ff881a',
          500: '#FF6A00',  // ACCENT
          600: '#cc5500',
          700: '#994000',
          800: '#662b00',
          900: '#331500',
        },
        'edm-black': '#111111',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Rajdhani', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'hero': ['clamp(2.5rem, 8vw, 6rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1.2' }],
      },
      backgroundImage: {
        'gradient-edm': 'linear-gradient(135deg, #0A1F44 0%, #0099FF 50%, #FF6A00 100%)',
        'gradient-dark': 'linear-gradient(180deg, #111111 0%, #0A1F44 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'gradient-card': 'linear-gradient(180deg, transparent 0%, rgba(10,31,68,0.95) 100%)',
        'gradient-hero': 'linear-gradient(135deg, rgba(10,31,68,0.9) 0%, rgba(0,153,255,0.3) 50%, rgba(255,106,0,0.2) 100%)',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(0, 153, 255, 0.5)',
        'glow-orange': '0 0 20px rgba(255, 106, 0, 0.5)',
        'glow-white': '0 0 20px rgba(255, 255, 255, 0.3)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'hero': '0 25px 50px rgba(0, 0, 0, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'fade-down': 'fadeDown 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'count-up': 'countUp 0.8s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'gradient-shift': 'gradientShift 4s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0,153,255,0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(0,153,255,0.7), 0 0 60px rgba(0,153,255,0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
