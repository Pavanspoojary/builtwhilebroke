"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

function FloatingCrystal() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4;
      meshRef.current.rotation.y += delta * 0.6;
    }
  });

  return (
    <Float speed={3} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1.2, 0]} />
        <MeshTransmissionMaterial
          backside
          samples={8}
          thickness={0.8}
          roughness={0.05}
          chromaticAberration={0.15}
          anisotropy={0.3}
          distortion={0.4}
          distortionScale={0.5}
          color="#ffffff"
          bg="#12131a"
        />
      </mesh>
    </Float>
  );
}

export function Glassmorphic3DCard() {
  return (
    <div className="relative w-full max-w-sm h-[400px] rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl flex flex-col justify-between overflow-hidden group shadow-2xl">
      {/* 3D Canvas Layer inside Card */}
      <div className="absolute inset-0 -z-10">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 3.5], fov: 45 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={2} color="#a855f7" />
          <directionalLight position={[-5, -5, -5]} intensity={1.5} color="#06b6d4" />
          <FloatingCrystal />
        </Canvas>
      </div>

      <div>
        <span className="text-xs font-mono text-violet-400">WebGL Shader Core</span>
        <h3 className="text-2xl font-bold text-white mt-1">Spatial Prism</h3>
      </div>

      <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
        <span>Real-time Refraction</span>
        <span className="text-white font-mono">60 FPS</span>
      </div>
    </div>
  );
}
