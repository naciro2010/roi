/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ----------------------------------------------------------------
        // Thème « Midnight » — sombre, premium, jamais noir pur.
        // Surfaces empilées : canvas < surface-soft < surface < 2 < 3.
        // ----------------------------------------------------------------
        canvas: '#0A0D14', // fond de l'app
        surface: {
          DEFAULT: '#141A26', // cartes
          soft: '#0F131C', // tuiles internes / fonds discrets
          2: '#1B2230', // inputs, pistes, pills
          3: '#28303F', // survol, segment actif, élévation
        },
        // Filets (hairlines) translucides pour un rendu « verre ».
        line: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          strong: 'rgba(255,255,255,0.14)',
        },
        // Texte : du plus lumineux au plus discret.
        fg: {
          DEFAULT: '#EEF1F7',
          soft: '#BFC6D4',
          muted: '#8B93A6',
          faint: '#5E6677',
        },

        // Accent indigo lumineux (pop sur le sombre, sobre quand même).
        brand: {
          50: '#19203A',
          100: '#222C4C',
          200: '#3C4A7A',
          300: '#AEB7F5',
          400: '#929DEE',
          500: '#5E6AD6',
          600: '#828DEC',
          700: '#A3ABF3',
          800: '#C7CCF8',
          900: '#2A3049',
          DEFAULT: '#5E6AD6',
          dark: '#4954C4',
          light: '#1C2540',
        },
        // Conserve la sémantique : ink = neutres pour quelques cas legacy.
        ink: {
          50: '#0F131C',
          100: '#1B2230',
          200: '#28303F',
          300: '#3A4456',
          400: '#5E6677',
          500: '#8B93A6',
          600: '#A7AEBE',
          700: '#BFC6D4',
          800: '#D7DCE6',
          900: '#EEF1F7',
          950: '#0A0D14',
        },
        // Vert sobre = « validé / fait ».
        success: { 300: '#86E0AB', DEFAULT: '#3E9E6A', light: '#14271C', dark: '#7ED3A0' },
        // Rose désaturé = « j'aime » (kudos likés).
        like: { DEFAULT: '#D38794', light: '#2A1A1F' },
        // Or champagne = accent « premium / abonnement ».
        gold: { 300: '#E7D49B', DEFAULT: '#C8A24A', dark: '#9A7B2E', light: '#2A2210' },
      },
      fontFamily: {
        display: ['"Inter Tight"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.40), 0 2px 10px rgba(0,0,0,0.28)',
        card: '0 1px 2px rgba(0,0,0,0.45), 0 14px 32px -16px rgba(0,0,0,0.70)',
        float: '0 18px 44px -18px rgba(0,0,0,0.78)',
        brand: '0 10px 26px -10px rgba(94,106,214,0.55)',
        ring: '0 50px 100px -32px rgba(0,0,0,0.88)',
      },
      backgroundImage: {
        // Halo discret derrière le « téléphone » (desktop).
        mesh:
          'radial-gradient(60% 50% at 12% 0%, rgba(94,106,214,0.12) 0%, rgba(94,106,214,0) 60%), radial-gradient(55% 55% at 92% 100%, rgba(123,134,224,0.08) 0%, rgba(123,134,224,0) 60%)',
        // Lueur sur les cartes « héros » sombres.
        'hero-glow':
          'radial-gradient(120% 90% at 82% -12%, rgba(123,134,224,0.20) 0%, rgba(123,134,224,0) 55%), radial-gradient(90% 80% at 0% 112%, rgba(94,106,214,0.16) 0%, rgba(94,106,214,0) 60%)',
        // Aurora « premium » : nappes indigo + violet sur surface sombre.
        aurora:
          'radial-gradient(70% 60% at 12% 2%, rgba(94,106,214,0.42) 0%, rgba(94,106,214,0) 60%), radial-gradient(60% 70% at 92% 6%, rgba(150,128,214,0.32) 0%, rgba(150,128,214,0) 58%), radial-gradient(80% 80% at 78% 112%, rgba(80,150,150,0.20) 0%, rgba(80,150,150,0) 60%)',
        // Filet doré discret pour les surfaces « premium ».
        'gold-sheen':
          'linear-gradient(135deg, rgba(231,212,155,0.16) 0%, rgba(231,212,155,0) 42%), radial-gradient(60% 80% at 90% 0%, rgba(200,162,74,0.18) 0%, rgba(200,162,74,0) 60%)',
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
        bubbleIn: {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.25s ease-out both',
        screenIn: 'screenIn 0.32s cubic-bezier(0.22,1,0.36,1) both',
        toastIn: 'toastIn 0.28s cubic-bezier(0.22,1,0.36,1) both',
        sheetIn: 'sheetIn 0.34s cubic-bezier(0.22,1,0.36,1) both',
        drawerIn: 'drawerIn 0.3s cubic-bezier(0.22,1,0.36,1) both',
        popIn: 'popIn 0.22s cubic-bezier(0.22,1,0.36,1) both',
        bubbleIn: 'bubbleIn 0.3s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
}
