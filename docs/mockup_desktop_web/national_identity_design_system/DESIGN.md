---
name: National Identity Design System
colors:
  surface: '#fff8f7'
  surface-dim: '#f0d4d0'
  surface-bright: '#fff8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0ef'
  surface-container: '#ffe9e6'
  surface-container-high: '#ffe2de'
  surface-container-highest: '#f9dcd9'
  on-surface: '#271816'
  on-surface-variant: '#5b403d'
  inverse-surface: '#3e2c2a'
  inverse-on-surface: '#ffedea'
  outline: '#8f706c'
  outline-variant: '#e4beba'
  surface-tint: '#b91d20'
  primary: '#a20513'
  on-primary: '#ffffff'
  primary-container: '#c62828'
  on-primary-container: '#ffe0dd'
  inverse-primary: '#ffb4ac'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e1dfdf'
  on-secondary-container: '#636262'
  tertiary: '#00557a'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e9d'
  on-tertiary-container: '#d1eaff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ac'
  on-primary-fixed: '#410003'
  on-primary-fixed-variant: '#93000e'
  secondary-fixed: '#e4e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#c8e6ff'
  tertiary-fixed-dim: '#88ceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#fff8f7'
  on-background: '#271816'
  surface-variant: '#f9dcd9'
typography:
  display-lg:
    fontFamily: Public Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.1px
  label-md:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  container-max: 1120px
  gutter: 24px
---

## Brand & Style

The brand personality of the design system is authoritative, patriotic, and accessible. It is designed to evoke a sense of national pride and institutional stability while remaining modern and easy to navigate for citizens of all ages. The design style follows a **Corporate / Modern** approach, drawing heavily from Material Design 3 principles to ensure functional clarity. It balances the weight of constitutional law with the lightness of modern digital interfaces through generous whitespace and a structured information hierarchy.

## Colors

The palette is rooted in the Indonesian national colors. The primary **Merah Tua** (#C62828) is used for high-impact elements like headers and primary actions, symbolizing strength and resolve. The **Abu-abu Gelap** (#5D5D5D) provides a neutral anchor for secondary UI elements and metadata.

Accent colors are applied sparingly to highlight specific states or critical information: **Kuning Emas** (#FFB300) is reserved for honorary highlights or search result matches, while **Orange** (#E64A19) is used for interactive warnings or secondary highlights. The background utilizes a crisp white for the main content area to maximize readability, with a soft grey secondary background to define structural boundaries.

## Typography

The design system utilizes **Public Sans**, an institutional typeface that offers exceptional clarity and a neutral, official tone. This choice ensures that constitutional text is legible across all devices. 

Hierarchy is established through weight and scale rather than decorative shifts. Headlines use semi-bold and bold weights to provide structural landmarks, while the body text uses a slightly increased line height (1.5x) to facilitate long-form reading of legal articles. Uppercase styling is reserved exclusively for small labels or subsection headers to maintain a formal, organized appearance.

## Layout & Spacing

The layout follows a **Fixed Grid** model for desktop to ensure that reading widths remain comfortable (optimally between 600px and 800px for the primary text column). A 12-column grid is utilized for the general interface, with content cards typically spanning 8 columns to allow for a secondary navigation or table of contents sidebar.

The spacing rhythm is based on a **8px linear scale**. Margins and gutters are standardized to 24px on desktop and 16px on mobile. Vertical rhythm is strictly enforced between clauses and articles to help users distinguish between different sections of the law visually.

## Elevation & Depth

Visual hierarchy in this design system is achieved through **Tonal Layers** and **Ambient Shadows**. Surfaces are categorized into three levels of depth:

1.  **Level 0 (Floor):** The secondary background (#F2F2F2), used for the application canvas.
2.  **Level 1 (Cards):** White surfaces (#FFFFFF) with a very soft, diffused shadow (4px blur, 4% opacity) and a 1px neutral border. These hold the primary content.
3.  **Level 2 (Active/Sticky):** Navigation elements and sticky headers that use a slightly more pronounced shadow (8px blur, 8% opacity) to indicate they float above the content during scroll.

Interactive elements like buttons use a subtle lift on hover, increasing the shadow intensity rather than changing the base color drastically.

## Shapes

The design system adopts a **Rounded** shape language to soften the institutional nature of the content. A standard radius of **8px (0.5rem)** is applied to all content cards, input fields, and buttons. Larger components, such as modals or bottom sheets, may utilize a 16px radius to emphasize their role as containers. This consistent rounding ensures the interface feels approachable and modern while adhering to Material Design standards.

## Components

### High-Contrast Headers
The main application header uses the Primary Merah Tua (#C62828) as a background with White text. It must include the national emblem (Garuda) at a fixed height to establish immediate context.

### Sticky Navigation Tabs
Navigation tabs for switching between the Preamble, Articles, and Amendments must remain sticky at the top of the viewport. They use a white background with a primary color bottom-border (3px) to indicate the active state.

### Content Cards
Constitutional text is housed in cards with an 8px border radius. Each card features:
- **Header:** Title (e.g., "Pasal 1") in Headline-md.
- **Body:** Numbered verses in Body-lg.
- **Footer:** Metadata or cross-reference links in Label-md.

### Buttons & Inputs
- **Primary Button:** Solid Merah Tua with white text, 8px radius.
- **Search Input:** Secondary background (#F2F2F2) with a 1px Abu-abu Gelap border, utilizing a Kuning Emas focus ring.
- **Chips:** Used for tagging categories (e.g., "HAM", "Ekonomi"), using Abu-abu Gelap with white text at 50% opacity for inactive states.

### Side Navigation (Table of Contents)
A vertical list with active-state indicators using the Primary color, allowing users to jump quickly to specific chapters (Bab) of the Constitution.