"use client";

/*
 * ANIMATION STORYBOARD
 *
 * Read top-to-bottom. All timing is spring-driven.
 *
 *      0ms   cards at rest in fan spread (visible variant)
 *    drag    active card tracks pointer freely (dragElastic)
 *  release   below threshold → springs back to rest
 *  release   above threshold → paginate (rotate indices array)
 *              exit variant fades + scales down the old top
 *              visible variant springs the new arrangement
 *              x uses a slower spring than scale/y for organic
 *              "tuck under" cascade as cards rearrange
 *   zIndex   delayed by 50ms so the exiting card renders
 *            above the new top card during the transition
 */

import {
  animate,
  motion,
  AnimatePresence,
  useReducedMotion,
} from "motion/react";
import type { PanInfo } from "motion/react";

import { useRef, useState } from "react";
import { useWebHaptics } from "web-haptics/react";
import { useSound } from "@web-kits/audio/react";
import { pop } from "@/../lib/audio/minimal";
import Image from "next/image";
import type { MobilePhoto } from "@/types/config";
import { useSmoothCorners } from "@lisse/react";

/* Settings: all spring params in one place */
const SETTINGS = {
  /* scale + y share a spring (snappy) */
  springDuration: 0.45,
  springBounce:   0.25,
  /* x uses a slower spring for organic tuck-under */
  xSpringDuration: 0.8,
  xSpringBounce:   0.15,
  /* drag + swipe */
  dragElastic:              0.7,
  swipeConfidenceThreshold: 10000,
  /* zIndex delay MUST match x spring so the card stays
     on top during the entire fly-back, then drops behind
     after landing at the back of the stack. */
  /* zIndex delay MUST match x spring so the card stays
     on top during the entire fly-back, then drops behind
     after landing at the back of the stack. */
  zIndexDelay: 0.8,
};

/* Per-position visual values (index 0 = top card)
 *   Drives the fan spread: scale, y-offset, rotation, x-offset. */
const POSITION = {
  scale:   [1, 0.93, 0.88, 0.84, 0.82],   // scale per stack position (tighter gap = slide, not shrink)
  y:       [0, -10, 0, 10, 16],            // vertical offset per position
  rotate:  [0, 2, 4, 6, 8],                // rotation per position
  x:       [0, 28, 44, 56, 64],            // horizontal offset per position
  zIndex:  [5, 4, 3, 2, 1],                // z-index per position
};

/** Distill swipe offset + velocity into one value.
 *  Less distance needs more velocity; short flicks and long
 *  swipes both work without binary distance/speed checks. */
const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

/** Build the variants object. `custom` is the position index
 *  in the `indices` array (0 = top card). */
const createCardVariants = (reduced: boolean) => ({
  visible: (i: number) => ({
    opacity:  1,
    zIndex:   POSITION.zIndex[i] ?? 1,
    scale:    POSITION.scale[i] ?? 0.78,
    y:        POSITION.y[i] ?? 18,
    rotate:   POSITION.rotate[i] ?? 9,
    x:        POSITION.x[i] ?? 72,
    transition: reduced
      ? { duration: 0 }
      : {
          zIndex: { delay: SETTINGS.zIndexDelay },
          scale:  { type: "spring", duration: SETTINGS.springDuration, bounce: SETTINGS.springBounce },
          y:      { type: "spring", duration: SETTINGS.springDuration, bounce: SETTINGS.springBounce },
          rotate: { type: "spring", duration: SETTINGS.springDuration, bounce: SETTINGS.springBounce },
          x:      { type: "spring", duration: SETTINGS.xSpringDuration, bounce: SETTINGS.xSpringBounce },
        },
  }),
  /* Exit: card slides to the back position, stays fully
     opaque so the slide is visible, then tucks behind. */
  exit: () => ({
    opacity: 1,
    scale:   POSITION.scale[POSITION.scale.length - 1] ?? 0.85,
    y:       POSITION.y[POSITION.y.length - 1] ?? 18,
    rotate:  POSITION.rotate[POSITION.rotate.length - 1] ?? 9,
    x:       POSITION.x[POSITION.x.length - 1] ?? 72,
    zIndex:  0,
    transition: reduced
      ? { duration: 0 }
      : {
          scale:   { type: "spring", duration: SETTINGS.xSpringDuration, bounce: SETTINGS.xSpringBounce },
          y:       { type: "spring", duration: SETTINGS.xSpringDuration, bounce: SETTINGS.xSpringBounce },
          rotate:  { type: "spring", duration: SETTINGS.xSpringDuration, bounce: SETTINGS.xSpringBounce },
          x:       { type: "spring", duration: SETTINGS.xSpringDuration, bounce: SETTINGS.xSpringBounce },
        },
  }),
});

