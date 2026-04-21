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

/** Maps config icon key → skillicons.dev icon ID */
const skillIconId: Record<string, string> = {
  python: "python",
  cpp: "cpp",
  java: "java",
  html: "html",
  css: "css",
  javascript: "js",
  typescript: "ts",
  sqlite: "sqlite",
  bash: "bash",
  react: "react",
  nodejs: "nodejs",
  p5js: "p5js",
  nextjs: "nextjs",
  git: "git",
  github: "github",
  linux: "linux",
  docker: "docker",
  vscode: "vscode",
  figma: "figma",
  intellij: "idea",
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
          const iconId = skill.icon ? skillIconId[skill.icon] : null;
          return {
            node: (
              <span
                className="group/pill inline-flex items-center justify-center rounded-xl bg-light-bg-alt p-3 elevation-2"
                title={skill.name}
              >
                {iconId ? (
                  <img
                    src={`https://skillicons.dev/icons?i=${iconId}&theme=dark`}
                    alt={skill.name}
                    width={40}
                    height={40}
                    loading="lazy"
                    className="size-10 transition-transform duration-150 ease-out group-hover/pill:scale-125"
                  />
                ) : (
                  <span className="flex size-10 items-center justify-center text-xs font-medium text-ink-muted">
                    {skill.name}
                  </span>
                )}
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
            <div className="py-1">
              <LogoLoop
                logos={logos}
                direction={directionMap[label] ?? "left"}
                logoHeight={64}
                gap={12}
                fadeOut
                fadeOutColor="var(--light-bg)"
                pauseOnHover
                className="py-1.5"
                ariaLabel={`${label} skills`}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
