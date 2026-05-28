import type { ProjectsConfig } from "@/types/config";
import {
  SectionWrapper,
  Overline,
  SectionHeading,
} from "@/components/ui/SectionWrapper";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { ProjectCommitsWidget } from "@/components/ui/ProjectCommitsWidget";
import { GitHubHeatmap } from "@/components/ui/GitHubHeatmap";
import { fetchContributions, generatePlaceholderData } from "@/lib/github";
import config from "@/config/portfolio.config";

/** Maps a project tag name to skillicons.dev icon ID */
function tagToIconId(tag: string): string | null {
  const normalized = tag.toLowerCase().replace(/[.\s]/g, "");
  const iconMap: Record<string, string> = {
    python: "python", cpp: "cpp", java: "java", html: "html", css: "css",
    javascript: "js", typescript: "ts", sqlite: "sqlite", bash: "bash",
    react: "react", nodejs: "nodejs", p5js: "p5js", nextjs: "nextjs",
    git: "git", github: "github", linux: "linux", docker: "docker",
    vscode: "vscode", figma: "figma", intellij: "idea",
    vite: "vite", supabase: "supabase", bootstrap: "bootstrap",
    express: "express", mongodb: "mongodb",
  };
  return iconMap[normalized] ?? null;
}

interface Props {
  data: ProjectsConfig;
}

export async function ProjectsSection({ data }: Props) {
  let heatmapData = null;
  const { sections, features } = config;
  if (features.githubHeatmap && sections.synopsis?.github?.username) {
    heatmapData = await fetchContributions(sections.synopsis.github.username);
  }
  if (!heatmapData) heatmapData = generatePlaceholderData();

  return (
    <SectionWrapper id="projects" variant="dark">
      <div className="flex items-baseline justify-between">
        <div>
          <Overline>{data.overline}</Overline>
          <SectionHeading>{data.heading}</SectionHeading>
        </div>
        {data.viewAllUrl && (
          <a
            href={data.viewAllUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent hover:underline"
          >
            View all &rarr;
          </a>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((project) => (
          <SpotlightCard
            key={project.title}
            as="a"
            href={project.href || "#"}
            target={project.href ? "_blank" : undefined}
            rel={project.href ? "noopener noreferrer" : undefined}
            className="group flex flex-col rounded-xl bg-card-bg p-5 dm-elevation-2"
          >
            {project.repo && <ProjectCommitsWidget repo={project.repo} />}
            <h3 className="mb-1 text-balance text-base font-semibold text-text-primary">
              {project.title}
            </h3>
            <p className="mb-3 flex-1 text-sm text-text-secondary">
              {project.description}
            </p>
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => {
                  const iconId = tagToIconId(tag);
                  return (
                    <span
                      key={tag}
                      className="inline-flex h-6.5 cursor-default items-center gap-1 rounded-md border-0 bg-dark-bg-alt px-1.5 py-0.5 text-xs font-medium text-text-muted dm-elevation-2 [@media(hover:hover)]:hover:bg-chip-hover-bg [@media(hover:hover)]:hover:text-text-primary [&_img]:pointer-events-none [&_img]:shrink-0"
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
                      {tag}
                    </span>
                  );
                })}
              </div>
            )}
          </SpotlightCard>
        ))}
      </div>

      {features.githubHeatmap && (
        <div className="mt-3 w-fit max-w-full rounded-xl bg-card-bg p-5 dm-elevation-2">
          <GitHubHeatmap data={heatmapData} />
        </div>
      )}
    </SectionWrapper>
  );
}
