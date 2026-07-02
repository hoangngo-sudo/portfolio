"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useWebHaptics } from "web-haptics/react";
import { useSound } from "@web-kits/audio/react";
import { expand, collapse } from "@/lib/audio/minimal";
import type { CoursesConfig } from "@/types/config";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { ShowMoreButton } from "@/components/ui/ShowMoreButton";
import { EASE_OUT_CUBIC } from "@/lib/motion-tokens";

const INITIAL_COUNT = 10;

interface Props {
  data: CoursesConfig;
}

export function CourseShowMoreClient({ data }: Props) {
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();
  const haptic = useWebHaptics();
  const playExpand = useSound(expand);
  const playCollapse = useSound(collapse);
  const gridRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(false);

  // Flatten all items while preserving category label and assigning a global index
  const allItems = useMemo(() => {
    let idx = 0;
    return data.categories.flatMap((cat) =>
      cat.items.map((item) => ({
        ...item,
        _categoryLabel: cat.label,
        _globalIndex: idx++,
      })),
    );
  }, [data.categories]);

  const totalCount = allItems.length;
  const hiddenStartIndex = expanded ? totalCount : INITIAL_COUNT;
  const showButton = totalCount > INITIAL_COUNT;

  // Group items by category, preserving original category order.
  const categoryGroups = useMemo(() => {
    const order = data.categories.map((c) => c.label);
    const groups = new Map<string, typeof allItems>();

    for (const item of allItems) {
      const list = groups.get(item._categoryLabel);
      if (list) {
        list.push(item);
      } else {
        groups.set(item._categoryLabel, [item]);
      }
    }

    return order
      .filter((label) => groups.has(label))
      .map((label) => ({ label, items: groups.get(label)! }));
  }, [allItems, data.categories]);

  const handleToggle = useCallback(() => {
    haptic.trigger("light");
    if (expanded) {
      playCollapse();
      shouldScrollRef.current = true;
    } else {
      playExpand();
    }
    setExpanded((prev) => !prev);
  }, [expanded, haptic, playExpand, playCollapse]);

  const renderCourseCard = useCallback(
    (course: (typeof allItems)[number]) => (
      <SpotlightCard
        key={course.code}
        spotlightSize={60}
        smoothCorners={{ radius: 12, smoothing: 0.6 }}
        className="bg-card-bg p-4 dm-elevation-2"
      >
        <p className="text-sm font-semibold text-text-primary">
          {course.code}{" "}
          <span className="font-normal text-text-secondary">
            {course.name}
          </span>
        </p>
        {course.description && (
          <p className="mt-1 text-xs text-text-muted">{course.description}</p>
        )}
      </SpotlightCard>
    ),
    [],
  );

  // Motion props for hidden cards
  const hiddenCardTransition = reduced
    ? { duration: 0 }
    : {
        duration: 0.25,
        ease: EASE_OUT_CUBIC,
      };

  return (
    <>
      <div ref={gridRef} id="courses-grid" className="space-y-8">
        {categoryGroups.map((category) => {
          const visible = category.items.filter(
            (item) => item._globalIndex < hiddenStartIndex,
          );
          const hidden = category.items.filter(
            (item) => item._globalIndex >= hiddenStartIndex,
          );

          // Skip empty categories when collapsed
          if (visible.length === 0 && hidden.length === 0) return null;

          return (
            <div key={category.label}>
              {category.label && (
                <h3 className="mb-4 text-xs uppercase tracking-wider text-text-muted">
                  {category.label}
                </h3>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                {visible.map(renderCourseCard)}

                <AnimatePresence
                  onExitComplete={() => {
                    if (shouldScrollRef.current) {
                      shouldScrollRef.current = false;
                      gridRef.current?.scrollIntoView({
                        block: "nearest",
                        behavior: reduced ? "instant" : "smooth",
                      });
                    }
                  }}
                >
                  {expanded &&
                    hidden.map((item) => (
                      <motion.div
                        key={item.code}
                        initial={
                          reduced
                            ? false
                            : { opacity: 0, y: 8 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        exit={
                          reduced
                            ? undefined
                            : { opacity: 0, y: -8 }
                        }
                        transition={{
                          ...hiddenCardTransition,
                          delay: reduced
                            ? 0
                            : (item._globalIndex - INITIAL_COUNT) * 0.06,
                        }}
                      >
                        {renderCourseCard(item)}
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {showButton && (
        <ShowMoreButton
          expanded={expanded}
          onClick={handleToggle}
        />
      )}
    </>
  );
}
