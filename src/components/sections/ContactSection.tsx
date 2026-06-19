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
        <div className="button-group flex flex-col items-end gap-3 px-[5vw] pt-20">
          {data.links.map((link) => {
            const Icon = iconMap[link.icon];
            return (
              <div key={link.platform} className="button-group__item w-fit">
                <Chip
                  label={link.label}
                  href={link.href}
                  external
                  icon={Icon ? <Icon className="h-4 w-4" /> : undefined}
                  onClick={() => haptic.trigger("light")}
                  className="bg-dark-bg-alt dm-elevation-2 border-0"
                />
              </div>
            );
          })}
        </div>

        {/* Footer text */}
        <h6
          className="pointer-events-none absolute bottom-0 left-[5vw] translate-y-1/8 select-none font-heading text-4xl font-bold tracking-tight leading-none text-text-primary"
          aria-hidden="true"
        >
          God bless you.
        </h6>
      </div>
    </section>
  );
}
