import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}

/** Eyebrow + split-animated heading + description used by every home section. */
export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "light",
  className,
}: SectionTitleProps) {
  const dark = tone === "dark";
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto text-center" : "text-left",
        "max-w-3xl",
        className,
      )}
    >
      {eyebrow && (
        <p
          data-reveal
          className={cn(
            "mb-4 inline-flex items-center gap-3 text-[12.5px] font-bold uppercase tracking-[0.28em]",
            dark ? "text-gold" : "text-navy-600",
          )}
        >
          <span className={cn("h-px w-8", dark ? "bg-gold" : "bg-navy-600")} />
          {eyebrow}
        </p>
      )}
      <h2
        data-split
        className={cn(
          "text-[34px] font-extrabold leading-[1.12] md:text-[50px]",
          dark ? "text-white" : "text-navy-900",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          data-reveal
          className={cn(
            "mt-5 text-[17px] leading-[1.85]",
            align === "center" && "mx-auto max-w-2xl",
            dark ? "text-white/70" : "text-slate-500",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
