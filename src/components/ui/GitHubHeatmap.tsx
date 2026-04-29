"use client";

import type { ContributionData } from "@/lib/github";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { AnimateNumber } from "motion-plus/react";

// ease-out-cubic — same blueprint used in Globe3D depth fade
const EASE_OUT_CUBIC: [number, number, number, number] = [0.215, 0.61, 0.355, 1];

interface GitHubHeatmapProps {
  data: ContributionData;
  /** Background colour the gradient fades into. Defaults to the light-section bg. */
  fadeColor?: string;
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

function getDateParts(dateStr: string): { weekday: string; month: string; day: number; year: number } {
  const d = new Date(dateStr + "T00:00:00");
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    month: d.toLocaleDateString("en-US", { month: "short" }),
    day: d.getDate(),
    year: d.getFullYear(),
  };
}

// Row indices that get a day label (0 = Sun, 1 = Mon … 6 = Sat)
const DAY_LABEL_ROWS: { label: string; row: number }[] = [
  { label: "Mon", row: 1 },
  { label: "Wed", row: 3 },
  { label: "Fri", row: 5 },
];

interface TooltipData {
  date: string;
  count: number;
}

export function GitHubHeatmap({ data, fadeColor = "var(--light-bg)" }: GitHubHeatmapProps) {
  const { colors } = useTheme();
  const weeks = data.weeks;
  const shouldReduceMotion = useReducedMotion();

  // Tooltip visibility + data
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);

  // Scroll edge state — hide blur overlay when already at that edge
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 0);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, []);

  // Run on mount + resize so the right blur appears immediately when SVG overflows
  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);

  // Raw cursor position MotionValues
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Spring-smoothed position so the tooltip path follows cursor naturally.
  // bounce: 0 = critically damped — no overshoot past the cursor.
  const springCfg = shouldReduceMotion
    ? { stiffness: 10000, damping: 1000 } // instant when reduced motion
    : { visualDuration: 0.2, bounce: 0 };
  const springX = useSpring(rawX, springCfg);
  const springY = useSpring(rawY, springCfg);

  // 5-stop opacity scale from the theme accent color
  const rgb = hexToRgb(colors.accent);
  const shades = rgb
    ? [
        "rgba(255, 255, 255, 0.06)",                             // 0
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
      {/* Tooltip — outer drives compositor x/y spring; inner animates opacity+scale */}
      <AnimatePresence>
        {tooltipData && (
          // Outer: zero-anchor fixed wrapper — x/y are compositor-only transforms
          <motion.div
            key="heatmap-tooltip"
            className="pointer-events-none fixed left-0 top-0 z-50"
            style={{ x: springX, y: springY }}
          >
            {/* Inner: CSS translate for centering (compositor) + enter/exit animation */}
            <motion.div
              role="tooltip"
              className="rounded-lg px-2.5 py-1.5 text-xs dm-elevation-2"
              style={{
                // CSS `translate` is compositor-only and independent from Motion's `transform`
                translate: "-50% -100%",
                background: "var(--dark-bg-alt)",
                color: "var(--text-primary)",
              }}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { ease: EASE_OUT_CUBIC, duration: 0.18 },
              }}
              exit={{
                opacity: 0,
                scale: 0.94,
                transition: { ease: EASE_OUT_CUBIC, duration: 0.13 },
              }}
            >
              <span style={{ fontVariantNumeric: "tabular-nums" }}>
                <AnimateNumber
                  transition={{
                    y: { type: "spring", visualDuration: 0.3, bounce: 0.1 },
                    opacity: { ease: "linear", duration: 0.15 },
                  }}
                >
                  {tooltipData.count}
                </AnimateNumber>
                {tooltipData.count === 1 ? " contribution on " : " contributions on "}
                <span className="font-medium">
                  {(() => {
                    const p = getDateParts(tooltipData.date);
                    return (
                      <>
                        {p.weekday}, {p.month}{" "}
                        <AnimateNumber
                          transition={{
                            y: { type: "spring", visualDuration: 0.3, bounce: 0.1 },
                            opacity: { ease: "linear", duration: 0.15 },
                          }}
                        >
                          {p.day}
                        </AnimateNumber>
                        ,{" "}
                        <AnimateNumber
                          transition={{
                            y: { type: "spring", visualDuration: 0.3, bounce: 0.1 },
                            opacity: { ease: "linear", duration: 0.15 },
                          }}
                        >
                          {p.year}
                        </AnimateNumber>
                      </>
                    );
                  })()}
                </span>
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-2">
        {/* Scroll container — wrapped in relative so blur overlays are contained */}
        <div className="relative overflow-hidden">
          {/* Left blur — fades in/out as scroll edge changes */}
          <AnimatePresence>
            {!atStart && (
              <motion.div
                key="blur-left"
                aria-hidden
                className="pointer-events-none absolute top-0 left-0 z-10 w-8"
                style={{
                  height: svgHeight,
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  maskImage: "linear-gradient(to right, black 0%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to right, black 0%, transparent 100%)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { ease: EASE_OUT_CUBIC, duration: 0.15 } }}
                exit={{ opacity: 0, transition: { ease: EASE_OUT_CUBIC, duration: 0.15 } }}
              />
            )}
          </AnimatePresence>
          {/* Right blur — fades in/out as scroll edge changes */}
          <AnimatePresence>
            {!atEnd && (
              <motion.div
                key="blur-right"
                aria-hidden
                className="pointer-events-none absolute top-0 right-0 z-10 w-8"
                style={{
                  height: svgHeight,
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  maskImage: "linear-gradient(to left, black 0%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to left, black 0%, transparent 100%)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { ease: EASE_OUT_CUBIC, duration: 0.15 } }}
                exit={{ opacity: 0, transition: { ease: EASE_OUT_CUBIC, duration: 0.15 } }}
              />
            )}
          </AnimatePresence>
        <div
          ref={scrollRef}
          className="overflow-x-auto"
          style={{ scrollbarWidth: "thin", scrollbarColor: "var(--accent) transparent" }}
          onScroll={updateEdges}
          onPointerMove={(e) => {
            if (e.pointerType === "touch") return;
            rawX.set(e.clientX);
            rawY.set(e.clientY - 10);
          }}
          onPointerLeave={() => setTooltipData(null)}
        >
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
                  onPointerEnter={(e) => {
                    if (e.pointerType === "touch") return;
                    rawX.set(e.clientX);
                    rawY.set(e.clientY - 10);
                    setTooltipData({ date: day.date, count: day.contributionCount });
                  }}
                />
              ))
            )}
          </svg>
        </div>
        </div>

        {/* Footer: contribution total + legend */}
        <div className="flex flex-col gap-1.5 text-xs sm:flex-row sm:items-center sm:justify-between sm:gap-0" style={{ color: "var(--text-muted)" }}>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>
            <AnimateNumber
              transition={{
                y: { type: "spring", visualDuration: 0.5, bounce: 0.1 },
                opacity: { ease: "linear", duration: 0.2 },
              }}
            >
              {data.totalContributions}
            </AnimateNumber>
            {" contributions in the last year"}
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
