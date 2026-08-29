---
name: ui-ux-design-mastery
description: >-
  Master-level guidance for modern UI/UX design, visual hierarchy, typography,
  color harmony, micro-spacing, glassmorphism, bento grids, and Apple/Linear/Stripe-tier
  frontend aesthetics. Use this skill whenever designing or implementing user interfaces,
  design systems, landing pages, dashboards, web apps, or aesthetic component architectures.
---

# UI/UX Design Mastery

A comprehensive guide and reference system for creating world-class, premium user interfaces with obsessive attention to craft, aesthetics, typography, micro-interactions, and accessibility.

---

## 1. Core Visual Pillars

### A. Visual Hierarchy & Contrast
- **Focal Point**: Every view must have a clear primary action or focal anchor. Avoid competing primary buttons or visual noise.
- **Surface Elevation**: Distinguish elevation through subtle tone shifts, border highlights (`inset 0 1px 0 0 rgba(255,255,255,0.08)`), and soft multi-layered ambient shadows rather than harsh drop shadows.
- **Content Hierarchy**: High contrast for titles (90–100% white/black), medium for body (65–75%), subtle for metadata/captions (40–55%).

### B. Spatial Harmony & Rhythm
- **4pt / 8pt Grid**: Consistently use standard rhythm (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`).
- **Internal vs External Spacing**: Internal padding must always be smaller than the space between distinct components.
- **Optical Balance**: Visual weight often differs from geometric bounding boxes. Optically align icons inside circular badges and text alongside badges.

### C. Color & Lighting Principles
- **Avoid Pure Black/White**: Use rich darks (e.g., `#090a0f`, `#0d1117`, `#0a0a0c`) and warm/clean whites (`#f8fafc`, `#fdfdfd`).
- **Accent Restraint**: Limit vibrant brand colors to 1-2 primary accents. Use opacity scales (`/10`, `/20`, `/80`) of the accent for badges, glows, and hover halos.
- **Border Lighting (The 1px Rule)**: Modern dark mode uses semi-transparent borders (`border border-white/10` or `border-white/[0.06]`) coupled with subtle inner top highlights to simulate 3D light catching edges.

---

## 2. In-Depth Reference Manuals

Read these specialized reference guides for detailed blueprints:

1. [Design Tokens, Palettes & Ambient Lighting](./references/design-tokens-and-color.md)
   - Color scales, token structures, multi-layered shadows, glassmorphism backdrop filters, and light/dark theme balance.
2. [Fluid Typography & Spatial Architecture](./references/typography-and-spacing.md)
   - Font pairing (sans + mono accents + display), `clamp()` fluid scales, line-height compensation, and optical alignment.
3. [Bento Grids, Dashboards & Modern Layouts](./references/bento-grids-and-layouts.md)
   - Modern bento grid patterns, asymmetric cards, sticky sidebars, and responsive dashboard workflows.
4. [Modern Components Catalog & Interaction Specs](./references/modern-components-catalog.md)
   - Specs for floating navbars, command palettes (`cmd+k`), interactive cards, animated badges, and status widgets.

---

## 3. High-Craft Component Checklist

When building any UI component, ensure:
- [ ] **State Coverage**: Default, Hover, Active, Focus-Visible, Disabled, Loading, and Empty states are visually distinct.
- [ ] **Accessibility (a11y)**: Contrast ratios exceed WCAG AA (4.5:1 for body, 3:1 for large text), ARIA attributes are placed correctly, and keyboard focus rings (`ring-2 ring-primary ring-offset-2`) are explicit.
- [ ] **Tactile Feedback**: Interactive elements respond with subtle scale down (`active:scale-[0.98]`), border tint shift, or subtle background lightening.
- [ ] **No Default Scrollbars**: Custom sleek scrollbars or hidden overflow with intuitive navigation affordances.
- [ ] **Dark Mode Native**: High fidelity dark theme without muddy grays.
