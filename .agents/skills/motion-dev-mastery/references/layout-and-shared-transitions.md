# Layout Animations & Shared Element Transitions (`layoutId`)

A complete guide to FLIP animations, morphing containers, and shared element transitions in Framer Motion.

---

## 1. How FLIP & `layout` Work

When a DOM element changes size or position, directly animating width/height causes expensive browser reflows and stutter.
Framer Motion's `layout` prop calculates the difference between the initial bounding box and the new bounding box, then applies an inverted GPU transform (`scale` and `translate`) to seamlessly transition between states at 60–120fps.

### Layout Prop Usage:
```tsx
import { useState } from "react";
import { motion } from "framer-motion";

export function ExpandableCard() {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={() => setExpanded(!expanded)}
      className="p-6 rounded-2xl bg-zinc-900 border border-white/10 cursor-pointer overflow-hidden"
    >
      <motion.h3 layout="position" className="text-lg font-bold text-white">
        Click to Expand
      </motion.h3>
      {expanded && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-3 text-sm text-zinc-400"
        >
          This content renders smoothly without layout jarring or jitter.
        </motion.p>
      )}
    </motion.div>
  );
}
```

---

## 2. Shared Element Transitions with `layoutId`

`layoutId` connects two separate React elements across renders, unmounts, or routes, smoothly morphing one into the other.

### A. Morphing Navigation Active Indicator:
```tsx
import { useState } from "react";
import { motion } from "framer-motion";

const tabs = ["Overview", "Integrations", "Analytics", "Settings"];

export function TabNav() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="flex items-center gap-1 p-1.5 rounded-full bg-zinc-950/80 border border-white/10 backdrop-blur-md">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 ${
              isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="active-pill"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="absolute inset-0 rounded-full bg-white/15 border border-white/20 shadow-sm"
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        );
      })}
    </div>
  );
}
```

### B. Expanding List Item to Full Modal:
When opening a modal from a list item, give both the preview card and the modal wrapper the same `layoutId`:
```tsx
// Inside list:
<motion.div layoutId={`card-${item.id}`} onClick={() => setSelected(item)}>
  <motion.img layoutId={`img-${item.id}`} src={item.image} />
  <motion.h4 layoutId={`title-${item.id}`}>{item.title}</motion.h4>
</motion.div>

// Inside Modal / Dialog:
<AnimatePresence>
  {selected && (
    <motion.div layoutId={`card-${selected.id}`} className="fixed inset-0 z-50 ...">
      <motion.img layoutId={`img-${selected.id}`} src={selected.image} />
      <motion.h4 layoutId={`title-${selected.id}`}>{selected.title}</motion.h4>
    </motion.div>
  )}
</AnimatePresence>
```
