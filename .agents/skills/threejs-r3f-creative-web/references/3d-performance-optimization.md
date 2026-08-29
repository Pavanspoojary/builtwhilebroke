# 3D WebGL Performance & Optimization

Techniques to ensure 60fps execution on mobile and laptop GPUs with Three.js / R3F.

---

## 1. InstancedMesh: 50,000+ Objects in 1 Draw Call

Never create thousands of individual `<mesh>` nodes. Use `instancedMesh`:

```tsx
import { useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export function ParticleInstances({ count = 2000 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D());

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      dummy.current.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      dummy.current.scale.setScalar(Math.random() * 0.05 + 0.02);
      dummy.current.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.current.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color="#8b5cf6" roughness={0.2} metalness={0.8} />
    </instancedMesh>
  );
}
```

---

## 2. DPR Clamping & Memory Disposal

```tsx
// 1. Clamp DPR to 2 maximum (never render at full 3x retina resolution)
<Canvas dpr={[1, 2]}>

// 2. Dispose of geometries and textures when unmounting
useEffect(() => {
  return () => {
    geometry.dispose();
    material.dispose();
  };
}, []);
```
