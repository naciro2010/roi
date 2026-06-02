/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ----------------------------------------------------------------
        // Identité inspirée de Strava : l'orange « Strava » (#FC4C02) comme
        // signal d'action et de marque, posé sur des neutres froids très clairs
        // (presque blancs) pour que les cartes ressortent et que les données
        // respirent. Surfaces empilées : canvas < surface-soft < surface
        // (cartes) < 2/3. Tokens sémantiques → l'app peut rethémer sans toucher
        // au code des écrans.
        // ----------------------------------------------------------------
        canvas: '#F2F2F4', // fond de l'app (gris froid très clair, presque blanc)
        surface: {
          DEFAULT: '#FFFFFF', // cartes
          soft: '#F2F2F4', // tuiles internes / hover / fonds discrets
          2: '#E7E7EC', // inputs, pistes, pills
          3: '#FFFFFF', // segment actif (pill blanche sur piste claire)
        },
        // Filets (hairlines) : gris neutre dilué, net et discret.
        line: {
          DEFAULT: 'rgba(20,20,28,0.09)',
          strong: 'rgba(20,20,28,0.15)',
        },
        // Texte : quasi-noir neutre « Strava », du plus contrasté au plus discret.
        fg: {
          DEFAULT: '#242428', // primaire, quasi-noir neutre
          soft: '#46464E', // secondaire
          muted: '#6D6D78', // tertiaire
          faint: '#A0A0AB', // quaternaire (icônes / placeholders)
        },

        // Accent principal : l'orange Strava. Vif, énergique, sportif — boutons,
        // états actifs, kudos. C'est LE signal de marque. L'or reste un accent
        // « récompense / premium » discret (médailles, abonnement).
        brand: {
          50: '#FFF1EA',
          100: '#FFDDCC',
          200: '#FEB892',
          300: '#FD8E55',
          400: '#FC6826',
          500: '#FC4C02',
          600: '#E14302',
          700: '#B83602',
          800: '#8C2904',
          900: '#5C1B03',
          DEFAULT: '#FC4C02',
          dark: '#C23A02',
          light: '#FFF1EA',
        },
        // Conserve `ink` pour rares usages explicitement « papier sombre ».
        ink: {
          50: '#F4F4F6',
          100: '#E8E8EC',
          200: '#D0D0D8',
          300: '#ABABB6',
          400: '#83838F',
          500: '#62626D',
          600: '#48484F',
          700: '#34343A',
          800: '#1F1F24',
          900: '#141418',
          950: '#0B0B0E',
        },
        // Vert net = « validé / fait » (PR, inscription, palier débloqué) —
        // signal positif distinct de l'orange de marque.
        success: { 300: '#5BD39B', DEFAULT: '#1FA463', light: '#E1F5EC', dark: '#127045' },
        // Rose désaturé = « j'aime » sur les posts du fil (distinct du kudos sportif).
        like: { DEFAULT: '#C2596A', light: '#F8E8EA' },
        // Or = accent « récompense / premium / abonnement » (médailles, Pro).
        gold: { 300: '#E7C766', DEFAULT: '#C79A2E', dark: '#8A6A1C', light: '#FBF3DD' },
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
        // Ombre teintée orange sous les boutons/marque pour un relief « Strava ».
        brand: '0 10px 22px -12px rgba(252,76,2,0.55)',
        ring: '0 36px 80px -34px rgba(0,0,0,0.24)',
      },
      backgroundImage: {
        // Halo orange très discret en arrière-plan (desktop).
        mesh:
          'radial-gradient(60% 50% at 12% 0%, rgba(252,76,2,0.06) 0%, rgba(252,76,2,0) 60%), radial-gradient(55% 55% at 92% 100%, rgba(252,76,2,0.05) 0%, rgba(252,76,2,0) 60%)',
        // Lueur sur les cartes « héros » orange : top highlight + vignette chaude.
        'hero-glow':
          'radial-gradient(120% 90% at 82% -12%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 55%), radial-gradient(90% 80% at 0% 112%, rgba(120,30,0,0.30) 0%, rgba(120,30,0,0) 60%)',
        // Aurora : highlights chauds subtils sur l'orange de marque.
        aurora:
          'radial-gradient(70% 60% at 12% 2%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 60%), radial-gradient(60% 70% at 92% 6%, rgba(255,225,120,0.18) 0%, rgba(255,225,120,0) 58%), radial-gradient(80% 80% at 78% 112%, rgba(120,30,0,0.22) 0%, rgba(120,30,0,0) 60%)',
        // Filet doré très discret pour les surfaces « premium / médaille ».
        'gold-sheen':
          'linear-gradient(135deg, rgba(199,154,46,0.12) 0%, rgba(199,154,46,0) 42%), radial-gradient(60% 80% at 90% 0%, rgba(231,199,102,0.20) 0%, rgba(231,199,102,0) 60%)',
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
