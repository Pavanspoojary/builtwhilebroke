# R3F & Drei Best Practices

Architecture patterns for lighting, postprocessing, camera rigging, and smooth frame delivery in React Three Fiber.

---

## 1. Cinematic Post-Processing Bloom & Vignette

```tsx
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette, ToneMapping } from "@react-three/postprocessing";

export function CinematicPostProcessing() {
  return (
    <EffectComposer disableNormalPass>
      {/* Subtle glow on emissive materials */}
      <Bloom
        intensity={0.6}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.3}
        mipmapBlur
      />
      {/* Soft dark perimeter vignette */}
      <Vignette eskil={false} offset={0.1} darkness={0.8} />
      <ToneMapping />
    </EffectComposer>
  );
}
```

---

## 2. Cursor-Reactive Camera Parallax

```tsx
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function CameraRig() {
  useFrame((state) => {
    // Smooth dampening towards cursor position
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.pointer.x * 1.2,
      0.05
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      state.pointer.y * 1.2,
      0.05
    );
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}
```
