"use client";

import { useRef } from "react";
import { useSmoothCorners } from "@lisse/react";
import type { SkillsConfig, StackDescriptionPart } from "@/types/config";
import {
  SectionWrapper,
  Overline,
  SectionHeading,
} from "@/components/ui/SectionWrapper";
import { getSkillIconId, getCustomIcon, buildSkillIconUrl } from "@/lib/icons";

/** Skill pill used in both category grid and inline stack descriptions */
function SkillPill({ name, icon, href, inline }: { name: string; icon?: string; href?: string; inline?: boolean }) {
  const iconId = icon ? getSkillIconId(icon) : null;
  const customIcon = icon ? getCustomIcon(icon) : null;
  const ref = useRef<HTMLAnchorElement>(null);
  useSmoothCorners(ref, { radius: 6, smoothing: 0.6 }, { autoEffects: false });
  const className = `${inline ? "mx-0.5 align-middle " : ""}inline-flex h-6.5 items-center gap-1.5 border-0 bg-light-bg-alt px-1.5 py-0.5 text-xs font-medium leading-none text-ink-muted elevation-2 [@media(hover:hover)]:hover:bg-chip-hover-bg [@media(hover:hover)]:hover:text-ink-body [&_img]:pointer-events-none [&_img]:shrink-0`;
  const style = { transition: "background-color 150ms cubic-bezier(0.215,0.61,0.355,1), color 150ms cubic-bezier(0.215,0.61,0.355,1)" };
  const iconEl = iconId ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={buildSkillIconUrl(iconId, "light")}
      alt=""
      aria-hidden="true"
      width={16}
      height={16}
      loading="lazy"
      className="size-4"
    />
  ) : customIcon ? (
    customIcon
  ) : null;

  const content = <>{iconEl}{name}</>;

  if (href) {
    return (
      <a ref={ref} href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
        {content}
      </a>
    );
  }

  return (
    <span ref={ref as unknown as React.Ref<HTMLSpanElement>} className={className} style={style}>
      {content}
    </span>
  );
}

interface Props {
  data: SkillsConfig;
}

export function SkillsSection({ data }: Props) {
  return (
    <SectionWrapper id="skills" variant="light">
      <Overline>{data.overline}</Overline>
      <SectionHeading>{data.heading}</SectionHeading>

      {/* Stack description paragraph */}
      {data.stackDescription && data.stackDescription.length > 0 && (
        <p className="mb-6 text-pretty leading-relaxed text-ink-muted">
          {data.stackDescription.map((part: StackDescriptionPart, i: number) =>
            part.type === "text" ? (
              <span key={i}>{part.content}</span>
            ) : (
              <SkillPill key={i} name={part.name} icon={part.icon} href={part.href} inline />
            )
          )}
        </p>
      )}

      {/* Category pill grid */}
      <div className="flex flex-col gap-5">
        {data.categories.map((category) => (
          <div
            key={category.label}
          >
            {/* XML-tag label */}
            <div className="mb-2 font-mono text-xs text-ink-muted">
              &lt;{category.label.toLowerCase()}/&gt;
            </div>
            {/* Pill row */}
            <div className="flex flex-wrap gap-3">
              {category.items.map((skill) => (
                <SkillPill key={skill.name} name={skill.name} icon={skill.icon} href={skill.href} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
