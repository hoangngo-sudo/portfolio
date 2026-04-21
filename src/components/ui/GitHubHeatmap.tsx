"use client";

import type { ContributionData } from "@/lib/github";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useState } from "react";

interface GitHubHeatmapProps {
  data: ContributionData;
}

const CELL_SIZE = 12;
const CELL_GAP = 3;
const CELL_STEP = CELL_SIZE + CELL_GAP;
// Space reserved on the left for Mon/Wed/Fri labels
const DAY_LABEL_WIDTH = 26;
// Space reserved on top for month name labels
const MONTH_LABEL_HEIGHT = 16;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([0-9a-f]{3,6})$/i.exec(hex);
  if (!m) return null;
  const h = m[1].length === 3
    ? m[1][0] + m[1][0] + m[1][1] + m[1][1] + m[1][2] + m[1][2]
    : m[1];
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

// Row indices that get a day label (0 = Sun, 1 = Mon … 6 = Sat)
const DAY_LABEL_ROWS: { label: string; row: number }[] = [
  { label: "Mon", row: 1 },
  { label: "Wed", row: 3 },
  { label: "Fri", row: 5 },
];

interface TooltipState {
  date: string;
  count: number;
  clientX: number;
  clientY: number;
}

export function GitHubHeatmap({ data }: GitHubHeatmapProps) {
  const { colors } = useTheme();
  const weeks = data.weeks;
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // 5-stop opacity scale from the theme accent color
  const rgb = hexToRgb(colors.accent);
  const shades = rgb
    ? [
        "rgba(255, 255, 255, 0.06)",                             // 0 — empty
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.22)`,             // 1–2
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.44)`,             // 3–5
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.70)`,             // 6–8
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1.00)`,             // 9+
      ]
    : ["#1a2e2e", "#134040", "#0a7070", "#0d9488", "#2dd4bf"];

  function getShade(count: number): string {
    if (count === 0) return shades[0];
    if (count <= 2) return shades[1];
    if (count <= 5) return shades[2];
    if (count <= 8) return shades[3];
    return shades[4];
  }

  // Derive month labels: emit a label at the first week that starts a new month
  const monthLabels: { label: string; x: number }[] = [];
  weeks.forEach((week, wi) => {
    const firstDay = week.contributionDays[0];
    if (!firstDay) return;
    // Append 'T00:00:00' to avoid UTC-vs-local timezone shift
    const date = new Date(firstDay.date + "T00:00:00");
    if (date.getDate() <= 7) {
      monthLabels.push({
        label: MONTHS[date.getMonth()],
        x: DAY_LABEL_WIDTH + wi * CELL_STEP,
      });
    }
  });

  const svgWidth = DAY_LABEL_WIDTH + weeks.length * CELL_STEP;
  const svgHeight = MONTH_LABEL_HEIGHT + 7 * CELL_STEP;

  return (
    <>
      {/* Tooltip */}
      {tooltip && (
        <div
          role="tooltip"
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-lg px-2.5 py-1.5 text-xs dm-elevation-2"
          style={{
            left: tooltip.clientX,
            top: tooltip.clientY - 10,
            background: "var(--dark-bg-alt)",
            color: "var(--text-primary)",
          }}
        >
          <span className="font-medium">{formatDate(tooltip.date)}</span>
          <span className="mx-1.5" style={{ color: "var(--text-muted)" }}>·</span>
          <span style={{ fontVariantNumeric: "tabular-nums", color: "var(--text-secondary)" }}>
            {tooltip.count} {tooltip.count === 1 ? "contribution" : "contributions"}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {/* Scroll container — no card box, scrolls horizontally; Emil: no fade on scrollable lists */}
        <div className="overflow-x-auto" onMouseLeave={() => setTooltip(null)}>
          <svg
            width={svgWidth}
            height={svgHeight}
            role="img"
            aria-label={`${data.totalContributions.toLocaleString("en-US")} contributions in the last year`}
            className="block"
          >
            {/* Month labels */}
            {monthLabels.map(({ label, x }, i) => (
              <text
                key={i}
                x={x}
                y={MONTH_LABEL_HEIGHT - 5}
                fontSize={10}
                fill="var(--text-muted)"
                fontFamily="inherit"
              >
                {label}
              </text>
            ))}

            {/* Day labels: Mon, Wed, Fri */}
            {DAY_LABEL_ROWS.map(({ label, row }) => (
              <text
                key={label}
                x={0}
                y={MONTH_LABEL_HEIGHT + row * CELL_STEP + CELL_SIZE - 1}
                fontSize={10}
                fill="var(--text-muted)"
                fontFamily="inherit"
              >
                {label}
              </text>
            ))}

            {/* Contribution cells */}
            {weeks.map((week, wi) =>
              week.contributionDays.map((day, di) => (
                <rect
                  key={`${wi}-${di}`}
                  x={DAY_LABEL_WIDTH + wi * CELL_STEP}
                  y={MONTH_LABEL_HEIGHT + di * CELL_STEP}
                  width={CELL_SIZE}
                  height={CELL_SIZE}
                  rx={3}
                  fill={getShade(day.contributionCount)}
                  style={{ transition: "fill 0.25s ease", cursor: "default" }}
                  onMouseEnter={(e) =>
                    setTooltip({
                      date: day.date,
                      count: day.contributionCount,
                      clientX: e.clientX,
                      clientY: e.clientY,
                    })
                  }
                />
              ))
            )}
          </svg>
        </div>

        {/* Footer: contribution total + legend */}
        <div className="flex flex-col gap-1.5 text-xs sm:flex-row sm:items-center sm:justify-between sm:gap-0" style={{ color: "var(--text-muted)" }}>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>
            {data.totalContributions.toLocaleString("en-US")} contributions in the last year
          </span>
          <div className="flex items-center gap-1">
            <span>Less</span>
            {shades.map((shade, i) => (
              <div
                key={i}
                aria-hidden="true"
                className="rounded-sm"
                style={{ width: CELL_SIZE, height: CELL_SIZE, background: shade, transition: "background 0.25s ease" }}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </>
  );
}
