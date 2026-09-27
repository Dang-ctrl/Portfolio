"use client";
import dynamic from "next/dynamic";
import { useTheme } from "../ThemeProvider";
import { SceneBoundary, useCanRender3D, useReducedMotion } from "./support";

const BackgroundScene = dynamic(() => import("./BackgroundScene"), { ssr: false });

/* Fixed layer behind every page: a CSS gradient that always renders,
   plus a lazily-loaded 3D particle field on top of it when WebGL is available. */
export default function Background() {
  const { theme } = useTheme();
  const canRender = useCanRender3D();
  const reduce = useReducedMotion();

  return (
    <div className="bg-layer" aria-hidden>
      <div className="bg-gradient" />
      {canRender && (
        <SceneBoundary>
          <BackgroundScene theme={theme} reduceMotion={reduce} />
        </SceneBoundary>
      )}
      <div className="bg-vignette" />
    </div>
  );
}
