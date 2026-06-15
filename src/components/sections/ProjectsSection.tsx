import type { ProjectsConfig } from "@/types/config";
import {
  SectionWrapper,
  Overline,
  SectionHeading,
} from "@/components/ui/SectionWrapper";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { ProjectCommitsWidget } from "@/components/ui/ProjectCommitsWidget";
import { GitHubHeatmap } from "@/components/ui/GitHubHeatmap";
import { TagPill } from "@/components/ui/TagPill";
import { fetchAllYearContributions, generateYearPlaceholderData, type YearContributionData } from "@/lib/github";
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
  let yearData: YearContributionData[] = [];
  const { sections, features } = config;
  if (features.githubHeatmap && sections.synopsis?.github?.username) {
    yearData = await fetchAllYearContributions(sections.synopsis.github.username);
  }
  if (!yearData || yearData.length === 0) {
    yearData = generateYearPlaceholderData();
  }

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
            className="group flex flex-col bg-card-bg p-5 dm-elevation-2"
            smoothCorners={{ radius: 12, smoothing: 0.6 }}
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
                    <TagPill
                      key={tag}
                      tag={tag}
                      iconId={iconId}
                    />
                  );
                })}
              </div>
            )}
          </SpotlightCard>
        ))}
      </div>

      {features.githubHeatmap && (
        <div className="mt-3 w-fit max-w-full rounded-xl bg-card-bg p-5 dm-elevation-2">
          <GitHubHeatmap years={yearData} />
        </div>
      )}
    </SectionWrapper>
  );
}
