"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/* ── Icon components ──────────────────────────────────────────────── */
function IconWork() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
      <rect x="8" y="22" width="48" height="34" rx="4" stroke="white" strokeWidth="2.5"/>
      <path d="M22 22V16a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6" stroke="white" strokeWidth="2.5"/>
      <line x1="8" y1="38" x2="56" y2="38" stroke="white" strokeWidth="2"/>
      <rect x="26" y="34" width="12" height="8" rx="2" stroke="white" strokeWidth="2"/>
    </svg>
  );
}

function IconCraft() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
      <path d="M12 52L26 38" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M26 38L46 12L52 18L26 38Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
      <line x1="38" y1="20" x2="44" y2="26" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="13" cy="51" r="3.5" stroke="white" strokeWidth="2"/>
    </svg>
  );
}

function IconThinking() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
      <path d="M32 10C22.6 10 15 17.6 15 27c0 6.2 3.3 11.6 8.2 14.7V46h17.6v-4.3C45.7 38.6 49 33.2 49 27c0-9.4-7.6-17-17-17z" stroke="white" strokeWidth="2.5"/>
      <line x1="23" y1="50" x2="41" y2="50" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="26" y1="55" x2="38" y2="55" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <line x1="32" y1="20" x2="32" y2="28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="24" x2="36" y2="24" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

function IconNow() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
      <circle cx="32" cy="32" r="22" stroke="white" strokeWidth="2.5"/>
      <line x1="32" y1="17" x2="32" y2="32" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="32" y1="32" x2="43" y2="39" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="32" cy="32" r="2.5" fill="white"/>
    </svg>
  );
}

function IconAbout() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
      <circle cx="32" cy="20" r="10" stroke="white" strokeWidth="2.5"/>
      <path d="M10 56c0-12.2 9.8-22 22-22s22 9.8 22 22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

function IconHome() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
      <path d="M8 28L32 8l24 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 26v26h36V26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="26" y="36" width="12" height="16" rx="1" stroke="white" strokeWidth="2"/>
    </svg>
  );
}

const ICON_MAP: Record<string, () => JSX.Element> = {
  "/work":     IconWork,
  "/craft":    IconCraft,
  "/thinking": IconThinking,
  "/now":      IconNow,
  "/about":    IconAbout,
  "/":         IconHome,
};

const LABEL_MAP: Record<string, string> = {
  "/work":     "Work",
  "/craft":    "Craft",
  "/thinking": "Thinking",
  "/now":      "Now",
  "/about":    "About",
  "/":         "Home",
};

/* ── Module-level state: destination + React setter callback ─────── */
let _dest = "/";
let _setDest: ((d: string) => void) | null = null;

export function setWipeDest(d: string) {
  _dest = d;
  _setDest?.(d);
}

/* ── Trigger: expand the wipe, then pop the icon ─────────────────── */
export async function fireWipeOut(): Promise<void> {
  const overlay = document.getElementById("page-wipe");
  const iconEl  = document.getElementById("page-wipe-icon");
  const ringEl  = document.getElementById("page-wipe-ring");
  const labelEl = document.getElementById("page-wipe-label");
  if (!overlay) return;

  return new Promise((res) => {
    // 1. Expand the green wipe overlay — slower, more cinematic
    overlay.style.transition    = "transform 0.52s cubic-bezier(0.76,0,0.24,1)";
    overlay.style.transformOrigin = "top";
    overlay.style.transform     = "scaleY(1)";

    // 2. Once the cover settles (~340ms), spring the icon + label in
    setTimeout(() => {
      if (iconEl) {
        iconEl.style.transition =
          "opacity 0.28s ease, transform 0.38s cubic-bezier(0.34,1.56,0.64,1)";
        iconEl.style.opacity   = "1";
        iconEl.style.transform = "translate(-50%,-50%) scale(1)";
      }
      if (ringEl) ringEl.classList.add("active");
      if (labelEl) labelEl.classList.add("visible");
    }, 340);

    // 3. Hold for ~360ms of icon face-time, then resolve so router navigates
    setTimeout(res, 700);
  });
}

/* ── Component ────────────────────────────────────────────────────── */
export default function PageWipe() {
  const path = usePathname();
  const iconRef  = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [dest, setDest] = useState<string>("/");

  // Register callback so TLink can push destination
  useEffect(() => {
    _setDest = setDest;
    return () => { _setDest = null; };
  }, []);

  // On path change: snap icon away, retract wipe
  useEffect(() => {
    const overlay  = document.getElementById("page-wipe");
    const iconEl   = iconRef.current;
    const ringEl   = ringRef.current;
    const labelEl  = labelRef.current;

    // Instantly hide icon
    if (iconEl) {
      iconEl.style.transition = "none";
      iconEl.style.opacity    = "0";
      iconEl.style.transform  = "translate(-50%,-50%) scale(0.5)";
    }
    if (ringEl)  ringEl.classList.remove("active");
    if (labelEl) labelEl.classList.remove("visible");

    // Retract overlay after a short tick — slower reveal
    const t = setTimeout(() => {
      if (!overlay) return;
      overlay.style.transition    = "transform 0.6s cubic-bezier(0.76,0,0.24,1)";
      overlay.style.transformOrigin = "bottom";
      overlay.style.transform     = "scaleY(0)";
    }, 40);

    return () => clearTimeout(t);
  }, [path]);

  const IconComp = ICON_MAP[dest] ?? IconHome;
  const label    = LABEL_MAP[dest] ?? "";

  return (
    <>
      {/* Expanding ring */}
      <div id="page-wipe-ring" ref={ringRef} className="wipe-ring" aria-hidden />

      {/* Icon */}
      <div
        id="page-wipe-icon"
        ref={iconRef}
        aria-hidden
        style={{
          position:      "fixed",
          top:           "50%",
          left:          "50%",
          transform:     "translate(-50%,-50%) scale(0.5)",
          opacity:       0,
          zIndex:        10001,
          pointerEvents: "none",
        }}
      >
        <IconComp />
      </div>

      {/* Destination label */}
      <span
        id="page-wipe-label"
        ref={labelRef}
        className="wipe-label"
        aria-hidden
      >
        {label}
      </span>
    </>
  );
}
