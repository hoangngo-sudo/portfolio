"use client";

import type { ContributionData } from "@/lib/github";
import { useTheme } from "@/components/providers/ThemeProvider";

interface GitHubHeatmapProps {
  data: ContributionData;
}

const SHADES: Record<string, string[]> = {
  black: ["#0d0d11", "#2a2a33", "#4a4a56", "#7c8594", "#9ba3b0"],
  teal: ["#0f1f1f", "#134040", "#0a7070", "#0d9488", "#2dd4bf"],
};

function getShade(count: number, shades: string[]): string {
  if (count === 0) return shades[0];
  if (count <= 2) return shades[1];
  if (count <= 5) return shades[2];
  if (count <= 8) return shades[3];
  return shades[4];
}

const CELL_SIZE = 11;
const CELL_GAP = 2;
const CELL_STEP = CELL_SIZE + CELL_GAP;

export function GitHubHeatmap({ data }: GitHubHeatmapProps) {
  const { theme } = useTheme();
  const shades = SHADES[theme] ?? SHADES.black;
  const weeks = data.weeks;
  const svgWidth = weeks.length * CELL_STEP;
  const svgHeight = 7 * CELL_STEP;

  return (
    <div className="flex w-full min-w-0 flex-col gap-2">
      <div className="overflow-x-auto rounded-lg border border-card-border bg-dark-bg p-3">
        <svg
          className="h-auto w-full"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          role="img"
          aria-label={`${data.totalContributions} contributions in the last year`}
        >
          {weeks.map((week, wi) =>
            week.contributionDays.map((day, di) => (
              <rect
                key={`${wi}-${di}`}
                x={wi * CELL_STEP}
                y={di * CELL_STEP}
                width={CELL_SIZE}
                height={CELL_SIZE}
                rx={2}
                fill={getShade(day.contributionCount, shades)}
                aria-label={`${day.date}: ${day.contributionCount} contribution${day.contributionCount !== 1 ? "s" : ""}`}
              />
            ))
          )}
        </svg>
      </div>

      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>{data.totalContributions} contributions in the last year</span>
        <div className="flex items-center gap-1">
          <span>Less</span>
          {shades.map((shade) => (
            <div
              key={shade}
              className="h-[10px] w-[10px] rounded-[2px]"
              style={{ background: shade }}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
