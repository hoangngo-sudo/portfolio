import type { CoursesConfig } from "@/types/config";
import {
  SectionWrapper,
  Overline,
  SectionHeading,
} from "@/components/ui/SectionWrapper";
import { CourseShowMoreClient } from "./CourseShowMoreClient";

interface Props {
  data: CoursesConfig;
}

export function CoursesSection({ data }: Props) {
  return (
    <SectionWrapper id="courses" variant="dark">
      <Overline>{data.overline}</Overline>
      <SectionHeading>{data.heading}</SectionHeading>

      <CourseShowMoreClient data={data} />
    </SectionWrapper>
  );
}
