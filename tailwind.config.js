/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ----------------------------------------------------------------
        // Thème clair façon Revolut : fond net et froid, surfaces empilées,
        // accent bleu électrique / indigo vibrant (jamais d'à-plat sombre).
        // Surfaces empilées : canvas < surface-soft < surface (cartes) < 2/3.
        // Tokens sémantiques → l'app peut basculer thème sans changer le code.
        // ----------------------------------------------------------------
        canvas: '#F4F6FD', // fond de l'app (off-white froid, légèrement bleuté)
        surface: {
          DEFAULT: '#FFFFFF', // cartes
          soft: '#EEF1FB', // tuiles internes / hover / fonds discrets
          2: '#E4E9F6', // inputs, pistes, pills
          3: '#FFFFFF', // segment actif (pill blanche sur piste claire)
        },
        // Filets (hairlines) translucides froids pour un rendu net.
        line: {
          DEFAULT: 'rgba(17,24,52,0.08)',
          strong: 'rgba(17,24,52,0.14)',
        },
        // Texte : du plus contrasté au plus discret (navy froid).
        fg: {
          DEFAULT: '#0B1020', // primaire, navy presque noir
          soft: '#2A3147', // secondaire
          muted: '#5C6479', // tertiaire
          faint: '#8B93AB', // quaternaire (icônes / placeholders)
        },

        // Accent principal : bleu électrique / indigo (signature Revolut clair).
        // L'or champagne reste réservé au « premium / Metal ».
        brand: {
          50: '#ECF0FF',
          100: '#DCE3FF',
          200: '#BBC8FF',
          300: '#93A6FF',
          400: '#6680FF',
          500: '#3B5BFF',
          600: '#2742F0',
          700: '#1D33C7',
          800: '#172796',
          900: '#111D6B',
          DEFAULT: '#3B5BFF',
          dark: '#1D33C7',
          light: '#ECF0FF',
        },
        // Conserve `ink` pour rares usages explicitement « papier sombre ».
        ink: {
          50: '#F2F4F8',
          100: '#E5E8F0',
          200: '#CCD1DE',
          300: '#A8AFC2',
          400: '#7C849A',
          500: '#5F6678',
          600: '#454A5C',
          700: '#323847',
          800: '#1F2432',
          900: '#10141F',
          950: '#0A0D14',
        },
        // Vert sobre = « validé / fait ».
        success: { 300: '#6FCC9A', DEFAULT: '#2E7D5A', light: '#E6F3EC', dark: '#1B5C42' },
        // Rose désaturé = « j'aime » (kudos likés).
        like: { DEFAULT: '#C2596A', light: '#F8E8EA' },
        // Or champagne = accent « premium / abonnement ».
        gold: { 300: '#E0C66D', DEFAULT: '#B8902F', dark: '#7A5E1F', light: '#FBF3DD' },
      },
      fontFamily: {
        display: ['"Inter Tight"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(17,24,52,0.04), 0 4px 14px rgba(17,24,52,0.06)',
        card: '0 1px 2px rgba(17,24,52,0.05), 0 12px 28px -14px rgba(17,24,52,0.16)',
        float: '0 22px 50px -22px rgba(17,24,52,0.26)',
        brand: '0 12px 30px -10px rgba(59,91,255,0.45)',
        ring: '0 40px 90px -30px rgba(17,24,52,0.32)',
      },
      backgroundImage: {
        // Halo discret derrière le « téléphone » (desktop) : ambient bleu/violet.
        mesh:
          'radial-gradient(60% 50% at 12% 0%, rgba(59,91,255,0.12) 0%, rgba(59,91,255,0) 60%), radial-gradient(55% 55% at 92% 100%, rgba(138,85,255,0.10) 0%, rgba(138,85,255,0) 60%)',
        // Lueur sur les cartes « héros » bleu/violet : top highlight + vignette douce.
        'hero-glow':
          'radial-gradient(120% 90% at 82% -12%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 55%), radial-gradient(90% 80% at 0% 112%, rgba(8,12,40,0.20) 0%, rgba(8,12,40,0) 60%)',
        // Aurora : highlight blanc + pop cyan électrique (carte façon Revolut).
        aurora:
          'radial-gradient(70% 60% at 12% 2%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 60%), radial-gradient(60% 70% at 92% 6%, rgba(0,224,255,0.26) 0%, rgba(0,224,255,0) 58%), radial-gradient(80% 80% at 78% 112%, rgba(168,120,255,0.22) 0%, rgba(168,120,255,0) 60%)',
        // Filet doré discret pour les surfaces « premium / Metal ».
        'gold-sheen':
          'linear-gradient(135deg, rgba(184,144,47,0.12) 0%, rgba(184,144,47,0) 42%), radial-gradient(60% 80% at 90% 0%, rgba(224,198,109,0.22) 0%, rgba(224,198,109,0) 60%)',
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
