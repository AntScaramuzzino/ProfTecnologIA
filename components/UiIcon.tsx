import {
  BookA, BookOpen, BriefcaseBusiness, ChartColumn, Compass, Earth, FlaskConical, Globe, KeyRound,
  Languages, Layers, Library, Mail, PencilRuler, Search, Telescope, Zap, type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  // fasi della lezione (MCNavigator)
  INNESCA: Zap,
  ESPLORA: BookOpen,
  OSSERVA: Search,
  SPERIMENTA: FlaskConical,
  AGISCI: Earth,
  RIPASSA: Layers,
  PROFESSIONE: BriefcaseBusiness,
  CLIL: Languages,
  // tipi di risultato della ricerca (lib/search.ts)
  mc: BookOpen,
  laboratorio: FlaskConical,
  escape: KeyRound,
  esplorazione: Telescope,
  scena: Telescope,
  geogebra: PencilRuler,
  glossario: BookA,
  pagina: Compass,
  // interfaccia
  progressi: ChartColumn,
  home: BookOpen,
  teoria: BookOpen,
  pratica: PencilRuler,
  web: Globe,
  wiki: Library,
  mail: Mail,
};

export function hasUiIcon(name?: string) {
  return !!name && name in ICONS;
}

export default function UiIcon({ name, size = 16, className = "" }: { name: string; size?: number; className?: string }) {
  const Icon = ICONS[name];
  if (!Icon) return null;
  return <Icon size={size} strokeWidth={1.75} aria-hidden="true" className={`inline-block shrink-0 align-[-0.15em] ${className}`} />;
}
