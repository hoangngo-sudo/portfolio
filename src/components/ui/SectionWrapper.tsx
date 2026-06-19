"use client";

import React from "react";

type SectionVariant = "dark" | "light";

interface SectionWrapperProps {
  id?: string;
  variant?: SectionVariant;
  children: React.ReactNode;
  className?: string;
}

const SectionVariantContext = React.createContext<SectionVariant>("light");

export function SectionWrapper({
  id,
  variant = "light",
  children,
  className = "",
}: SectionWrapperProps) {
  const bgClass =
    variant === "dark"
      ? "bg-dark-bg text-text-primary"
      : "bg-light-bg text-ink-body";

  return (
    <SectionVariantContext.Provider value={variant}>
      <section
        id={id}
        className={`${bgClass} ${className}`}
      >
        <div className="mx-auto max-w-6xl px-[5%] py-16 md:py-20">
          {children}
        </div>
      </section>
    </SectionVariantContext.Provider>
  );
}

export function Overline({ children }: { children: React.ReactNode }) {
  const variant = React.useContext(SectionVariantContext);
  const colorClass =
    variant === "dark" ? "text-text-muted" : "text-ink-muted";
  return (
    <p className={`mb-2 text-xs font-medium tracking-[2px] ${colorClass}`}>
      {children}
    </p>
  );
}

export function SectionHeading({ children }: { children: React.ReactNode }) {
  const variant = React.useContext(SectionVariantContext);
  const colorClass =
    variant === "dark" ? "text-text-primary" : "text-ink-primary";
  return (
    <h2 className={`mb-8 text-balance font-heading text-3xl font-bold tracking-tight md:text-4xl ${colorClass}`}>
      {children}
    </h2>
  );
}
