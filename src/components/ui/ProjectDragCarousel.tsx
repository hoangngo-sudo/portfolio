"use client";

import { useRef, useCallback } from "react";
import type { ProjectItem } from "@/types/config";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { ProjectCommitsWidget } from "@/components/ui/ProjectCommitsWidget";
import { TagPill } from "@/components/ui/TagPill";
import { getSkillIconId, getCustomIcon } from "@/lib/icons";

interface Props {
  items: ProjectItem[];
}

export function ProjectDragCarousel({ items }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isPointerDown = useRef(false);
  const dragMoved = useRef(false);
  const startX = useRef(0);
  const lastMoveX = useRef(0);
  const lastMoveTime = useRef(0);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Prevent native link drag on <a> cards so our custom drag-scroll works.
    // Does NOT prevent the click event
    e.preventDefault();

    isPointerDown.current = true;
    dragMoved.current = false;
    startX.current = e.clientX;
    lastMoveX.current = e.clientX;
    lastMoveTime.current = performance.now();
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Pointer capture can fail in test environments, ignore
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPointerDown.current) return;
    const container = containerRef.current;
    if (!container) return;

    const deltaX = startX.current - e.clientX;
    if (deltaX === 0) return;

    container.scrollLeft += deltaX;
    dragMoved.current = true;

    // Track position & time for velocity calculation on release
    // (save the previous position before overwriting startX)
    lastMoveX.current = startX.current;
    lastMoveTime.current = performance.now();

    startX.current = e.clientX;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;

    const container = containerRef.current;
    if (!container || !dragMoved.current) return;

    const now = performance.now();
    const moveTime = now - lastMoveTime.current;

    // Calculate velocity from the last pointer move (px/ms).
    // moveDelta > 0 means finger moved right on screen.
    // The scroll direction is opposite to pointer movement:
    //   finger right → content moves right → scrollLeft DEcreases.
    // So we SUBTRACT the velocity projection from scrollLeft.
    const moveDelta = startX.current - lastMoveX.current;
    if (moveTime > 0 && Math.abs(moveDelta) > 2) {
      const velocity = moveDelta / moveTime; // px/ms

      // Apply momentum only above a minimum flick speed (0.15 px/ms ≈ 150 px/s)
      if (Math.abs(velocity) > 0.15) {
        const maxScroll = container.scrollWidth - container.clientWidth;
        const currentScroll = container.scrollLeft;
        // Project ~300ms of dampened momentum
        const target = currentScroll - velocity * 300 * 0.5;
        const clampedTarget = Math.max(0, Math.min(target, maxScroll));

        container.scrollTo({ left: clampedTarget, behavior: "smooth" });
      }
    }

    setTimeout(() => { dragMoved.current = false; }, 100);
  }, []);

  const handleClickCapture = useCallback((e: React.MouseEvent) => {
    if (dragMoved.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  return (
    <div
      ref={containerRef}
      draggable={false}
      role="region"
      aria-label="Project carousel"
      className="scrollbar-hide flex gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-1 select-none"
      style={{
        cursor: "grab",
        touchAction: "pan-x",
        scrollbarWidth: "none",
        scrollPaddingRight: "26px",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClickCapture={handleClickCapture}
    >
      {items.map((project) => (
        <SpotlightCard
          key={project.title}
          as="a"
          href={project.href || "#"}
          target={project.href ? "_blank" : undefined}
          rel={project.href ? "noopener noreferrer" : undefined}
          className="group flex w-75 shrink-0 flex-col bg-card-bg p-5 dm-elevation-2 transition-transform duration-150 ease-out active:scale-[0.97] md:w-90 lg:w-105"
          style={{ scrollSnapAlign: "start" }}
          smoothCorners={{ radius: 12, smoothing: 0.6 }}
        >
          {project.repo && <ProjectCommitsWidget repo={project.repo} />}
          <h3 className="mb-1 text-balance text-base font-semibold text-text-primary">
            {project.title}
          </h3>
          <p className="mb-3 flex-1 text-sm text-text-secondary">
            {project.description}
          </p>
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <TagPill
                  key={tag}
                  tag={tag}
                  iconId={getSkillIconId(tag)}
                  customIcon={getCustomIcon(tag)}
                />
              ))}
            </div>
          )}
        </SpotlightCard>
      ))}
    </div>
  );
}
