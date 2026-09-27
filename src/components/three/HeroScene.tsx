"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { palette } from "./support";

function Core({ theme }: { theme: "light" | "dark" }) {
  const rig = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const moons = useRef<THREE.Group>(null);
  const pal = palette(theme);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (rig.current) {
      // tilt toward the pointer
      rig.current.rotation.y += ((state.pointer.x * 0.6) - rig.current.rotation.y) * 0.05;
      rig.current.rotation.x += ((-state.pointer.y * 0.4) - rig.current.rotation.x) * 0.05;
    }
    if (shell.current) {
      shell.current.rotation.y -= delta * 0.12;
      shell.current.rotation.z += delta * 0.05;
    }
    if (ringA.current) ringA.current.rotation.z += delta * 0.25;
    if (ringB.current) ringB.current.rotation.z -= delta * 0.18;
    if (moons.current) moons.current.rotation.y = t * 0.35;
  });

  return (
    <group ref={rig}>
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
        {/* liquid core */}
        <mesh>
          <icosahedronGeometry args={[1.25, 48]} />
          <MeshDistortMaterial
            color={theme === "dark" ? "#1c3a26" : "#cfe7d4"}
            emissive={pal.accentDeep}
            emissiveIntensity={theme === "dark" ? 0.35 : 0.1}
            roughness={0.18}
            metalness={0.65}
            distort={0.38}
            speed={1.6}
          />
        </mesh>

        {/* geodesic shell */}
        <mesh ref={shell}>
          <icosahedronGeometry args={[1.9, 1]} />
          <meshBasicMaterial color={pal.accent} wireframe transparent opacity={theme === "dark" ? 0.22 : 0.35} />
        </mesh>

        {/* orbit rings */}
        <mesh ref={ringA} rotation={[Math.PI / 2.4, 0.2, 0]}>
          <torusGeometry args={[2.45, 0.012, 8, 160]} />
          <meshBasicMaterial color={pal.accent} transparent opacity={0.6} />
        </mesh>
        <mesh ref={ringB} rotation={[Math.PI / 1.7, -0.5, 0]}>
          <torusGeometry args={[2.8, 0.008, 8, 160]} />
          <meshBasicMaterial color={pal.ink} transparent opacity={0.25} />
        </mesh>

        {/* satellites */}
        <group ref={moons} rotation={[0.35, 0, 0.2]}>
          {[0, 1, 2].map((i) => {
            const a = (i / 3) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 2.45, 0, Math.sin(a) * 2.45]}>
                <sphereGeometry args={[i === 0 ? 0.11 : 0.07, 24, 24]} />
                <meshStandardMaterial color={pal.accent} emissive={pal.accent} emissiveIntensity={1.2} />
              </mesh>
            );
          })}
        </group>
      </Float>
    </group>
  );
}

export default function HeroScene({ theme, reduceMotion }: { theme: "light" | "dark"; reduceMotion: boolean }) {
  const pal = palette(theme);
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      frameloop={reduceMotion ? "demand" : "always"}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
    >
      <ambientLight intensity={theme === "dark" ? 0.35 : 0.9} />
      <directionalLight position={[4, 5, 3]} intensity={theme === "dark" ? 1.6 : 1.4} />
      <pointLight position={[-4, -2, 3]} intensity={25} color={pal.accent} />
      <pointLight position={[3, -4, -2]} intensity={12} color="#9ad7ff" />
      <Core theme={theme} />
    </Canvas>
  );
}
