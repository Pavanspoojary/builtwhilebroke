# Web Audio Synthesis Guide for UI Micro-Interactions

Synthesizing clean, tactile acoustic feedback using oscillators and exponential decay envelopes.

---

## 1. Tactile Click Sound (Crisp Transients)

A sharp transient followed by a 20ms pitch drop simulates a physical mechanical switch:

```ts
let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx && typeof window !== "undefined") {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playTactileClick() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  // Rapid pitch drop creates mechanical click feel
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(120, now + 0.03);

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.03);
}
```

---

## 2. Bubble "Pop" Sound

A low-to-high frequency ramp simulating a rounded bubble pop:

```ts
export function playBubblePop() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(300, now);
  osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);

  gain.gain.setValueAtTime(0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.08);
}
```

---

## 3. Harmonic Success Chime (Two-Tone Major Third)

```ts
export function playSuccessChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  const playTone = (freq: number, startTime: number, duration: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  playTone(523.25, now, 0.25);        // C5
  playTone(659.25, now + 0.08, 0.35); // E5
  playTone(783.99, now + 0.16, 0.5);  // G5
}
```
