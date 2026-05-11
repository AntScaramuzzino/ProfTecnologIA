interface FormulaCardProps {
  label: string;    // es. "Legge di Ohm"
  formula: string;  // es. "V = R × I"
  note?: string;    // es. "Tensione = Resistenza × Corrente"
}

export default function FormulaCard({ label, formula, note }: FormulaCardProps) {
  return (
    <div className="formula-card my-5 not-prose">
      <p className="formula-label">{label}</p>
      <p className="formula-main">{formula}</p>
      {note && <p className="formula-note">{note}</p>}
    </div>
  );
}
