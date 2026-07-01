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
        const res = await fetch("/my-resume.html");
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

          {/* A4: 210mm × 297mm — locked ratio, no inner scroll.
               Fonts scale proportionally: at 210mm preview width they're full size;
               on smaller viewports they shrink with the same ratio via vw-based calc. */}
          <style>{`@page { size: A4; margin: 0; }`}</style>
          <div
            style={{ width: "min(210mm, calc(100vw - 10%))", aspectRatio: "210 / 297" }}
            className="mx-auto rounded-sm bg-white
              shadow-[0_1px_3px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.08)]
              px-[20mm] py-[18mm]
              max-sm:px-[12mm] max-sm:py-[10mm]
              font-[Cambria,serif] text-black leading-[1.12]
              text-[min(9pt,1.36vw)]
              [&_h1]:text-[min(9pt,1.36vw)] [&_h1]:font-bold [&_h1]:border-b [&_h1]:border-black
              [&_h1]:pb-[min(1pt,0.15vw)] [&_h1]:mt-[min(10pt,1.5vw)] [&_h1]:mb-[min(4pt,0.6vw)]
              [&_p]:text-[min(9pt,1.36vw)] [&_p]:m-0 [&_p]:mb-[min(1pt,0.15vw)]
              [&_a]:text-[#467886]
              [&_table]:w-full [&_table]:border-collapse
              [&_td]:p-0 [&_td]:align-top [&_td]:text-[min(9pt,1.36vw)]
              [&_.right]:text-right
              [&_ul]:m-0 [&_ul]:pl-6 [&_ul]:list-disc
              [&_li]:text-[min(9pt,1.36vw)] [&_li]:mb-[min(1pt,0.15vw)]
              [&_.header-name]:text-[min(20pt,3vw)] [&_.header-name]:font-bold
              [&_.header-loc]:text-[min(9pt,1.36vw)] [&_.header-loc]:font-bold
              [&_.header-contact]:text-[min(9pt,1.36vw)]
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
