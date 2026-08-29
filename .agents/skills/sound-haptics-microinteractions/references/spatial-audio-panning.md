# Spatial Audio Panning with Cursor Position

Using `StereoPannerNode` to dynamically pan synthesized audio based on where on the screen the interaction happened.

---

## 1. Calculating Normalized Stereo Pan

Map client X coordinate to `[-1, 1]` (Left to Right):

```ts
export function playSpatialClick(clientX: number) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  // Create Stereo Panner
  const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
  
  // Calculate pan from -1 (left) to 1 (right)
  const panValue = Math.max(-1, Math.min(1, (clientX / window.innerWidth) * 2 - 1));
  if (panner) {
    panner.pan.setValueAtTime(panValue, now);
  }

  osc.type = "sine";
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(100, now + 0.025);

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

  if (panner) {
    osc.connect(gain);
    gain.connect(panner);
    panner.connect(ctx.destination);
  } else {
    osc.connect(gain);
    gain.connect(ctx.destination);
  }

  osc.start(now);
  osc.stop(now + 0.025);
}
```
