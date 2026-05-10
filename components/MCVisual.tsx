import type { VisualAsset } from "@/lib/content-loader";

interface MCVisualProps {
  asset: VisualAsset | null;
  alt: string;
  className?: string;
}

export default function MCVisual({ asset, alt, className = "" }: MCVisualProps) {
  if (!asset) {
    return (
      <div className={`flex min-h-72 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-500 ${className}`}>
        Visual non ancora generato
      </div>
    );
  }

  return (
    <figure className={className}>
      <img
        src={asset.src}
        alt={alt}
        className="h-full w-full rounded-lg object-cover"
      />
      <figcaption className="mt-2 text-xs text-slate-500">{asset.label}</figcaption>
    </figure>
  );
}
