import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  emoji?: string;
  color?: string; // hex colore area
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  // JSON-LD structured data per SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `https://antscaramuzzino.github.io/ProfTecnologIA${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label="Percorso di navigazione"
        className="border-b border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-2.5 sm:px-6"
      >
        <ol className="mx-auto flex max-w-7xl min-w-0 items-center gap-1 text-sm">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={i} className="flex min-w-0 items-center gap-1">
                {/* Separatore (non prima del primo item) */}
                {i > 0 && (
                  <svg className="h-3.5 w-3.5 shrink-0 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}

                {isLast ? (
                  /* Ultimo elemento — non linkato, colore area */
                  <span
                    className="flex min-w-0 items-center gap-1.5 truncate font-semibold"
                    style={{ color: item.color ?? "#0f172a" }}
                    aria-current="page"
                  >
                    {item.emoji && <span className="shrink-0 text-base" aria-hidden="true">{item.emoji}</span>}
                    <span className="truncate">{item.label}</span>
                  </span>
                ) : (
                  /* Elemento navigabile */
                  <Link
                    href={item.href!}
                    className="flex min-w-0 items-center gap-1.5 text-slate-500 transition hover:text-slate-900"
                  >
                    {i === 0 ? (
                      /* Home icon per il primo elemento */
                      <>
                        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="truncate">{item.label}</span>
                      </>
                    ) : (
                      <>
                        {item.emoji && <span className="shrink-0" aria-hidden="true">{item.emoji}</span>}
                        <span className="truncate">{item.label}</span>
                      </>
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
