from lib import *
import math
OUT = "out"
S = {}

# 1 ALI-2-01 §9 — ciclo biologico
def ali_2_01_9():
    cx, cy, R = 800, 500, 300
    fasi = [
        ("1 · Germinazione", ["acqua, calore, ossigeno:", "esce la radichetta"]),
        ("2 · Piantina", ["prime foglie vere,", "inizia la fotosintesi"]),
        ("3 · Crescita vegetativa", ["radici, fusto, foglie;", "serve molto azoto"]),
        ("4 · Fioritura", ["impollinazione: insetti,", "vento o acqua"]),
        ("5 · Fruttificazione", ["l'ovario diventa frutto", "che contiene i semi"]),
        ("6 · Maturazione", ["i semi cadono nel suolo:", "il ciclo ricomincia"]),
    ]
    b = circle(cx, cy, R, "none", LINE, 2)
    icons = []
    for i, (t, d) in enumerate(fasi):
        a = math.radians(-90 + i * 60)
        x, y = cx + R * math.cos(a), cy + R * math.sin(a)
        # freccia d'arco verso la fase successiva
        r2 = R - 75; a2 = math.radians(-90 + i * 60 + 14); a3 = math.radians(-90 + i * 60 + 46)
        b += path(f"M{cx+r2*math.cos(a2):.0f},{cy+r2*math.sin(a2):.0f} A{r2},{r2} 0 0 1 {cx+r2*math.cos(a3):.0f},{cy+r2*math.sin(a3):.0f}", GREEN, 6, arrow=True)
        b += circle(x, y, 46, GREEN_L, GREEN, 3) + text(x, y + 13, str(i + 1), 36, GREEN, 800, "middle")
        side = 1 if math.cos(a) > 0.2 else (-1 if math.cos(a) < -0.2 else 0)
        if side == 0:
            tx, ty, an = x + (70 if i == 0 else 70), y - 8, "start"
            if i == 3: ty = y + 8
        else:
            tx, ty, an = x + side * 66, y - 10, "start" if side > 0 else "end"
        b += text(tx, ty, t[4:], 26, INK, 700, an) + lines(tx, ty + 30, d, 21, MUTED, 400, an)
    # centro
    b += lines(cx, cy - 30, ["Ciclo di vita di una", "pianta da fiore", "(angiosperma)"], 24, INK, 700, "middle")
    b += text(cx, cy + 70, "stessa specie dall'inizio alla fine", 20, MUTED, 400, "middle", True)
    return page("Il ciclo biologico della pianta: dal seme al frutto", b)
S["ALI-2-01_9"] = ali_2_01_9

# 2 ALI-2-03 §8 — valori nutrizionali (dati del testo)
def ali_2_03_8():
    data = {"Grassi saturi (g)": (3, 1, 12), "Zuccheri (g)": (28, 12, 32), "Proteine (g)": (8, 14, 6)}
    cols = [CYAN, AMBER, VIOLET]
    x0, y0, h = 140, 760, 520  # base asse
    sc = h / 35
    b = line(x0, y0, 1480, y0, INK, 2) + line(x0, y0, x0, y0 - h - 10, INK, 2)
    for v in range(0, 36, 5):
        y = y0 - v * sc
        b += line(x0, y, 1480, y, LINE, 1) + text(x0 - 14, y + 8, v, 20, MUTED, 400, "end")
    gx = x0 + 60
    for g, vals in data.items():
        for k, v in enumerate(vals):
            x = gx + k * 120
            b += rect(x, y0 - v * sc, 100, v * sc, cols[k], "none", 0, 4)
            b += text(x + 50, y0 - v * sc - 12, str(v).replace(".", ","), 24, INK, 700, "middle")
        b += text(gx + 170, y0 + 40, g, 26, INK, 700, "middle")
        gx += 440
    for k, n in enumerate(["Barretta A", "Barretta B", "Barretta C"]):
        b += rect(1180 + 0, 170 + k * 44, 26, 26, cols[k], "none", 0, 4) + text(1220, 192 + k * 44, n, 22)
    b += text(x0, 175, "Valori per 100 g · confronto delle tre barrette del testo", 24, MUTED)
    b += lines(x0, 855, ["Per 100 g perché così si confrontano prodotti con confezioni di peso diverso."], 22, MUTED)
    return page("Leggere i valori nutrizionali per scegliere", b)
S["ALI-2-03_8"] = ali_2_03_8

