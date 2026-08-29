# Workspace Rule: Motion, Spring Physics & Animation Engineering

All interactive animations, transitions, and scroll effects constructed in this workspace must adhere to the following motion engineering standards:

1. **Spring Physics Over Linear Eases**:
   - For UI interaction states (buttons, tabs, sheets, dialogs), use natural physics-based spring curves (e.g. `type: "spring", stiffness: 400, damping: 30, mass: 0.8`).
   - Avoid flat linear transitions except for continuous background loops or 1:1 scrubbed scroll timelines.

2. **Hardware Acceleration & Zero-Jank Rule**:
   - Only animate GPU-composited properties: `transform` (`x`, `y`, `scale`, `rotate`) and `opacity`.
   - Never animate `width`, `height`, `top`, or `left` directly. For dynamic container resizing or shared elements, use Framer Motion's `layout` / `layoutId` (FLIP engine) or GSAP Flip.
   - For pure CSS accordion height transitions, use the `grid-template-rows: 0fr -> 1fr` trick.

3. **Tool Selection Framework**:
   - **Framer Motion (`framer-motion` / `motion.dev`)**: Preferred for UI components, modal entrances/exits (`AnimatePresence`), gestures (drag, hover, tap), and shared element layout transitions (`layoutId`).
   - **GSAP 3 (`gsap`, `ScrollTrigger`, `useGSAP`)**: Preferred for complex narrative storytelling, horizontal scroll sections, pinned step-by-step scrubbing, and SVG line morphing.

4. **Lifecycle & Memory Safety**:
   - In React / Next.js, always use `@gsap/react`'s `useGSAP` hook with explicit scoping (`{ scope: containerRef }`) so all tweens and ScrollTriggers are automatically cleaned up on unmount.
