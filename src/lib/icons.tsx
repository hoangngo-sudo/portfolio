
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
  webpack: "webpack",
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

/** Inline SVG for Base UI */
function BaseUIIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M13.082 6.562a.52.52 0 0 0-.546.529V24a8.727 8.727 0 0 0 .546-17.438M11.446 9.6V24c-4.82 0-8.728-4.298-8.728-9.6V0c4.82 0 8.728 4.298 8.728 9.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Inline SVG for Tailwind CSS */
function TailwindCSSIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"
        fill="#38bdf8"
      />
    </svg>
  );
}

/** Inline SVG for GSAP */
function GSAPIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M9.83 7.59c.817.005 1.437.238 1.842.692c.383.431.567 1.054.547 1.85l-.014.061a.16.16 0 0 1-.148.095h-1.659a.2.2 0 0 1-.199-.195q.002-.634-.39-.71l-.12-.011c-.342 0-.564.211-.57.579c-.007.41.225.783.885 1.423c.868.816 1.217 1.539 1.2 2.493c-.027 1.544-1.077 2.543-2.673 2.543c-.815 0-1.438-.219-1.853-.649c-.42-.437-.612-1.078-.572-1.906a.17.17 0 0 1 .049-.112a.16.16 0 0 1 .112-.045h1.716a.2.2 0 0 1 .069.017a.17.17 0 0 1 .083.098q.008.03.002.06c-.019.298.034.521.151.645a.4.4 0 0 0 .311.121c.317 0 .503-.225.51-.615c.006-.337-.102-.634-.682-1.232c-.751-.734-1.424-1.492-1.403-2.684a2.48 2.48 0 0 1 .774-1.781c.514-.482 1.216-.737 2.032-.737m-5.783.028c.747-.006 1.334.224 1.742.685c.432.487.651 1.221.652 2.182a.16.16 0 0 1-.161.158H4.479a.13.13 0 0 1-.084-.036a.13.13 0 0 1-.035-.085c-.014-.623-.188-.946-.532-.984l-.071-.004c-.69.001-1.097.938-1.313 1.458a5.5 5.5 0 0 0-.426 2.301c.015.366.074.88.42 1.093c.308.189.747.064 1.013-.146c.265-.209.479-.571.569-.901q.02-.07.001-.098q-.01-.011-.032-.015l-.504-.004a.18.18 0 0 1-.129-.06a.1.1 0 0 1-.025-.05a.1.1 0 0 1 0-.056l.316-1.374a.18.18 0 0 1 .157-.134v-.003h3.035l.021.001c.079.01.135.084.134.164v.004l-.316 1.371c-.017.078-.095.135-.184.135h-.381a.064.064 0 0 0-.061.046c-.352 1.194-.829 2.016-1.458 2.509c-.536.42-1.195.616-2.077.616c-.792 0-1.326-.255-1.779-.758c-.598-.666-.845-1.754-.695-3.067c.27-2.463 1.546-4.948 4.004-4.948m16.969.132c2.01 0 3.014.912 2.983 2.711c-.037 2.108-1.321 3.658-3.254 4.016q-.413.073-.833.068l-.934-.004a.06.06 0 0 0-.058.057q0 .015.008.029a.1.1 0 0 0 .022.021l.794.414q.098.053.076.164l-.207.933c-.017.078-.08.123-.171.123h-1.703a.2.2 0 0 1-.071-.015a.2.2 0 0 1-.058-.044a.12.12 0 0 1-.025-.107l1.896-8.241c.019-.086.1-.124.172-.124zm-3.743.012a.2.2 0 0 1 .051.033a.2.2 0 0 1 .034.052a.2.2 0 0 1 .011.059l-.011 8.213a.14.14 0 0 1-.003.058a.14.14 0 0 1-.081.091a.14.14 0 0 1-.064.013h-1.813a.16.16 0 0 1-.111-.045a.2.2 0 0 1-.033-.051a.2.2 0 0 1-.012-.06l.039-.797c.002-.087 0-.111-.051-.117l-.068-.002h-1.714c-.124 0-.133.011-.177.125l-.356.857q-.048.09-.192.09h-1.795c-.109 0-.187-.108-.146-.209l3.718-8.199c.025-.049.063-.123.149-.123h2.566q.03 0 .059.012M15.5 9.985c-.008-.032-.034-.029-.055.013a1 1 0 0 0-.04.093l-1.284 3.183l-.016.048q-.002.01-.001.019l.007.017a.04.04 0 0 0 .015.012a.04.04 0 0 0 .017.006l1.072.014c.119-.01.125-.016.137-.137c.002-.043.154-3.231.148-3.268m4.612-.403a.06.06 0 0 0-.04.017a.06.06 0 0 0-.018.04a.06.06 0 0 0 .03.051l.842.445c.042.023.043.063.029.132c-.007.031-.54 2.375-.539 2.377c.003.003.019.011.099.011h.036c.895-.036 1.383-1.094 1.401-2.121c.009-.555-.18-.896-.523-.946l-.071-.006z" />
    </svg>
  );
}

/** Custom inline SVG icons for skills/tags */
export function getCustomIcon(key: string): ReactNode | null {
  const normalized = normalizeIconKey(key);
  if (normalized === "motion") return <MotionIcon className="size-4" />;
  if (normalized === "baseui" || normalized === "base-ui") return <BaseUIIcon className="size-4" />;
  if (normalized === "tailwindcss") return <TailwindCSSIcon className="size-4" />;
  if (normalized === "gsap") return <GSAPIcon className="size-4" />;
  return null;
}
