"use client";

import dynamic from "next/dynamic";
import { useTheme } from "@/components/providers/ThemeProvider";
import type { GlobeConfig } from "@/types/config";

const Globe3D = dynamic(
  () => import("@/components/ui/Globe3D").then((m) => m.Globe3D),
  { ssr: false, loading: () => <GlobeSkeleton /> }
);

function GlobeSkeleton() {
  return (
    <div className="flex aspect-square w-full items-center justify-center"></div>
  );
}

interface Props {
  config: GlobeConfig;
}

export function GlobeCard({ config }: Props) {
  const { colors, theme } = useTheme();

  return (
    <div className="w-full cursor-default rounded-2xl bg-light-bg-alt elevation-2">
      <div className="flex flex-col overflow-hidden rounded-2xl">
        {/* Text at top */}
        <div className="px-6 pt-6 pb-2">
          <h3 className="mt-1 text-xl font-bold text-ink-muted">
            {config.heading}
          </h3>
        </div>

        {/*
         * Globe below the text, cropped at the bottom.
         * Negative margin pulls the card bottom up into the globe.
         * overflow:hidden clips the rest.
         */}
        <div className="-mb-[40%] w-full">
          <Globe3D
            markers={config.markers ?? []}
            arcs={config.arcs}
            atmosphereColor={colors.accent}
            autoRotateSpeed={config.autoRotateSpeed}
            arcWidth={config.arcWidth}
            arcHeight={config.arcHeight}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}