interface CardStackProps {
  images: MobilePhoto[];
}

export function CardStack({ images }: CardStackProps) {
  const shouldReduceMotion = useReducedMotion();
  const haptic = useWebHaptics();
  const playPop = useSound(pop);

  /* indices[0] is always the top card. paginate rotates the
     array so each card moves to the next position, and the
     old top wraps to the back. */
  const [indices, setIndices] = useState(() =>
    images.map((_, i) => i),
  );

  /* Each card gets a token that increments when it's swiped.
     Changing the token forces AnimatePresence to exit the
     old key → exit variant slides from drag position to back. */
  const [tokens, setTokens] = useState<Record<string, number>>({});

  const paginate = () => {
    haptic.trigger("light");
    playPop();
    const topSrc = images[indices[0]].src;
    setTokens((prev) => ({ ...prev, [topSrc]: (prev[topSrc] ?? 0) + 1 }));
    setIndices((prev) => [...prev.slice(1), prev[0]]);
  };

  const cardVariants = createCardVariants(!!shouldReduceMotion);

  return (
    <div
      className="relative aspect-square w-[clamp(150px,45vw,200px)]"
      style={{ perspective: "400px" }}
    >
      <AnimatePresence initial={false}>
        {indices.map((imageIndex, i) => (
          <StackCard
            key={`${images[imageIndex].src}-${tokens[images[imageIndex].src] ?? 0}`}
            image={images[imageIndex]}
            position={i}
            totalImages={images.length}
            cardVariants={cardVariants}
            onPaginate={paginate}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface StackCardProps {
  image: MobilePhoto;
  position: number;
  totalImages: number;
  cardVariants: ReturnType<typeof createCardVariants>;
  onPaginate: () => void;
}

function StackCard({
  image,
  position,
  totalImages,
  cardVariants,
  onPaginate,
}: StackCardProps) {
  const liRef = useRef<HTMLLIElement>(null);
  useSmoothCorners(liRef, { radius: 10, smoothing: 0.6 }, { autoEffects: false });

  const handleDragEnd = (_: unknown, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (
      swipe < -SETTINGS.swipeConfidenceThreshold ||
      swipe > SETTINGS.swipeConfidenceThreshold
    ) {
      /* Above threshold: paginate → token changes → AnimatePresence
         exits old key → exit variant slides from drag position to back. */
      onPaginate();
      return;
    }
    /* Below threshold: explicitly snap back to center.
       animate() on the DOM ref animates x/y transform directly. */
    animate(liRef.current!, { x: 0, y: 0 }, {
      type: "spring",
      stiffness: 600,
      damping: 50,
    });
  };

  return (
    <motion.li
      ref={liRef}
      className="absolute inset-0 list-none overflow-hidden bg-black/5 drop-shadow-[1px_3px_5px_rgba(0,0,0,0.3)] will-change-[transform,opacity]"
      custom={position}
      variants={cardVariants}
      initial="exit"
      animate="visible"
      exit="exit"
      drag
      dragElastic={SETTINGS.dragElastic}
      onDragEnd={handleDragEnd}
      aria-label={`Photo ${position + 1} of ${totalImages}`}
    >
      <Image
        className="absolute inset-0 h-full w-full select-none touch-none object-cover"
        src={image.src}
        alt={`Portrait photo ${position + 1}`}
        fill
        sizes="(max-width: 1024px) 55vw, 220px"
        onPointerDown={(e) => e.preventDefault()}
      />
    </motion.li>
  );
}
