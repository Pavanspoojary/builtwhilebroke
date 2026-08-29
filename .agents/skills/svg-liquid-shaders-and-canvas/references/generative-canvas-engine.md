# Generative 2D Canvas Engine

High-performance HTML5 Canvas animation patterns with zero garbage-collection thrashing.

---

## 1. Zero-Allocation Render Loop Pattern

Avoid creating temporary objects (`{ x, y }` or `new Vector()`) inside the `requestAnimationFrame` loop. Pre-allocate arrays and reuse object pools:

```ts
class ParticlePool {
  public x: Float32Array;
  public y: Float32Array;
  public vx: Float32Array;
  public vy: Float32Array;
  public size: Float32Array;
  public count: number;

  constructor(count: number) {
    this.count = count;
    this.x = new Float32Array(count);
    this.y = new Float32Array(count);
    this.vx = new Float32Array(count);
    this.vy = new Float32Array(count);
    this.size = new Float32Array(count);
  }

  public init(width: number, height: number) {
    for (let i = 0; i < this.count; i++) {
      this.x[i] = Math.random() * width;
      this.y[i] = Math.random() * height;
      this.vx[i] = (Math.random() - 0.5) * 1.5;
      this.vy[i] = (Math.random() - 0.5) * 1.5;
      this.size[i] = Math.random() * 2 + 1;
    }
  }

  public update(width: number, height: number) {
    for (let i = 0; i < this.count; i++) {
      this.x[i] += this.vx[i];
      this.y[i] += this.vy[i];

      if (this.x[i] < 0 || this.x[i] > width) this.vx[i] *= -1;
      if (this.y[i] < 0 || this.y[i] > height) this.vy[i] *= -1;
    }
  }
}
```

---

## 2. DPR-Aware High DPI Canvas Scaling

```ts
export function setupHighDPICanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.scale(dpr, dpr);
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
}
```
