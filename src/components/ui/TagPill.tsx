"use client";

import { useRef } from "react";
import { useSmoothCorners } from "@lisse/react";
import { buildSkillIconUrl } from "@/lib/icons";

interface TagPillProps {
  tag: string;
  iconId: string | null;
  customIcon?: React.ReactNode;
}

export function TagPill({ tag, iconId, customIcon }: TagPillProps) {
  const ref = useRef<HTMLSpanElement>(null);
  useSmoothCorners(ref, { radius: 6, smoothing: 0.6 }, { autoEffects: false });

  return (
    <span
      ref={ref}
      className="inline-flex h-6.5 cursor-default items-center gap-1.5 rounded-md border-0 bg-dark-bg-alt px-1.5 py-0.5 text-xs font-medium leading-none text-text-muted dm-elevation-2 [@media(hover:hover)]:hover:bg-chip-hover-bg [@media(hover:hover)]:hover:text-text-primary [&_img]:pointer-events-none [&_img]:shrink-0"
      style={{ transition: "var(--hover-transition)" }}
    >
      {iconId ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={buildSkillIconUrl(iconId, "dark")}
          alt=""
          aria-hidden="true"
          width={16}
          height={16}
          loading="lazy"
          className="size-4"
        />
      ) : customIcon ? (
        customIcon
      ) : null}
      {tag}
    </span>
  );
}
