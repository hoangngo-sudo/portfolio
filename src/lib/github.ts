interface ContributionDay {
  contributionCount: number;
  date: string;
  color: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionData {
  totalContributions: number;
  weeks: ContributionWeek[];
}

/** A single year's contribution data paired with its calendar year. */
export interface YearContributionData {
  year: number;
  data: ContributionData;
}

const YEAR_QUERY = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
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

/** Fetch the user's GitHub account creation year (auto-detect start year).
 *  Cached for 24 hours since account creation date never changes. */
async function fetchGitHubStartYear(username: string): Promise<number> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return new Date().getFullYear();

  const query = `query($username: String!) { user(login: $username) { createdAt } }`;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      console.warn(`[github] startYear query returned ${res.status}`);
      return new Date().getFullYear();
    }

    const json = await res.json();
    const createdAt = json.data?.user?.createdAt;
    if (!createdAt) {
      console.warn(`[github] No createdAt for user "${username}"`);
      return new Date().getFullYear();
    }

    return new Date(createdAt).getFullYear();
  } catch (err) {
    console.warn("[github] Failed to fetch start year:", err);
    return new Date().getFullYear();
  }
}

/** Fetch contributions for a single calendar year. */
async function fetchContributionsForYear(
  username: string,
  year: number
): Promise<ContributionData | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  const from = `${year}-01-01T00:00:00Z`;
  const to = `${year}-12-31T23:59:59Z`;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: YEAR_QUERY,
        variables: { username, from, to },
      }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`[github] API returned ${res.status} for year ${year}`);
      return null;
    }

    const json = await res.json();
    const calendar = json.data?.user?.contributionsCollection?.contributionCalendar ?? null;
    return calendar;
  } catch (err) {
    console.warn(`[github] Failed to fetch contributions for ${year}:`, err);
    return null;
  }
}

/** Fetch contributions for all years from startYear to current year.
 *  Auto-detects startYear via fetchGitHubStartYear() if not provided.
 *  Runs requests in parallel via Promise.all.
 *  Does NOT filter out years with zero contributions; empty years stay navigable. */
export async function fetchAllYearContributions(
  username: string,
  startYear?: number
): Promise<YearContributionData[]> {
  if (startYear === undefined) {
    startYear = await fetchGitHubStartYear(username);
  }
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = startYear; y <= currentYear; y++) years.push(y);

  const results = await Promise.all(
    years.map(async (year) => {
      const data = await fetchContributionsForYear(username, year);
      return { year, data };
    })
  );

  // Keep all years, even zero-contribution ones, for consistent navigation
  return results.filter((r): r is YearContributionData => r.data !== null);
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

/** Generate placeholder heatmap data for all years (fallback when API fails).
 *  Generates 52 full weeks per year anchored at Jan 1 with per-year varied seeds.
 *  Simple approach, visually close enough for placeholder data. */
export function generateYearPlaceholderData(startYear?: number): YearContributionData[] {
  const firstYear = startYear ?? new Date().getFullYear();
  const currentYear = new Date().getFullYear();
  const results: YearContributionData[] = [];

  for (let y = firstYear; y <= currentYear; y++) {
    const seed = 42 + (y - firstYear) * 7; // different seed per year for visual variety
    const rand = seededRandom(seed);
    const weeks: ContributionWeek[] = [];
    // Anchor at Jan 1 of the target year
    const yearStart = new Date(`${y}-01-01T00:00:00`);

    for (let w = 0; w < 52; w++) {
      const days: ContributionDay[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(yearStart);
        date.setDate(date.getDate() + w * 7 + d);
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

    results.push({ year: y, data: { totalContributions: total, weeks } });
  }

  return results;
}
