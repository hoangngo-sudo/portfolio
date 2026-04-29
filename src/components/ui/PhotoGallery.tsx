"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Photo } from "@/components/ui/Photo";
import type { DesktopPhoto } from "@/types/config";

interface PhotoGalleryProps {
  photos: DesktopPhoto[];
  animationDelay?: number;
}

export function PhotoGallery({
  photos,
  animationDelay = 0.5,
}: PhotoGalleryProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay * 1000);

    const animationTimer = setTimeout(
      () => {
        setIsLoaded(true);
      },
      (animationDelay + 0.4) * 1000,
    );

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(animationTimer);
    };
  }, [animationDelay]);

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const photoVariants = {
    hidden: () => ({
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
    }),
    visible: (custom: { x: string; y: string; order: number }) => ({
      x: custom.x,
      y: custom.y,
      rotate: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 110,
        damping: 15,
        mass: 1,
        delay: custom.order * 0.1,
      },
    }),
  };

  return (
    <div className="relative mb-8 hidden h-[350px] w-full items-center justify-center lg:flex">
      <motion.div
        className="relative mx-auto flex w-full max-w-6xl justify-center"
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          className="relative flex w-full justify-center"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          animate={shouldReduceMotion ? "visible" : (isLoaded ? "visible" : "hidden")}
        >
          <div className="relative h-[220px] w-[220px]">
            {[...photos].reverse().map((photo, reverseIndex) => {
              const order = photos.length - 1 - reverseIndex;
              return (
                <motion.div
                  key={photo.src}
                  className="absolute left-0 top-0"
                  style={{ zIndex: photo.zIndex, willChange: "transform" }}
                  variants={photoVariants}
                  custom={{ x: photo.x, y: photo.y, order }}
                >
                  <Photo
                    width={220}
                    height={220}
                    src={photo.src}
                    alt="Photo"
                    direction={photo.direction}
                    label={photo.label}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
