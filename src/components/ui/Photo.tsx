"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import type { Direction } from "@/types/config";
import { ArcTooltip } from "@/components/ui/ArcTooltip";

function getRandomNumberInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

interface PhotoProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  direction?: Direction;
  className?: string;
  label?: string;
}

export function Photo({
  src,
  alt,
  width,
  height,
  direction = "right",
  className,
  label,
}: PhotoProps) {
  const rotation = useMemo(
    () => getRandomNumberInRange(1, 4) * (direction === "left" ? -1 : 1),
    [direction],
  );
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  function handleMouse(event: React.PointerEvent<HTMLDivElement>) {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    const halfWidth = event.currentTarget.offsetWidth / 2;
    const offset = event.nativeEvent.offsetX - halfWidth;
    animationFrameRef.current = requestAnimationFrame(() => {
      x.set(offset);
    });
  }

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileTap={{ scale: 1.2, zIndex: 9999 }}
      whileHover={{
        scale: 1.1,
        rotateZ: 2 * (direction === "left" ? -1 : 1),
        zIndex: 9999,
      }}
      whileDrag={{ scale: 1.1, zIndex: 9999 }}
      initial={{ rotate: 0 }}
      animate={{ rotate: rotation }}
      style={{
        width,
        height,
        perspective: 400,
        zIndex: 1,
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        touchAction: "none",
      }}
      className={`relative mx-auto shrink-0 cursor-grab active:cursor-grabbing ${className ?? ""}`}
      onPointerMove={handleMouse}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      tabIndex={0}
    >
      <div className="relative h-full w-full overflow-hidden rounded-lg shadow-sm shadow-slate-900/30">
        <img
          className="rounded-lg object-cover absolute inset-0 h-full w-full"
          src={src}
          alt={alt}
          draggable={false}
        />
      </div>
      {label && (
        <ArcTooltip label={label} isHovered={isHovered} x={x} />
      )}
    </motion.div>
  );
}
