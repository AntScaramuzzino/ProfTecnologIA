import type { VisualAsset } from "@/lib/content-loader";

interface MCVisualProps {
  asset: VisualAsset | null;
  alt: string;
  className?: string;
}

export default function MCVisual({ asset, alt, className = "" }: MCVisualProps) {
  if (!asset) {
    return (
      <div className={`flex min-h-48 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-500 sm:min-h-72 ${className}`}>
        Visual non ancora generato
      </div>
    );
  }

  // Alt text descrittivo (CARBLE-CDD criterio L — accessibilità)
  const descriptiveAlt = alt || `${asset.label} — immagine didattica generata con AI`;

  return (
    <figure className={`w-full overflow-hidden ${className}`}>
      <img
        src={asset.src}
        alt={descriptiveAlt}
        className="h-full w-full max-w-full rounded-lg object-contain"
        loading="lazy"
        decoding="async"
      />
      <figcaption className="mt-2 text-xs text-slate-500">
        {asset.label}
        {asset.kind === "generated" || asset.kind === "hero" ? (
          <span className="ml-1 text-slate-400">· Immagine AI</span>
        ) : null}
      </figcaption>
    </figure>
  );
}
