"use client";

import { useState, useEffect } from "react";
import type { ContactConfig } from "@/types/config";
import { Chip } from "@/components/ui/Chip";
import { FlutedGlassBackground } from "@/components/ui/FlutedGlassBackground";
import { FiMail, FiInstagram, FiLinkedin, FiGithub } from "react-icons/fi";
import type { IconType } from "react-icons";
import { useWebHaptics } from "web-haptics/react";

const iconMap: Record<string, IconType> = {
  FiMail,
  FiInstagram,
  FiLinkedin,
  FiGithub,
};

interface Props {
  data: ContactConfig;
}

export function ContactSection({ data }: Props) {
  const haptic = useWebHaptics();
  const [shaderReady, setShaderReady] = useState(false);

  // Pre-activate the shader as soon as any "#contact" link is clicked so the
  // WebGL canvas is ready before the smooth-scroll animation arrives.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>(
        'a[href="#contact"]',
      );
      if (link) setShaderReady(true);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Mount the WebGL shader when the courses section scrolls into view — avoids
  // the shader competing for GPU resources during the hero entrance animation.
  useEffect(() => {
    const courses = document.getElementById("courses");
    const activate = () => setShaderReady(true);

    // No courses element or already scrolled past it
    if (!courses || courses.getBoundingClientRect().bottom < 0) {
      const raf = requestAnimationFrame(activate);
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          activate();
          observer.disconnect();
        }
      },
      { rootMargin: "0px" },
    );
    observer.observe(courses);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="contact"
      className="sticky bottom-0 z-0 min-h-screen overflow-hidden bg-dark-bg text-text-primary"
    >
      {shaderReady && <FlutedGlassBackground />}

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center">
        {/* Chips column */}
        <div className="flex flex-col items-end gap-3 px-[5vw] pt-16 md:pt-20">
          {data.links.map((link) => {
            const Icon = iconMap[link.icon];
            return (
              <Chip
                key={link.platform}
                label={link.label}
                href={link.href}
                external
                icon={Icon ? <Icon className="h-4 w-4" /> : undefined}
                onClick={() => haptic.trigger("light")}
                className="bg-dark-bg-alt dm-elevation-2 border-0"
              />
            );
          })}
        </div>

        {/* "Online" text */}
        <h6
          className="pointer-events-none absolute bottom-0 left-[5vw] translate-y-1/5 select-none font-heading text-3xl font-bold tracking-tight text-text-primary md:text-4xl"
          aria-hidden="true"
        >
          Online
        </h6>
      </div>
    </section>
  );
}
