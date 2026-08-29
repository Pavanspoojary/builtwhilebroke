---
name: svg-liquid-shaders-and-canvas
description: >-
  Advanced guide and patterns for organic SVG liquid filters (Gooey effect, displacement maps,
  turbulent wave distortion) and high-speed 60fps HTML5 2D Canvas generative visuals (particle
  physics, cursor trails, network mesh nodes). Use this skill whenever building organic liquid
  interfaces, fluid cursor followers, or high-performance 2D canvas effects.
---

# SVG Liquid Filters & Generative Canvas Mastery

A comprehensive guide and reference system for organic SVG morphing filters, liquid goo interactions, and high-performance HTML5 Canvas physics simulations.

---

## 1. The Liquid Gooey SVG Filter Formula

The "gooey" effect merges distinct circular elements into organic fluid drops when they approach each other.
It relies on a high-intensity Gaussian blur followed by a contrast-clamping color matrix:

```html
<svg class="hidden">
  <defs>
    <filter id="goo">
      <!-- 1. Blur the edges -->
      <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
      <!-- 2. Clamp the alpha channel to sharp 1 or 0 -->
      <feColorMatrix
        in="blur"
        mode="matrix"
        values="1 0 0 0 0  
                0 1 0 0 0  
                0 0 1 0 0  
                0 0 0 20 -10"
        result="goo"
      />
      <feComposite in="SourceGraphic" in2="goo" operator="atop" />
    </filter>
  </defs>
</svg>
```

Apply `style={{ filter: "url(#goo)" }}` to the container element!

---

## 2. In-Depth Reference Manuals

Read these specialized reference guides:

1. [SVG Filters & Liquid Goo Guide](./references/svg-filters-and-liquid-goo.md)
   - Color matrix math, `feDisplacementMap` water ripple distortion, and turbulent noise animation.
2. [Generative 2D Canvas Engine](./references/generative-canvas-engine.md)
   - `requestAnimationFrame` render loops, particle velocity vectors, spatial grid partitioning, and mouse repulsion physics.

---

## 3. Production Component Recipes (`examples/`)

- [Generative Particle Canvas](./examples/generative-particle-canvas.tsx) - Interactive connected node network on HTML5 canvas.
- [Liquid Goo Cursor](./examples/liquid-goo-cursor.tsx) - Fluid trailing cursor that magnetically connects with interactive buttons.
