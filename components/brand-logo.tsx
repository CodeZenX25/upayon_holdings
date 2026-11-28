import { useId } from "react";
import { cn } from "@/lib/utils";

/** Official Upayon brand colours (from the logo artwork). */
export const brandColors = {
  blue: "#3BAFE3",
  sky: "#5DA5DA",
  pink: "#F76CB2",
  purple: "#7B4CA8",
  navy: "#2E2F6E",
} as const;

/**
 * The Upayon "U" mark: four rising bars, rounded at the top, cut by the
 * circular base of the U. Vector recreation of the logo artwork.
 */
export function BrandMark({
  className,
  x,
  y,
  width,
  height,
}: {
  className?: string;
  /** Position/size — only needed when nesting the mark inside another SVG. */
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}) {
  const clipId = `upayon-u-${useId().replace(/:/g, "")}`;
  return (
    <svg
      viewBox="120 110 363 412"
      x={x}
      y={y}
      width={width}
      height={height}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="120" y="100" width="363" height="241" />
          <circle cx="301.5" cy="340" r="181.5" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <path d="M120 110a74 74 0 0 1 74 74v356h-74z" fill={brandColors.blue} />
        <path d="M214 247a77 77 0 0 1 77 77v216h-77z" fill={brandColors.sky} />
        <path d="M388 247a76 76 0 0 0-76 76v217h76z" fill={brandColors.pink} />
        <path d="M483 110a74 74 0 0 0-74 74v356h74z" fill={brandColors.purple} />
      </g>
    </svg>
  );
}

const sizes = {
  sm: "text-[19px]",
  md: "text-[23px]",
  lg: "text-[30px]",
} as const;

interface BrandLogoProps {
  /** White wordmark for dark backgrounds. */
  light?: boolean;
  size?: keyof typeof sizes;
  className?: string;
}

/** Full logo: mark + "UPAYON / HOLDINGS" wordmark (Poppins, like the artwork). */
export function BrandLogo({ light = false, size = "md", className }: BrandLogoProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-[0.36em] font-sans leading-none", sizes[size], className)}
      aria-label="Upayon Holdings"
      role="img"
    >
      <BrandMark className="h-[1.62em] w-auto shrink-0" />
      {/* Offsets below are measured against the logo artwork (Poppins has a
          tall line box, hence the negative margin). */}
      <span aria-hidden="true" className="relative top-[0.07em] inline-flex flex-col">
        <span
          className="text-[1em] font-bold tracking-[0.005em]"
          style={{ color: light ? "#ffffff" : brandColors.purple }}
        >
          UPAYON
        </span>
        {/* Letters are spread edge-to-edge so "HOLDINGS" spans exactly the
            width of "UPAYON", giving the wordmark a clean block shape. */}
        <span
          className="-mt-[1.35em] flex w-full justify-between pl-[0.1em] pr-[0.05em] text-[0.4em] font-semibold"
          style={{ color: light ? "rgba(255,255,255,0.85)" : brandColors.navy }}
        >
          {"HOLDINGS".split("").map((letter, i) => (
            <span key={i}>{letter}</span>
          ))}
        </span>
      </span>
    </span>
  );
}
