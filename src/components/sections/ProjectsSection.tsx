import type { ProjectsConfig } from "@/types/config";
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
    <section id="projects" className="bg-dark-bg text-text-primary">
      {/* Title row — within padded container */}
      <div className="mx-auto max-w-6xl px-[5%] pt-16 md:pt-20">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="mb-2 text-xs font-medium tracking-[2px] text-text-muted">
              {data.overline}
            </p>
            <h2 className="mb-8 text-balance font-heading text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
              {data.heading}
            </h2>
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
      </div>

      {/* Carousel — edge to edge, full viewport width */}
      <div className="w-screen">
        <ProjectDragCarousel items={data.items} />
      </div>

      {/* GitHub heatmap — within padded container, with bottom padding */}
      <div className="mx-auto max-w-6xl px-[5%] pb-16 md:pb-20">
        {features.githubHeatmap && (
          <div className="mt-3 w-fit max-w-full rounded-xl bg-card-bg p-5 dm-elevation-2">
            <GitHubHeatmap years={yearData} />
          </div>
        )}
      </div>
    </section>
  );
}