import type { MouseEventHandler, ReactNode } from "react";

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
  const baseClasses =
    "inline-flex items-center gap-2 rounded-lg border border-chip-border bg-transparent px-4 py-2 text-sm font-medium text-current/80 transition-colors hover:bg-chip-hover-bg hover:text-current";

  if (href) {
    return (
      <a
        id={id}
        href={href}
        download={download}
        onClick={onClick}
        className={`${baseClasses} ${className}`}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {icon}
        {label}
      </a>
    );
  }

  return (
    <span id={id} className={`${baseClasses} ${className}`}>
      {icon}
      {label}
    </span>
  );
}
