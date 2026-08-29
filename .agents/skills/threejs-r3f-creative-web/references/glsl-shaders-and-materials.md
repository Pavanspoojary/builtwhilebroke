# GLSL Shaders & Custom Materials in Three.js / R3F

A guide to writing custom vertex and fragment shaders for iridescent, liquid, and noise-driven materials.

---

## 1. Custom ShaderMaterial with Simplex Noise Displacement

Deforms a 3D mesh surface based on 3D noise over time:

```tsx
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const vertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vDisplacement;

  // Simple pseudo-noise function
  float noise(vec3 p) {
    return sin(p.x * 3.0 + uTime) * sin(p.y * 3.0 + uTime) * sin(p.z * 3.0 + uTime);
  }

  void main() {
    vUv = uv;
    vNormal = normal;
    float d = noise(position * 1.5) * 0.25;
    vDisplacement = d;
    vec3 newPosition = position + normal * d;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vDisplacement;

  void main() {
    // Gradient mix based on displacement depth and normal
    float fresnel = dot(vNormal, vec3(0.0, 0.0, 1.0));
    vec3 color = mix(uColorA, uColorB, vDisplacement * 2.0 + 0.5);
    color += pow(1.0 - fresnel, 3.0) * 0.4; // Soft rim lighting
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function DeformingBlob() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#6366f1") }, // Indigo
      uColorB: { value: new THREE.Color("#ec4899") }, // Pink
    }),
    []
  );

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta * 1.2;
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[1.5, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
```

---

## 2. Ultra-Luxury Glass Refraction (`MeshTransmissionMaterial`)

Using `@react-three/drei`'s optimized physical transmission shader:

```tsx
import { MeshTransmissionMaterial } from "@react-three/drei";

export function LuxuryGlassSphere() {
  return (
    <mesh>
      <sphereGeometry args={[1.2, 32, 32]} />
      <MeshTransmissionMaterial
        backside
        samples={10}
        thickness={0.6}
        roughness={0.05}
        chromaticAberration={0.08}
        anisotropy={0.2}
        distortion={0.3}
        distortionScale={0.4}
        temporalDistortion={0.1}
        color="#ffffff"
        bg="#09090b"
      />
    </mesh>
  );
}
```
