import type { CSSProperties } from "react";
import { svgMaskUrl } from "@/lib/safeContent";

/**
 * A category icon from the API (SVG text staff can edit), drawn as a CSS
 * mask in the current text colour: shown, never run (lib/safeContent).
 * Renders nothing for an icon that isn't SVG.
 */
export default function SvgIcon({
  svg,
  className,
  style,
}: {
  svg: unknown;
  className?: string;
  style?: CSSProperties;
}) {
  const mask = svgMaskUrl(svg);
  if (!mask) return null;
  return (
    <span
      aria-hidden
      className={className}
      style={{
        display: "inline-block",
        backgroundColor: "currentColor",
        WebkitMaskImage: mask,
        maskImage: mask,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        ...style,
      }}
    />
  );
}
