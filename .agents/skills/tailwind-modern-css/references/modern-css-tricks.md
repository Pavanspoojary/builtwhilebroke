# Modern CSS Patterns & Layout Tricks

Advanced patterns using modern CSS capabilities (`:has()`, container queries, subgrid, and dynamic CSS variables).

---

## 1. Container Queries in Tailwind CSS

Enable responsive behavior based on the parent card's width rather than screen viewport:

```html
<!-- Parent defines container -->
<div class="@container/card rounded-2xl border border-white/10 bg-zinc-900 p-6">
  <!-- Child adjusts layout when container width exceeds 400px -->
  <div class="flex flex-col @md/card:flex-row @md/card:items-center @md/card:justify-between gap-4">
    <div>
      <h4 class="text-white font-semibold">Autonomous Fleet</h4>
      <p class="text-zinc-400 text-xs mt-1">Status: Active</p>
    </div>
    <button class="w-full @md/card:w-auto px-4 py-2 bg-white text-zinc-900 text-xs font-semibold rounded-lg">
      Deploy
    </button>
  </div>
</div>
```

---

## 2. Parent Selection with `:has()`

Style parent containers or sibling elements based on child state without JavaScript:

```css
/* Highlight container when any input inside has focus */
.form-group:has(input:focus-visible) {
  border-color: rgba(139, 92, 246, 0.6);
  box-shadow: 0 0 20px -4px rgba(139, 92, 246, 0.25);
}

/* Dim other siblings when one card is hovered */
.card-grid:has(.card:hover) .card:not(:hover) {
  opacity: 0.5;
  filter: grayscale(40%);
  transform: scale(0.98);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## 3. CSS Subgrid for Perfect Card Alignment

Subgrid ensures that headers, bodies, and footers across multiple grid cards align perfectly with each other, regardless of varying content lengths:

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.bento-card {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3; /* Matches Header, Body, Footer rows */
}
```
