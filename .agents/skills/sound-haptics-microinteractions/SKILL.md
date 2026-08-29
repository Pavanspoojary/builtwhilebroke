---
name: sound-haptics-microinteractions
description: >-
  Architectural patterns for synthesized Web Audio API sound effects (zero-asset clicks, pops,
  whooshes, switches, and completion chimes), mobile haptic vibration feedback, and spatial
  audio panning. Use this skill whenever building tactile micro-interactions, rich sound-designed
  UIs (Apple/Linear-tier feedback), or mobile PWA touch sensations.
---

# Synthesized UI Sound & Haptics Mastery

A guide and reference system for implementing zero-latency programmatic audio synthesis and tactile haptic vibration patterns without downloading external `.mp3`/`.wav` audio files.

---

## 1. Zero-Asset Programmatic Sound Synthesis

By using the browser's native `AudioContext`, we synthesize short, clean, delightful micro-sounds using oscillators, exponential gain envelopes, and biquad filters:
- **Zero latency**: Plays instantly on pointer down without network latency or buffer fetching.
- **Zero payload**: 0KB assets added to bundle size.
- **Dynamic pitch/volume**: Can vary pitch dynamically with scroll speed or cursor velocity.

---

## 2. In-Depth Reference Manuals

Read these specialized reference guides:

1. [Web Audio Synthesis Guide](./references/web-audio-synthesis-guide.md)
   - Synthesis formulas for clicks, switches, pops, whooshes, and melodic chords.
2. [Mobile Haptic Feedback Patterns](./references/mobile-haptic-patterns.md)
   - `navigator.vibrate` patterns for light taps, warning vibrations, and success confirmations.
3. [Spatial Audio Panning with Cursor Position](./references/spatial-audio-panning.md)
   - Using `StereoPannerNode` to pan sounds smoothly between left and right ears based on screen coordinates.

---

## 3. Production Component Recipes (`examples/`)

- [UI Audio Synthesizer](./examples/ui-audio-synthesizer.ts) - Zero-dependency TypeScript audio synthesis engine exporting `sound.click()`, `sound.pop()`, `sound.toggle()`, `sound.success()`.
- [Interactive Tactile Button](./examples/interactive-tactile-button.tsx) - Button with integrated spring scale, synthesized sound, and haptic feedback.