# 3 COM-3-02 §6 — Creative Commons
def com_3_02_6():
    el = [("BY", "Attribuzione", "cita l'autore", CYAN),
          ("SA", "Condividi allo stesso modo", "stessa licenza per le modifiche", GREEN),
          ("NC", "Non commerciale", "niente usi commerciali", AMBER),
          ("ND", "Non opere derivate", "niente modifiche", RED)]
    b = text(60, 150, "I quattro elementi", 26, INK, 700)
    for i, (s, n, d, c) in enumerate(el):
        y = 175 + i * 128
        b += rect(60, y, 470, 112, "#fff", LINE, 2, 14) + rect(60, y, 110, 112, c, "none", 0, 14) + rect(150, y, 20, 112, c, "none", 0, 0)
        b += text(115, y + 70, s, 40, "#fff", 800, "middle") + text(190, y + 46, n, 23, INK, 700) + text(190, y + 82, d, 20, MUTED)
    # matrice licenze
    lic = [("CC0", "—"), ("CC BY", "BY"), ("CC BY-SA", "BY SA"), ("CC BY-NC", "BY NC"), ("CC BY-NC-SA", "BY NC SA"), ("CC BY-ND", "BY ND")]
    q = ["Devo citare?", "Uso commerciale?", "Posso modificare?", "Stessa licenza?"]
    x0, y0, cw, rh = 580, 175, 200, 76
    b += text(x0, 150, "Cosa puoi fare con ogni licenza", 26, INK, 700)
    b += rect(x0, y0, 200 + cw * 4, rh, "#E2E8F0", "none", 0, 10)
    for j, t in enumerate(q):
        b += text(x0 + 200 + j * cw + cw / 2, y0 + 47, t, 19, INK, 700, "middle")
    for i, (n, e) in enumerate(lic):
        y = y0 + rh * (i + 1)
        b += rect(x0, y, 200 + cw * 4, rh, "#fff" if i % 2 else "#F1F5F9", "none", 0, 0)
        b += text(x0 + 20, y + 48, n, 24, INK, 800)
        ans = [("no", False) if n == "CC0" else ("sì", True),
               ("no", False) if "NC" in e else ("sì", True),
               ("no", False) if "ND" in e else ("sì", True),
               ("sì", True) if "SA" in e else ("no", False)]
        for j, (a, pos) in enumerate(ans):
            if j == 0: c, f = (AMBER, AMBER_L) if pos else (GREEN, GREEN_L)
            elif j == 3: c, f = (AMBER, AMBER_L) if pos else (GREEN, GREEN_L)
            else: c, f = (GREEN, GREEN_L) if pos else (RED, RED_L)
            label = {0: ("obbligatorio" if pos else "non serve"), 1: ("consentito" if pos else "vietato"),
                     2: ("consentito" if pos else "vietato"), 3: ("obbligatoria" if pos else ("non si applica" if "ND" in e else "libera"))}[j]
            if label == "non si applica": c, f = MUTED, "#E2E8F0"
            b += pill(x0 + 200 + j * cw + 14, y + 18, label, f, c, 20)
    b += text(x0, y0 + rh * 7 + 50, "Verde = più libertà per chi usa l'opera · Rosso = divieto · Ambra = obbligo", 20, MUTED)
    return page("Le licenze Creative Commons", b)
S["COM-3-02_6"] = com_3_02_6

# 4 DIG-2-03 §3 — nomi dei file
def dig_2_03_3():
    parts = [("2026-03-15", "data AAAA-MM-GG", CYAN), ("_", None, MUTED), ("tecnologia", "materia", AMBER),
             ("_", None, MUTED), ("relazione-energia", "argomento", VIOLET), ("_", None, MUTED), ("v02", "versione", GREEN), (".docx", "estensione", MUTED)]
    x = 90; y = 260
    b = text(110, 170, "Anatomia di un nome di file ben fatto", 26, INK, 700)
    for s, lab, c in parts:
        w = len(s) * 25 + 6
        b += text(x + w / 2, y, s, 42, c, 700, "middle", font=MONO)
        if lab:
            b += path(f"M{x+6},{y+22} L{x+6},{y+36} L{x+w-6},{y+36} L{x+w-6},{y+22}", c, 3)
            b += text(x + w / 2, y + (100 if lab == "estensione" else 70), lab, 22, c, 700, "middle")
        x += w
    b += text(110, 370, "_ separa i blocchi  ·  - unisce le parole dentro un blocco", 22, MUTED)
    # ordinamento
    b += rect(80, 420, 690, 400, "#fff", LINE) + text(110, 465, "Data all'inizio (AAAA-MM-GG): ordine giusto", 23, GREEN, 700)
    ok = ["2025-11-20_scienze_ricerca.docx", "2026-01-15_tecnologia_disegno.pdf", "2026-03-15_tecnologia_relazione_v01.docx", "2026-03-15_tecnologia_relazione_v02.docx", "2026-04-01_matematica_esercizi.pdf"]
    b += lines(110, 515, ok, 21, INK, 400)
    b += rect(830, 420, 690, 400, "#fff", LINE) + text(860, 465, "Data GG-MM-AAAA: ordine sbagliato", 23, RED, 700)
    ko = ["01-04-2026_matematica_esercizi.pdf", "15-01-2026_tecnologia_disegno.pdf", "15-03-2026_tecnologia_relazione.docx", "20-11-2025_scienze_ricerca.docx"]
    b += lines(860, 515, ko, 21, INK, 400)
    b += lines(860, 680, ["Da evitare nei nomi:", "spazi · caratteri / \\ : * ? \" < > |", "parole come «finale», «definitivo»"], 21, RED, 400)
    b += lines(110, 680, ["I file si ordinano da soli", "in ordine cronologico."], 21, GREEN, 400)
    return page("Nominare i file: la convenzione", b)
