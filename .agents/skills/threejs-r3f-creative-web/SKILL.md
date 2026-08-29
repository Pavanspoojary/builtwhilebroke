---
name: threejs-r3f-creative-web
description: >-
  Expert guide and patterns for Three.js, React Three Fiber (R3F), Drei, custom GLSL shaders,
  interactive 3D spatial heroes, particle clouds, glass refraction materials, and 60fps WebGL
  optimization. Use this skill whenever creating 3D graphics, spatial landing page visuals,
  interactive 3D cards, or custom shader materials.
---

# Three.js, React Three Fiber & GLSL Shaders Mastery

A comprehensive guide and reference system for creating immersive 3D spatial web experiences, interactive 3D heroes, particle fields, and custom GLSL vertex/fragment shaders in React and Next.js applications.

---

## 1. Core Architecture: React Three Fiber (R3F)

### Safe Canvas Setup & Performance Clamping:
Always clamp device pixel ratio to `[1, 2]` to prevent 4K/Retina displays from choking mobile/laptop GPUs:

```tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";

export function SceneCanvas({ children }: { children: React.ReactNode }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="w-full h-full"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
        {children}
      </Float>
    </Canvas>
  );
}
```

---

## 2. In-Depth Reference Manuals

Read these specialized reference guides:

1. [GLSL Shaders & Custom Materials](./references/glsl-shaders-and-materials.md)
   - Custom vertex displacement, iridescent holographic materials, liquid refraction, and noise shaders.
2. [R3F & Drei Best Practices](./references/r3f-best-practices.md)
   - Environment maps (`Environment`), post-processing blooms (`EffectComposer`), mesh transmission, and camera rigging.
3. [3D WebGL Performance & Optimization](./references/3d-performance-optimization.md)
   - `InstancedMesh` for 50,000+ objects in a single draw call, DRACO mesh compression, frustum culling, and texture downscaling.

---

## 3. Production Component Recipes (`examples/`)

- [Particle Field Hero](./examples/particle-field-hero.tsx) - Mouse-reactive 3D particle constellation with smooth spring attraction.
- [Glassmorphic 3D Interactive Card](./examples/glassmorphic-3d-card.tsx) - Translucent refractive 3D geometry floating inside interactive cards.
