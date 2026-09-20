/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Palette Material 3 des maquettes, réduite aux tokens réellement
        // utilisés. `primary` tranche la divergence relevée entre écrans
        // (#F07E00 sur l'accueil, #934b00 ailleurs) : voir DIVERGENCES.md.
        primary: '#F07E00',
        'primary-dark': '#934b00',
        'primary-container': '#f07e00',
        'primary-fixed': '#ffdcc5',
        'on-primary': '#ffffff',
        'on-primary-container': '#542800',

        secondary: '#675d4f',
        'secondary-container': '#ecdecc',
        'on-secondary': '#ffffff',

        tertiary: '#006c49',
        'tertiary-container': '#00b27b',
        'on-tertiary': '#ffffff',

        background: '#fcf9f8',
        surface: '#fcf9f8',
        'surface-variant': '#e5e2e1',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f6f3f2',
        'surface-container': '#f0edec',
        'surface-container-high': '#ebe7e7',
        'on-surface': '#1c1b1b',
        'on-surface-variant': '#564335',

        outline: '#8a7263',
        'outline-variant': '#ddc1af',

        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
      },
      fontFamily: {
        // Une seule famille : les 12 alias générés par Stitch pointaient
        // tous vers Plus Jakarta Sans.
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Chaque échelon porte sa graisse et son interlettrage : une seule
        // classe (`text-headline-md`) suffit à poser un niveau typographique.
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
      },
      borderRadius: {
        card: '22px',
        'card-lg': '26px',
      },
      boxShadow: {
        // Les trois ombres du glassmorphism des maquettes, nommées pour
        // éviter de recopier des valeurs arbitraires dans chaque composant.
        glass: '0 6px 24px 0 rgb(20 20 20 / 0.04)',
        'glass-lg': '0 12px 32px 0 rgb(20 20 20 / 0.06)',
        nav: '0 16px 36px -6px rgb(20 20 20 / 0.12), 0 6px 16px -3px rgb(20 20 20 / 0.05)',
        sheet: '0 -8px 30px rgb(0 0 0 / 0.08)',
      },
    },
  },
  plugins: [],
}
