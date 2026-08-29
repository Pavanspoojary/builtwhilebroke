# Timelines, Stagger & Custom Eases in GSAP

A reference guide for constructing master choreographies, nested timelines, and premium ease curves.

---

## 1. Timeline Positioning & Orchestration

GSAP's position parameter gives frame-perfect control over concurrent and sequenced animations:

```ts
const tl = gsap.timeline({
  defaults: { duration: 0.8, ease: "power3.out" },
});

tl.from(".hero-badge", { y: 20, opacity: 0 })
  .from(".hero-title", { y: 40, opacity: 0 }, "-=0.4")   // Starts 0.4s BEFORE badge animation finishes
  .from(".hero-desc", { y: 30, opacity: 0 }, "<0.1")     // Starts 0.1s AFTER hero-title starts
  .from(".hero-cta", { scale: 0.9, opacity: 0 }, "<")    // Starts at the EXACT same time as hero-desc
  .from(".floating-card", {
    y: 60,
    opacity: 0,
    stagger: {
      each: 0.1,
      from: "start", // or "center", "edges", "random"
    },
  }, "-=0.2");
```

---

## 2. Choosing the Right Ease Curve

- **`expo.out` / `power4.out`**: Extremely fast start with ultra-luxurious, long deceleration tail (perfect for hero entry, modal pop, card reveal).
- **`power2.out`**: Subtle, natural deceleration (good for small hover states, dropdown menus).
- **`back.out(1.7)`**: Overshoots destination slightly before settling (springy tactile buttons, badges).
- **`circ.out`**: Sudden deceleration curve.
- **`none` (Linear)**: Only for constant loops (e.g., spinning globe, continuous marquee, scrubbed scroll progress).

### Custom Cubic Bezier:
```ts
// Apple style smooth deceleration
import { CustomEase } from "gsap/CustomEase";
gsap.registerPlugin(CustomEase);

CustomEase.create("appleDecel", "M0,0 C0.16,1 0.3,1 1,1");

gsap.to(".sheet", { y: 0, ease: "appleDecel", duration: 1.2 });
```

---

## 3. Advanced Stagger Configurations

```ts
gsap.from(".grid-item", {
  opacity: 0,
  scale: 0.8,
  y: 40,
  duration: 0.6,
  ease: "power3.out",
  stagger: {
    grid: [4, 4],     // Matrix [rows, cols]
    from: "center",   // Animates outward from center of grid
    amount: 0.8,      // Total duration distributed across all items
  },
});
```
