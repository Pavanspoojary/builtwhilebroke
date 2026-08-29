# Web Workers for Heavy Compute

Offloading CPU-intensive algorithms, physics engines, and heavy string indexing away from the main UI thread.

---

## 1. Ergonomic Web Workers with `comlink`

In modern Next.js / Vite apps, use `comlink` to invoke Web Worker functions as standard asynchronous promises without manual `postMessage` boilerplate:

```ts
// worker.ts
import { expose } from "comlink";

const heavyCompute = {
  processData(data: number[]): number {
    // Heavy CPU computation
    return data.reduce((acc, val) => acc + Math.sqrt(val), 0);
  },
};

expose(heavyCompute);
```

```ts
// main.ts
import { wrap } from "comlink";

const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
const api = wrap<{ processData: (data: number[]) => Promise<number> }>(worker);

async function run() {
  const result = await api.processData([1, 2, 3, 4, 5]);
  console.log("Calculated off main thread:", result);
}
```
