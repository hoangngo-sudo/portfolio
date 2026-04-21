export interface WeeklyCommitStats {
  week: number;   // Unix timestamp (seconds) of week start
  total: number;  // Total commits that week
}

export interface ProjectCommitsData {
  weeks: WeeklyCommitStats[];  // Last 12 weeks
  totalCommits: number;        // Sum of weeks[*].total
  lastCommitDate: string | null; // ISO date string of last non-zero week, or null
}

/** GLOBAL_MAX: treat 30 commits/week as 100% bar height (absolute, not normalized). */
const COMMIT_GLOBAL_MAX = 30;

export async function fetchCommitActivity(
  repo: string // "owner/slug"
): Promise<ProjectCommitsData | null> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "portfolio-site",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const url = `https://api.github.com/repos/${repo}/stats/commit_activity`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers,
        next: { revalidate: 3600 },
      });

      if (res.status === 202) {
        // GitHub computing stats — wait 1s and retry
        if (attempt < 2) {
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }
        return null;
      }

      if (!res.ok) return null;

      const raw: Array<{ week: number; total: number; days: number[] }> =
        await res.json();

      if (!Array.isArray(raw)) return null;

      const weeks = raw.slice(-12).map(({ week, total }) => ({ week, total }));
      const totalCommits = weeks.reduce((sum, w) => sum + w.total, 0);
      const lastActiveWeek = [...weeks].reverse().find((w) => w.total > 0);
      const lastCommitDate = lastActiveWeek
        ? new Date(lastActiveWeek.week * 1000).toISOString()
        : null;

      return { weeks, totalCommits, lastCommitDate };
    } catch {
      return null;
    }
  }

  return null;
}

// Re-export constant for use in widget
export { COMMIT_GLOBAL_MAX };

export interface ContributionDay {
  contributionCount: number;
  date: string;
  color: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionData {
  totalContributions: number;
  weeks: ContributionWeek[];
}

const QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              color
            }
          }
        }
      }
    }
  }
`;

export async function fetchContributions(
  username: string
): Promise<ContributionData | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn("[github] GITHUB_TOKEN env var is missing — using placeholder heatmap data");
    return null;
  }

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: QUERY, variables: { username } }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`[github] API returned ${res.status} — check if GITHUB_TOKEN is valid`);
      return null;
    }

    const json = await res.json();
    const calendar = json.data?.user?.contributionsCollection?.contributionCalendar ?? null;
    if (!calendar) {
      console.warn(`[github] No contribution data for user "${username}" — check username exists`);
    }
    return calendar;
  } catch (err) {
    console.warn("[github] Failed to fetch contributions:", err);
    return null;
  }
}

/** Simple deterministic PRNG (mulberry32) to avoid hydration mismatch */
function seededRandom(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Generate placeholder heatmap data for when no API token is available.
 *  Uses a fixed seed so server and client produce identical output. */
export function generatePlaceholderData(): ContributionData {
  const rand = seededRandom(42);
  const weeks: ContributionWeek[] = [];
  // Use a fixed reference date so output is stable across renders
  const ref = new Date("2026-03-31");

  for (let w = 51; w >= 0; w--) {
    const days: ContributionDay[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(ref);
      date.setDate(date.getDate() - w * 7 - (6 - d));
      const count = rand() < 0.3 ? 0 : Math.floor(rand() * 12);
      days.push({
        contributionCount: count,
        date: date.toISOString().split("T")[0],
        color: "",
      });
    }
    weeks.push({ contributionDays: days });
  }

  const total = weeks.reduce(
    (sum, w) =>
      sum + w.contributionDays.reduce((s, d) => s + d.contributionCount, 0),
    0
  );

  return { totalContributions: total, weeks };
}
