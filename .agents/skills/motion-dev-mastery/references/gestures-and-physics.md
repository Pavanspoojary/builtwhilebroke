# Gestural Interactions & Micro-Physics

Guide to building magnetic cursor attraction, 3D card tilt physics, and drag-to-dismiss interactions.

---

## 1. 3D Perspective Card Tilt on Mouse Move

Calculates normalized cursor coordinate offsets from the card center to rotate along X and Y axes:

```tsx
import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function TiltCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const xPct = (e.clientX - rect.left) / width - 0.5;
    const yPct = (e.clientY - rect.top) / height - 0.5;
    
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative rounded-3xl border border-white/10 bg-zinc-900/80 p-8 backdrop-blur-xl shadow-2xl"
    >
      <div style={{ transform: "translateZ(30px)" }}>{children}</div>
    </motion.div>
  );
}
```

---

## 2. Drag to Dismiss Sheet / Drawer Physics

```tsx
import { motion, PanInfo } from "framer-motion";

export function DismissibleSheet({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 500) {
      onClose();
    }
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.05, bottom: 0.8 }}
      onDragEnd={handleDragEnd}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      className="fixed bottom-0 inset-x-0 bg-zinc-900 border-t border-white/10 rounded-t-3xl p-6 z-50 shadow-2xl"
    >
      <!-- Pull Bar Indicator -->
      <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto mb-6" />
      {children}
    </motion.div>
  );
}
```
