"use client";

import { Ref, forwardRef, useMemo, useState } from "react";
import Image, { ImageProps } from "next/image";
import { motion, useMotionValue, useReducedMotion } from "motion/react";
import { useWebHaptics } from "web-haptics/react";
import { useSound } from "@web-kits/audio/react";
import { pop } from "@/lib/audio/minimal";
import type { Direction } from "@/types/config";
import { ArcTooltip } from "@/components/ui/ArcTooltip";

/*
 * 
 * Photos respond to drag with zero travel (constraints at
 * origin) and high elasticity (0.8) for a rubber-band feel.
 *   whileHover: scale 1.1, rotateZ +/-2 deg, zIndex 9999
 *     → ease transition, 200ms (standard UI, Emil rule #3)
 *   whileTap:   scale 1.2, zIndex 9999
 *     → ease transition, 120ms (micro-interaction)
 *   whileDrag:  scale 1.1, zIndex 9999
 *     → spring via dragTransition (drag = spring physics)
 *
 * On drag start: haptic "light". On drag end: pop sound.
 *   prefers-reduced-motion: hover/tap disabled; drag active.
 *
 *   Hit area    = entire photo surface (drag prop)
 *   Cancel area = ArcTooltip label (stopPropagation)
 *   MotionImage = motion.create(forwardRef(Image))
 *   x, y motion = mouse offset for ArcTooltip spring
 */

const MotionImage = motion.create(
  forwardRef(function MotionImage(
    { alt, ...props }: ImageProps,
    ref: Ref<HTMLImageElement>,
  ) {
    return <Image ref={ref} alt={alt} {...props} />;
  }),
);

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
  const x = useMotionValue(200);
  const y = useMotionValue(200);
  const haptic = useWebHaptics();
  const playPop = useSound(pop);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  const resetMouse = () => {
    x.set(200);
    y.set(200);
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      dragTransition={{ power: 0.1, bounceStiffness: 200 }}
      onDragStart={() => {
        haptic.trigger("light");
      }}
      onDragEnd={() => {
        playPop();
      }}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              scale: 1.1,
              rotateZ: 2 * (direction === "left" ? -1 : 1),
              zIndex: 9999,
              transition: { ease: "easeOut", duration: 0.2 },
            }
      }
      whileTap={
        shouldReduceMotion
          ? undefined
          : {
              scale: 1.2,
              zIndex: 9999,
              transition: { ease: "easeOut", duration: 0.12 },
            }
      }
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
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        resetMouse();
      }}
      draggable={false}
      tabIndex={0}
    >
      <MotionImage
        className="rounded-lg object-cover"
        src={src}
        alt={alt}
        fill
        sizes="220px"
        draggable={false}
      />
      {/* Cancel zone: tooltip label does NOT initiate drag */}
      {label && (
        <div onPointerDown={(e) => e.stopPropagation()}>
          <ArcTooltip label={label} isHovered={isHovered} x={x} />
        </div>
      )}
    </motion.div>
  );
}
