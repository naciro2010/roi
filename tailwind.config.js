/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ----------------------------------------------------------------
        // Identité chromatique MONOCHROME, minimaliste & clean (façon
        // Vercel·Linear-mono·Apple) : pas de teinte d'accent colorée — le
        // signal d'action est un graphite quasi-noir, posé sur des gris froids
        // neutres (zinc) et des surfaces blanches, avec beaucoup d'air. Les
        // seules couleurs sont réservées aux ÉTATS (vert succès, rouge erreur)
        // et au premium (or discret). Surfaces empilées :
        // canvas < surface-soft < surface (cartes) < 2/3. Tokens sémantiques →
        // l'app peut rethémer sans toucher au code des écrans.
        // ----------------------------------------------------------------
        canvas: '#F4F4F5', // fond de l'app (gris froid neutre, zinc-100)
        surface: {
          DEFAULT: '#FFFFFF', // cartes
          soft: '#F4F4F5', // tuiles internes / hover / fonds discrets
          2: '#E4E4E7', // inputs, pistes, pills (zinc-200)
          3: '#FFFFFF', // segment actif (pill blanche sur piste claire)
        },
        // Filets (hairlines) : gris neutre dilué, net et discret.
        line: {
          DEFAULT: 'rgba(0,0,0,0.08)',
          strong: 'rgba(0,0,0,0.15)',
        },
        // Texte : noir ardoise (zinc), du plus contrasté au plus discret.
        fg: {
          DEFAULT: '#18181B', // primaire, quasi-noir (zinc-900)
          soft: '#3F3F46', // secondaire (zinc-700)
          muted: '#71717A', // tertiaire (zinc-500)
          faint: '#A1A1AA', // quaternaire (icônes / placeholders, zinc-400)
        },

        // Accent principal = MONOCHROME graphite (zinc). Aucune couleur :
        // boutons, états actifs, liens, jauges et onglet actif sont rendus en
        // noir/graphite pour un look minimal et clean. L'échelle est volontairement
        // « foncée » (500-700 quasi-noirs) pour rester contrastée et nette ;
        // 50-200 servent de tuiles claires neutres.
        brand: {
          50: '#F4F4F5',
          100: '#E4E4E7',
          200: '#D4D4D8',
          300: '#A1A1AA',
          400: '#52525B',
          500: '#27272A',
          600: '#1C1C1F',
          700: '#18181B',
          800: '#111113',
          900: '#09090B',
          DEFAULT: '#18181B',
          dark: '#09090B',
          light: '#F4F4F5',
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
        // Ombre neutre (graphite) sous les boutons/marque : relief discret, sans teinte.
        brand: '0 10px 22px -14px rgba(0,0,0,0.40)',
        ring: '0 36px 80px -34px rgba(0,0,0,0.24)',
      },
      backgroundImage: {
        // Halo neutre quasi imperceptible en arrière-plan (desktop) — sobre, sans teinte.
        mesh:
          'radial-gradient(60% 50% at 12% 0%, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0) 60%), radial-gradient(55% 55% at 92% 100%, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0) 60%)',
        // Lueur sur les cartes « héros » graphite : top highlight clair + vignette noire.
        'hero-glow':
          'radial-gradient(120% 90% at 82% -12%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 55%), radial-gradient(90% 80% at 0% 112%, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0) 60%)',
        // Aurora : highlights neutres (clair) + vignette noire sur le graphite de marque.
        aurora:
          'radial-gradient(70% 60% at 12% 2%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%), radial-gradient(60% 70% at 92% 6%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 58%), radial-gradient(80% 80% at 78% 112%, rgba(0,0,0,0.26) 0%, rgba(0,0,0,0) 60%)',
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
