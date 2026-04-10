import type { CoursesConfig } from "@/types/config";
import {
  SectionWrapper,
  Overline,
  SectionHeading,
} from "@/components/ui/SectionWrapper";
import SpotlightCard from "@/components/ui/SpotlightCard";

interface Props {
  data: CoursesConfig;
}

export function CoursesSection({ data }: Props) {
  return (
    <SectionWrapper id="courses" variant="dark">
      <Overline>{data.overline}</Overline>
      <SectionHeading>{data.heading}</SectionHeading>

      <div className="space-y-8">
        {data.categories.map((category) => (
          <div key={category.label}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
              {category.label}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {category.items.map((course) => (
                <SpotlightCard
                  key={course.code}
                  spotlightSize={60}
                  className="rounded-lg border border-card-border bg-card-bg p-4"
                >
                  <p className="text-sm font-semibold text-text-primary">
                    {course.code}{" "}
                    <span className="font-normal text-text-secondary">
                      · {course.name}
                    </span>
                  </p>
                  {course.description && (
                    <p className="mt-1 text-xs text-text-muted">
                      {course.description}
                    </p>
                  )}
                </SpotlightCard>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
