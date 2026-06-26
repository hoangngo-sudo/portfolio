import type { ProjectsConfig } from "@/types/config";
import {
  SectionWrapper,
  Overline,
  SectionHeading,
} from "@/components/ui/SectionWrapper";
import { IconArrowFromCornerBottomRightFillDuo18 } from "nucleo-ui-fill-duo-18";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { ProjectCommitsWidget } from "@/components/ui/ProjectCommitsWidget";
import { GitHubHeatmap } from "@/components/ui/GitHubHeatmap";
import { TagPill } from "@/components/ui/TagPill";
import { getSkillIconId, getCustomIcon } from "@/lib/icons";
import { fetchAllYearContributions, generateYearPlaceholderData, type YearContributionData } from "@/lib/github";
import config from "@/config/portfolio.config";

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
            className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
          >
            View all
            <IconArrowFromCornerBottomRightFillDuo18 size={14} /> 
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
                {project.tags.map((tag) => (
                  <TagPill
                    key={tag}
                    tag={tag}
                    iconId={getSkillIconId(tag)}
                    customIcon={getCustomIcon(tag)}
                  />
                ))}
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