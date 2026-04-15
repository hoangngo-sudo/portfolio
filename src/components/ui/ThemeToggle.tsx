"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { useWebHaptics } from "web-haptics/react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const haptic = useWebHaptics();

  return (
    <div className="flex items-center gap-1 border-none p-1">
      <button
        onClick={() => {
          haptic.trigger("selection");
          setTheme("black");
        }}
        aria-label="Black theme"
        className={`h-7 w-7 rounded-full transition-[background-color,box-shadow] ${
          theme === "black"
            ? "bg-[#7c8594] shadow-[0_0_8px_rgba(124,133,148,0.6)]"
            : "bg-[#7c8594]/30 hover:bg-[#7c8594]/50"
        }`}
      />
      <button
        onClick={() => {
          haptic.trigger("selection");
          setTheme("teal");
        }}
        aria-label="Teal theme"
        className={`h-7 w-7 rounded-full transition-[background-color,box-shadow] ${
          theme === "teal"
            ? "bg-[#0d9488] shadow-[0_0_8px_#0d948880]"
            : "bg-[#0d9488]/30 hover:bg-[#0d9488]/50"
        }`}
      />
    </div>
  );
}
