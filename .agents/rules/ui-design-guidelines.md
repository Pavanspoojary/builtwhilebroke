# Workspace Rule: UI/UX & Visual Design Standards

All user interfaces, design systems, components, and layouts constructed in this workspace must adhere to the following design standards:

1. **Aesthetic Caliber (Apple / Linear / Stripe Benchmark)**:
   - Avoid generic, flat, cookie-cutter templates.
   - Use high-contrast hierarchy, rich slate/zinc dark surfaces (`#09090b`, `#12131a`), semi-transparent borders with top-edge highlights (`border-white/10` + `inset 0 1px 0 0 rgba(255,255,255,0.1)`), and soft multi-tiered ambient shadows.
   - Use fluid typography with optical letter-spacing (`tracking-tight` for titles > 24px, `tracking-wider uppercase font-mono` for micro-badges).

2. **Accessibility & Usability (a11y)**:
   - Text contrast must meet or exceed WCAG AA standards (4.5:1 for body copy).
   - Every interactive element must have distinct `:focus-visible` ring styling (`ring-2 ring-primary ring-offset-2`).
   - Honor `prefers-reduced-motion` across all animations and transitions.
   - Interactive touch targets on mobile must have a minimum size of 44x44px.

3. **Interactive Micro-States**:
   - Provide visual feedback for all 7 component states: Default, Hover, Active/Pressed (`active:scale-[0.98]`), Focus-Visible, Disabled (`disabled:opacity-50 disabled:cursor-not-allowed`), Loading (smooth skeleton/spinner), and Empty states.
