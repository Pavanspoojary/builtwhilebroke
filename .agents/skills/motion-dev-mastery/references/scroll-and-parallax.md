# Scroll-Linked & Parallax Animations

Techniques for building scroll progress indicators, parallax hero layers, and viewport reveal animations using `framer-motion` and `motion.dev`.

---

## 1. Global Scroll Progress Bar

```tsx
import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-emerald-400 origin-left z-50"
    />
  );
}
```

---

## 2. Container-Targeted Scroll & Parallax

Map an element's scroll position across the viewport to transform values:

```tsx
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function ParallaxHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Layer 1 moves slower (background)
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  // Layer 2 scales down and fades
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden flex items-center justify-center">
      <motion.div
        style={{ y: yBg }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/30 via-zinc-950 to-zinc-950 -z-10"
      />
      
      <motion.div style={{ opacity, scale }} className="text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">
          Craft Beyond Limits
        </h1>
        <p className="mt-4 text-lg text-zinc-400 max-w-xl mx-auto">
          Ultra-responsive, buttery-smooth interactive applications.
        </p>
      </motion.div>
    </div>
  );
}
```

---

## 3. Viewport Reveal with `whileInView`

```tsx
import { motion } from "framer-motion";

export function RevealFeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="p-8 rounded-3xl bg-zinc-900/60 border border-white/10 backdrop-blur-xl"
    >
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-zinc-400 text-sm">{desc}</p>
    </motion.div>
  );
}
```
