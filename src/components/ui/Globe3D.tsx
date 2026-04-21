"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { GlobeMarker } from "@/types/config";

const THETA = 0.2; // tilt (radians)
// cobe internal: ee = 0.8 (globe radius), markerElevation default = 0.05
const ELEV = 0.85;

function project(
  lat: number,
  lng: number,
  phi: number,
): { sx: number; sy: number; visible: boolean } {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;

  // cobe's 3D coords, already scaled by elevation
  const cosr = Math.cos(latRad);
  const t0 =  cosr * Math.cos(lngRad) * ELEV;
  const t1 =  Math.sin(latRad)        * ELEV;
  const t2 = -cosr * Math.sin(lngRad) * ELEV;

  const cosPhi   = Math.cos(phi);
  const sinPhi   = Math.sin(phi);
  const cosTheta = Math.cos(THETA);
  const sinTheta = Math.sin(THETA);

  const c = cosPhi * t0 + sinPhi * t2;
  const s = sinPhi * sinTheta * t0 + cosTheta * t1 - cosPhi * sinTheta * t2;

  const zView = -sinPhi * cosTheta * t0 + sinTheta * t1 + cosPhi * cosTheta * t2;

  return {
    sx: (c + 1) / 2,
    sy: (-s + 1) / 2,
    visible: zView >= 0,
  };
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
}

interface Props {
  markers: GlobeMarker[];
  atmosphereColor?: string;
  autoRotateSpeed?: number;
}

export function Globe3D({
  markers,
  atmosphereColor = "#4da6ff",
  autoRotateSpeed = 0.3,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarRefs = useRef<(HTMLDivElement | null)[]>([]);
  const phiRef = useRef(0);
  // Cache container dimensions read once (+ ResizeObserver), never in rAF
  const wRef = useRef(0);
  const hRef = useRef(0);
  // Track previous visibility per marker to skip no-op style writes
  const prevVisibleRef = useRef<boolean[]>(markers.map(() => false));
  // Drag state
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const momentumRef = useRef(0); // radians/frame carried after release
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const atmo = hexToRgb(atmosphereColor);
    const speed = autoRotateSpeed * 0.003;
    const el = container!;

    wRef.current = container.offsetWidth;
    hRef.current = container.offsetHeight;

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      width: wRef.current * 2,
      height: hRef.current * 2,
      phi: phiRef.current,
      theta: THETA,
      dark: 1,
      diffuse: 1.3,
      mapSamples: 20000,
      mapBrightness: 7,
      mapBaseBrightness: 0.00,
      baseColor: [atmo[0] * 0.15, atmo[1] * 0.15, atmo[2] * 0.15],
      markerColor: [atmo[0], atmo[1], atmo[2]],
      glowColor: [atmo[0] * 0.55, atmo[1] * 0.55, atmo[2] * 0.55],
    });

    // Drag handlers
    function onPointerDown(e: PointerEvent) {
      isDraggingRef.current = true;
      lastXRef.current = e.clientX;
      momentumRef.current = 0;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    }
    function onPointerMove(e: PointerEvent) {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - lastXRef.current;
      lastXRef.current = e.clientX;
      // drag across full globe diameter (~80% of container) = π radians
      const dphi = (dx / wRef.current) * Math.PI * 1.2;
      phiRef.current += dphi;
      momentumRef.current = dphi;
    }
    function onPointerUp() {
      isDraggingRef.current = false;
      el.style.cursor = "grab";
    }

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.style.cursor = "grab";

    // ResizeObserver: cache dimensions, never read layout inside rAF
    const resizeObserver = new ResizeObserver(() => {
      wRef.current = container.offsetWidth;
      hRef.current = container.offsetHeight;
    });
    resizeObserver.observe(container);

    // RAF loop (started/stopped by IntersectionObserver)
    let rafId = 0;

    function frame() {
      if (!isDraggingRef.current) {
        // Resume auto-rotation blended with decaying momentum
        if (!prefersReducedMotion) phiRef.current += speed;
        phiRef.current += momentumRef.current;
        momentumRef.current *= 0.93; // friction decay
      }
      globe.update({ phi: phiRef.current });

      const w = wRef.current;
      const h = hRef.current;

      for (let i = 0; i < markers.length; i++) {
        const el = avatarRefs.current[i];
        if (!el) continue;
        const { sx, sy, visible } = project(markers[i].lat, markers[i].lng, phiRef.current);
        // translate: A-tier (compositor transform, no layout)
        el.style.transform = `translate(${sx * w}px, ${sy * h}px)`;
        if (visible !== prevVisibleRef.current[i]) {
          prevVisibleRef.current[i] = visible;
          el.style.opacity = visible ? "1" : "0";
          el.style.pointerEvents = visible ? "auto" : "none";
        }
      }

      rafId = requestAnimationFrame(frame);
    }

    // IntersectionObserver: pause loop when off-screen
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!rafId) rafId = requestAnimationFrame(frame);
        } else {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      globe.destroy();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atmosphereColor, autoRotateSpeed]);

  return (
    <div ref={containerRef} className="relative w-full aspect-square touch-none select-none">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Rotating globe showing my locations in Ho Chi Minh City and Chicago"
        className="h-full w-full"
        style={{ contain: "layout style size" }}
      />
      {markers.map((m, i) => (
        <div
          key={i}
          ref={(el) => { avatarRefs.current[i] = el; }}
          className="absolute transition-opacity duration-300"
          style={{
            top: 0,
            left: 0,
            opacity: 0,
            willChange: "transform, opacity",
          }}
          aria-label={m.label}
        >
          {/* Avatar circle */}
          <div
            className="absolute size-9 overflow-hidden rounded-full shadow-lg ring-2 ring-white/30"
            style={{ top: -68, left: -18 }}
          >
            <Image
              src={m.src}
              alt={m.label}
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Connector */}
          <div
            className="absolute w-px bg-linear-to-b from-transparent to-white/60"
            style={{ top: -32, left: -0.5, height: 28 }}
          />

          {/* Surface dot at the projected globe point */}
          <div
            className="absolute size-2 rounded-full bg-white/80"
            style={{ top: -4, left: -4 }}
          />
        </div>
      ))}
    </div>
  );
}




