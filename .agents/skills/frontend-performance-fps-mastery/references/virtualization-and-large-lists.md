# List Virtualization & Massive Datasets

Rendering 50,000+ rows smoothly by only mounting DOM nodes currently inside the viewport.

---

## 1. Virtualization with `@tanstack/react-virtual`

```tsx
import React, { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

export function VirtualizedList({ items }: { items: string[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      className="h-[400px] w-full overflow-auto rounded-2xl border border-white/10 bg-zinc-900/80 p-2"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
            className="flex items-center px-4 text-xs text-zinc-300 border-b border-white/5"
          >
            {items[virtualRow.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
```
