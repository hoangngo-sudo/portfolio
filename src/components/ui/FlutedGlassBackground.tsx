"use client";

import { useRef, useState, useEffect } from "react";
import { FlutedGlass } from "@paper-design/shaders-react";
import { useTheme } from "@/components/providers/ThemeProvider";

const COLOR_BACK: Record<"teal" | "black", string> = {
  teal: "#0f1a1a",
  black: "#111111",
};

export function FlutedGlassBackground() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        setDims({
          width: Math.round(entry.contentRect.width),
          height: Math.round(entry.contentRect.height),
        });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const colorBack = COLOR_BACK[theme] ?? COLOR_BACK.black;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <FlutedGlass
        width={dims.width}
        height={dims.height}
        image="/flower.webp"
        colorBack={colorBack}
        colorShadow="#000000"
        colorHighlight="#ffffff"
        size={0.5}
        shadows={0.25}
        highlights={0.1}
        shape="lines"
        angle={0}
        distortionShape="prism"
        distortion={0.5}
        shift={0}
        stretch={0}
        blur={0}
        edges={0.25}
        margin={0}
        grainMixer={0}
        grainOverlay={0}
        fit="cover"
      />
    </div>
  );
}
