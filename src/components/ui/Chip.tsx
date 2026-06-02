"use client";

import { useRef } from "react";
import type { MouseEventHandler, ReactNode } from "react";
import { useSmoothCorners } from "@lisse/react";

interface ChipProps {
  label: string;
  href?: string;
  external?: boolean;
  icon?: ReactNode;
  className?: string;
  id?: string;
  download?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export function Chip({ label, href, external, icon, className = "", id, download, onClick }: ChipProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  // Apply squircle corners on whichever element renders; the hook is a no-op
  // when ref.current is null (the other branch).
  useSmoothCorners(linkRef, { radius: 8, smoothing: 0.6 }, { autoEffects: false });
  useSmoothCorners(spanRef, { radius: 8, smoothing: 0.6 }, { autoEffects: false });

  const baseClasses =
    "inline-flex cursor-pointer items-center gap-2 bg-dark-bg-alt dm-elevation-2 px-6 py-2.5 text-sm font-medium text-text-primary transition-[colors,transform] duration-150 ease-out active:scale-[0.97]";

  if (href) {
    return (
      <a
        ref={linkRef}
        id={id}
        href={href}
        download={download}
        onClick={onClick}
        className={`${baseClasses} ${className} outline-offset-2`}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {icon}
        {label}
      </a>
    );
  }

  return (
    <span ref={spanRef} id={id} className={`${baseClasses} ${className}`}>
      {icon}
      {label}
    </span>
  );
}
