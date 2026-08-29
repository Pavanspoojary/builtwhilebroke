# Bento Grids, Dashboards & Modern Layouts

A master design reference for structuring bento grids, asymmetric feature sections, and dashboard architectures.

---

## 1. The Anatomy of a World-Class Bento Grid

A Bento Grid organizes varied content (data, visuals, interactive previews, code, metrics) into modular, visually harmonious compartments.

### Structural Rules:
1. **Asymmetric Hierarchy**: Mix 1x1 (square), 2x1 (wide), 1x2 (tall), and 2x2 (feature hero) blocks.
2. **Internal Card Contrast**: Give each card a distinct internal structure (e.g., one card features an interactive mini-chart, another has a live code terminal, another has a large numeric metric with sparkline).
3. **Consistent Corner Radii & Gaps**: Standardize outer gap (`gap-4` or `gap-6`) and card corner radius (`rounded-2xl` or `rounded-3xl`).
4. **Interactive Hover Lift**: Cards should have subtle border illumination and micro-lift on hover.

### 4-Card Bento Grid Layout (Tailwind Blueprint):
```html
<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[280px] max-w-7xl mx-auto p-4">
  
  <!-- Hero Card (Spans 2 cols, 2 rows) -->
  <div class="col-span-1 md:col-span-2 row-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 p-8 backdrop-blur-xl flex flex-col justify-between group hover:border-white/20 transition-all duration-300">
    <div class="space-y-2">
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        Live Stream
      </span>
      <h3 class="text-2xl font-bold text-white">Autonomous Intelligence Core</h3>
      <p class="text-zinc-400 text-sm max-w-md">Real-time telemetry, automated healing, and decentralized multi-agent synchronization.</p>
    </div>
    <!-- Interactive visual slot inside card -->
    <div class="h-48 w-full rounded-2xl bg-black/40 border border-white/5 p-4 flex items-center justify-center">
      <!-- Graphic/Chart component -->
    </div>
  </div>

  <!-- Tall Card (Spans 1 col, 2 rows) -->
  <div class="col-span-1 row-span-2 rounded-3xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl flex flex-col justify-between group hover:border-white/20 transition-all">
    <div>
      <h4 class="text-lg font-semibold text-white">System Health</h4>
      <p class="text-zinc-400 text-xs mt-1">99.99% uptime cluster status</p>
    </div>
    <div class="space-y-3">
      <!-- Metric rows -->
      <div class="flex items-center justify-between text-xs text-zinc-300 py-2 border-b border-white/5">
        <span>Latency</span>
        <span class="font-mono text-emerald-400">12ms</span>
      </div>
      <div class="flex items-center justify-between text-xs text-zinc-300 py-2 border-b border-white/5">
        <span>Memory</span>
        <span class="font-mono text-violet-400">1.2 GB</span>
      </div>
    </div>
  </div>

  <!-- Wide Card (Spans 1 col / 2 col mobile) -->
  <div class="col-span-1 rounded-3xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl group hover:border-white/20 transition-all">
    <div class="text-3xl font-bold font-mono text-white tracking-tight">4.8M+</div>
    <div class="text-zinc-400 text-xs mt-1">Events Dispatched</div>
  </div>

  <!-- Regular Card -->
  <div class="col-span-1 rounded-3xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl group hover:border-white/20 transition-all flex flex-col justify-between">
    <div class="text-sm font-semibold text-white">Zero Configuration</div>
    <div class="text-xs text-zinc-400">Instant cold start under 80ms.</div>
  </div>

</div>
```

---

## 2. Modern Dashboard Layout Patterns

- **Collapsible / Floating Sidebar**: 64px collapsed icon dock, 240px expanded navigation panel with smooth spring transition.
- **Top Context Bar**: Breadcrumbs + Command search bar (`cmd+k`) + Notification center + Workspace switcher.
- **Dynamic Content Canvas**: Centered max-width (`max-w-7xl`) container with fluid padding (`px-4 sm:px-6 lg:px-8`).
