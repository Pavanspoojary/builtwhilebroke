# React & Next.js SSR Integration Guide with `@gsap/react`

A guide to using GSAP safely in React 18/19 and Next.js App Router without memory leaks or hydration mismatches.

---

## 1. Safe SSR & Client Component Directives

Next.js Server Components cannot execute GSAP (since `window` and DOM elements do not exist on the server).
Always add `"use client";` at the top of animated components and register plugins inside a browser check or inside `useGSAP`.

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}
```

---

## 2. Scoped Selectors with `useGSAP`

`useGSAP` eliminates the need to create a React `useRef` for every single animated child element. Simply scope to the parent container:

```tsx
export function FeatureList() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Scoped automatically: selects only .item inside container.current
      gsap.from(".item", {
        opacity: 0,
        x: -30,
        stagger: 0.1,
      });
    },
    { scope: container }
  );

  return (
    <div ref={container}>
      <div className="item">Feature 1</div>
      <div className="item">Feature 2</div>
      <div className="item">Feature 3</div>
    </div>
  );
}
```

---

## 3. Dependencies & Reactive Updates

When animations depend on React state, pass `dependencies` to `useGSAP` (works like `useEffect` dependencies, but automatically reverts previous GSAP instances before re-running):

```tsx
export function FilterableGallery({ category }: { category: string }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".gallery-card", {
        scale: 0.85,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out",
      });
    },
    { dependencies: [category], scope: container }
  );

  return (
    <div ref={container}>
      {/* Category cards */}
    </div>
  );
}
```
