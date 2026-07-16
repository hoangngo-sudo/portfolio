import type { ProjectsConfig } from "@/types/config";
import {
  SectionWrapper,
  Overline,
  SectionHeading,
} from "@/components/ui/SectionWrapper";
import { IconArrowFromCornerBottomRightFillDuo18 } from "nucleo-ui-fill-duo-18";
import { ProjectDragCarousel } from "@/components/ui/ProjectDragCarousel";
import { GitHubHeatmap } from "@/components/ui/GitHubHeatmap";
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

      <ProjectDragCarousel items={data.items} />

      {features.githubHeatmap && (
        <div className="mt-3 w-fit max-w-full rounded-xl bg-card-bg p-5 dm-elevation-2">
          <GitHubHeatmap years={yearData} />
        </div>
      )}
    </SectionWrapper>
  );
}