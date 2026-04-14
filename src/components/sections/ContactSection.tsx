"use client";

import type { ContactConfig } from "@/types/config";
import {
  SectionWrapper,
  Overline,
  SectionHeading,
} from "@/components/ui/SectionWrapper";
import { Chip } from "@/components/ui/Chip";
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
    <SectionWrapper id="contact" variant="light">
      <Overline>{data.overline}</Overline>
      <SectionHeading>{data.heading}</SectionHeading>

      <div className="flex flex-wrap gap-3">
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
              className="elevation-3"
            />
          );
        })}
      </div>
    </SectionWrapper>
  );
}
