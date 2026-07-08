import type { VisualAsset } from "@/lib/content-loader";

interface MCVisualProps {
  asset: VisualAsset | null;
  alt: string;
  className?: string;
  /**
   * true  → immagine hero above-the-fold: eager + fetchPriority=high, niente lazy.
   * false → immagini below-fold (carousel, card): lazy + decoding=async.
   */
  priority?: boolean;
}

export default function MCVisual({
  asset,
  alt,
  className = "",
  priority = false,
}: MCVisualProps) {
  if (!asset) {
    return (
      <div
        className={`flex min-h-48 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-500 sm:min-h-72 ${className}`}
      >
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
        /* Dimensioni esplicite → previene CLS (la maggior parte degli asset
           è 1600×900; per i casi eccezionali il CSS object-contain gestisce). */
        width={1600}
        height={900}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        /* fetchPriority="high" indica al browser che questa è la LCP image */
        {...(priority ? { fetchPriority: "high" } : {})}
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
