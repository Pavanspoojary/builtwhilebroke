# Polymorphic `asChild` Pattern with `@radix-ui/react-slot`

Allowing UI primitives to merge their props and styling onto arbitrary child elements.

---

## 1. Why `asChild` is Superior to `as="a"`

The standard `as` prop (`<Button as="a" href="...">`) requires complex TypeScript polymorphic generics and breaks when passing custom router links (`<Link href="...">`).

The `Slot` pattern merges event handlers, class names, and refs directly onto the child without extra DOM wrappers:

```tsx
import React from "react";
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "primary" | "secondary";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, variant = "primary", className = "", ...props }, ref) => {
    const Component = asChild ? Slot : "button";

    const baseClass = "inline-flex items-center justify-center font-medium rounded-xl px-4 py-2 text-sm transition-all";
    const variantClass = variant === "primary" ? "bg-white text-zinc-950" : "bg-zinc-900 text-white border border-white/10";

    return (
      <Component
        ref={ref}
        className={`${baseClass} ${variantClass} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
```

### Usage with Next.js Link:
```tsx
<Button asChild variant="primary">
  <Link href="/dashboard">
    Go to Dashboard
  </Link>
</Button>
```
Renders a single `<a href="/dashboard" class="...">` tag with no nested button invalid HTML!
