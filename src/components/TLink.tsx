"use client";
import Link, { type LinkProps } from "next/link";
import { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { navigate } from "@/lib/motion";

type Props = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    href: string;
    children: ReactNode;
    /** Text shown on the transition curtain (defaults to the route name). */
    curtainLabel?: string;
  };

/* Internal link that plays the curtain transition. Keeps normal browser
   behaviour for new-tab / modified clicks and still prefetches via next/link. */
export default function TLink({ href, children, onClick, curtainLabel, ...rest }: Props) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (rest.target && rest.target !== "_self") return;
    e.preventDefault();
    navigate(href, curtainLabel);
  };

  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
