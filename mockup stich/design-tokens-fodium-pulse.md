---
name: Fodium Pulse
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0edec'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#564335'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#8a7263'
  outline-variant: '#ddc1af'
  surface-tint: '#934b00'
  primary: '#934b00'
  on-primary: '#ffffff'
  primary-container: '#f07e00'
  on-primary-container: '#542800'
  inverse-primary: '#ffb782'
  secondary: '#675d4f'
  on-secondary: '#ffffff'
  secondary-container: '#ecdecc'
  on-secondary-container: '#6b6153'
  tertiary: '#006c49'
  on-tertiary: '#ffffff'
  tertiary-container: '#00b27b'
  on-tertiary-container: '#003c27'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc5'
  primary-fixed-dim: '#ffb782'
  on-primary-fixed: '#301400'
  on-primary-fixed-variant: '#703800'
  secondary-fixed: '#efe0cf'
  secondary-fixed-dim: '#d2c4b4'
  on-secondary-fixed: '#211a10'
  on-secondary-fixed-variant: '#4e4539'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 38px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
  price-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '800'
    lineHeight: 24px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
The design system delivers an energetic, warm, and hyper-legible lifestyle experience tailored for urban Senegal (Dakar and beyond). Melding the editorial, poster-centric visual attitude of contemporary cultural ticketing platforms like DICE with frictionless local transit and event discovery, the aesthetic balances modern functional clarity with atmospheric warmth. 

The design direction is **Modern Clean Minimalist with Tactile Warmth**:
- **Poster-First Priority:** Visual culture leads. Artwork, festival imagery, and transport maps are presented uncompromised and uncluttered. Text never overlaps primary imagery.
- **Warm & Optimistic Modernity:** Deep near-black typography and crisp off-white containers sit against a sunlit, warm neutral canvas, enlivened by precise sparks of deep radiant saffron-orange.
- **Urban Utility:** Interfaces prioritize fast scanning in high-glare outdoor environments, clear bilingual (French/Wolof/English) phrasing, and transparent, upfront pricing ("frais inclus") without hidden fees.

## Colors
The color architecture relies on strict semantic discipline to maintain a calm, premium surface while directing immediate attention to transactional actions and live states.

### Core Palette
- **Primary Accent (`#F07E00`):** Reserved exclusively for high-intent moments—primary CTA buttons, active tab indicators, ticket admission prices, live tracking statuses, and urgent confirmations.
- **Secondary Soft Accent (`#FFF0DE`):** Warm tinted peach utilized as the surface fill for active category chips, highlight tags, notification badges, and tonal secondary selections.
- **Tertiary Success (`#10B981`):** Applied to confirmed bookings, validated transit tickets, verified venue checkmarks, and real-time transit readiness.
- **Text Primary (`#141414`):** High-contrast, deep near-black for expressive editorial titles, body copy, and prominent figures.
- **Text Secondary (`#6B7280`):** Balanced neutral for venue meta-information, dates, timestamps, and transit line itineraries.
- **Text Muted (`#9CA3AF`):** Subdued grey for helper annotations, disabled states, and placeholder labels.
- **Surface Canvas (`#F6F7FB`):** Soft, cool-warm atmospheric base that makes white cards visually float without heavy drop shadows.
- **Surface Cards (`#FFFFFF`):** Pure white container surfaces framing poster visuals and structured transaction cards.
- **Borders & Dividers (`#ECEEF2`):** Ultra-subtle separations used sparingly when background contrast alone is insufficient.

## Typography
Plus Jakarta Sans drives the typographic rhythm across all interfaces. Its geometric construction conveys modern tech efficiency, while subtle humanist nuances introduce friendliness and character.

