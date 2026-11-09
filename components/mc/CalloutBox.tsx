"use client";

import { cx } from "@/lib/ui";

export type CalloutType = "info" | "safety" | "physics" | "error" | "question" | "tip" | "action" | "local" | "recipient" | "format";

interface CalloutBoxProps {
  children: React.ReactNode;
  type?: CalloutType;
  className?: string;
}

function detectType(text: string): CalloutType {
  if (/✋|tocca a te/i.test(text)) return "action";
  if (/📍|qui da noi/i.test(text)) return "local";
  if (/📬|a chi lo consegni/i.test(text)) return "recipient";
  if (/🎲|come farla questa volta/i.test(text)) return "format";
  if (/⚠️|sicurezza|attenzione|pericolo|non toccare/i.test(text)) return "safety";
  if (/⚡|fisica|legge|formula|ohm|corrente|tensione/i.test(text)) return "physics";
  if (/errore comune|sbaglio|spesso si sbaglia/i.test(text)) return "error";
  if (/^(\*\*)?domanda aperta/i.test(text)) return "question";
  if (/💡|lo sapevi|suggerimento|nota:/i.test(text)) return "tip";
  return "info";
}

const STYLES: Record<CalloutType, { border: string; bg: string; text: string; icon: string }> = {
  info:     { border: "border-amber-400",  bg: "bg-amber-50",  text: "text-amber-900",  icon: "💡" },
  tip:      { border: "border-amber-400",  bg: "bg-amber-50",  text: "text-amber-900",  icon: "💡" },
  safety:   { border: "border-red-500",    bg: "bg-red-50",    text: "text-red-950",    icon: "⚠️" },
  physics:  { border: "border-blue-500",   bg: "bg-blue-50",   text: "text-blue-950",   icon: "⚡" },
  error:    { border: "border-yellow-500", bg: "bg-yellow-50", text: "text-yellow-950", icon: "🔴" },
  action:   { border: "border-emerald-500", bg: "bg-emerald-50", text: "text-emerald-950", icon: "✋" },
  local:    { border: "border-violet-500", bg: "bg-violet-50", text: "text-violet-950", icon: "📍" },
  recipient:{ border: "border-sky-500", bg: "bg-sky-50", text: "text-sky-950", icon: "📬" },
  format:   { border: "border-rose-400", bg: "bg-rose-50", text: "text-rose-950", icon: "🎲" },
  question: { border: "border-sky-500",    bg: "bg-sky-50",    text: "text-sky-950",    icon: "💬" },
};

export function CalloutBox({ children, type, className = "" }: CalloutBoxProps) {
  // Deriva tipo automaticamente dal testo se non passato esplicitamente
  const resolvedType: CalloutType =
    type ??
    detectType(typeof children === "string" ? children : "");

  const s = STYLES[resolvedType];

  return (
    <blockquote
      className={cx(
        "my-4 max-w-[68ch] rounded-xl border-l-[6px] px-4 py-3 text-sm leading-7",
        s.border,
        s.bg,
        s.text,
        className,
      )}
      data-type={resolvedType}
      role="note"
    >
      {children}
    </blockquote>
  );
}

/**
 * Versione che riceve il testo grezzo (stringa Markdown leggera)
 * e determina il tipo automaticamente dal contenuto.
 */
export function CalloutBoxFromText({
  text,
  renderInline,
  className,
}: {
  text: string;
  renderInline: (s: string) => React.ReactNode;
  className?: string;
}) {
  const type = detectType(text);
  return (
    <CalloutBox type={type} className={className}>
      {renderInline(text)}
    </CalloutBox>
  );
}
