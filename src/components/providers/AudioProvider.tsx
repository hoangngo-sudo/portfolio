"use client";

import { SoundProvider } from "@web-kits/audio/react";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY_ENABLED = "portfolio-audio-enabled";
const STORAGE_KEY_VOLUME = "portfolio-audio-volume";

function readInitial<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(() => readInitial(STORAGE_KEY_ENABLED, true));
  const [volume, setVolume] = useState(() => readInitial(STORAGE_KEY_VOLUME, 0.6));

  // Sync with localStorage after hydration
  useEffect(() => {
    const storedEnabled = readInitial(STORAGE_KEY_ENABLED, true);
    const storedVolume = readInitial(STORAGE_KEY_VOLUME, 0.6);
    if (storedEnabled !== enabled) setEnabled(storedEnabled);
    if (storedVolume !== volume) setVolume(storedVolume);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnabledChange = useCallback((v: boolean) => {
    setEnabled(v);
    try { localStorage.setItem(STORAGE_KEY_ENABLED, JSON.stringify(v)); } catch { /* noop */ }
  }, []);

  const handleVolumeChange = useCallback((v: number) => {
    setVolume(v);
    try { localStorage.setItem(STORAGE_KEY_VOLUME, JSON.stringify(v)); } catch { /* noop */ }
  }, []);

  return (
    <SoundProvider
      enabled={enabled}
      volume={volume}
      onEnabledChange={handleEnabledChange}
      onVolumeChange={handleVolumeChange}
    >
      {children}
    </SoundProvider>
  );
}