- **Weight Distribution:** Heavy contrast is intentional. Headings rely on 700 (Bold) and 800 (ExtraBold) weights with tight negative tracking to replicate the impact of concert and cultural festival posters. Body text remains at 400 and 500 for rapid scanning.
- **Price Treatments:** Ticket prices and transit fares (`price-display`) must always render in 800 weight using `#F07E00`, paired immediately with lowercase muted indicators for fee inclusion (e.g., `5.000 FCFA` + `frais inclus` in `body-sm`).
- **Data Densities:** Event metadata (Dates, Venues, Commute durations) leverages `label-md` uppercase or title case to build clear informational hierarchy below poster graphics.

## Layout & Spacing
The layout follows a mobile-first, fluid grid designed for touch-first navigation and glanceable consumption on high-density mobile screens.

- **Mobile Rhythm (360px - 599px):** 4-column layout with 16px (`1rem`) outer canvas margins and 16px gutters. Poster cards span full container width, maximizing edge-to-edge graphical impact.
- **Tablet Reflow (600px - 1023px):** 8-column layout with 32px (`2rem`) margins. Event and transit cards switch into a balanced 2-column masonry or symmetrical grid.
- **Desktop System (1024px+):** 12-column layout maxing out at 1280px total width with 48px (`3rem`) margins and 24px gutters. Detail views adapt into an asymmetrical 7:5 ratio (poster media left, purchase and transit schedule sticky right).
- **Component Padding Scale:** 
  - `space-xs` (4px): Micro gaps between icons and adjacent labels.
  - `space-sm` (8px): Badge inner padding, category chip vertical spacing.
  - `space-md` (16px): Standard internal card padding below artwork; input field padding.
  - `space-lg` (24px): Vertical spacing between independent component groupings and detail view sections.
  - `space-xl` (32px): Structural separation between major screen modules and hero showcases.

## Elevation & Depth
Depth is built on ambient, natural luminosity rather than mechanical dropshadows. Surfaces float softly above the `#F6F7FB` backdrop, creating clear physical hierarchy without harsh outlines.

- **Level 0 (Canvas Base):** `#F6F7FB` flat base. No shadow.
- **Level 1 (Event Cards & Modules):** Pure `#FFFFFF` surface accompanied by a diffused ambient shadow: `0 4px 20px -2px rgba(20, 20, 20, 0.04), 0 2px 6px -1px rgba(20, 20, 20, 0.02)`. Optional hairline perimeter stroke in `#ECEEF2` to preserve edge definition against bright ambient sunlight.
- **Level 2 (Popovers, Sticky Bar, Dropdowns):** `#FFFFFF` surface with elevated ambient dispersion: `0 10px 25px -4px rgba(20, 20, 20, 0.06), 0 4px 10px -2px rgba(20, 20, 20, 0.03)`.
- **Level 3 (Floating Pill Navigation Bar):** High-prominence ambient float: `0 14px 34px -4px rgba(20, 20, 20, 0.12), 0 6px 12px -3px rgba(20, 20, 20, 0.04)`. Translucent blur: When supported, white backdrops use `rgba(255, 255, 255, 0.92)` combined with `backdrop-filter: blur(12px)`.
- **Level 4 (Modal Drawers & Checkout Bottom Sheets):** Deep scrim overlay `rgba(20, 20, 20, 0.48)` behind solid `#FFFFFF` drawers elevated with `0 -8px 32px rgba(20, 20, 20, 0.1)`.

## Shapes
The design uses an expressive, rounded visual vocabulary that mirrors the tactile smoothness of physical tokens, tickets, and rounded transit cards.

- **Standard Cards & Containers:** Standardized at 20px to 24px (`rounded-xl` to custom 24px). Poster graphics nested at the top of cards precisely follow the parent container's upper corner radii (20-24px), transitioning into squared seams at the metadata boundary.
- **Pills, Interactive Chips, and CTAs:** Fully rounded pill shapes (`border-radius: 9999px`) used for all primary actions, category filters, status chips, and the floating navigation dock.
- **Input Fields & Search Elements:** Curated at 16px (`rounded-lg`) to 9999px (search bars) for comfortable tap targets.
- **Dividers & Micro Elements:** Avatar frames, transit route bullets, and step indicators retain consistent circular geometry (`9999px`).

