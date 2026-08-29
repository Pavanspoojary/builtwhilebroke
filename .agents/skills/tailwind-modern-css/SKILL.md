---
name: tailwind-modern-css
description: >-
  Advanced modern CSS & Tailwind CSS engineering guidelines, container queries (@container),
  CSS subgrid, animated glowing borders (@property), noise/grain textures, custom glassmorphism,
  and Lenis smooth scroll integration. Use this skill whenever styling complex responsive layouts,
  crafting CSS-only micro-effects, or configuring Tailwind CSS design tokens.
---

# Modern CSS & Tailwind Architecture Mastery

A comprehensive guide and reference system for implementing cutting-edge CSS, container queries, modern layout techniques, dynamic glowing border effects, and ultra-smooth scrolling.

---

## 1. Core Principles

### A. Responsive with Container Queries (`@container`)
Never rely solely on viewport `@media (min-width: ...)` for modular components. A component inside a 1/3-width sidebar needs different styling than the same component placed in a full-width hero.
- Define `@container` on parent cards.
- Style children with `@sm:`, `@md:`, `@lg:`.

### B. GPU-Accelerated CSS Transitions
- Transition only `opacity`, `transform`, and `filter`.
- Never transition `all` or `height`/`width` directly—use `grid-template-rows: 0fr -> 1fr` for accordion height transitions.

---

## 2. In-Depth Reference Manuals

Read these specialized reference guides:

1. [Modern CSS Patterns & Layout Tricks](./references/modern-css-tricks.md)
   - CSS grid auto-fit / minmax, subgrid, smooth accordion height trick, `:has()` relational selectors, `:focus-visible`.
2. [Dynamic Visual Effects & Animated Glow Borders](./references/dynamic-effects-and-shaders.md)
   - `@property` animated border angle rotations, radiant sheen on hover, noise texture overlays.
3. [Lenis Smooth Scroll Integration](./references/lenis-smooth-scroll.md)
   - Integrating `@studio-freight/lenis` / `lenis` with GSAP ScrollTrigger and Framer Motion for synchronized smooth scrolling.

---

## 3. Quick Accordion Height CSS Trick

The smoothest, zero-jank way to animate height without fixed numbers:

```html
<div class="grid transition-all duration-300 ease-out grid-rows-[0fr] data-[open=true]:grid-rows-[1fr]">
  <div class="overflow-hidden">
    <!-- Inner dynamic content -->
  </div>
</div>
```
