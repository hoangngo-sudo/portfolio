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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-card-border bg-dark-bg-alt px-2 py-0.5 text-xs font-medium text-text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </SpotlightCard>
        ))}
      </div>

      {features.githubHeatmap && (
        <div className="mt-4 w-fit max-w-full rounded-xl bg-card-bg p-5 dm-elevation-2">
          <GitHubHeatmap data={heatmapData} />
        </div>
      )}
    </SectionWrapper>
  );
}
