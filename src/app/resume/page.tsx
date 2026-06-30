"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { useSmoothCorners } from "@lisse/react";
import { useWebHaptics } from "web-haptics/react";
import { useSound } from "@web-kits/audio/react";
import { tap } from "@/../lib/audio/minimal";
import { IconFileDownloadFillDuo18, IconUndo2FillDuo18 } from "nucleo-ui-fill-duo-18";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const PRESS_SPRING = { type: "spring" as const, stiffness: 600, damping: 20 };

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, delay: 0.3, ease: [0.215, 0.61, 0.355, 1] },
  },
};

const MotionLink = motion.create(Link);

export default function ResumePage() {
  const backBtnRef = useRef<HTMLAnchorElement>(null);
  const downloadBtnRef = useRef<HTMLAnchorElement>(null);
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const reduced = useReducedMotion();
  const haptic = useWebHaptics();
  const playTap = useSound(tap);

  useSmoothCorners(backBtnRef, { radius: 8, smoothing: 0.6 }, { autoEffects: false });
  useSmoothCorners(downloadBtnRef, { radius: 8, smoothing: 0.6 }, { autoEffects: false });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/resume.html");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        if (!cancelled) setHtml(text);
      } catch (err) {
        console.error("Failed to load resume:", err);
        if (!cancelled) setError(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="relative flex min-h-screen flex-col items-center bg-dark-bg px-[5%] pt-24 pb-32">
      <motion.div
        className="absolute right-4 top-4 z-30"
        variants={fadeIn}
        initial="hidden"
        animate={html !== null ? "visible" : "hidden"}
      >
        <ThemeToggle />
      </motion.div>

      {error ? (
        <p className="text-text-muted">
          Could not load resume. Place <code className="text-accent">resume.docx</code> in the{" "}
          <code className="text-accent">public/</code> folder.
        </p>
      ) : html === null ? null : (
        <>
          {/* Back button above the resume, left-aligned */}
          <div className="mx-auto mb-4 flex w-[210mm] max-w-full items-center max-sm:w-[calc(100vw-10%)]">
            <motion.div variants={fadeIn} initial="hidden" animate="visible">
              <MotionLink
                ref={backBtnRef}
                href="/"
                aria-label="Back to home"
                onClick={() => { haptic.trigger("medium"); playTap(); }}
                whileTap={reduced ? undefined : { scale: 0.97 }}
                transition={reduced ? { duration: 0 } : PRESS_SPRING}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-md
                  bg-dark-bg-alt px-3 py-2 text-sm font-medium
                  text-text-primary dm-elevation-2 touch-manipulation
                  focus-visible:ring-2 focus-visible:ring-accent/50
                  focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg
                  focus-visible:outline-none"
                style={{ transition: "background-color 150ms ease, color 150ms ease" }}
              >
                <IconUndo2FillDuo18 className="size-4" aria-hidden="true" />
                Back
              </MotionLink>
            </motion.div>
          </div>

          {/* A4: 210mm × 297mm. Scales down to fit mobile viewports while preserving A4 ratio. */}
          <style>{`
            @page { size: A4; margin: 0; }
            .resume-a4 {
              width: min(210mm, calc(100vw - 10%));
              aspect-ratio: 210 / 297;
              min-height: auto;
            }
          `}</style>
          <div
            className="mx-auto w-[210mm] min-h-[297mm] max-w-full rounded-sm bg-white
              shadow-[0_1px_3px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.08)]
              px-[20mm] py-[18mm] overflow-auto
              max-sm:w-[calc(100vw-10%)] max-sm:min-h-[calc((100vw-10%)*297/210)]
              max-sm:px-[12mm] max-sm:py-[10mm]
              font-[Cambria,serif] text-black leading-[1.12]
              max-sm:text-[6.5pt]
              [&_h1]:text-[9pt] [&_h1]:font-bold [&_h1]:border-b [&_h1]:border-black [&_h1]:pb-[1pt] [&_h1]:mt-[10pt] [&_h1]:mb-[4pt]
              max-sm:[&_h1]:text-[7pt] max-sm:[&_h1]:mt-[7pt] max-sm:[&_h1]:mb-[3pt]
              [&_p]:text-[9pt] [&_p]:m-0 [&_p]:mb-[1pt]
              max-sm:[&_p]:text-[6.5pt]
              [&_a]:text-[#467886]
              [&_table]:w-full [&_table]:border-collapse
              [&_td]:p-0 [&_td]:align-top [&_td]:text-[9pt]
              max-sm:[&_td]:text-[6.5pt]
              [&_.right]:text-right
              [&_ul]:m-0 [&_ul]:pl-6 [&_ul]:list-disc
              [&_li]:text-[9pt] [&_li]:mb-[1pt]
              max-sm:[&_li]:text-[6.5pt] max-sm:[&_li]:mb-[0.5pt]
              [&_.header-name]:text-[20pt] [&_.header-name]:font-bold
              max-sm:[&_.header-name]:text-[14pt]
              [&_.header-loc]:text-[9pt] [&_.header-loc]:font-bold
              max-sm:[&_.header-loc]:text-[6.5pt]
              [&_.header-contact]:text-[9pt]
              max-sm:[&_.header-contact]:text-[6.5pt]
              [&_.center]:text-center
              [&_.skill-line]:ml-3"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <motion.a
            ref={downloadBtnRef}
            href="/resume.docx"
            download="Hoang_Minh_Ngo_Resume.docx"
            onClick={() => { haptic.trigger("medium"); playTap(); }}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            transition={reduced ? { duration: 0 } : PRESS_SPRING}
            className="fixed bottom-8 left-1/2 z-20 -translate-x-1/2
              inline-flex cursor-pointer items-center gap-2 rounded-md
              bg-dark-bg-alt dm-elevation-2 px-4 py-2 text-sm font-medium
              text-text-primary touch-manipulation
              focus-visible:ring-2 focus-visible:ring-accent/50
              focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg
              focus-visible:outline-none"
            style={{ transition: "background-color 150ms ease, color 150ms ease" }}
          >
            <IconFileDownloadFillDuo18 className="size-4" aria-hidden="true" />
            Download
          </motion.a>
        </>
      )}
    </section>
  );
}
