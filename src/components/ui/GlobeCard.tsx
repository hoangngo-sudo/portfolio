"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "@/components/providers/ThemeProvider";
import type { GlobeConfig } from "@/types/config";
import { useSmoothCorners } from "@lisse/react";

const Globe3D = dynamic(
  () => import("@/components/ui/Globe3D").then((m) => m.Globe3D),
  { ssr: false, loading: () => <GlobeSkeleton /> }
);

function GlobeSkeleton() {
  return (
    <div className="aspect-square w-full animate-pulse rounded-full bg-dark-bg-alt/40" />
  );
}

interface Props {
  config: GlobeConfig;
}

export function GlobeCard({ config }: Props) {
  const { colors } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  useSmoothCorners(cardRef, { radius: 16, smoothing: 0.6 }, { autoEffects: false });

  return (
    <div
      ref={cardRef}
      className="flex w-full cursor-default flex-col overflow-hidden bg-dark-bg dm-elevation-2"
    >
      {/* Text at top, which mirrors the reference card layout */}
      <div className="px-6 pt-6 pb-2">
        <h3 className="mt-1 text-xl font-bold text-text-primary">
          {config.heading}
        </h3>
      </div>

      {/*
       * Globe below the text, cropped at the bottom.
       * The negative margin pushes the card's bottom edge UP into the globe,
       * so overflow:hidden on the card clips the lower portion.
       * This creates the "globe peeking out of the card" look from the reference.
       */}
      <div className="-mb-[40%] w-full">
        <Globe3D
          markers={config.markers ?? []}
          atmosphereColor={colors.accent}
          autoRotateSpeed={config.autoRotateSpeed}
        />
      </div>
    </div>
  );
}

