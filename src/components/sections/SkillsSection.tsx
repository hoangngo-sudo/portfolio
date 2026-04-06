import type { SkillsConfig } from "@/types/config";
import {
  SectionWrapper,
  Overline,
  SectionHeading,
} from "@/components/ui/SectionWrapper";
import { Chip } from "@/components/ui/Chip";

interface Props {
  data: SkillsConfig;
}

export function SkillsSection({ data }: Props) {
  return (
    <SectionWrapper id="skills" variant="light">
      <Overline>{data.overline}</Overline>
      <SectionHeading>{data.heading}</SectionHeading>

      <div className="space-y-8">
        {data.categories.map((category) => (
          <div key={category.label}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-muted">
              {category.label}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.items.map((skill) => (
                <Chip
                  key={skill.name}
                  id={`skill-${skill.name.toLowerCase().replace(/[\s.]+/g, "-")}`}
                  label={skill.name}
                  href={skill.href}
                  external
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
