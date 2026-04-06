interface SectionWrapperProps {
  id?: string;
  variant?: "dark" | "light";
  children: React.ReactNode;
  className?: string;
}

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
    <section
      id={id}
      className={`${bgClass} ${className}`}
    >
      <div className="mx-auto max-w-6xl px-[5%] py-16 md:py-20">
        {children}
      </div>
    </section>
  );
}

export function Overline({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-xs font-semibold uppercase tracking-[3px] text-text-muted">
      {children}
    </p>
  );
}

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-8 font-heading text-3xl font-bold tracking-tight md:text-4xl">
      {children}
    </h2>
  );
}
