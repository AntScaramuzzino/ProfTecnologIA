export interface SDGBadgeDefinition {
  id: string;
  sdg: number;
  title: string;
  shortTitle: string;
  description: string;
  assetSrc: string;
  accent: string;
  requiredPassed: number;
}

export type SdgValue = number | string | null | undefined;

// Colori ufficiali Agenda 2030 (UN SDG brand palette)
export const SDG_BADGES: SDGBadgeDefinition[] = [
  {
    id: "sdg-2",
    sdg: 2,
    title: "Sconfiggere la fame",
    shortTitle: "SDG 2",
    description: "Sblocchi il badge quando superi quiz collegati ad alimentazione, filiera agroalimentare, nutrizione e agricoltura sostenibile.",
    assetSrc: "/assets/badges/sdg/sdg-2-fame-zero.svg",
    accent: "#DDA63A",
    requiredPassed: 2,
  },
  {
    id: "sdg-3",
    sdg: 3,
    title: "Salute e benessere",
    shortTitle: "SDG 3",
    description: "Sblocchi il badge quando superi quiz collegati alla salute, al benessere digitale e all'impatto delle tecnologie sulla vita quotidiana.",
    assetSrc: "/assets/badges/sdg/sdg-3-salute-benessere.svg",
    accent: "#4C9F38",
    requiredPassed: 1,
  },
  {
    id: "sdg-4",
    sdg: 4,
    title: "Istruzione di qualità",
    shortTitle: "SDG 4",
    description: "Sblocchi il badge quando superi quiz collegati a competenze digitali, coding, disegno tecnico e pensiero computazionale.",
    assetSrc: "/assets/badges/sdg/sdg-4-istruzione-qualita.svg",
    accent: "#C5192D",
    requiredPassed: 5,
  },
  {
    id: "sdg-7",
    sdg: 7,
    title: "Energia pulita e accessibile",
    shortTitle: "SDG 7",
    description: "Sblocchi il badge quando superi quiz collegati a fonti energetiche rinnovabili, conversione dell'energia e risparmio energetico.",
    assetSrc: "/assets/badges/sdg/sdg-7-energia-pulita.svg",
    accent: "#FCC30B",
    requiredPassed: 2,
  },
  {
    id: "sdg-8",
    sdg: 8,
    title: "Lavoro dignitoso e crescita economica",
    shortTitle: "SDG 8",
    description: "Sblocchi il badge quando superi quiz collegati a sistemi economici, mondo del lavoro e innovazione nelle imprese.",
    assetSrc: "/assets/badges/sdg/sdg-8-lavoro-crescita.svg",
    accent: "#A21942",
    requiredPassed: 1,
  },
  {
    id: "sdg-9",
    sdg: 9,
    title: "Industria, innovazione e infrastrutture",
    shortTitle: "SDG 9",
    description: "Sblocchi il badge quando superi quiz collegati a materiali, reti, energia, robotica o innovazione tecnologica.",
    assetSrc: "/assets/badges/sdg/sdg-9-industria-innovazione.svg",
    accent: "#F26A2E",
    requiredPassed: 3,
  },
  {
    id: "sdg-10",
    sdg: 10,
    title: "Ridurre le disuguaglianze",
    shortTitle: "SDG 10",
    description: "Sblocchi il badge quando superi quiz collegati a bias algoritmici, accessibilità digitale e inclusione tecnologica.",
    assetSrc: "/assets/badges/sdg/sdg-10-disuguaglianze.svg",
    accent: "#DD1367",
    requiredPassed: 1,
  },
  {
    id: "sdg-11",
    sdg: 11,
    title: "Città e comunità sostenibili",
    shortTitle: "SDG 11",
    description: "Sblocchi il badge quando superi quiz collegati ad abitazioni, pianificazione urbana, mobilità e smart city.",
    assetSrc: "/assets/badges/sdg/sdg-11-citta-sostenibili.svg",
    accent: "#FD9D24",
    requiredPassed: 3,
  },
  {
    id: "sdg-12",
    sdg: 12,
    title: "Consumo e produzione responsabili",
    shortTitle: "SDG 12",
    description: "Sblocchi il badge quando superi quiz collegati a rifiuti, economia circolare, ciclo dei materiali e impronta ecologica.",
    assetSrc: "/assets/badges/sdg/sdg-12-consumo-responsabile.svg",
    accent: "#BF8B2E",
    requiredPassed: 2,
  },
  {
    id: "sdg-13",
    sdg: 13,
    title: "Lotta contro il cambiamento climatico",
    shortTitle: "SDG 13",
    description: "Sblocchi il badge quando superi quiz collegati al clima, all'impatto ambientale delle tecnologie e alla transizione ecologica.",
    assetSrc: "/assets/badges/sdg/sdg-13-clima.svg",
    accent: "#3F7E44",
    requiredPassed: 1,
  },
  {
    id: "sdg-15",
    sdg: 15,
    title: "La vita sulla terra",
    shortTitle: "SDG 15",
    description: "Sblocchi il badge quando superi quiz collegati a ecosistemi, biodiversità e impatto dei materiali sull'ambiente naturale.",
    assetSrc: "/assets/badges/sdg/sdg-15-vita-terra.svg",
    accent: "#56C02B",
    requiredPassed: 1,
  },
  {
    id: "sdg-16",
    sdg: 16,
    title: "Pace, giustizia e istituzioni solide",
    shortTitle: "SDG 16",
    description: "Sblocchi il badge quando superi quiz collegati a crittografia, sicurezza digitale, privacy e cittadinanza digitale.",
    assetSrc: "/assets/badges/sdg/sdg-16-pace-giustizia.svg",
    accent: "#00689D",
    requiredPassed: 3,
  },
];

export function getBadgeState(passed: number, required: number) {
  if (passed >= required) return "unlocked";
  if (passed > 0) return "progress";
  return "locked";
}

export function normalizeSdgList(values: SdgValue[] | null | undefined): number[] {
  if (!values) return [];
  return [...new Set(
    values
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value) && value >= 1 && value <= 17),
  )];
}

export function hasSdg(values: SdgValue[] | null | undefined, sdg: number): boolean {
  return normalizeSdgList(values).includes(sdg);
}

export function getSdgBadge(sdg: SdgValue): SDGBadgeDefinition | null {
  const normalized = Number(sdg);
  if (!Number.isInteger(normalized)) return null;
  return SDG_BADGES.find((badge) => badge.sdg === normalized) ?? null;
}
