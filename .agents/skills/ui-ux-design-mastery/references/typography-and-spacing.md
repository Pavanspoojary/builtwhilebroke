# Fluid Typography & Spatial Architecture Guide

A master guide to typography scales, pairing strategies, micro-spacing, and optical alignment.

---

## 1. Font Selection & Pairing Archetypes

A signature high-end interface usually pairs two distinct typefaces (or one versatile variable font with a clean monospace accent):

1. **Modern Tech / Product Archetype**:
   - **Primary Sans**: `Inter`, `Geist Sans`, `Plus Jakarta Sans`, or `SF Pro Display`
   - **Monospace Accent**: `Geist Mono`, `JetBrains Mono`, `Fira Code` (for numbers, timestamps, badges, code tokens, IDs)
2. **Editorial Luxury / SaaS Archetype**:
   - **Display Heading**: `Newsreader`, `Playfair Display`, `Instrument Serif`, or `Cal Sans`
   - **Body Sans**: `Inter` or `Geist Sans`
   - **Mono**: `Geist Mono`

---

## 2. Fluid Typography Scale (`clamp()`)

Avoid sudden jumps between screen sizes. Use fluid formulas that scale smoothly between mobile (375px) and desktop (1440px):

```css
:root {
  /* Display / Hero: 36px to 72px */
  --font-hero: clamp(2.25rem, 1.5rem + 3.75vw, 4.5rem);
  
  /* H1 / Section Title: 28px to 48px */
  --font-h1: clamp(1.75rem, 1.25rem + 2.5vw, 3rem);
  
  /* H2 / Card Heading: 20px to 30px */
  --font-h2: clamp(1.25rem, 1rem + 1.25vw, 1.875rem);
  
  /* H3 / Subtitle: 16px to 22px */
  --font-h3: clamp(1rem, 0.9rem + 0.5vw, 1.375rem);
  
  /* Body: 14px to 16px */
  --font-body: clamp(0.875rem, 0.85rem + 0.15vw, 1rem);
  
  /* Small / Caption / Meta: 12px to 13px */
  --font-caption: clamp(0.75rem, 0.72rem + 0.1vw, 0.8125rem);
}
```

---

## 3. Letter Spacing & Line Height Rules

- **Display & Large Titles (>24px)**: Tighten tracking to improve punch and visual unity.
  - `tracking-tight` (`-0.02em`) or `tracking-tighter` (`-0.035em`)
  - `leading-[1.1]` or `leading-[1.05]`
- **Body Text (14px–16px)**: Normal tracking with relaxed line height for effortless readability.
  - `tracking-normal` (`0em`)
  - `leading-relaxed` (`1.6` to `1.7`)
  - Optimal measure: 45–75 characters per line (`max-w-prose` or `max-w-xl`).
- **Uppercase Badges & Overlines (10px–12px)**: Wide tracking for crisp scannability.
  - `uppercase tracking-wider` (`0.05em`) or `tracking-widest` (`0.1em`)
  - `font-mono` or `font-semibold`

---

## 4. Optical Alignment & Micro-Spacing

- **Button Icons**: Icons placed before text should have 1px to 2px extra optical margin depending on their bounding shape.
- **Numbers in Tables / Dashboards**: Always enable tabular figures (`tabular-nums` / `font-variant-numeric: tabular-nums`) so numbers don't jitter when updating or align incorrectly in columns.
- **Status Indicator Dots**: Pair `w-2 h-2` or `w-1.5 h-1.5` pulsing dots with `leading-none` and `inline-flex items-center gap-1.5` to ensure dead-center vertical centering.
