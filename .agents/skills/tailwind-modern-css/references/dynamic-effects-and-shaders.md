# Dynamic Visual Effects & Animated Glow Borders

Techniques for creating rotating gradient borders, noise overlays, and radiant shimmer effects in pure CSS.

---

## 1. Rotating Conic-Gradient Border (`@property`)

Using modern CSS Houdini `@property`, browsers can smoothly interpolate angle values:

```css
@property --border-angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

@keyframes rotateBorder {
  to {
    --border-angle: 360deg;
  }
}

.glowing-border-card {
  --border-angle: 0deg;
  position: relative;
  background: #09090b;
  border-radius: 1.25rem;
  padding: 1px;
  animation: rotateBorder 6s linear infinite;
  background:
    linear-gradient(#09090b, #09090b) padding-box,
    conic-gradient(
      from var(--border-angle),
      transparent 20%,
      rgba(139, 92, 246, 0.8) 50%,
      transparent 80%
    ) border-box;
  border: 1px solid transparent;
}
```

---

## 2. Radiant Button Shimmer / Sheen

A smooth light sweep across a button on hover:

```html
<button class="relative overflow-hidden rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white border border-white/10 group">
  <!-- Shimmer ray -->
  <span class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
  <span class="relative z-10 flex items-center gap-2">
    <span>Get Started Free</span>
    <span class="group-hover:translate-x-0.5 transition-transform">→</span>
  </span>
</button>
```

---

## 3. Subtle Film Grain & Noise Overlay

Adding a 2–3% opacity noise overlay gives dark mode surfaces a tactile, filmic, high-luxury finish:

```css
.noise-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
```
