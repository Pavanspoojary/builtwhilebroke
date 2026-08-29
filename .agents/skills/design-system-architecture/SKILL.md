---
name: design-system-architecture
description: >-
  Enterprise-grade component system architecture, Headless UI (Radix UI, Base UI, Shadcn),
  compound component composition, polymorphic asChild delegation (@radix-ui/react-slot),
  keyboard navigation (roving tabindex, focus traps), and state machine patterns.
  Use this skill whenever designing scalable UI component libraries, headless design systems,
  or complex accessible widgets (command palettes, multi-tier dialogs, comboboxes).
---

# Design System Architecture Mastery

A comprehensive guide and reference system for architecting enterprise-tier, accessible headless UI libraries, compound components, polymorphic slots, and state machines in React.

---

## 1. The Headless & Compound Component Paradigm

High-craft design systems separate **behavior & accessibility** from **visual presentation**:
- **Headless Core**: Manages ARIA attributes, keyboard navigation (`ArrowUp`/`ArrowDown`/`Escape`), focus trapping, and screen reader announcements.
- **Polymorphic Slot (`asChild`)**: Allows consumers to render custom link components (e.g. Next.js `<Link>`) without creating nested button-in-anchor HTML bugs.
- **Compound Composition**: Intuitive nested JSX APIs (`<Select.Root>`, `<Select.Trigger>`, `<Select.Content>`, `<Select.Item>`).

---

## 2. In-Depth Reference Manuals

Read these specialized reference guides:

1. [Compound Components Pattern](./references/compound-components-pattern.md)
   - React Context wiring, sub-component namespaces, and declarative prop composition.
2. [Polymorphic `asChild` Pattern](./references/polymorphic-as-child.md)
   - Using `@radix-ui/react-slot` (`Slot`) to merge props, refs, and event handlers cleanly.
3. [State Machines for Complex UI](./references/state-machines-for-ui.md)
   - Finite state machines (FSM) for predictable transitions in multi-step wizards, dialogs, and comboboxes.

---

## 3. Production Component Recipes (`examples/`)

- [Accessible Command Palette (`Cmd+K`)](./examples/accessible-command-palette.tsx) - Full headless command palette with keyboard navigation, fuzzy filtering, and smooth enter/exit transitions.
