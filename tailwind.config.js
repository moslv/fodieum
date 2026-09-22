/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Palette Material 3 des maquettes, réduite aux tokens réellement
        // utilisés. Chaque teinte est une variable CSS définie deux fois dans
        // `styles/index.css` : une bascule de `.dark` rhabille l'application
        // entière, sans qu'un seul composant ait à porter une variante `dark:`.
        primary: 'rgb(var(--primary) / <alpha-value>)',
        'primary-dark': 'rgb(var(--primary-dark) / <alpha-value>)',
        'primary-container': 'rgb(var(--primary-container) / <alpha-value>)',
        'primary-fixed': 'rgb(var(--primary-fixed) / <alpha-value>)',
        'on-primary': 'rgb(var(--on-primary) / <alpha-value>)',
        'on-primary-container': 'rgb(var(--on-primary-container) / <alpha-value>)',

        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        'secondary-container': 'rgb(var(--secondary-container) / <alpha-value>)',
        'on-secondary': 'rgb(var(--on-secondary) / <alpha-value>)',

        tertiary: 'rgb(var(--tertiary) / <alpha-value>)',
        'tertiary-container': 'rgb(var(--tertiary-container) / <alpha-value>)',
        'on-tertiary': 'rgb(var(--on-tertiary) / <alpha-value>)',

        background: 'rgb(var(--background) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-variant': 'rgb(var(--surface-variant) / <alpha-value>)',
        'surface-container-lowest': 'rgb(var(--surface-container-lowest) / <alpha-value>)',
        'surface-container-low': 'rgb(var(--surface-container-low) / <alpha-value>)',
        'surface-container': 'rgb(var(--surface-container) / <alpha-value>)',
        'surface-container-high': 'rgb(var(--surface-container-high) / <alpha-value>)',
        'on-surface': 'rgb(var(--on-surface) / <alpha-value>)',
        'on-surface-variant': 'rgb(var(--on-surface-variant) / <alpha-value>)',

        outline: 'rgb(var(--outline) / <alpha-value>)',
        'outline-variant': 'rgb(var(--outline-variant) / <alpha-value>)',

        error: 'rgb(var(--error) / <alpha-value>)',
        'error-container': 'rgb(var(--error-container) / <alpha-value>)',
        'on-error': 'rgb(var(--on-error) / <alpha-value>)',

        // Deux filets dont l'opacité doit changer avec le thème : un trait noir
        // à 6 % disparaît sur fond sombre. Ils portent donc leur alpha dans la
        // variable, et ne se modulent pas au point d'usage.
        hairline: 'var(--hairline)',
        tear: 'var(--tear)',
      },
      fontFamily: {
        // Les 12 alias générés par Stitch pointaient tous vers Plus Jakarta
        // Sans : elle reste la famille de toute l'interface.
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'ui-monospace', 'monospace'],
        // Réservée au cri d'accueil, et à rien d'autre : une display aussi
        // marquée s'use vite si on la met partout.
        display: ['Unbounded', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Chaque échelon porte sa graisse et son interlettrage : une seule
        // classe (`text-headline-md`) suffit à poser un niveau typographique.
        // Unbounded est large de nature : l'interlettrage ne se resserre pas
        // comme sur Plus Jakarta Sans, et la taille descend d'un cran.
        hero: ['28px', { lineHeight: '34px', letterSpacing: '-0.01em', fontWeight: '800' }],
        'hero-lg': ['42px', { lineHeight: '50px', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-lg': ['40px', { lineHeight: '48px', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-md': ['32px', { lineHeight: '38px', letterSpacing: '-0.025em', fontWeight: '800' }],
        'headline-lg': ['28px', { lineHeight: '34px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-md': ['22px', { lineHeight: '28px', letterSpacing: '-0.015em', fontWeight: '700' }],
        'headline-sm': ['18px', { lineHeight: '24px', letterSpacing: '-0.01em', fontWeight: '700' }],
        price: ['20px', { lineHeight: '24px', letterSpacing: '-0.02em', fontWeight: '800' }],
        'body-lg': ['16px', { lineHeight: '24px', letterSpacing: '-0.005em', fontWeight: '500' }],
        'body-md': ['14px', { lineHeight: '20px', letterSpacing: '0em', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.01em', fontWeight: '400' }],
        'label-lg': ['15px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '700' }],
        'label-md': ['13px', { lineHeight: '18px', letterSpacing: '0.02em', fontWeight: '600' }],
        'label-sm': ['11px', { lineHeight: '14px', letterSpacing: '0.04em', fontWeight: '700' }],
        // Échelons du billet : intitulés poinçonnés, valeurs en machine à écrire.
        'stub-label': ['9px', { lineHeight: '12px', letterSpacing: '0.18em', fontWeight: '700' }],
        'stub-value': ['14px', { lineHeight: '18px', letterSpacing: '0.01em', fontWeight: '700' }],
        // Titre du billet : en capitales, l'interlettrage doit redevenir positif.
        'ticket-title': ['21px', { lineHeight: '23px', letterSpacing: '0.005em', fontWeight: '800' }],
      },
      borderRadius: {
        card: '18px',
        'card-lg': '22px',
        // Un billet n'est pas une carte : ses angles sont ceux de l'icône
        // « Événements », à peine adoucis.
        ticket: '8px',
      },
      keyframes: {
        // Le badge « bientôt » est la seule animation imposée par le brief :
        // un reflet qui balaie la pastille, doublé d'un halo qui respire.
        shimmer: {
          '0%': { transform: 'translateX(-140%) skewX(-20deg)' },
          '55%, 100%': { transform: 'translateX(260%) skewX(-20deg)' },
        },
        halo: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgb(240 126 0 / 0.45)' },
          '50%': { boxShadow: '0 0 0 5px rgb(240 126 0 / 0)' },
        },
        'float-in': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        shimmer: 'shimmer 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        halo: 'halo 2.6s ease-out infinite',
        'float-in': 'float-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      boxShadow: {
        // Les trois ombres du glassmorphism des maquettes, nommées pour
        // éviter de recopier des valeurs arbitraires dans chaque composant.
        // Elles s'assombrissent avec le thème : une ombre à 4 % ne se voit pas
        // sur un fond sombre.
        glass: '0 6px 24px 0 var(--shadow-soft)',
        'glass-lg': '0 12px 32px 0 var(--shadow-medium)',
        nav: '0 16px 36px -6px var(--shadow-strong), 0 6px 16px -3px var(--shadow-soft)',
        sheet: '0 -8px 30px var(--shadow-medium)',
      },
    },
  },
  plugins: [],
}
