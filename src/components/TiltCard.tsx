"use client";
import { useRef, PointerEvent, ReactNode, CSSProperties } from "react";

/* Wraps content in a CSS-3D tilt surface with a moving glare.
   Pointer-only (no effect on touch) and disabled for reduced motion via CSS. */
export default function TiltCard({
  children,
  className,
  max = 7,
  style,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${(px - 0.5) * max * 2}deg`);
    el.style.setProperty("--rx", `${(0.5 - py) * max * 2}deg`);
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
    el.dataset.tilting = "true";
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    delete el.dataset.tilting;
  };

  return (
    <div ref={ref} className={`tilt ${className ?? ""}`} style={style} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="tilt-inner">
        {children}
        <span className="tilt-glare" aria-hidden />
      </div>
    </div>
  );
}
