import type { SkillsConfig, StackDescriptionPart } from "@/types/config";
import {
  SectionWrapper,
  Overline,
  SectionHeading,
} from "@/components/ui/SectionWrapper";

/** Maps config icon key to skillicons.dev icon ID */
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
  supabase: "supabase",
};

/** Inline pill used inside the stack description paragraph */
function InlinePill({ name, icon }: { name: string; icon?: string }) {
  const iconId = icon ? skillIconId[icon] : null;
  return (
    <span
      className="mx-0.5 inline-flex h-6.5 cursor-default items-center gap-1.5 rounded-md border-0 bg-light-bg-alt px-1.5 py-0.5 text-xs font-medium text-ink-muted elevation-2 [@media(hover:hover)]:hover:bg-chip-hover-bg [@media(hover:hover)]:hover:text-ink-body [&_img]:pointer-events-none [&_img]:shrink-0"
      style={{ transition: "background-color 150ms cubic-bezier(0.215,0.61,0.355,1), color 150ms cubic-bezier(0.215,0.61,0.355,1)" }}
    >
      {iconId && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://skillicons.dev/icons?i=${iconId}&theme=dark`}
          alt=""
          aria-hidden="true"
          width={16}
          height={16}
          loading="lazy"
          className="size-4"
        />
      )}
      {name}
    </span>
  );
}

/** Skill pill used in the category grid */
function SkillPill({ name, icon }: { name: string; icon?: string }) {
  const iconId = icon ? skillIconId[icon] : null;
  return (
    <span
      className="inline-flex h-6.5 cursor-default items-center gap-1.5 rounded-md border-0 bg-light-bg-alt px-1.5 py-0.5 text-xs font-medium text-ink-muted elevation-2 [@media(hover:hover)]:hover:bg-chip-hover-bg [@media(hover:hover)]:hover:text-ink-body [&_img]:pointer-events-none [&_img]:shrink-0"
      style={{ transition: "background-color 150ms cubic-bezier(0.215,0.61,0.355,1), color 150ms cubic-bezier(0.215,0.61,0.355,1)" }}
    >
      {iconId && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://skillicons.dev/icons?i=${iconId}&theme=dark`}
          alt=""
          aria-hidden="true"
          width={16}
          height={16}
          loading="lazy"
          className="size-4"
        />
      )}
      {name}
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
        <p className="mb-6 leading-relaxed text-ink-muted">
          {data.stackDescription.map((part: StackDescriptionPart, i: number) =>
            part.type === "text" ? (
              <span key={i}>{part.content}</span>
            ) : (
              <InlinePill key={i} name={part.name} icon={part.icon} />
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
                <SkillPill key={skill.name} name={skill.name} icon={skill.icon} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