S["DIG-2-03_3"] = dig_2_03_3

# 5 DIS-1-02 §3 — calcolo della scala
def dis_1_02_3():
    b = rect(60, 140, 700, 230, "#fff", LINE) + text(90, 190, "Formula (scala 1:n)", 26, INK, 700)
    b += text(90, 255, "misura sul disegno = misura reale ÷ n", 30, CYAN, 700)
    b += text(90, 320, "misura reale = misura sul disegno × n", 30, AMBER, 700)
    # esempio 1
    b += rect(820, 140, 720, 230, CYAN_L, "none") + text(850, 190, "Esempio 1 · dalla realtà al disegno", 24, CYAN, 700)
    b += lines(850, 235, ["Parete reale: 6 m = 600 cm · scala 1:50", "600 cm ÷ 50 = 12 cm", "Sul disegno la parete è lunga 12 cm"], 24, INK, 400, lh=1.4)
    b += rect(820, 395, 720, 230, AMBER_L, "none") + text(850, 445, "Esempio 2 · dal disegno alla realtà", 24, AMBER, 700)
    b += lines(850, 490, ["Finestra sul disegno: 2,4 cm · scala 1:50", "2,4 cm × 50 = 120 cm", "Nella realtà la finestra è larga 1,2 m"], 24, INK, 400, lh=1.4)
    # visual barre
    b += text(90, 440, "Stessa parete, due misure", 24, INK, 700)
    b += rect(90, 470, 600, 40, "#94A3B8", "none", 0, 4) + text(90, 545, "realtà: 600 cm (6 m)", 22, MUTED)
    b += rect(90, 580, 12, 40, CYAN, "none", 0, 2) + text(120, 610, "disegno 1:50 → 12 cm (50 volte più corta)", 22, CYAN, 700)
    b += rect(60, 660, 1480, 150, "#fff", LINE)
    b += lines(90, 705, ["Scale di ingrandimento (es. 5:1): misura sul disegno = misura reale × 5", "Bullone reale 18 mm a scala 5:1 → 18 × 5 = 90 mm sul disegno"], 24, INK, 400, lh=1.5)
    return page("Come si calcola la scala", b)
S["DIS-1-02_3"] = dis_1_02_3

# 6 ENE-3-01 §4 — vantaggio meccanico con la leva
def ene_3_01_4():
    fx, fy = 1010, 520
    L, Rr = 760, 150  # bracci in px: 1 m e 0,2 m  (rapporto 5)
    b = path(f"M{fx-60},{fy+110} L{fx},{fy+12} L{fx+60},{fy+110} Z", INK, 3, "#E2E8F0")
    b += rect(fx - L, fy - 10, L + Rr + 40, 20, "#A16207", "none", 0, 4)
    # carico
    b += rect(fx + Rr - 60, fy - 150, 120, 140, "#64748B", "none", 0, 10) + text(fx + Rr, fy - 70, "500 N", 28, "#fff", 800, "middle")
    b += line(fx + Rr, fy + 30, fx + Rr, fy + 160, RED, 6, arrow=True) + text(fx + Rr + 26, fy + 110, "F resistente = 500 N", 24, RED, 700)
    b += line(fx - L + 10, fy - 200, fx - L + 10, fy - 30, CYAN, 6, arrow=True) + text(fx - L + 30, fy - 180, "F motrice = 100 N", 24, CYAN, 700)
    # quote bracci
    yq = fy + 200
    b += line(fx - L + 10, yq, fx, yq, CYAN, 2, arrow=True, arrow_start=True) + text(fx - L / 2, yq + 34, "braccio motore 1,0 m", 24, CYAN, 700, "middle")
    b += line(fx, yq, fx + Rr, yq, RED, 2, arrow=True, arrow_start=True) + text(fx + Rr / 2, yq + 34, "0,2 m", 24, RED, 700, "middle")
    b += text(fx, fy + 140, "fulcro", 22, MUTED, 400, "middle")
    # box formula
    b += rect(1250, 140, 300, 300, "#fff", LINE)
    b += lines(1275, 190, ["VM = F res / F mot", "= 500 / 100 = 5", "", "e anche:", "VM = b mot / b res", "= 1,0 / 0,2 = 5"], 23, INK, 400, lh=1.35)
    b += text(80, 180, "Il carico vicino al fulcro, la forza lontana: serve 5 volte meno forza.", 24, INK, 700)
    b += text(80, 220, "Ma la mano deve abbassarsi 5 volte di più del carico: il lavoro resta lo stesso.", 22, MUTED)
    return page("Il vantaggio meccanico", b)
S["ENE-3-01_4"] = ene_3_01_4

if __name__ == "__main__":
    import sys
    for k, f in S.items():
        save(k, f(), OUT)
    print(len(S))
