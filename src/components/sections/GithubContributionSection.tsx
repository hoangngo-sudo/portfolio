import type { SynopsisConfig } from "@/types/config";
import {
  SectionWrapper,
  Overline,
  SectionHeading,
} from "@/components/ui/SectionWrapper";
import { GitHubHeatmap } from "@/components/ui/GitHubHeatmap";
import { fetchContributions, generatePlaceholderData } from "@/lib/github";
import config from "@/config/portfolio.config";

interface Props {
  data: SynopsisConfig;
}

export async function GithubContributionSection({ data }: Props) {
  let heatmapData = null;

  if (config.features.githubHeatmap && data.github?.username) {
    heatmapData = await fetchContributions(data.github.username);
  }

  if (!heatmapData) {
    heatmapData = generatePlaceholderData();
  }

  return (
    <SectionWrapper id="contributions" variant="light">
      <Overline>GitHub Activity</Overline>
      <SectionHeading>Contribution History</SectionHeading>
      <div className="mt-6">
        <GitHubHeatmap data={heatmapData} />
      </div>
    </SectionWrapper>
  );
}
