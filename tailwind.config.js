/** @type {import('tailwindcss').Config} */

/* ==========================================================================
   R.O.I — RUN ON INVESTMENT · Identité « LA LIGNE »
   Les jetons de l'app sont ceux du site (assets/roi.css sur runoninvest.fr) :
   deux fonds — encre et craie —, un seul accent, l'orange impact ; Archivo
   variable en graisse fine et chasse étendue pour les titres, JetBrains Mono
   pour les labels, la nav, les boutons et la data. Aucun arrondi, aucune
   ombre portée, aucun dégradé décoratif : des filets, des aplats, de l'air.

   Les noms de jetons historiques de l'app (canvas, surface, fg, brand, gold,
   success…) sont conservés pour que les écrans n'aient pas à changer : ils
   pointent désormais tous dans la palette du site.
   ========================================================================== */

const CRAIE = '#EFEBE2'
const CRAIE_2 = '#E7E1D4'
const CRAIE_3 = '#D9D2C2'
const ENCRE = '#070707'
const ENCRE_2 = '#101010'
const IMPACT = '#FF4400'
const IMPACT_SOMBRE = '#C63500' // réservé aux tons foncés de l'échelle (800)
const MUTED = '#57534A' // texte atténué sur fond clair
const BETON = '#6B6558' // labels mono sur fond clair
const LIGNE = 'rgba(14,13,12,0.16)'
const LIGNE_FORTE = 'rgba(14,13,12,0.32)'

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    /* Aucun coin rond dans « La Ligne » : dossard, cadres, boutons, tout est
       à angle droit. On neutralise toute l'échelle, `rounded-full` compris
       (les pastilles deviennent des carrés, comme les puces ■ du site). */
    borderRadius: {
      none: '0', sm: '0', DEFAULT: '0', md: '0', lg: '0', xl: '0', '2xl': '0', '3xl': '0', full: '0',
    },
    extend: {
      colors: {
        /* Le site n'a ni blanc ni noir purs : la craie et l'encre les
           remplacent partout, y compris là où l'app disait `text-white`. */
        white: CRAIE,
        black: ENCRE,

        craie: { DEFAULT: CRAIE, 2: CRAIE_2, 3: CRAIE_3 },
        encre: { DEFAULT: ENCRE, 2: ENCRE_2 },
        impact: { DEFAULT: IMPACT, sombre: IMPACT_SOMBRE },

        canvas: CRAIE, // fond de l'app : la craie grainée
        surface: {
          DEFAULT: CRAIE, // les cartes sont des cadres sur le même papier
          soft: CRAIE_2, // tuiles internes / hover
          2: CRAIE_2, // inputs, pistes, labels
          3: ENCRE, // segment actif : encre sur craie
        },
        // Filets (hairlines) : l'encre diluée, comme --ligne-encre en section claire.
        line: { DEFAULT: LIGNE, strong: LIGNE_FORTE, craie: 'rgba(239,235,226,0.14)' },
        // Texte : encre pleine, puis les gris chauds du site.
        fg: { DEFAULT: ENCRE, soft: '#3A3731', muted: MUTED, faint: BETON },

        /* L'accent unique : l'orange impact, le même que le site sur les
           deux fonds (#FF4400 partout — le point AA sur fond clair est un
           choix de marque ouvert côté site, voir README). Les tons clairs de
           l'échelle sont des craies (pour les tuiles), le 900 l'encre. */
        brand: {
          50: CRAIE_2, 100: CRAIE_2, 200: CRAIE_3,
          300: '#FF7A45', 400: '#FF5C1F', 500: IMPACT,
          600: IMPACT, 700: IMPACT, 800: IMPACT_SOMBRE, 900: ENCRE,
          DEFAULT: IMPACT, dark: ENCRE, light: CRAIE_2,
        },
        ink: {
          50: CRAIE, 100: CRAIE_2, 200: CRAIE_3, 300: '#B0A99C', 400: '#8F897B',
          500: BETON, 600: MUTED, 700: '#3A3731', 800: '#1C1B18', 900: ENCRE_2, 950: ENCRE,
        },
        /* Pas de vert dans « La Ligne » (le site n'en a qu'un, le message
           « ok » d'un formulaire, porté par .form-msg.ok). Les états « fait »,
           « connecté », « confirmé » sont de l'encre sur craie. */
        success: { 300: CRAIE_3, DEFAULT: ENCRE, light: CRAIE_2, dark: ENCRE },
        // « J'aime », premium, récompense : tout passe par l'accent unique.
        like: { DEFAULT: IMPACT, light: CRAIE_2 },
        gold: { 300: '#FF7A45', DEFAULT: IMPACT, dark: IMPACT_SOMBRE, light: CRAIE_2 },
      },
      fontFamily: {
        display: ['"Archivo VF"', 'Archivo', 'system-ui', 'sans-serif'],
        sans: ['"Archivo VF"', 'Archivo', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      /* Pas d'ombre portée : une carte sans bordure reçoit un filet d'un
         pixel à la place, la seule ombre qui existe est celle du dossard. */
      boxShadow: {
        soft: `0 0 0 1px ${LIGNE}`,
        card: `0 0 0 1px ${LIGNE}`,
        float: 'none',
        brand: 'none',
        ring: 'none',
        dossard: '0 18px 40px rgba(0,0,0,.45)',
      },
      // Plus de halos ni de reflets : les fonds sont des aplats grainés.
      backgroundImage: {
        mesh: 'none',
        'hero-glow': 'none',
        aurora: 'none',
        'gold-sheen': 'none',
        damier: `repeating-conic-gradient(${CRAIE} 0% 25%, transparent 0% 50%) 0 0/14px 14px`,
        'damier-encre': `repeating-conic-gradient(${ENCRE} 0% 25%, transparent 0% 50%) 0 0/14px 14px`,
      },
      letterSpacing: {
        mono: '.14em',
        label: '.2em',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        screenIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        toastIn: {
          '0%': { opacity: '0', transform: 'translate(-50%, 16px)' },
          '100%': { opacity: '1', transform: 'translate(-50%, 0)' },
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
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        bubbleIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
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
