/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ----------------------------------------------------------------
        // Thème clair façon Apple : neutre, sobre, haut de gamme.
        // Gris clair signature, texte quasi-noir, accent graphite/noir
        // (aucune couleur flashy). Surfaces empilées :
        // canvas < surface-soft < surface (cartes) < 2/3.
        // Tokens sémantiques → l'app peut basculer thème sans changer le code.
        // ----------------------------------------------------------------
        canvas: '#F5F5F7', // fond de l'app (gris clair Apple)
        surface: {
          DEFAULT: '#FFFFFF', // cartes
          soft: '#EFEFF2', // tuiles internes / hover / fonds discrets
          2: '#E8E8ED', // inputs, pistes, pills
          3: '#FFFFFF', // segment actif (pill blanche sur piste claire)
        },
        // Filets (hairlines) neutres translucides pour un rendu net et discret.
        line: {
          DEFAULT: 'rgba(0,0,0,0.08)',
          strong: 'rgba(0,0,0,0.14)',
        },
        // Texte : du plus contrasté au plus discret (neutres Apple).
        fg: {
          DEFAULT: '#1D1D1F', // primaire, quasi-noir
          soft: '#3A3A3C', // secondaire
          muted: '#6E6E73', // tertiaire
          faint: '#A1A1A6', // quaternaire (icônes / placeholders)
        },

        // Accent principal : graphite/noir. Monochrome sobre et premium —
        // boutons noirs élégants, jamais de couleur vive. L'or reste réservé
        // au « premium / Metal », en touche très discrète.
        brand: {
          50: '#F2F2F4',
          100: '#E4E4E7',
          200: '#C9C9CF',
          300: '#9A9AA2',
          400: '#5C5C63',
          500: '#1D1D1F',
          600: '#161617',
          700: '#0F0F10',
          800: '#0A0A0B',
          900: '#000000',
          DEFAULT: '#1D1D1F',
          dark: '#000000',
          light: '#F2F2F4',
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
        // Police système Apple (San Francisco) en priorité, Inter en repli.
        display: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', '"Inter Tight"', 'Inter', '"Segoe UI"', 'sans-serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"SF Pro Display"', 'Inter', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      // Rayons plus serrés et « architecturaux » : un rendu corporate/exécutif
      // (façon Linear/Stripe) plutôt que des cartes très arrondies « grand public ».
      borderRadius: {
        '2xl': '0.875rem',
        '3xl': '1.125rem',
      },
      boxShadow: {
        // Ombres retenues : profondeur discrète, rendu plat et professionnel.
        soft: '0 1px 2px rgba(0,0,0,0.04), 0 3px 10px rgba(0,0,0,0.04)',
        card: '0 1px 2px rgba(0,0,0,0.04), 0 10px 22px -16px rgba(0,0,0,0.12)',
        float: '0 16px 38px -20px rgba(0,0,0,0.20)',
        brand: '0 10px 24px -14px rgba(0,0,0,0.38)',
        ring: '0 36px 80px -34px rgba(0,0,0,0.24)',
      },
      backgroundImage: {
        // Halo neutre très discret derrière le « téléphone » (desktop).
        mesh:
          'radial-gradient(60% 50% at 12% 0%, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 60%), radial-gradient(55% 55% at 92% 100%, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0) 60%)',
        // Lueur sur les cartes « héros » graphite : top highlight + vignette douce.
        'hero-glow':
          'radial-gradient(120% 90% at 82% -12%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 55%), radial-gradient(90% 80% at 0% 112%, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0) 60%)',
        // Aurora : highlights blancs subtils sur graphite (rendu sobre, sans couleur).
        aurora:
          'radial-gradient(70% 60% at 12% 2%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 60%), radial-gradient(60% 70% at 92% 6%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 58%), radial-gradient(80% 80% at 78% 112%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 60%)',
        // Filet doré très discret pour les surfaces « premium / Metal ».
        'gold-sheen':
          'linear-gradient(135deg, rgba(184,144,47,0.10) 0%, rgba(184,144,47,0) 42%), radial-gradient(60% 80% at 90% 0%, rgba(224,198,109,0.18) 0%, rgba(224,198,109,0) 60%)',
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
        cardIn: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
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
        cardIn: 'cardIn 0.45s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
}
