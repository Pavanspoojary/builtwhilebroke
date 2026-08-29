# Exit Animations & Orchestration (`AnimatePresence`)

Master guide for managing component unmounting, multi-step page transitions, and staggered reveal sequences.

---

## 1. The Power of `AnimatePresence`

In vanilla React, unmounting components immediately deletes DOM nodes without allowing exit animations. `AnimatePresence` preserves the DOM node until the `exit` animation completes.

### Golden Rules:
1. Direct child of `<AnimatePresence>` must have a **unique `key`**.
2. To animate between alternate views (e.g. tabs or pages), set `mode="wait"` to let old view exit before the new one animates in.
3. For overlapping transitions, set `mode="sync"` (default) or `mode="popLayout"`.

```tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function NotificationBanner({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-white/10 text-white shadow-xl"
    >
      <span>{message}</span>
      <button onClick={onClose} className="text-zinc-400 hover:text-white text-sm">Dismiss</button>
    </motion.div>
  );
}
```

---

## 2. Directional Slide Tabs / Multi-Step Wizard

When stepping forward (1 -> 2) or backward (2 -> 1), use custom direction variants:

```tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
    filter: "blur(4px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0,
    filter: "blur(4px)",
  }),
};

export function StepWizard() {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <div className="relative overflow-hidden w-full max-w-md p-6 bg-zinc-900 rounded-2xl border border-white/10">
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
        >
          <h2 className="text-xl font-bold text-white">Step {page + 1}</h2>
          <p className="text-zinc-400 text-sm mt-2">Content for step index {page}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-6">
        <button onClick={() => paginate(-1)} className="px-3 py-1.5 text-xs text-zinc-300 bg-white/5 rounded-lg">
          Prev
        </button>
        <button onClick={() => paginate(1)} className="px-3 py-1.5 text-xs text-zinc-900 bg-white rounded-lg font-medium">
          Next
        </button>
      </div>
    </div>
  );
}
```
