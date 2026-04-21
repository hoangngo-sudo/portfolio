import type { SynopsisConfig } from "@/types/config";
import {
  SectionWrapper,
  Overline,
  SectionHeading,
} from "@/components/ui/SectionWrapper";
import { GlobeCard } from "@/components/ui/GlobeCard";

interface Props {
  data: SynopsisConfig;
}

export function SynopsisSection({ data }: Props) {
  return (
    <SectionWrapper id="synopsis" variant="light">
      <div className="grid gap-10 md:grid-cols-[1.1fr_1.4fr]">
        <div>
          <Overline>{data.overline}</Overline>
          <SectionHeading>{data.heading}</SectionHeading>
          <p className="mb-6 leading-relaxed text-ink-muted">{data.body}</p>

          {data.links && data.links.length > 0 && (
            <div className="flex flex-col gap-2">
              {data.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent underline-offset-4 hover:underline"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center">
          {data.globe ? (
            <GlobeCard config={data.globe} />
          ) : null}
        </div>
      </div>
    </SectionWrapper>
  );
}
