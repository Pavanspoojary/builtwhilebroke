# Modern Components Catalog & Interaction Specs

Design blueprints and interaction specifications for high-end modern UI components.

---

## 1. Floating Island Navbar (Dynamic Island / Glass Dock)

- **Behavior**: Sticks to top of viewport with `top-4`, floats centered with max-width (`max-w-4xl`), features subtle backdrop blur and border.
- **Scroll Shrink / Fade**: Compresses slightly and increases backdrop blur intensity when scrolling down.

```html
<nav class="fixed top-4 inset-x-0 mx-auto max-w-4xl z-50 px-4">
  <div class="flex items-center justify-between px-4 py-2.5 rounded-full border border-white/10 bg-zinc-950/70 backdrop-blur-xl shadow-2xl">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
        B
      </div>
      <span class="font-semibold text-sm text-white tracking-tight">BuiltWhileBroke</span>
    </div>
    
    <div class="hidden md:flex items-center gap-1 text-xs font-medium text-zinc-400">
      <a href="#features" class="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors">Features</a>
      <a href="#pricing" class="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors">Pricing</a>
      <a href="#docs" class="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors">Docs</a>
    </div>

    <div class="flex items-center gap-2">
      <button class="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white text-zinc-950 hover:bg-zinc-200 transition-all active:scale-95 shadow-sm">
        Launch App
      </button>
    </div>
  </div>
</nav>
```

---

## 2. Command Palette Dialog (`cmd+k`)

- **Backdrop**: `fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4`
- **Container**: `max-w-xl w-full rounded-2xl border border-white/15 bg-zinc-900 shadow-2xl overflow-hidden`
- **Search Header**: Large input with search icon, clear button, and `ESC` shortcut tag.
- **Grouped Items**: Categorized list (e.g., "Navigation", "Actions", "Recent Documents") with keyboard navigation focus states.

---

## 3. High-Craft Interactive Card with Spotlight Border

- Uses a mouse-tracking dynamic radial gradient to illuminate the card border as the cursor moves over it.

```tsx
import React, { useRef, useState } from "react";

export function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.1), transparent 80%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
```

---

## 4. Sleek Status & Metric Badges

- **Live Status Indicator**:
```html
<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
  <span class="relative flex h-1.5 w-1.5">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
    <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
  </span>
  Operational
</span>
```
