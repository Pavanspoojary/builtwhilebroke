# Layout Thrashing Prevention & Forced Reflows

Diagnosing and eliminating layout thrashing to preserve 120fps frame rates.

---

## 1. What Causes Layout Thrashing?

Layout thrashing happens when JavaScript reads a geometry property (e.g. `offsetWidth`, `clientHeight`, `getBoundingClientRect()`) immediately after writing a style property (`style.width = ...`). This forces the browser to synchronously recalculate the entire page layout mid-frame.

### The Problem:
```ts
// ❌ BAD: Layout Thrashing (forces 100 layout reflows!)
elements.forEach((el) => {
  const width = el.offsetWidth; // Read
  el.style.width = `${width + 10}px`; // Write
});
```

### The Solution (Batching):
```ts
// ✅ GOOD: Read batch first, then write batch (1 layout reflow total)
const widths = elements.map((el) => el.offsetWidth); // Reads
elements.forEach((el, i) => {
  el.style.width = `${widths[i] + 10}px`; // Writes
});
```

---

## 2. Using `requestAnimationFrame` for Scroll/Resize Updates

```ts
let scheduledAnimationFrame = false;

window.addEventListener("scroll", () => {
  if (scheduledAnimationFrame) return;
  scheduledAnimationFrame = true;

  requestAnimationFrame(() => {
    // Perform layout reads and writes cleanly once per frame
    scheduledAnimationFrame = false;
  });
});
```
