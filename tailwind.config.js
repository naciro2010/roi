/** @type {import('tailwindcss').Config} */

/* ==========================================================================
   R.O.I — RUN ON INVESTMENT · L'app, refonte « simple, claire, fluide »
   Deux signaux d'identité seulement : le logotype R■O■I et l'orange #FF4400.
   Tout le reste est neutre et calme : fond craie partout, un seul bloc encre
   par écran, coins souples, Archivo en graisses normales, aucune ombre.

   Les noms de jetons historiques de l'app (canvas, surface, fg, brand, gold,
   success…) sont conservés pour que les écrans n'aient pas à changer : ils
   pointent désormais tous dans la palette de la refonte.
   ========================================================================== */

const CRAIE = '#EFEBE2' // fond de toutes les pages, nav, en-tête
const SURFACE = '#F7F5F0' // cartes, tuiles, champs, lignes de liste
const CRAIE_2 = '#E7E1D4' // sélecteur segmenté, boutons ronds secondaires
const CRAIE_3 = '#D9D2C2'
const ENCRE = '#131211' // texte principal, l'unique bloc plein par écran
const ENCRE_2 = '#2A2723' // corps de texte dans les cartes, bulles reçues
const IMPACT = '#FF4400'
const IMPACT_SOMBRE = '#C63500' // réservé aux tons foncés de l'échelle (800)
const MUTED = '#57534A' // descriptions, sous-titres
const BETON = '#6B6558' // méta, horodatage, chevrons, placeholders
const LIGNE = 'rgba(19,18,17,0.1)' // cartes, tuiles, champs
const SEPARATEUR = 'rgba(19,18,17,0.08)' // lignes de liste, bordure de nav
const LIGNE_FORTE = 'rgba(19,18,17,0.16)' // boutons secondaires à bordure

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    /* Des coins souples : 12 pour la nav, 16 pour les tuiles, 18 pour les
       cartes, 20–22 pour les blocs et les sheets, 999 pour tout ce qui est
       pilule (boutons, puces, champs, avatars). */
    borderRadius: {
      none: '0', sm: '10px', DEFAULT: '12px', md: '14px', lg: '16px',
      xl: '18px', '2xl': '20px', '3xl': '22px', full: '999px',
    },
    extend: {
      /* La bascule nav basse ↔ sidebar se fait à 1000 px. */
      screens: { lg: '1000px' },
      colors: {
        /* Ni blanc ni noir purs : la craie et l'encre les remplacent partout,
           y compris là où l'app disait `text-white`. */
        white: CRAIE,
        black: ENCRE,

        craie: { DEFAULT: CRAIE, 2: CRAIE_2, 3: CRAIE_3 },
        encre: { DEFAULT: ENCRE, 2: ENCRE_2 },
        impact: { DEFAULT: IMPACT, sombre: IMPACT_SOMBRE },

        canvas: CRAIE, // fond de l'app
        surface: {
          DEFAULT: SURFACE, // cartes, tuiles, champs
          soft: CRAIE_2, // segmenté, boutons ronds secondaires
          2: CRAIE_2,
          3: ENCRE, // segment actif plein
        },
        // Filets : l'encre très diluée sur la craie.
        line: { DEFAULT: LIGNE, soft: SEPARATEUR, strong: LIGNE_FORTE, craie: 'rgba(239,235,226,0.2)' },
        // Texte : encre pleine, puis les gris chauds.
        fg: { DEFAULT: ENCRE, soft: ENCRE_2, muted: MUTED, faint: BETON },
        // Le voile posé derrière les sheets.
        voile: 'rgba(19,18,17,0.45)',

        /* L'accent unique : l'orange impact. Les tons clairs de l'échelle
           sont des craies (pour les tuiles), le 900 l'encre. */
        brand: {
          50: CRAIE_2, 100: CRAIE_2, 200: CRAIE_3,
          300: '#FF7A45', 400: '#FF5C1F', 500: IMPACT,
          600: IMPACT, 700: IMPACT, 800: IMPACT_SOMBRE, 900: ENCRE,
          DEFAULT: IMPACT, dark: ENCRE, light: CRAIE_2,
        },
        ink: {
          50: CRAIE, 100: SURFACE, 200: CRAIE_2, 300: CRAIE_3, 400: '#8F897B',
          500: BETON, 600: MUTED, 700: ENCRE_2, 800: '#1C1B18', 900: ENCRE, 950: ENCRE,
        },
        /* Les états « fait », « connecté », « confirmé » sont de l'encre sur
           craie : l'orange reste le seul accent. */
        success: { 300: CRAIE_3, DEFAULT: ENCRE, light: CRAIE_2, dark: ENCRE },
        like: { DEFAULT: IMPACT, light: CRAIE_2 },
        gold: { 300: '#FF7A45', DEFAULT: IMPACT, dark: IMPACT_SOMBRE, light: CRAIE_2 },
      },
      /* Une seule famille : Archivo. JetBrains Mono n'est plus utilisée —
         l'alias `mono` reste pour que `font-mono` ne casse rien, il pointe
         sur Archivo. */
      fontFamily: {
        display: ['"Archivo VF"', 'Archivo', 'system-ui', 'sans-serif'],
        sans: ['"Archivo VF"', 'Archivo', 'system-ui', 'sans-serif'],
        mono: ['"Archivo VF"', 'Archivo', 'system-ui', 'sans-serif'],
      },
      /* Aucune ombre : la hiérarchie passe par la bordure et le fond. */
      boxShadow: {
        soft: 'none', card: 'none', float: 'none', brand: 'none', ring: 'none', dossard: 'none',
      },
      backgroundImage: {
        mesh: 'none',
        'hero-glow': 'none',
        aurora: 'none',
        'gold-sheen': 'none',
        damier: `repeating-conic-gradient(${CRAIE} 0% 25%, transparent 0% 50%) 0 0/14px 14px`,
        'damier-encre': `repeating-conic-gradient(${ENCRE} 0% 25%, transparent 0% 50%) 0 0/14px 14px`,
      },
      letterSpacing: {
        // Les capitales ne sont plus espacées qu'à peine : titres de section.
        mono: '.06em',
        label: '.08em',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        screenIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        toastIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        sheetUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drawerIn: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        popIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        bubbleIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        cardIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease both',
        screenIn: 'screenIn 0.2s ease both',
        toastIn: 'toastIn 0.18s ease both',
        // `sheetIn` garde son nom (les sheets existantes l'utilisent) et prend
        // la nouvelle courbe : 24 px de montée, 280 ms.
        sheetIn: 'sheetUp 0.28s cubic-bezier(0.22,1,0.36,1) both',
        sheetUp: 'sheetUp 0.28s cubic-bezier(0.22,1,0.36,1) both',
        drawerIn: 'drawerIn 0.28s cubic-bezier(0.22,1,0.36,1) both',
        popIn: 'popIn 0.18s ease both',
        bubbleIn: 'bubbleIn 0.2s ease both',
        cardIn: 'cardIn 0.2s ease both',
      },
    },
  },
  plugins: [],
}
