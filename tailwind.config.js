/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ----------------------------------------------------------------
        // Identité « exécutive » : bleu encre profond (navy) + neutres frais +
        // or champagne en accent premium. Sobre et jamais flashy, mais plus
        // clair, chaleureux et raffiné qu'un pur graphite. Surfaces empilées :
        // canvas < surface-soft < surface (cartes) < 2/3.
        // Tokens sémantiques → l'app peut basculer thème sans changer le code.
        // ----------------------------------------------------------------
        canvas: '#F4F6FA', // fond de l'app (gris bleuté très clair)
        surface: {
          DEFAULT: '#FFFFFF', // cartes
          soft: '#EDF0F6', // tuiles internes / hover / fonds discrets
          2: '#E5E9F1', // inputs, pistes, pills
          3: '#FFFFFF', // segment actif (pill blanche sur piste claire)
        },
        // Filets (hairlines) : bleu encre très dilué, net et discret.
        line: {
          DEFAULT: 'rgba(20,33,61,0.10)',
          strong: 'rgba(20,33,61,0.16)',
        },
        // Texte : quasi-noir à très légère âme bleutée, du plus contrasté au plus discret.
        fg: {
          DEFAULT: '#1A1F2B', // primaire, quasi-noir bleuté
          soft: '#3A4151', // secondaire
          muted: '#697086', // tertiaire
          faint: '#9AA1B2', // quaternaire (icônes / placeholders)
        },

        // Accent principal : bleu encre profond (navy). Élégant, sérieux,
        // jamais vif — boutons & états actifs. L'or champagne reste l'accent
        // premium ; ensemble navy + or = un duo « exécutif » haut de gamme.
        brand: {
          50: '#EDF1F8',
          100: '#DCE3F0',
          200: '#B7C4DE',
          300: '#8493B6',
          400: '#465579',
          500: '#243352',
          600: '#1D2A45',
          700: '#162036',
          800: '#101829',
          900: '#0A1019',
          DEFAULT: '#243352',
          dark: '#101829',
          light: '#EDF1F8',
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
        // Halo bleu encre très discret en arrière-plan (desktop).
        mesh:
          'radial-gradient(60% 50% at 12% 0%, rgba(20,33,61,0.06) 0%, rgba(20,33,61,0) 60%), radial-gradient(55% 55% at 92% 100%, rgba(20,33,61,0.05) 0%, rgba(20,33,61,0) 60%)',
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
