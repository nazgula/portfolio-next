# Design System — Maria Gurevich Portfolio

## Visual Identity
Art Deco x Modern Tech. The aesthetic draws from 1920s geometric decorative language —
ruled lines, diamond ornaments, symmetry, and gold — applied to a clean, editorial layout.
It is refined and confident, never ornate or heavy.

## Color Palette

| Token                | Value     | Role                              |
|----------------------|-----------|-----------------------------------|
| --color-bg           | #F5F0E8   | Page background (warm parchment)  |
| --color-bg-deep      | #0F1117   | Reserved for future dark sections |
| --color-surface      | #EDE8DE   | Card backgrounds, header, footer  |
| --color-surface-dark | #1A1F2B   | Reserved for future dark panels   |
| --color-border       | #C8C0AE   | Borders on light bg               |
| --color-text         | #1A1814   | Primary text                      |
| --color-text-muted   | #6B6358   | Secondary text, descriptions      |
| --color-text-dim     | #9B9286   | Metadata, dates                   |
| --color-accent-gold  | #C9A84C   | Art deco accent — use sparingly   |
| --color-accent-teal  | #2A8C8C   | Secondary accent (chip colors)    |
| --color-accent-cobalt| #1E4ED8   | Tertiary accent (chip colors)     |
| --color-accent-orange| #F47820   | Reserved for high-energy CTA      |

### Role Chip Colors (hardcoded)

| Role              | Background | Text     |
|-------------------|-----------|----------|
| Full Stack        | #D0EBEB   | #1A5A5A  |
| Frontend          | #D4E0F8   | #1A3A8A  |
| Web Designer      | #F0E8D0   | #7A5A1A  |
| AI Engineer       | #E8E0F0   | #3A1A5A  |
| Freelance         | #E8E0D0   | #5A4A35  |
| Default           | var(--color-tag-bg) #E2DAC8 | var(--color-tag-text) #4A4235 |

## Typography

| Role        | Font                    | Size                      | Weight | Notes                  |
|-------------|-------------------------|---------------------------|--------|------------------------|
| Display     | Cormorant Garamond      | clamp(48px, 7vw, 88px)    | 300    | Hero name              |
| H2          | Cormorant Garamond      | 28px                      | 500    | Project titles         |
| Subtitle    | Jost                    | clamp(13px, 1.5vw, 16px)  | 500    | ls 0.2em, uppercase    |
| Body        | Jost                    | 18px / lh 1.7             | 300    | Project descriptions   |
| Label       | Jost                    | 11px / ls 0.15em / upper  | 600    | Section labels         |
| Mono        | DM Mono                 | 13px                      | 500    | Tech stack (bold)      |
| Mono (meta) | DM Mono                 | 12px                      | 400    | Dates, metadata        |

### Font Loading
Google Fonts via next/font:
- Cormorant Garamond: weights 300, 400, 500, 600
- Jost: weights 300, 400, 500, 600
- DM Mono: weights 400, 500

## Spacing
Base-8 system. All spacing values must be multiples of 8.

| Token   | Value |
|---------|-------|
| --sp-1  | 8px   |
| --sp-2  | 16px  |
| --sp-3  | 24px  |
| --sp-4  | 32px  |
| --sp-6  | 48px  |
| --sp-8  | 64px  |
| --sp-12 | 96px  |
| --sp-16 | 128px |

## Layout
- --max-width: 1200px
- --gutter: 32px
- --margin: clamp(24px, 5vw, 80px)

## Border Radius
Keep it sharp. Art deco does not round.

| Token    | Value |
|----------|-------|
| --r-sm   | 2px   |
| --r      | 4px   |
| --r-lg   | 8px   |
| --r-pill | 999px (tags/chips only) |

## Shadows

| Token         | Value                                                            |
|---------------|------------------------------------------------------------------|
| --shadow-card | 0 2px 12px rgba(26,24,20,0.08), 0 1px 3px rgba(26,24,20,0.06)   |
| --shadow-lift | 0 8px 32px rgba(26,24,20,0.14), 0 2px 8px rgba(26,24,20,0.08)   |
| --shadow-dark | 0 8px 40px rgba(0,0,0,0.5)                                      |

## Motion

| Token         | Value                          |
|---------------|--------------------------------|
| --ease-out    | cubic-bezier(0.16, 1, 0.3, 1)  |
| --ease-in-out | cubic-bezier(0.45, 0, 0.55, 1) |
| --dur-fast    | 120ms                          |
| --dur-std     | 220ms                          |
| --dur-slow    | 380ms                          |

## Art Deco Rules
- Diamond ornament (flanking rules with rotated square) appears: below hero subtitle
- Art deco background pattern (diamond lattice + ruled grid) covers the work section
  - 45deg / -45deg gold lines at 30px intervals, opacity 0.12
  - Horizontal / vertical gold lines at 60px intervals, opacity 0.08
- Corner bracket ornaments (L-shaped, 24px, 2px gold, opacity 0.4) appear on the hero section
- Gold accent (#C9A84C) is used ONLY for: ornaments, hover states, card top borders, gallery dots (active), deco patterns
- Never use gold as a background fill except on hover states
- All ruled lines are 1px, color --color-border or --color-accent-gold at opacity 0.5

## Page Sections

### Hero (header)
- Background: --color-surface
- Center-aligned, no navigation bar
- Name is the topmost element (no ornament above it)
- Name in Display font, thin ruled line below, subtitle, then diamond deco rule
- Corner bracket ornaments in all four corners

### Work Section (main)
- Background: --color-bg with deco-pattern overlay
- No section title
- Project cards in alternating layout

### Footer
- Background: --color-surface
- Diamond deco rule, then email link only
- Email hover: --color-accent-gold

## Component Rules

### Project Cards
- Alternating two-column layout (text left / image right, then flip)
- Background: --color-surface
- 2px solid gold top border only
- --shadow-card
- Border radius: --r (4px)
- Role chips: color-coded by discipline, border-radius --r-pill
- Tech stack: DM Mono, weight 500, no background, dot-separated, --color-text

### Image Gallery
- Aspect ratio 16/10, border-radius --r
- Shadow: --shadow-card at rest, --shadow-lift on hover
- Navigation dots: --color-border default, --color-accent-gold active
- "Click to expand" hint in DM Mono on hover

### Lightbox
- Fullscreen overlay, bg rgba(15,17,23,0.94) with 12px backdrop blur
- Nav buttons: circular, gold-tinted border, semi-transparent bg
- Caption: Jost, weight 300, 14px
- Counter: DM Mono, 12px

### Floating Chat Button
- Fixed bottom-right 32px from edges
- 56px circle, bg --color-bg-deep, border 2px solid --color-accent-gold
- Icon: chat bubble SVG, stroke --color-accent-gold
- Hover: fills gold, icon inverts to --color-bg-deep
- Pulse ring animation on load x3, then stops

### Chat Dialog
- Background: --color-surface
- Border: 1px solid --color-border
- Shadow: --shadow-lift
- User bubbles: bg --color-bg-deep, text --color-text-inv
- Assistant bubbles: bg --color-tag-bg, text --color-text
- Input: bg --color-bg, border --color-border, focus border --color-accent-gold

## Do Not
- Do not use Inter, Roboto, system-ui for display or headings
- Do not round corners beyond 8px
- Do not introduce new colors outside the token set
- Do not use purple gradients or generic AI-looking color schemes
- Do not make the art deco elements optional — they define the brand
