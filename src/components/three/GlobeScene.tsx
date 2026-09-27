"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { palette } from "./support";

const RADIUS = 1.6;
const DOTS = 1600;
const HOME = { lat: 13.08, lon: 80.27 }; // Chennai

function latLonToVec(lat: number, lon: number, r: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

function Globe({ theme, drag }: { theme: "light" | "dark"; drag: React.MutableRefObject<{ vx: number; vy: number; active: boolean }> }) {
  const spin = useRef<THREE.Group>(null);
  const pulse = useRef<THREE.Mesh>(null);
  const pal = palette(theme);

  const dots = useMemo(() => {
    // Fibonacci sphere: evenly spread points
    const arr = new Float32Array(DOTS * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < DOTS; i++) {
      const y = 1 - (i / (DOTS - 1)) * 2;
      const rr = Math.sqrt(1 - y * y);
      const th = golden * i;
      arr[i * 3] = Math.cos(th) * rr * RADIUS;
      arr[i * 3 + 1] = y * RADIUS;
      arr[i * 3 + 2] = Math.sin(th) * rr * RADIUS;
    }
    return arr;
  }, []);

  const home = useMemo(() => latLonToVec(HOME.lat, HOME.lon, RADIUS), []);
  // start rotated so Chennai faces the camera
  const startY = useMemo(() => -Math.atan2(home.x, home.z), [home]);
  const ringQuat = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), home.clone().normalize()),
    [home]
  );

  useFrame((state, delta) => {
    const g = spin.current;
    if (!g) return;
    const d = drag.current;
    if (!d.active) {
      d.vx *= 0.94;
      d.vy *= 0.94;
      g.rotation.y += delta * 0.12;
    }
    g.rotation.y += d.vx;
    g.rotation.x = THREE.MathUtils.clamp(g.rotation.x + d.vy, -0.8, 0.8);
    if (pulse.current) {
      const s = 1 + ((state.clock.elapsedTime * 0.8) % 1) * 2.2;
      pulse.current.scale.setScalar(s);
      (pulse.current.material as THREE.MeshBasicMaterial).opacity = 0.9 * (1 - (s - 1) / 2.2);
    }
  });

  return (
    <group rotation={[0.25, 0, 0]}>
      <group ref={spin} rotation={[0, startY, 0]}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[dots, 3]} />
          </bufferGeometry>
          <pointsMaterial color={pal.ink} size={0.028} sizeAttenuation transparent opacity={0.8} depthWrite={false} />
        </points>
        {/* occluder so back-side dots are dimmed */}
        <mesh>
          <sphereGeometry args={[RADIUS * 0.985, 48, 48]} />
          <meshBasicMaterial color={theme === "dark" ? "#07090a" : "#f2f0e9"} transparent opacity={0.72} />
        </mesh>
        {/* home marker */}
        <mesh position={home}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color={pal.accent} />
        </mesh>
        <mesh ref={pulse} position={home} quaternion={ringQuat}>
          <ringGeometry args={[0.06, 0.075, 40]} />
          <meshBasicMaterial color={pal.accent} transparent side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        {/* equator ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[RADIUS * 1.18, 0.004, 6, 160]} />
          <meshBasicMaterial color={pal.accent} transparent opacity={0.35} />
        </mesh>
      </group>
    </group>
  );
}

export default function GlobeScene({ theme, reduceMotion }: { theme: "light" | "dark"; reduceMotion: boolean }) {
  const drag = useRef({ vx: 0, vy: 0, active: false });
  const last = useRef<{ x: number; y: number } | null>(null);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 40 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      frameloop={reduceMotion ? "demand" : "always"}
      style={{ touchAction: "pan-y", cursor: "grab" }}
      onPointerDown={(e) => { drag.current.active = true; last.current = { x: e.clientX, y: e.clientY }; }}
      onPointerMove={(e) => {
        if (!drag.current.active || !last.current) return;
        drag.current.vx = (e.clientX - last.current.x) * 0.006;
        drag.current.vy = (e.clientY - last.current.y) * 0.004;
        last.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={() => { drag.current.active = false; last.current = null; }}
      onPointerLeave={() => { drag.current.active = false; last.current = null; }}
    >
      <Globe theme={theme} drag={drag} />
    </Canvas>
  );
}
