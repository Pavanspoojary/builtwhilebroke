# Compound Components Pattern in React

Building scalable, flexible component APIs with React Context.

---

## 1. The Anatomy of a Compound Component

```tsx
import React, { createContext, useContext, useState } from "react";

interface AccordionContextType {
  openItem: string | null;
  toggleItem: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextType | null>(null);

function useAccordion() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion sub-components must be inside <Accordion.Root>");
  return ctx;
}

// 1. Root
function Root({ children }: { children: React.ReactNode }) {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const toggleItem = (id: string) => setOpenItem(openItem === id ? null : id);

  return (
    <AccordionContext.Provider value={{ openItem, toggleItem }}>
      <div className="space-y-2">{children}</div>
    </AccordionContext.Provider>
  );
}

// 2. Item
const ItemContext = createContext<{ id: string } | null>(null);

function Item({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <ItemContext.Provider value={{ id }}>
      <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">{children}</div>
    </ItemContext.Provider>
  );
}

// 3. Trigger
function Trigger({ children }: { children: React.ReactNode }) {
  const { openItem, toggleItem } = useAccordion();
  const { id } = useContext(ItemContext)!;
  const isOpen = openItem === id;

  return (
    <button
      onClick={() => toggleItem(id)}
      className="flex w-full items-center justify-between font-semibold text-white text-left text-sm"
      aria-expanded={isOpen}
    >
      <span>{children}</span>
      <span className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}>↓</span>
    </button>
  );
}

// 4. Content
function Content({ children }: { children: React.ReactNode }) {
  const { openItem } = useAccordion();
  const { id } = useContext(ItemContext)!;
  const isOpen = openItem === id;

  if (!isOpen) return null;
  return <div className="mt-3 text-xs text-zinc-400 leading-relaxed">{children}</div>;
}

export const Accordion = { Root, Item, Trigger, Content };
```
