"use client";

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

  return (
    <section
      id="contact"
      className="sticky bottom-0 z-0 min-h-screen overflow-hidden bg-dark-bg text-text-primary"
    >
      <FlutedGlassBackground />

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
        <h2
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/5 select-none font-heading text-[60px] font-bold leading-none text-white sm:left-[5vw] sm:translate-x-0 sm:text-[60px]"
          aria-hidden="true"
        >
          Online
        </h2>
      </div>
    </section>
  );
}
