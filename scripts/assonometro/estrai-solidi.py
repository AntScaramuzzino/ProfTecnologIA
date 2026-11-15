"""Rigenera public/embeds/assonometro/solidi.js dalla copia «libro» del proiettore ortogonale.

L'Assonometro usa gli stessi solidi del proiettore (stessi id, stesse chiavi delle misure): così una tavola
si apre con lo stesso solido nei due strumenti. Per non avere due elenchi da tenere allineati, la fabbrica
dei solidi non si riscrive: si copia da public/embeds/proiettore/proiettore.js, dalla riga «const V3 = »
fino alla fine di «const SOLIDI = {…};», e le si aggiunge la riga di esportazione.

    python3 scripts/assonometro/estrai-solidi.py

Va rilanciato dopo scripts/proiettore/aggiorna-proiettore.py, quando al proiettore si aggiunge un solido.
Se il proiettore cambia in quel punto lo script si ferma senza scrivere niente.
"""
import pathlib
import re
import sys

REPO = pathlib.Path(__file__).resolve().parents[2]
ORIGINE = REPO / "public" / "embeds" / "proiettore" / "proiettore.js"
DESTINAZIONE = REPO / "public" / "embeds" / "assonometro" / "solidi.js"

righe = ORIGINE.read_text(encoding="utf-8").split("\n")
inizio = [i for i, r in enumerate(righe) if r.startswith("const V3 = ")]
solidi = [i for i, r in enumerate(righe) if r.startswith("const SOLIDI = {")]
if len(inizio) != 1 or len(solidi) != 1 or solidi[0] < inizio[0]:
    sys.exit("proiettore.js è cambiato: non trovo «const V3 = » e «const SOLIDI = {» una volta sola, in quest'ordine.")
fine = next((i for i in range(solidi[0], len(righe)) if righe[i] == "};"), None)
if fine is None:
    sys.exit("proiettore.js è cambiato: non trovo la fine di «const SOLIDI = {…};».")

blocco = "\n".join(righe[inizio[0]:fine + 1])
vietati = re.findall(r"\bTHREE\b|\bdocument\b|\bwindow\b|\$\(", blocco)
if vietati:
    sys.exit(f"La fabbrica dei solidi ora usa la pagina o Three.js ({sorted(set(vietati))}): non si può copiare così com'è.")

nomi = ["V3", "sub", "cross", "dot", "norm", "SOLIDI", "MISURE", "misureStandard"]
mancanti = [n for n in nomi if not re.search(rf"^(const|function) {n}\b", blocco, re.M)]
if mancanti:
    sys.exit(f"proiettore.js è cambiato: mancano {mancanti}.")

testa = (
    "/* Solidi dell'Assonometro — COPIA GENERATA, non modificare a mano.\n"
    "   È la fabbrica dei solidi del proiettore ortogonale (public/embeds/proiettore/proiettore.js),\n"
    "   copiata da scripts/assonometro/estrai-solidi.py. Stessi id e stesse chiavi delle misure.\n"
    "   Assi dei solidi: X = larghezza (verso destra), Y = altezza (verso l'alto), Z = profondità (verso chi guarda). */\n"
)
DESTINAZIONE.parent.mkdir(parents=True, exist_ok=True)
DESTINAZIONE.write_text(testa + blocco + "\n\nexport { " + ", ".join(nomi) + " };\n", encoding="utf-8")
print(f"scritto {DESTINAZIONE.relative_to(REPO)}: righe {inizio[0] + 1}–{fine + 1} di proiettore.js, {len(blocco)} caratteri")
