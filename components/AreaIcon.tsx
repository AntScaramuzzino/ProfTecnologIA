import { Binary, BookOpen, Building2, Cog, Laptop, PencilRuler, RadioTower, Recycle, Wheat, Zap, type LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  MAT: Recycle,
  ALI: Wheat,
  AMB: Building2,
  COM: RadioTower,
  ENE: Zap,
  SIS: Cog,
  INF: Binary,
  DIS: PencilRuler,
  DIG: Laptop,
};

export default function AreaIcon({ area, size = 18, className = "" }: { area?: string; size?: number; className?: string }) {
  const Icon = (area && ICONS[area]) || BookOpen;
  return <Icon size={size} strokeWidth={1.75} aria-hidden="true" className={`inline-block shrink-0 align-[-0.15em] ${className}`} />;
}
