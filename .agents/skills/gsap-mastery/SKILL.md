---
name: gsap-mastery
description: >-
  Comprehensive guide and patterns for GreenSock Animation Platform (GSAP 3),
  ScrollTrigger pinning and scrubbing, high-performance timelines, custom eases,
  SplitText/SplitType typography reveals, SVG morphing, and clean React/@gsap/react
  integration with useGSAP. Use this skill whenever building complex narrative scrolls,
  cinematic landing page choreographies, pinned sections, or high-performance canvas/SVG web animations.
---

# GSAP & ScrollTrigger Mastery

A complete architecture and reference guide for building high-performance creative web animations, narrative scroll sequences, text reveals, and complex multi-stage timelines using GSAP 3 and ScrollTrigger.

---

## 1. Core Principles & React Integration

### A. Lifecycle Safety with `@gsap/react` (`useGSAP`)
Always use the official `useGSAP` hook in React/Next.js to ensure all timelines, ScrollTriggers, and tweens are automatically scoped and cleaned up when components unmount:

```tsx
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function AnimatedSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Animations here are automatically scoped to containerRef
      gsap.from(".reveal-item", {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef}>
      <div className="reveal-item">One</div>
      <div className="reveal-item">Two</div>
    </div>
  );
}
```

### B. Choosing Between GSAP and Framer Motion
- **Use Framer Motion**: UI component state transitions, layout changes (`layoutId`), gesture springs, interactive modals, tabs, drag/drop.
- **Use GSAP & ScrollTrigger**: Complex multi-step narrative storytelling, pinned section scrubbing, horizontal scroll sections, SVG path morphing, split character typography, complex sequencing.

---

## 2. In-Depth Reference Manuals

Read these specialized reference guides for detailed blueprints:

1. [ScrollTrigger Guide (Pin, Scrub & Snap)](./references/scrolltrigger-guide.md)
   - Pinning viewports, horizontal track scrubbing, layered parallax, and dynamic snap configurations.
2. [Timelines, Stagger & Custom Eases](./references/timelines-and-eases.md)
   - Master timeline orchestration, position parameters (`"<"`, `"-=0.2"`), `expo.out`, `back.out(1.7)`, and custom beziers.
3. [React & Next.js SSR Integration Guide](./references/react-usegsap-integration.md)
   - Server-side rendering guards, smooth cleanup, Lenis integration, and ref lifecycle management.
4. [SVG Animation & SplitText Typography](./references/svg-and-splittext.md)
   - Splitting text into chars/words, masking text lines with `overflow: hidden`, and SVG line drawing with `strokeDashoffset`.

---

## 3. Production Component Recipes (`examples/`)

Inspect and reuse tested interactive GSAP components:
- [Horizontal Scroll Showcase](./examples/horizontal-scroll.tsx) - Smooth pinned horizontal container scrubbed by vertical scroll.
- [Cinematic Hero Reveal](./examples/hero-reveal.tsx) - Line-masked heading, subtitle blur fade, and staggered floating badge choreography.
- [Stacked Pinned Cards](./examples/pinned-cards.tsx) - Apple-style stacking card deck with scale & opacity diminution.
