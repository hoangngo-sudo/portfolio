
import type { ReactNode } from "react";

/** Shared map from config icon key */
const SKILLICON_MAP: Record<string, string> = {
  python: "python",
  cpp: "cpp",
  java: "java",
  html: "html",
  css: "css",
  javascript: "js",
  typescript: "ts",
  sqlite: "sqlite",
  bash: "bash",
  react: "react",
  nodejs: "nodejs",
  p5js: "p5js",
  nextjs: "nextjs",
  git: "git",
  github: "github",
  linux: "linux",
  docker: "docker",
  vscode: "vscode",
  figma: "figma",
  intellij: "idea",
  vite: "vite",
  supabase: "supabase",
  bootstrap: "bootstrap",
  express: "express",
  mongodb: "mongodb",
};

/** Build a skillicons.dev CDN URL for a given icon ID and theme */
export function buildSkillIconUrl(iconId: string, theme: "light" | "dark"): string {
  return `https://skillicons.dev/icons?i=${iconId}&theme=${theme}`;
}

/** Normalize a tag/key name for icon map lookup */
function normalizeIconKey(key: string): string {
  return key.toLowerCase().replace(/[.\s]/g, "");
}

/** Look up the skillicons.dev icon ID for a config key, or null if unavailable */
export function getSkillIconId(key: string): string | null {
  return SKILLICON_MAP[normalizeIconKey(key)] ?? null;
}

/** Inline SVG for Motion */
function MotionIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="m9.071 7.5-4.747 9H0l3.707-7.027C4.28 8.383 5.715 7.5 6.909 7.5zm10.605 2.25c0-1.243.968-2.25 2.162-2.25S24 8.507 24 9.75 23.032 12 21.838 12s-2.162-1.007-2.162-2.25M9.882 7.5h4.324l-4.747 9H5.135zm5.107 0h4.324l-3.705 7.028c-.575 1.09-2.01 1.972-3.204 1.972h-2.162z" />
    </svg>
  );
}

/** Custom inline SVG icons for skills/tags */
export function getCustomIcon(key: string): ReactNode | null {
  const normalized = normalizeIconKey(key);
  if (normalized === "motion") return <MotionIcon className="size-4" />;
  return null;
}
