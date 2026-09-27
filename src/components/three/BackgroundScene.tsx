"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { palette } from "./support";

const COUNT = 1400;

/* Soft round sprite so points render as dots, not squares. */
function useDotTexture() {
  return useMemo(() => {
    const size = 64;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.6)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

function Field({ theme }: { theme: "light" | "dark" }) {
  const group = useRef<THREE.Group>(null);
  const shapes = useRef<THREE.Group>(null);
  const tex = useDotTexture();
  const pal = palette(theme);

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      // wide, shallow slab of points with a denser core
      const r = Math.pow(Math.random(), 0.6) * 18;
      const a = Math.random() * Math.PI * 2;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 2] = Math.sin(a) * r - 6;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const scroll = typeof window !== "undefined" ? window.scrollY : 0;
    g.rotation.y += delta * 0.018;
    // parallax: follow pointer gently, drift with scroll
    g.rotation.x += ((state.pointer.y * 0.08) - g.rotation.x) * 0.03;
    g.position.x += ((state.pointer.x * 0.5) - g.position.x) * 0.03;
    g.position.y = scroll * 0.0025;
    if (shapes.current) {
      shapes.current.children.forEach((m, i) => {
        m.rotation.x += delta * (0.05 + i * 0.02);
        m.rotation.y += delta * (0.07 + i * 0.015);
      });
      shapes.current.position.y = scroll * 0.004;
    }
  });

  const blending = pal.additive ? THREE.AdditiveBlending : THREE.NormalBlending;

  return (
    <>
      <group ref={group}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            map={tex}
            color={pal.accent}
            size={0.09}
            sizeAttenuation
            transparent
            opacity={pal.additive ? 0.55 : 0.45}
            depthWrite={false}
            blending={blending}
          />
        </points>
      </group>

      {/* A few slow wireframe solids floating at depth */}
      <group ref={shapes}>
        <mesh position={[-11, -4, -12]}>
          <icosahedronGeometry args={[1.6, 1]} />
          <meshBasicMaterial color={pal.accent} wireframe transparent opacity={0.09} />
        </mesh>
        <mesh position={[11, -5, -12]}>
          <torusKnotGeometry args={[1.3, 0.35, 90, 10]} />
          <meshBasicMaterial color={pal.accent} wireframe transparent opacity={0.06} />
        </mesh>
        <mesh position={[10, 6, -13]}>
          <octahedronGeometry args={[1.4, 0]} />
          <meshBasicMaterial color={pal.accent} wireframe transparent opacity={0.08} />
        </mesh>
      </group>
    </>
  );
}

export default function BackgroundScene({ theme, reduceMotion }: { theme: "light" | "dark"; reduceMotion: boolean }) {
  return (
    <Canvas
      className="bg-canvas"
      camera={{ position: [0, 0, 8], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      frameloop={reduceMotion ? "demand" : "always"}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
    >
      <Field theme={theme} />
    </Canvas>
  );
}
