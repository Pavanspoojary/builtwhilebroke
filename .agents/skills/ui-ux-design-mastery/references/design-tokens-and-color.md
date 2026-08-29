# Design Tokens, Palettes & Ambient Lighting Guide

This reference defines token systems, color harmony rules, multi-layered elevation, and glassmorphism techniques for top-tier visual styling.

---

## 1. Color Palette Architecture

### Dark Theme Foundations
Never use pure `#000000` for main surfaces—it causes harsh eye strain and eliminates depth. Use rich tinted slates/obsidians:
- **Canvas / Root Background**: `#09090b` (Zinc-950) or `#0a0c10` (Dark Void)
- **Layer 1 Surface (Cards, Panels)**: `#12131a` or `rgba(255, 255, 255, 0.03)` with `backdrop-blur-md`
- **Layer 2 Surface (Dropdowns, Popovers, Modals)**: `#181a24` or `#1c1e2d`
- **Layer 3 Surface (Tooltips, Hover Highlights)**: `#242738`
- **Primary Text**: `#f8fafc` (Slate-50, 98% luminosity)
- **Secondary Text**: `#94a3b8` (Slate-400, 65% luminosity)
- **Muted / Hint Text**: `#64748b` (Slate-500, 45% luminosity)
- **Subtle Border**: `rgba(255, 255, 255, 0.08)` or `rgba(240, 246, 252, 0.1)`

### Accent Palettes & Glowing Accents
Choose a strong accent paired with a harmonious secondary:
- **Cyber Violet / Indigo**: Primary `#6366f1` / `#8b5cf6`, Secondary `#ec4899`
- **Electric Emerald / Mint**: Primary `#10b981` / `#059669`, Secondary `#06b6d4`
- **Linear Amber / Orange**: Primary `#f59e0b` / `#d97706`, Secondary `#ef4444`

**Radial Glow Recipe (Tailwind & CSS)**:
```html
<div class="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl">
  <!-- Subtle ambient radial spotlight -->
  <div class="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl"></div>
  <div class="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl"></div>
  <div class="relative z-10">
    <!-- Card Content -->
  </div>
</div>
```

---

## 2. Multi-Layered Shadows & Inset Highlights

Single hard drop shadows look dated. High-end modern interfaces use layered ambient occlusion and inner highlights:

### Elevated Card Shadow Token:
```css
/* Multi-layered soft ambient shadow */
.shadow-elevated {
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.08),
    0 1px 2px -1px rgba(0, 0, 0, 0.3),
    0 4px 12px -2px rgba(0, 0, 0, 0.4),
    0 16px 32px -4px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.12); /* 3D top edge light catch */
}

/* Floating Modal / Popover Shadow */
.shadow-popover {
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.12),
    0 8px 24px -4px rgba(0, 0, 0, 0.6),
    0 24px 48px -12px rgba(0, 0, 0, 0.7),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.15);
}
```

---

## 3. Glassmorphism & Translucency Master Formula

True glassmorphism requires 4 synchronized elements:
1. **Low opacity background**: `bg-zinc-900/70` or `rgba(18, 19, 26, 0.65)`
2. **Backdrop blur**: `backdrop-blur-md` or `backdrop-blur-xl` (12px–20px)
3. **Reflective Border**: `border border-white/[0.08]` (crisp 1px boundary)
4. **Noise Texture (Optional for ultra-luxury touch)**: Subtle 2-3% opacity monochrome SVG noise overlay.

```html
<div class="group relative rounded-xl border border-white/[0.08] bg-black/40 p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-black/50">
  <div class="text-sm font-medium text-white/90">Card Title</div>
  <p class="mt-1 text-xs text-white/60">Subtle, crisp high-end translucent surface.</p>
</div>
```
