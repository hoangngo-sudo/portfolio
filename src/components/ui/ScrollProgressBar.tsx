"use client";

import { useEffect, useRef } from "react";

export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 z-50 h-1 w-full">
      <div
        ref={barRef}
        className="h-full w-full bg-accent"
        style={{ transform: "scaleX(0)", transformOrigin: "left" }}
      />
    </div>
  );
}
