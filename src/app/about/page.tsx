"use client";
import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";
import HeroSection    from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";

export default function AboutPage() {
  const ref = useRef<HTMLElement>(null!);
  useReveal(ref);

  return (
    <main ref={ref} style={{ paddingTop: 52 }}>
      <HeroSection />
      <ContactSection />
    </main>
  );
}
