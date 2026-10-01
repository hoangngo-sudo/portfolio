import type { YearContributionData } from "@/lib/github";

/** One day of contribution counts from the live API. */
export interface LiveDayCount {
  date: string; // YYYY-MM-DD
  count: number;
}

/**
 * Public, CORS-enabled source for the same calendar GitHub renders on a
 * profile page. No token is needed, so it is safe to call from the browser.
 * GitHub's own GraphQL API requires a token and cannot be used client-side.
 */
const LIVE_API_BASE = "https://github-contributions-api.jogruber.de/v4";

/**
 * Fetch one calendar year of contribution counts for `username`.
 * Returns null on any failure (network, non-2xx, malformed body) so the
 * caller can keep the build-time data already on screen.
 */
export async function fetchLiveYearCounts(
  username: string,
  year: number,
): Promise<LiveDayCount[] | null> {
  try {
    const res = await fetch(
      `${LIVE_API_BASE}/${encodeURIComponent(username)}?y=${year}`,
    );
    if (!res.ok) return null;
    const json: { contributions?: Array<{ date?: string; count?: number }> } =
      await res.json();
    if (!Array.isArray(json.contributions)) return null;
    const days: LiveDayCount[] = [];
    for (const day of json.contributions) {
      if (typeof day?.date === "string" && typeof day?.count === "number") {
        days.push({ date: day.date, count: day.count });
      }
    }
    return days;
  } catch {
    return null;
  }
}

/**
 * Patch live counts into the build-time data for one year.
 *
 * Pure. Returns the input array by reference when nothing changed, so React
 * can bail out of re-rendering and AnimateNumber never animates a no-op.
 *
 * Only `contributionCount` and `totalContributions` are touched. Week and day
 * arrays keep their length and order, so the heatmap's cell keys stay stable
 * and its entrance stagger does not replay.
 */
export function applyLiveYearCounts(
  years: YearContributionData[],
  year: number,
  days: LiveDayCount[],
): YearContributionData[] {
  const target = years.find((entry) => entry.year === year);
  if (!target || days.length === 0) return years;

  const countByDate = new Map(days.map((day) => [day.date, day.count]));

  let changed = false;
  const weeks = target.data.weeks.map((week) => ({
    contributionDays: week.contributionDays.map((day) => {
      const liveCount = countByDate.get(day.date);
      if (liveCount === undefined || liveCount === day.contributionCount) {
        return day;
      }
      changed = true;
      return { ...day, contributionCount: liveCount };
    }),
  }));

  // Sum only days that belong to the requested year: the first and last weeks
  // carry padding days from the neighbouring years.
  const yearPrefix = `${year}-`;
  let total = 0;
  for (const week of weeks) {
    for (const day of week.contributionDays) {
      if (day.date.startsWith(yearPrefix)) total += day.contributionCount;
    }
  }

  if (!changed && total === target.data.totalContributions) return years;

  return years.map((entry) =>
    entry.year === year
      ? { year: entry.year, data: { totalContributions: total, weeks } }
      : entry,
  );
}
