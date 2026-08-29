---
name: frontend-performance-fps-mastery
description: >-
  120fps performance engineering, sub-50ms Interaction to Next Paint (INP), layout thrashing
  elimination (forced synchronous reflows), list virtualization (@tanstack/react-virtual),
  and Web Worker offloading (comlink). Use this skill whenever optimizing performance,
  fixing frame drops, diagnosing memory leaks, or rendering massive datasets with silky smoothness.
---

# 120 FPS Performance & Web Vitals Engineering Mastery

A comprehensive guide and reference system for eliminating frame drops, eliminating layout thrashing, achieving sub-50ms INP, and rendering massive datasets at 120fps.

---

## 1. The 120 FPS Frame Budget

To hit 120fps, the browser has only **8.33 milliseconds** per frame to run JavaScript, calculate styles, compute layout, and composite pixels.

### The Golden Rules of Zero-Jank:
1. **Never read and write DOM in interleaved loops** (Forced Synchronous Layout / Layout Thrashing).
2. **Never run O(n) math inside scroll or mousemove handlers** without throttling or decoupling with `useMotionValue` / `requestAnimationFrame`.
3. **Use CSS `content-visibility: auto`** for offscreen DOM sections.

---

## 2. In-Depth Reference Manuals

Read these specialized reference guides:

1. [Layout Thrashing Prevention & Forced Reflows](./references/layout-thrashing-prevention.md)
   - FastDOM patterns, `getBoundingClientRect()` batching, and `ResizeObserver` lifecycle safety.
2. [List Virtualization & Large Data Sets](./references/virtualization-and-large-lists.md)
   - Windowing with `@tanstack/react-virtual` to render 50,000+ items at 120fps.
3. [Web Workers for Heavy Compute](./references/web-workers-heavy-compute.md)
   - Offloading physics, image filtering, and search indexing off the main UI thread with `comlink`.
