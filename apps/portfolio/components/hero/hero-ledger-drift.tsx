"use client";

/**
 * R3F hero scene — three suspended paper cards drifting slowly under a gilt rim-light.
 *
 * Tri budget: 3 cards × RoundedBox(2,1,1) ≈ ~600 tris each + Drei contact shadows
 * + 1 directional + 1 ambient. Well under the 8k budget.
 *
 * The cards are *meaning vessels* — the buyer's eye fills in the three findings
 * (negotiable / future-target / flagged). No text in 3D; text lives in surrounding DOM.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, RoundedBox } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function Card({
  position,
  rotation,
  color,
  phase,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  phase: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 0.55 + phase) * 0.08;
    ref.current.rotation.x = rotation[0] + Math.sin(t * 0.3 + phase) * 0.04;
    ref.current.rotation.y = rotation[1] + Math.cos(t * 0.22 + phase) * 0.06;
  });
  return (
    <RoundedBox
      ref={ref}
      args={[1.8, 2.4, 0.04]}
      radius={0.04}
      smoothness={3}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={color} roughness={0.75} metalness={0.05} />
      {/* gilt edge — emissive */}
    </RoundedBox>
  );
}

export default function HeroLedgerDrift() {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 6], fov: 36 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.6]}
      shadows
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.15} />
        <directionalLight
          position={[3, 4, 5]}
          intensity={1.0}
          color="#E8C77A"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-4, -1, 2]} intensity={0.18} color="#7BA68A" />
        <Card position={[-1.85, 0, 0.4]} rotation={[0.08, 0.35, -0.18]} color="#1A2820" phase={0} />
        <Card position={[0, 0.05, 0.7]} rotation={[-0.04, -0.05, 0.06]} color="#243A2F" phase={1.4} />
        <Card position={[1.85, -0.05, 0.4]} rotation={[0.06, -0.32, 0.18]} color="#1A2820" phase={2.8} />
        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={0.55}
          blur={2.4}
          far={4}
          resolution={512}
          color="#000000"
        />
        <Environment preset="apartment" />
      </Suspense>
    </Canvas>
  );
}
