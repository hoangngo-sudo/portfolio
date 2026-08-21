"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { useWebHaptics } from "web-haptics/react";
import { useSound } from "@web-kits/audio/react";
import { tap } from "@/lib/audio/minimal";
import { IconFileDownloadFillDuo18, IconCircleArrowLeftFillDuo18 } from "nucleo-ui-fill-duo-18";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { PRESS_SPRING, EASE_OUT_CUBIC, EASE_OUT } from "@/lib/motion-tokens";

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, delay: 0.3, ease: EASE_OUT_CUBIC },
  },
};

const MotionLink = motion.create(Link);

export default function ResumePage() {
  const backBtnRef = useRef<HTMLAnchorElement>(null);
  const downloadBtnRef = useRef<HTMLAnchorElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const backRowRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState<string | null>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const reduced = useReducedMotion();
  const haptic = useWebHaptics();
  const playTap = useSound(tap);

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
  
  useLayoutEffect(() => {
    if (html === null) return;
    const top = (backRowRef.current?.getBoundingClientRect().bottom ?? 0) + 16;
    setStartY(window.innerHeight - top);
  }, [html]);

  return (
    <section className="relative flex min-h-screen flex-col items-center overflow-hidden bg-dark-bg px-[5%] pt-24 pb-32">
      <motion.div
        className="absolute right-4 top-4 z-30"
        variants={fadeIn}
        initial="hidden"
        animate={html !== null ? "visible" : "hidden"}
      >
        <ThemeToggle />
      </motion.div>

      {error ? (
        <p className="text-text-muted-dark">
          Could not load resume. Place <code className="text-accent">resume.docx</code> in the{" "}
          <code className="text-accent">public/</code> folder.
        </p>
      ) : html === null ? null : (
        <>
          {/* Back button above the resume, left-aligned */}
          <div ref={backRowRef} className="mx-auto mb-4 flex w-[210mm] max-w-full items-center max-sm:w-[calc(100vw-10%)]">
            <motion.div variants={fadeIn} initial="hidden" animate="visible">
              <MotionLink
                ref={backBtnRef}
                href="/"
                aria-label="Back to home"
                onClick={() => { haptic.trigger("medium"); playTap(); }}
                whileTap={reduced ? undefined : { scale: 0.96 }}
                transition={reduced ? { duration: 0 } : PRESS_SPRING}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-md
                  btn-natural btn-natural-accent px-3 py-2 text-sm
                  touch-manipulation focus-ring"
                style={{ transition: "background-color 150ms ease, color 150ms ease" }}
              >
                <IconCircleArrowLeftFillDuo18 className="size-4" aria-hidden="true" />
                Back
              </MotionLink>
            </motion.div>
          </div>

          {/* ~A4 ratio (210×297). Locked aspect ratio, scales down via box-border + % padding.
               Fonts in the HTML CSS use min(pt, vw) to scale proportionally with the container. */}
          <style>{`@page { size: A4; margin: 0; }`}</style>
          {startY === null ? null : (
            <motion.div
              ref={sheetRef}
              initial={reduced ? false : { y: startY, opacity: 0.001 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                y: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.2, ease: EASE_OUT },
              }}
              style={{ width: "min(793px, 90vw)", aspectRatio: "210 / 297" }}
              className="mx-auto box-border rounded-sm bg-white
                shadow-[0_1px_3px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.08)]
                px-[16mm] py-[18mm]
                max-sm:px-[7.619%] max-sm:py-[8.571%]
                [container-type:inline-size]"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}

          <motion.a
            ref={downloadBtnRef}
            href="/resume.docx"
            download="Hoang_Minh_Ngo_Resume.docx"
            onClick={() => { haptic.trigger("medium"); playTap(); }}
            whileTap={reduced ? undefined : { scale: 0.96 }}
            transition={reduced ? { duration: 0 } : PRESS_SPRING}
            className="fixed bottom-8 left-1/2 z-20 -translate-x-1/2
              inline-flex cursor-pointer items-center gap-2 rounded-md
              btn-natural btn-natural-accent px-4 py-2 text-sm
              touch-manipulation focus-ring"
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
