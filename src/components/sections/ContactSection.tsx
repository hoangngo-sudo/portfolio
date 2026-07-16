"use client";

import { useCallback, useState } from "react";
import type { ContactConfig } from "@/types/config";
import { Chip } from "@/components/ui/Chip";
import { FlutedGlassBackground } from "@/components/ui/FlutedGlassBackground";
import { IconEnvelopePenFillDuo18 } from "nucleo-ui-fill-duo-18";
import { IconInstagram } from "nucleo-social-media";
import { IconGithub } from "nucleo-social-media";
import { IconLinkedin } from "nucleo-social-media";
import { useWebHaptics } from "web-haptics/react";

/** Checkmark icon shown briefly after email is copied. */
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      width={18}
      height={18}
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      <path
        opacity="0.4"
        d="M9.00012 17C13.4184 17 17.0001 13.4183 17.0001 9C17.0001 4.58172 13.4184 1 9.00012 1C4.58184 1 1.00012 4.58172 1.00012 9C1.00012 13.4183 4.58184 17 9.00012 17Z"
      />
      <path d="M8.00012 12.5C7.78822 12.5 7.58512 12.4102 7.44252 12.252L5.19252 9.752C4.91522 9.4439 4.94051 8.9698 5.24821 8.6924C5.55581 8.4155 6.02851 8.44 6.30781 8.7481L7.95622 10.5801L11.6564 5.79151C11.9103 5.46341 12.381 5.40329 12.7091 5.65669C13.0362 5.90959 13.0968 6.3808 12.8439 6.7085L8.59391 12.2085C8.45721 12.3848 8.25012 12.4912 8.02852 12.4995C8.01872 12.5 8.00982 12.5 8.00012 12.5Z" />
    </svg>
  );
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
                      ? <CheckIcon className="h-4 w-4" />
                      : Icon
                        ? <Icon className="h-4 w-4" />
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
