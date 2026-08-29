# SVG Animation & SplitText Typography Guide

Techniques for typography line-masking reveals and high-performance SVG path animation.

---

## 1. Cinematic Line-Mask Text Reveal

Wrapping each text line in an `overflow: hidden` block allows text to slide up from invisible clipping planes without requiring complex third-party paid plugins.

```tsx
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function MaskedHeading({ line1, line2 }: { line1: string; line2: string }) {
  const container = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      gsap.from(".text-line-inner", {
        y: "110%",
        rotateX: -15,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "expo.out",
      });
    },
    { scope: container }
  );

  return (
    <h1 ref={container} className="text-5xl sm:text-7xl font-bold tracking-tight text-white leading-tight">
      <div className="overflow-hidden">
        <div className="text-line-inner inline-block">{line1}</div>
      </div>
      <div className="overflow-hidden">
        <div className="text-line-inner inline-block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
          {line2}
        </div>
      </div>
    </h1>
  );
}
```

---

## 2. SVG Line Drawing Animation

Animate SVG paths by manipulating `strokeDasharray` and `strokeDashoffset`:

```tsx
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function AnimatedCheckmark() {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const path = svgRef.current?.querySelector("path");
      if (!path) return;

      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });

      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1,
        ease: "power2.inOut",
      });
    },
    { scope: svgRef }
  );

  return (
    <svg ref={svgRef} className="w-12 h-12 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
```
