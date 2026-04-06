import type { ProjectsConfig } from "@/types/config";
import {
  SectionWrapper,
  Overline,
  SectionHeading,
} from "@/components/ui/SectionWrapper";
import { Chip } from "@/components/ui/Chip";

interface Props {
  data: ProjectsConfig;
}

export function ProjectsSection({ data }: Props) {
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
          <a
            key={project.title}
            href={project.href || "#"}
            target={project.href ? "_blank" : undefined}
            rel={project.href ? "noopener noreferrer" : undefined}
            className="group flex flex-col rounded-xl border border-card-border bg-card-bg p-5 transition-colors hover:bg-card-hover"
          >
            {project.image && (
              <div className="mb-3 h-24 w-full overflow-hidden rounded-lg bg-dark-bg-alt" />
            )}
            <h3 className="mb-1 text-base font-semibold text-text-primary">
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
                    className="rounded-md border border-chip-border px-2 py-0.5 text-xs text-text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>
    </SectionWrapper>
  );
}
