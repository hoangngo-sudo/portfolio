"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  wrap,
} from "framer-motion";
import type { PanInfo } from "framer-motion";

import { useEffect, useRef, useState } from "react";
import { useWebHaptics } from "web-haptics/react";
import type { MobilePhoto } from "@/types/config";

const fanSpring = { type: "spring" as const, stiffness: 260, damping: 20 };
const snapSpring = { type: "spring" as const, stiffness: 600, damping: 50 };

interface CardStackProps {
  images: MobilePhoto[];
  rotationStep?: number;
}

export function CardStack({ images, rotationStep = 4 }: CardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef<HTMLUListElement>(null);
  const [width, setWidth] = useState(200);

  useEffect(() => {
    if (!ref.current) return;
    setWidth(ref.current.offsetWidth);
  }, []);

  return (
    <ul
      className="relative m-0 aspect-square w-[clamp(180px,55vw,220px)] list-none p-0"
      style={{ perspective: "800px" }}
      ref={ref}
    >
      {images.map((image, index) => (
        <StackImage
          {...image}
          minDistance={width * 0.5}
          rotationStep={rotationStep}
          key={image.src}
          index={index}
          currentIndex={currentIndex}
          totalImages={images.length}
          setNextImage={() => {
            setCurrentIndex(wrap(0, images.length, currentIndex + 1));
          }}
        />
      ))}
    </ul>
  );
}

interface StackImageProps {
  src: string;
  index: number;
  totalImages: number;
  currentIndex: number;
  rotationStep: number;
  minDistance?: number;
  minSpeed?: number;
  setNextImage: () => void;
}

function StackImage({
  src,
  index,
  currentIndex,
  totalImages,
  rotationStep,
  setNextImage,
  minDistance = 200,
  minSpeed = 50,
}: StackImageProps) {
  const shouldReduceMotion = useReducedMotion();
  const haptic = useWebHaptics();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const depth = wrap(0, totalImages, index - currentIndex);
  const zIndex = totalImages - depth;
  const isActive = depth === 0;

  const fanRotation = depth * rotationStep;
  const depthScale = Math.max(0.7, 1 - depth * 0.06);
  const depthOpacity = depth < totalImages * 0.75 ? 1 : 0;

  // 3D tilt derived from drag offset (active card only)
  const rotateX = useTransform(y, [-200, 200], [15, -15]);
  const rotateY = useTransform(x, [-200, 200], [-15, 15]);

  const onDrag = (_: unknown, info: PanInfo) => {
    y.set(info.offset.y);
  };

  const onDragEnd = () => {
    const distance = Math.abs(x.get());
    const speed = Math.abs(x.getVelocity());

    if (distance > minDistance || speed > minSpeed) {
      setNextImage();
    }
    haptic.trigger("light");
    animate(x, 0, snapSpring);
    animate(y, 0, snapSpring);
  };

  return (
    <motion.li
      className="absolute overflow-hidden rounded-[10px] bg-black/5 drop-shadow-[1px_3px_5px_rgba(0,0,0,0.3)] will-change-[transform,opacity,filter]"
      style={{
        width: "100%",
        height: "100%",
        left: "50%",
        top: "50%",
        marginLeft: "-50%",
        marginTop: "-50%",
        transformOrigin: "90% 90%",
        zIndex,
        x,
        rotateX: isActive ? rotateX : 0,
        rotateY: isActive ? rotateY : 0,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        rotateZ: fanRotation,
        scale: depthScale,
        opacity: depthOpacity,
      }}
      whileTap={isActive ? { scale: 0.98 } : {}}
      transition={shouldReduceMotion ? { duration: 0 } : fanSpring}
      drag={isActive ? "x" : false}
      onDrag={isActive ? onDrag : undefined}
      onDragEnd={onDragEnd}
    >
      <img
        className="absolute inset-0 h-full w-full select-none touch-none object-cover"
        src={src}
        alt=""
        onPointerDown={(e) => e.preventDefault()}
      />
    </motion.li>
  );
}
