# Mobile Haptic Feedback Patterns

Utilizing `navigator.vibrate` to provide tactile physical confirmation on mobile browsers and PWAs.

---

## 1. Haptic Patterns

```ts
export const Haptic = {
  // Ultra-light micro-tap (10ms)
  light: () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10);
    }
  },

  // Medium action confirmation (25ms)
  medium: () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(25);
    }
  },

  // Success double pulse [vibrate, pause, vibrate]
  success: () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([15, 60, 20]);
    }
  },

  // Warning / Error pattern
  error: () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([40, 40, 40, 40, 60]);
    }
  },
};
```