## Components

### 1. Buttons & CTAs
- **Primary Button:** Full pill shape (`border-radius: 9999px`), solid `#F07E00` fill, white `#FFFFFF` text in `label-lg`. Height 52px for primary touch safety. Subtle downward scale on active tap (`transform: scale(0.98)`).
- **Secondary / Soft Button:** Pill shape, `#FFF0DE` background with `#F07E00` text in `label-lg`. No border.
- **Tertiary / Outlined:** Pill shape, transparent background, 1px `#ECEEF2` border, `#141414` text.

### 2. Poster-First Event Cards
- **Structure:** Solid `#FFFFFF` container with 20px or 24px rounded corners and Level 1 ambient elevation.
- **Image Header:** High-aspect-ratio poster image (16:9, 4:3, or 1:1) docked flush along top, left, and right borders. Imagery is completely unobstructed: zero text overlays, gradients, or floating tags on the image canvas itself.
- **Content Block:** Positioned below the media with 16px internal padding.
  - Line 1: Date & Time in `label-sm` (`#F07E00`), accompanied by dot separator and Venue name in `label-sm` (`#6B7280`).
  - Line 2: Event Title in `headline-sm` (`#141414`), clamped to 2 lines.
  - Line 3: Footer row displaying category tag in `#FFF0DE` pill badge, and right-aligned price in `price-display` (`#F07E00`) with adjacent `body-sm` (`#6B7280`) note: "frais inclus".

### 3. Floating Bottom Pill Navigation Bar
- **Form Factor:** Detached pill docked 16px above screen bottom margin, centered with 90-94% screen width (max 420px).
- **Visual Spec:** Height 64px, `border-radius: 9999px`, background `rgba(255, 255, 255, 0.94)` with `backdrop-filter: blur(16px)` and Level 3 ambient shadow. 
- **Tab Items:** 4 distinct destinations (Découvrir, Billets, Trajets, Profil). Inactive icons render in `#6B7280`. Active tab displays an `#F07E00` icon nestled within an animated `#FFF0DE` circular pill ground.

### 4. Chips & Category Filters
- **Default State:** Pill shape, `#FFFFFF` background with a hairline 1px `#ECEEF2` border, `#141414` label in `label-md`.
- **Active State:** Fill transforms to `#FFF0DE`, border transitions to transparent, typography switches to `#F07E00` in `label-md` weight.

### 5. Input Fields & Search
- **Search Bar:** Height 48px, fully pill-shaped (`9999px`), background `#FFFFFF`, subtle 1px `#ECEEF2` border, leading search icon in `#9CA3AF`. Placeholder text in `body-md` (`#9CA3AF`).
- **Form Inputs:** 16px radius, 52px height, `#FFFFFF` background. Floating labels in `label-sm` (`#6B7280`). Focus state highlights border with a crisp 1.5px `#F07E00` ring without heavy outer glow.

### 6. Transit & Shuttle Route Cards
- **Structure:** Level 1 elevation, `#FFFFFF` surface, 20px radius.
- **Content:** Origin-to-destination progression linked via a vertical or horizontal `#F07E00` dotted milestone line. Real-time bus/TER status marked with `#10B981` ("À l'heure / En direct") pill badge. Fares rendered distinctly in `#F07E00`.

### 7. Digital Ticket Pass (QR Vault)
- **Top Section:** Event poster banner paired with event title and seat/tier classification.
- **Center Divider:** Notched cutout circles on both card edges connected by a dashed `#ECEEF2` tear-line.
- **Bottom Section:** High-contrast QR code centered over pure white, followed by a dynamic anti-fraud live-time counter in `#10B981` and Apple/Google Wallet integration pills.