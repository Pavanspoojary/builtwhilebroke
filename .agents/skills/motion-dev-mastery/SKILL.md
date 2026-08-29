---
name: motion-dev-mastery
description: >-
  Expert guide and patterns for Framer Motion and Motion.dev (Motion One) animations,
  layout transitions, shared element transitions (layoutId), spring physics, scroll-linked
  animations, gestural interactions, and AnimatePresence exit choreographies.
  Use this skill whenever creating animations, transitions, interactive UI components,
  or smooth motion graphics in React, Next.js, or modern frontend applications.
---

# Motion & Framer Motion Mastery

A comprehensive guide and reference system for implementing fluid, 60fps animations, layout transitions, spring physics, and scroll interactions using `framer-motion` and `motion` (Motion.dev).

---

## 1. Core Principles of Premium Motion

### A. Natural Spring Physics vs. Linear Durations
- Never use linear transitions for UI states. Real-world physical objects have inertia, mass, and tension.
- **Snappy UI Interaction** (Buttons, tabs, toggles): `type: "spring", stiffness: 400, damping: 30, mass: 0.8`
- **Gentle Floating / Ambient**: `type: "spring", stiffness: 100, damping: 20`
- **Bouncy Playful**: `type: "spring", stiffness: 300, damping: 15, mass: 1`
- **Smooth Page / Modal Transition**: `type: "spring", damping: 25, stiffness: 200`

### B. Hardware Acceleration & Performance (Zero Jank)
- **Safe Properties**: Only animate transform (`x`, `y`, `scale`, `rotate`) and `opacity`.
- **Layout Animations**: When animating dimensions or DOM positions, always use `layout` or `layoutId` (Framer Motion's FLIP engine) rather than animating `width`, `height`, `top`, or `left`.
- **GPU Layer**: Add `transform: translateZ(0)` or `will-change: transform` automatically handled by Framer Motion.

---

## 2. In-Depth Reference Manuals

Read these specialized reference guides for detailed blueprints:

1. [Layout Animations & Shared Element Transitions (`layoutId`)](./references/layout-and-shared-transitions.md)
   - Morphing tabs, expanding card dialogs, reordering lists, and cross-component shared anchors.
2. [Scroll-Linked & Parallax Animations](./references/scroll-and-parallax.md)
   - `useScroll`, `useTransform`, `useSpring`, scroll progress bars, parallax depth, and reveal on enter.
3. [Gestural Interactions & Micro-Physics](./references/gestures-and-physics.md)
   - Magnetic hover buttons, 3D tilt cards, drag-to-dismiss sheets, and boundary physics.
4. [Exit Animations & Orchestration (`AnimatePresence`)](./references/exit-and-presence.md)
   - Staggered children reveals, modal backdrops, tab switches, and multi-step wizard choreographies.

---

## 3. Production Component Recipes (`examples/`)

Inspect and reuse tested interactive components:
- [Magnetic Button](./examples/magnetic-button.tsx) - Smooth spring-based magnetic pull on cursor hover.
- [Animated Segmented Tabs](./examples/animated-tabs.tsx) - Morphing pill background using `layoutId`.
- [Smooth Drawer Modal](./examples/drawer-modal.tsx) - Fluid drag-to-dismiss bottom sheet / dialog with `AnimatePresence`.

---

## 4. Quick API Cheat Sheet

### Variants Pattern
```tsx
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 350, damping: 25 },
  },
};

export function StaggeredList({ items }: { items: string[] }) {
  return (
    <motion.ul variants={containerVariants} initial="hidden" animate="visible" className="space-y-2">
      {items.map((item, i) => (
        <motion.li key={i} variants={itemVariants} className="p-3 bg-zinc-900 rounded-lg text-white">
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```
