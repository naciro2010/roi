/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Accent sobre : un indigo-acier désaturé, professionnel et calme.
        brand: {
          50: '#F1F3FA',
          100: '#E1E5F2',
          200: '#C2C9E4',
          300: '#97A4CE',
          400: '#6E7FBB',
          500: '#4F60A0',
          600: '#41508A',
          700: '#374270',
          800: '#30395C',
          900: '#2A3049',
          DEFAULT: '#4F60A0',
          dark: '#41508A',
          light: '#E1E5F2',
        },
        ink: {
          50: '#F7F8F9',
          100: '#EEF0F2',
          200: '#E1E4E8',
          300: '#C7CCD3',
          400: '#9AA1AC',
          500: '#6B7280',
          600: '#4B5360',
          700: '#384049',
          800: '#262C34',
          900: '#171B21',
          950: '#0E1116',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(14,17,22,0.04), 0 4px 12px rgba(14,17,22,0.05)',
        card: '0 1px 2px rgba(14,17,22,0.04), 0 10px 28px -14px rgba(14,17,22,0.14)',
        float: '0 10px 30px -14px rgba(14,17,22,0.22)',
        brand: '0 8px 20px -10px rgba(14,17,22,0.28)',
        ring: '0 30px 70px -28px rgba(14,17,22,0.55)',
      },
      backgroundImage: {
        mesh:
          'radial-gradient(50% 50% at 18% 8%, rgba(79,96,160,0.10) 0%, rgba(79,96,160,0) 60%), radial-gradient(45% 45% at 88% 92%, rgba(14,17,22,0.05) 0%, rgba(14,17,22,0) 60%)',
        'hero-glow':
          'radial-gradient(115% 80% at 82% -12%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 52%), radial-gradient(85% 75% at 0% 112%, rgba(110,127,187,0.22) 0%, rgba(110,127,187,0) 58%)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        screenIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        toastIn: {
          '0%': { opacity: '0', transform: 'translate(-50%, 16px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translate(-50%, 0) scale(1)' },
        },
        sheetIn: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drawerIn: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        fadeIn: 'fadeIn 0.25s ease-out both',
        screenIn: 'screenIn 0.32s cubic-bezier(0.22,1,0.36,1) both',
        toastIn: 'toastIn 0.28s cubic-bezier(0.22,1,0.36,1) both',
        sheetIn: 'sheetIn 0.34s cubic-bezier(0.22,1,0.36,1) both',
        drawerIn: 'drawerIn 0.3s cubic-bezier(0.22,1,0.36,1) both',
        popIn: 'popIn 0.22s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
}
