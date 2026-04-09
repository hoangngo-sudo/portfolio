"use client";

import { useMemo } from "react";
import type { SkillsConfig } from "@/types/config";
import {
  SectionWrapper,
  Overline,
  SectionHeading,
} from "@/components/ui/SectionWrapper";
import LogoLoop from "@/components/ui/LogoLoop";
import type { LogoItem } from "@/components/ui/LogoLoop";
import {
  SiPython, SiCplusplus, SiOpenjdk, SiHtml5, SiCss,
  SiJavascript, SiTypescript, SiSqlite, SiGnubash,
  SiReact, SiNodedotjs, SiP5Dotjs, SiNextdotjs,
  SiGit, SiGithub, SiLinux, SiDocker,
  SiIntellijidea, SiClaude,
} from "react-icons/si";
import { VscVscodeInsiders } from "react-icons/vsc";

const skillIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  SiPython, SiCplusplus, SiOpenjdk, SiHtml5, SiCss,
  SiJavascript, SiTypescript, SiSqlite, SiGnubash,
  SiReact, SiNodedotjs, SiP5Dotjs, SiNextdotjs,
  SiGit, SiGithub, SiLinux, SiDocker,
  VscVscodeInsiders, SiIntellijidea, SiClaude,
};

const directionMap: Record<string, "left" | "right"> = {
  Language: "right",
  Framework: "left",
  Tool: "right",
};

interface Props {
  data: SkillsConfig;
}

export function SkillsSection({ data }: Props) {
  const categoryLogos = useMemo(
    () =>
      data.categories.map((category) => ({
        label: category.label,
        logos: category.items.map((skill): LogoItem => {
          const IconComp = skill.icon ? skillIconMap[skill.icon] : null;
          return {
            node: (
              <span
                className="inline-flex items-center justify-center rounded-xl border border-chip-border bg-light-bg-alt p-3.5"
                title={skill.name}
              >
                {IconComp && <IconComp className="size-7" />}
              </span>
            ),
            ariaLabel: skill.name,
          };
        }),
      })),
    [data.categories]
  );

  return (
    <SectionWrapper id="skills" variant="light">
      <Overline>{data.overline}</Overline>
      <SectionHeading>{data.heading}</SectionHeading>

      <div className="space-y-8">
        {categoryLogos.map(({ label, logos }) => (
          <div key={label}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-muted">
              {label}
            </h3>
            <div className="py-4">
              <LogoLoop
                logos={logos}
                direction={directionMap[label] ?? "left"}
                logoHeight={56}
                gap={12}
                fadeOut
                fadeOutColor="var(--light-bg)"
                pauseOnHover
                scaleOnHover
                ariaLabel={`${label} skills`}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
