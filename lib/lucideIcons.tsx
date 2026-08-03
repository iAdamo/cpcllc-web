import {
  Wrench, Zap, Sparkles, Wind, Snowflake, PaintBucket, Hammer, Package,
  Bug, Scissors, Truck, ShieldCheck, Sun, Home, Waves, Grid3x3, Briefcase,
  Plug, Droplet, Flame, Leaf, Car, Key, Lock, Camera, Wifi, Trash2, Brush,
  Ruler, Drill, Thermometer, TreePine, PawPrint, Sprout, Bath, Utensils,
  Dumbbell, Stethoscope, Baby, Dog, type LucideIcon,
} from "lucide-react";

/**
 * Curated, whitelisted icon set for the service catalogue. Keys are the lucide
 * PascalCase component names so the exact same stored value resolves on the web
 * (lucide-react) AND the mobile app (lucide-react-native), which export the
 * same names. Store the key; render via resolveCatalogueIcon.
 */
export const CATALOGUE_ICONS: Record<string, LucideIcon> = {
  Wrench, Zap, Sparkles, Wind, Snowflake, PaintBucket, Hammer, Package,
  Bug, Scissors, Truck, ShieldCheck, Sun, Home, Waves, Grid3x3, Briefcase,
  Plug, Droplet, Flame, Leaf, Car, Key, Lock, Camera, Wifi, Trash2, Brush,
  Ruler, Drill, Thermometer, TreePine, PawPrint, Sprout, Bath, Utensils,
  Dumbbell, Stethoscope, Baby, Dog,
};

export const CATALOGUE_ICON_NAMES = Object.keys(CATALOGUE_ICONS);

/** Resolve a stored icon name to its lucide component, or null if unknown. */
export function resolveCatalogueIcon(name?: string | null): LucideIcon | null {
  if (!name) return null;
  return CATALOGUE_ICONS[name] ?? null;
}
