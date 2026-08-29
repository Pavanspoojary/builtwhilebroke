# Lenis Smooth Scroll Integration Guide

Integrating Lenis smooth scroll with GSAP ScrollTrigger and Framer Motion for synchronous, buttery-smooth scrolling.

---

## 1. Setup & Synchronizing Lenis with GSAP ScrollTrigger

When using a virtual smooth scroller like Lenis, GSAP ScrollTrigger must be notified on every tick to ensure pinning and trigger calculations remain perfectly synchronized.

### React / Next.js Setup (`SmoothScrollProvider.tsx`):
```tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 1. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth exponential ease
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // 2. Synchronize Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return <>{children}</>;
}
```

---

## 2. Preventing Conflict with Modals & Drawers

When an overlay/modal opens, pause Lenis to lock background scroll cleanly:

```ts
// When modal opens:
lenis.stop();

// When modal closes:
lenis.start();
```
