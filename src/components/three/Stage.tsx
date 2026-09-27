"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../ThemeProvider";
import { SceneBoundary, useCanRender3D, useInView, useReducedMotion } from "./support";

const scenes = {
  hero:  dynamic(() => import("./HeroScene"),  { ssr: false }),
  globe: dynamic(() => import("./GlobeScene"), { ssr: false }),
};

/* Lazy, theme-aware wrapper for an inline 3D scene.
   Mounts the canvas when first near the viewport; pauses it while off-screen. */
export default function Stage({ scene, className, label }: { scene: keyof typeof scenes; className?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const canRender = useCanRender3D();
  const reduce = useReducedMotion();
  const inView = useInView(ref);
  // Mount on first approach, then keep the WebGL context alive and just pause when off-screen.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { if (inView) setMounted(true); }, [inView]);
  const Scene = scenes[scene];

  return (
    <div ref={ref} className={`stage ${className ?? ""}`} role="img" aria-label={label}>
      <div className="stage-fallback" aria-hidden />
      {canRender && mounted && (
        <SceneBoundary>
          <Scene theme={theme} reduceMotion={reduce || !inView} />
        </SceneBoundary>
      )}
    </div>
  );
}
