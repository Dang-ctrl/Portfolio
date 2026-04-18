"use client";
import { useRouter } from "next/navigation";
import { MouseEvent, ReactNode } from "react";
import { fireWipeOut, setWipeDest } from "./PageWipe";

interface Props { href: string; children: ReactNode; className?: string; style?: React.CSSProperties; }

export default function TLink({ href, children, className, style }: Props) {
  const router = useRouter();
  const handle = async (e: MouseEvent) => {
    e.preventDefault();
    setWipeDest(href);   // tell the overlay which icon to show
    await fireWipeOut();
    router.push(href);
  };
  return <a href={href} onClick={handle} className={className} style={style}>{children}</a>;
}
