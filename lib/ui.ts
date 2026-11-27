export const levelBadge: Record<string, string> = {
  F: "border-blue-200 bg-blue-50 text-blue-800",
  I: "border-emerald-200 bg-emerald-50 text-emerald-800",
  A: "border-orange-200 bg-orange-50 text-orange-800",
  H: "border-red-200 bg-red-50 text-red-800",
};

export const areaAccent: Record<string, string> = {
  MAT: "bg-stone-100 border-stone-200",
  DIS: "bg-blue-50 border-blue-200",
  DIG: "bg-cyan-50 border-cyan-200",
  ALI: "bg-lime-50 border-lime-200",
  AMB: "bg-orange-50 border-orange-200",
  ENE: "bg-amber-50 border-amber-200",
  COM: "bg-violet-50 border-violet-200",
  INF: "bg-indigo-50 border-indigo-200",
  SIS: "bg-sky-50 border-sky-200",
};

export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
