import {
  Wrench,
  Zap,
  Sparkles,
  Wind,
  Snowflake,
  PaintBucket,
  Hammer,
  Package,
  Bug,
  Scissors,
  Truck,
  ShieldCheck,
  Sun,
  Home,
  Waves,
  Grid3x3,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

/**
 * Map a service-category name to a lucide icon. Replaces the old hardcoded SVGs
 * in public/assets/icons so the homepage can render whatever categories the
 * backend actually returns. Substring match keeps it resilient to naming
 * variations ("AC Repair" → "air condition" etc.); unknown names fall back to a
 * neutral briefcase.
 */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  plumb: Wrench,
  electric: Zap,
  clean: Sparkles,
  hvac: Wind,
  "air condition": Snowflake,
  "ac repair": Snowflake,
  heating: Wind,
  paint: PaintBucket,
  carpent: Hammer,
  appliance: Package,
  pest: Bug,
  landscap: Scissors,
  garden: Scissors,
  moving: Truck,
  security: ShieldCheck,
  solar: Sun,
  roof: Home,
  pool: Waves,
  floor: Grid3x3,
  handy: Wrench,
  professional: Briefcase,
};

export function getCategoryIcon(name: string): LucideIcon {
  const key = (name || "").toLowerCase();
  for (const [k, Icon] of Object.entries(CATEGORY_ICONS)) {
    if (key.includes(k)) return Icon;
  }
  return Briefcase;
}

/** A rotating tint palette so the icon tiles aren't monochrome. */
export const CATEGORY_TONES = [
  "bg-blue-50 text-blue-600",
  "bg-yellow-50 text-yellow-600",
  "bg-green-50 text-green-600",
  "bg-cyan-50 text-cyan-600",
  "bg-purple-50 text-purple-600",
  "bg-red-50 text-red-500",
  "bg-orange-50 text-orange-500",
  "bg-sky-50 text-sky-500",
  "bg-amber-50 text-amber-600",
  "bg-indigo-50 text-indigo-600",
  "bg-teal-50 text-teal-600",
  "bg-rose-50 text-rose-500",
];
