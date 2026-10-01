"use client";

import { useEffect, useState } from "react";
import { GitHubHeatmap } from "@/components/ui/GitHubHeatmap";
import { applyLiveYearCounts, fetchLiveYearCounts } from "@/lib/github-client";
import type { YearContributionData } from "@/lib/github";

/** How often a visible tab re-checks for new contributions. */
const DEFAULT_REFRESH_MS = 5 * 60 * 1000;

interface Props {
  years: YearContributionData[];
  username?: string;
  refreshIntervalMs?: number;
}

/**
 * Keeps the heatmap's newest year in sync with GitHub after the static export
 * was built. The build-time data renders first (no flash); the live API only
 * patches counts in place. Failures are silent: the build-time data stays.
 */
export function LiveGitHubHeatmap({
  years,
  username,
  refreshIntervalMs = DEFAULT_REFRESH_MS,
}: Props) {
  const [liveYears, setLiveYears] = useState(years);

  useEffect(() => {
    const user = username?.trim();
    if (!user) return;
    const currentYear = new Date().getFullYear();
    // Nothing to refresh when the build data predates the current year
    // (e.g. the site was last built in December); that needs a rebuild.
    if (!years.some((entry) => entry.year === currentYear)) return;

    let cancelled = false;

    const refresh = async () => {
      const days = await fetchLiveYearCounts(user, currentYear);
      if (cancelled || !days) return;
      setLiveYears((prev) => applyLiveYearCounts(prev, currentYear, days));
    };

    void refresh();

    function onVisibilityChange() {
      if (document.visibilityState === "visible") void refresh();
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, refreshIntervalMs);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.clearInterval(interval);
    };
  }, [username, years, refreshIntervalMs]);

  return <GitHubHeatmap years={liveYears} />;
}
