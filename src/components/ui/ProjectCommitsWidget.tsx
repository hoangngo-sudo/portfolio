"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

interface Props {
  repo: string; // "owner/slug"
}

interface RecentCommit {
  sha: string;
  message: string; // first line only
  date: string;    // ISO string
}

function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) return `${diffWeeks}w ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.floor(diffMonths / 12)}y ago`;
}

const WIDTHS = [68, 50, 58];

function SkeletonCommits() {
  return (
    <div className="mb-4 rounded-lg bg-black/40 px-4 py-3">
      {/* Header */}
      <div className="mb-2.5 flex items-center gap-1.5">
        <div className="h-3 w-3 rounded-full bg-white/[0.07]" />
        <div className="h-2.5 w-20 rounded bg-white/[0.07]" />
      </div>
      {/* Rows */}
      <div className="flex flex-col gap-2 animate-pulse" aria-hidden="true">
        {WIDTHS.map((w, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-2.5 w-10 shrink-0 rounded bg-white/5" />
            <div className="h-2.5 flex-1 rounded bg-white/[0.07]" style={{ width: `${w}%` }} />
            <div className="h-2.5 w-6 shrink-0 rounded bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CommitList({ commits }: { commits: RecentCommit[] }) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="mb-4 rounded-lg bg-black/40 px-4 py-3">
      {/* Header */}
      <div className="mb-2.5 flex items-center gap-1.5">
        <span className="text-[11px] font-medium uppercase tracking-widest text-text-muted">
          Recent commit
        </span>
      </div>

      <ul className="flex flex-col gap-2" aria-label="Recent commits">
        {commits.map((c, i) => (
          <motion.li
            key={c.sha}
            className="flex items-baseline gap-2 min-w-0"
            initial={reducedMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.25,
              ease: [0.215, 0.61, 0.355, 1],
              delay: reducedMotion ? 0 : i * 0.06,
            }}
          >
            <span className="shrink-0 font-mono text-[10px] leading-none text-accent/50 select-none">
              {c.sha.slice(0, 7)}
            </span>
            <span
              className="flex-1 truncate text-xs leading-snug text-text-secondary"
              title={c.message}
            >
              {c.message}
            </span>
            <time
              dateTime={c.date}
              className="shrink-0 tabular-nums text-[11px] text-text-muted"
            >
              {formatRelativeDate(c.date)}
            </time>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

export function ProjectCommitsWidget({ repo }: Props) {
  const [commits, setCommits] = useState<RecentCommit[] | null | "loading">("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const url = `https://api.github.com/repos/${repo}/commits?per_page=3`;
        const res = await fetch(url, { headers: { "User-Agent": "portfolio-site" } });

        if (!res.ok) { if (!cancelled) setCommits(null); return; }

        const raw: Array<{ sha: string; commit: { message: string; author: { date: string } } }> =
          await res.json();
        if (!Array.isArray(raw)) { if (!cancelled) setCommits(null); return; }

        const result: RecentCommit[] = raw.slice(0, 3).map((c) => ({
          sha: c.sha,
          message: c.commit.message.split("\n")[0].trim(),
          date: c.commit.author.date,
        }));

        if (!cancelled) setCommits(result);
      } catch {
        if (!cancelled) setCommits(null);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [repo]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {commits === "loading" && (
        <motion.div
          key="skeleton"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <SkeletonCommits />
        </motion.div>
      )}
      {Array.isArray(commits) && commits.length > 0 && (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <CommitList commits={commits} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
