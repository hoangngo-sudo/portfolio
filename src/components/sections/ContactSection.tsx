"use client";

import { useCallback, useState } from "react";
import type { ContactConfig } from "@/types/config";
import { Chip } from "@/components/ui/Chip";
import { FlutedGlassBackground } from "@/components/ui/FlutedGlassBackground";
import { IconCircleCheckFillDuo18, IconEnvelopePenFillDuo18 } from "nucleo-ui-fill-duo-18";
import { IconInstagram } from "nucleo-social-media";
import { IconGithub } from "nucleo-social-media";
import { IconLinkedin } from "nucleo-social-media";
import { useWebHaptics } from "web-haptics/react";

/** Checkmark icon shown briefly after email is copied. */
function CheckIcon({ className }: { className?: string }) {
  return <IconCircleCheckFillDuo18 className={className} />;
}

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  email: IconEnvelopePenFillDuo18,
  instagram: IconInstagram,
  linkedin: IconLinkedin,
  github: IconGithub,
};

interface Props {
  data: ContactConfig;
}

export function ContactSection({ data }: Props) {
  const haptic = useWebHaptics();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = useCallback(async () => {
    const emailLink = data.links.find((l) => l.platform === "email");
    if (!emailLink) return;
    try {
      await navigator.clipboard.writeText(emailLink.label);
      haptic.trigger("medium");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }, [data.links, haptic]);

  return (
    <section
      id="contact"
      className="sticky bottom-0 z-0 min-h-screen overflow-hidden bg-dark-bg text-text-primary"
    >
      <FlutedGlassBackground />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center">
        {/* Chips column */}
        <div className="button-group button-group--no-blur flex flex-col items-end gap-3 px-[5vw] pt-20">
          {data.links.map((link) => {
            const Icon = iconMap[link.icon];
            const isEmail = link.platform === "email";
            return (
              <div key={link.platform} className="button-group__item w-fit">
                <Chip
                  label={isEmail && copied ? "Copied!" : link.label}
                  href={isEmail ? undefined : link.href}
                  external={!isEmail}
                  icon={
                    isEmail && copied
                      ? <CheckIcon className="size-4" />
                      : Icon
                        ? <Icon className="size-4" />
                        : undefined
                  }
                  iconKey={isEmail ? (copied ? "check" : "email") : undefined}
                  onClick={isEmail ? handleCopyEmail : () => haptic.trigger("light")}
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
          Open To Work.
        </h6>
      </div>
    </section>
  );
}
