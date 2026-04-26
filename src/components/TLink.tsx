"use client";
import { useRouter, usePathname } from "next/navigation";
import { MouseEvent, ReactNode, AnchorHTMLAttributes } from "react";
import { fireWipeOut, setWipeDest } from "./PageWipe";

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
}

export default function TLink({ href, children, onClick: _onClick, ...rest }: Props) {
  const router   = useRouter();
  const pathname = usePathname();

  const handle = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Already on this page — do nothing to avoid a frozen wipe overlay
    if (href === pathname) return;
    setWipeDest(href);
    await fireWipeOut();
    router.push(href);
  };

  return (
    <a href={href} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
