"use client";

import { useState, useEffect } from "react";

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
  timeZoneName: "short",
});

/**
 * Returns the current time in America/Chicago, formatted as "10:32:45 AM CDT".
 * Returns null on the server to prevent hydration mismatches.
 */
export function useLocalClock(): string | null {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}
