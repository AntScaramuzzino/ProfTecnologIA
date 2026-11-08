from lib import *
import math
OUT = "out"
S = {}

# AMB-2-05 §2 — ciclo artificiale dell'acqua
def amb_2_05_2():
    st = [("Captazione", ["prelievo da fiume, lago,", "falda o sorgente"], BLUE, BLUE_L),
          ("Potabilizzazione", ["sedimentazione, filtrazione,", "disinfezione"], CYAN, CYAN_L),
          ("Distribuzione", ["serbatoi, pompe e tubi", "fino ai contatori"], CYAN, CYAN_L),
          ("Uso", ["bere, cucinare, lavarsi:", "circa 220 l a testa al giorno"], VIOLET, VIOLET_L),
          ("Fognatura", ["le acque usate vanno", "in una rete separata"], AMBER, AMBER_L),
          ("Depurazione", ["processi fisici, biologici,", "a volte chimici"], GREEN, GREEN_L)]
    pos = [(80, 200), (580, 200), (1080, 200), (1080, 520), (580, 520), (80, 520)]
    b = ""
    for i, ((t, d, c, f), (x, y)) in enumerate(zip(st, pos)):
        b += rect(x, y, 420, 200, f, c, 3) + circle(x + 44, y + 46, 26, c, "none", 0) + text(x + 44, y + 56, str(i + 1), 28, "#fff", 800, "middle")
        b += text(x + 84, y + 56, t, 28, INK, 700) + lines(x + 30, y + 110, d, 22, INK)
    b += line(505, 300, 572, 300, INK, 4, arrow=True) + line(1005, 300, 1072, 300, INK, 4, arrow=True)
    b += line(1290, 405, 1290, 512, INK, 4, arrow=True)
    b += line(1075, 620, 1008, 620, INK, 4, arrow=True) + line(575, 620, 508, 620, INK, 4, arrow=True)
    b += path("M290,720 L290,780 L40,780 L40,160 L290,160 L290,192", GREEN, 4, arrow=True, dash="10 8")
    b += text(60, 815, "L'acqua depurata torna all'ambiente (fiume, mare) o viene riusata in agricoltura", 21, GREEN, 700)
    return page("Il ciclo artificiale dell'acqua in sei fasi", b)
S["AMB-2-05_2"] = amb_2_05_2

# COM-3-02 §3 — compressione
def com_3_02_3():
    b = rect(60, 140, 720, 440, GREEN_L, "none") + text(90, 190, "Lossless · senza perdita", 28, GREEN, 800)
    b += text(90, 235, "Cerca le ripetizioni e le scrive in modo più corto", 21, INK)
    b += text(90, 300, "AAAAAAABBBBCCCCCC", 36, INK, 700, font=MONO) + text(690, 300, "17", 24, MUTED, 700, "end")
    b += line(250, 320, 250, 360, GREEN, 4, arrow=True)
    b += text(90, 400, "7A 4B 6C", 36, GREEN, 800, font=MONO) + text(690, 400, "6", 24, MUTED, 700, "end")
    b += line(250, 420, 250, 460, GREEN, 4, arrow=True)
    b += text(90, 500, "AAAAAAABBBBCCCCCC", 36, INK, 700, font=MONO) + text(90, 545, "ricostruito identico all'originale", 21, GREEN, 700)
    b += text(690, 270, "caratteri", 18, MUTED, 400, "end")
    b += rect(820, 140, 720, 440, AMBER_L, "none") + text(850, 190, "Lossy · con perdita", 28, AMBER, 800)
    b += text(850, 235, "Scarta i dettagli che occhio e orecchio notano meno", 21, INK)
    import random
    random.seed(5)
    for r in range(8):
        for c in range(8):
            v = 120 + int(80 * math.sin(r / 2) * math.cos(c / 3)) + random.randint(-35, 35)
            b += f'<rect x="{870+c*30}" y="{270+r*30}" width="30" height="30" fill="rgb({v},{v-30},{min(255,v+40)})"/>'
    b += line(1130, 390, 1210, 390, AMBER, 4, arrow=True)
    for r in range(4):
        for c in range(4):
            v = 120 + int(80 * math.sin(r) * math.cos(c / 1.5))
            b += f'<rect x="{1230+c*60}" y="{270+r*60}" width="60" height="60" fill="rgb({v},{v-30},{min(255,v+40)})"/>'
    b += text(870, 545, "originale", 20, MUTED) + text(1230, 545, "compresso: simile, non identico", 20, AMBER, 700)
    rows = [("PNG", "immagini: loghi, schermate", "JPEG", "fotografie"), ("FLAC", "musica di alta qualità", "MP3", "musica in streaming, podcast"), ("ZIP", "qualsiasi file", "H.264 · H.265 · AV1", "video: salvano solo le differenze tra fotogrammi")]
    for i, (a, ad, c, cd) in enumerate(rows):
        y = 620 + i * 66
        b += rect(60, y, 720, 56, "#fff", LINE, 1, 8) + text(80, y + 37, a, 22, GREEN, 800) + text(210, y + 37, ad, 20, INK)
        b += rect(820, y, 720, 56, "#fff", LINE, 1, 8) + text(840, y + 37, c, 22, AMBER, 800) + text(1080, y + 37, cd, 19, INK)
    return page("Compressione: come si riduce un file", b)
S["COM-3-02_3"] = com_3_02_3

# DIG-2-01 §4 — interfaccia di Scratch (categorie di Scratch 3)
def dig_2_01_4():
    cats = [("Movimento", "#4C97FF"), ("Aspetto", "#9966FF"), ("Suono", "#CF63CF"), ("Situazioni", "#FFBF00"), ("Controllo", "#FFAB19"),
            ("Sensori", "#5CB1D6"), ("Operatori", "#59C059"), ("Variabili", "#FF8C1A"), ("I miei blocchi", "#FF6680")]
    b = rect(60, 140, 1480, 680, "#fff", INK, 3, 12)
    b += rect(60, 140, 270, 680, "#F1F5F9", LINE, 1, 12) + text(80, 180, "Categorie", 22, INK, 700)
    for i, (n, c) in enumerate(cats):
        y = 205 + i * 66
        b += circle(100, y + 22, 18, c, "none", 0) + text(130, y + 30, n, 21, INK)
    # area script
    b += rect(340, 150, 700, 660, "#FAFAFA", LINE, 1, 8) + text(360, 190, "Area degli script", 22, INK, 700)
    blocks = [("quando si clicca sulla bandiera verde", "#FFBF00", 0), ("per sempre", "#FFAB19", 0), ("fai 10 passi", "#4C97FF", 30), ("rimbalza quando tocchi il bordo", "#4C97FF", 30), ("passa al costume seguente", "#9966FF", 30)]
    for i, (t, c, ind) in enumerate(blocks):
        y = 240 + i * 62
        b += rect(380 + ind, y, 470 - ind, 52, c, "none", 0, 8) + text(400 + ind, y + 34, t, 20, "#fff", 700)
    b += rect(380, 240 + 5 * 62, 300, 26, "#FFAB19", "none", 0, 8)
    b += text(380, 610, "I blocchi si incastrano come un puzzle:", 20, MUTED) + text(380, 638, "la forma indica dove si possono collegare.", 20, MUTED)
    # stage
    b += rect(1060, 150, 470, 330, "#EFF6FF", BLUE, 2, 8) + text(1080, 190, "Stage (palcoscenico)", 22, INK, 700)
    b += circle(1295, 330, 46, "#FDBA74", "#C2410C", 3) + text(1295, 340, "sprite", 18, INK, 700, "middle")
    b += rect(1060, 500, 470, 310, "#fff", LINE, 1, 8) + text(1080, 540, "Elenco degli sprite", 22, INK, 700)
    for i in range(3):
        b += rect(1085 + i * 145, 570, 125, 110, "#F1F5F9", LINE, 1, 8)
    b += lines(1080, 730, ["ogni sprite ha i suoi script,", "costumi e suoni"], 19, MUTED)
    b += text(60, 860, "Categorie e colori dell'editor Scratch 3 · lo scambio di messaggi (invia a tutti) si trova in «Situazioni»", 19, MUTED)
    return page("Scratch: l'ambiente di programmazione a blocchi", b)
S["DIG-2-01_4"] = dig_2_01_4

# DIS-1-02 §4 — formati ISO 216
def dis_1_02_4():
    sc = 0.6  # px per mm: A0 1189x841 -> 713x505
    x0, y0 = 90, 200
    A0w, A0h = 1189, 841
    def r(x, y, w, h, lab, dims, c):
        return (rect(x0 + x * sc, y0 + y * sc, w * sc, h * sc, c, INK, 2, 0)
                + text(x0 + (x + w / 2) * sc, y0 + (y + h / 2) * sc + 4, lab, max(16, int(min(w, h) * sc / 3.2)), INK, 800, "middle")
                + (text(x0 + (x + w / 2) * sc, y0 + (y + h / 2) * sc + 30, dims, 16, MUTED, 400, "middle") if min(w, h) * sc > 90 else ""))
    b = r(0, 0, 594, 841, "A1", "594 × 841", "#E0F2FE")
    b += r(594, 0, 595, 420, "A2", "420 × 594", "#CFFAFE")
    b += r(594, 420, 297, 421, "A3", "297 × 420", "#FEF3C7")
    b += r(891, 420, 298, 210, "A4", "210 × 297", "#DCFCE7")
    b += r(891, 630, 149, 211, "A5", "", "#EDE9FE") + r(1040, 630, 149, 211, "A5", "", "#EDE9FE")
    b += text(x0, y0 - 20, "A0 = 841 × 1189 mm (1 m²) · ogni piega a metà dà il formato successivo", 22, INK, 700)
    X = 900
    b += rect(X, 200, 640, 300, "#fff", LINE)
    b += lines(X + 30, 250, ["Lato lungo ÷ lato corto = √2 ≈ 1,414", "per tutti i formati della serie A.", "", "Piegando a metà si dimezza l'area,", "ma le proporzioni restano uguali."], 23, INK, 400, lh=1.4)
    b += rect(X, 530, 640, 280, AMBER_L, "none")
    b += lines(X + 30, 580, ["Da A3 ad A4 si riduce al 70,7%:", "una scala 1:50 diventa circa 1:70,7.", "", "Per passare da 1:50 a 1:100", "le lunghezze vanno ridotte al 50%."], 22, INK, 400, lh=1.4)
    return page("I formati dei fogli: la famiglia ISO 216", b)
S["DIS-1-02_4"] = dis_1_02_4

# DIS-2-02 §5 — cavaliera vs isometrica
def dis_2_02_5():
    w, h, d, rc = 220, 150, 160, 45
    def draw(O, ex, ey, ez, color, side="R"):
        P = lambda a, b_, c: (O[0] + a * ex[0] + b_ * ey[0] + c * ez[0], O[1] + a * ex[1] + b_ * ey[1] + c * ez[1])
        F = [P(0, 0, 0), P(w, 0, 0), P(w, 0, h), P(0, 0, h)]
        T = [P(0, 0, h), P(w, 0, h), P(w, d, h), P(0, d, h)]
        R = [P(w, 0, 0), P(w, d, 0), P(w, d, h), P(w, 0, h)] if side == "R" else [P(0, 0, 0), P(0, d, 0), P(0, d, h), P(0, 0, h)]
        poly = lambda pts, f: f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in pts)}" fill="{f}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>'
        s = poly(T, "#E2E8F0") + poly(R, "#CBD5E1") + poly(F, "#FFFFFF")
        pts = [P(w / 2 + rc * math.cos(t), 0, h / 2 + rc * math.sin(t)) for t in [i * math.pi / 36 for i in range(73)]]
        s += f'<polyline points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in pts)}" fill="{color}" fill-opacity="0.25" stroke="{color}" stroke-width="4"/>'
        return s, P
    c45 = math.cos(math.radians(45)) * 0.5; c30, s30 = math.cos(math.radians(30)), math.sin(math.radians(30))
    s1, P1 = draw((170, 560), (1, 0), (c45, -c45), (0, -1), CYAN)
    s2, P2 = draw((900, 640), (c30, -s30), (-c30, -s30), (0, -1), AMBER, "L")
    b = s1 + s2
    b += text(270, 180, "Cavaliera obliqua", 30, CYAN, 800, "middle")
    b += text(870, 180, "Isometrica", 30, AMBER, 800, "middle")
    b += lines(90, 640, ["faccia frontale in vera forma:", "il cerchio resta un cerchio", "profondità a 45°, ridotta a metà"], 21, INK, 400, lh=1.35)
    b += lines(700, 700, ["tutti gli assi a 30°, nessuna riduzione:", "il cerchio diventa un'ellisse"], 21, INK, 400, lh=1.35)
    # tabella
    X = 1180
    rows = [("", "Cavaliera", "Isometrica"), ("assi obliqui", "45°", "30°"), ("riduzione", "0,5 su y", "nessuna"), ("faccia frontale", "invariata", "deformata"), ("costruzione", "più semplice", "media"), ("uso tipico", "istruzioni,", "cataloghi,"), ("", "manuali", "CAD")]
    for i, (a, c, iso) in enumerate(rows):
        y = 220 + i * 50
        if i == 0: b += rect(X - 10, y - 32, 380, 44, "#E2E8F0", "none", 0, 6)
        b += text(X, y, a, 18, MUTED, 700) + text(X + 150, y, c, 19, CYAN, 700 if i == 0 else 400) + text(X + 280, y, iso, 19, AMBER, 700 if i == 0 else 400)
    b += rect(60, 770, 1480, 70, "#fff", LINE)
    b += text(90, 815, "Regola pratica: una faccia importante senza deformazioni → cavaliera; oggetto equilibrato con tre facce simili → isometrica", 20, INK)
    return page("Cavaliera e isometrica: quando scegliere quale", b)
S["DIS-2-02_5"] = dis_2_02_5

# ENE-3-02 §6 — effetto serra
def ene_3_02_6():
    gy = 700
    b = rect(60, gy, 1480, 120, "#D9F99D", "none", 0, 0) + text(800, gy + 70, "superficie terrestre: assorbe la luce e si scalda", 22, INK, 700, "middle")
    b += rect(60, 380, 1480, 120, "#E0F2FE", "none", 0, 0) + text(1520, 470, "atmosfera con gas serra", 20, BLUE, 700, "end")
    b += circle(150, 210, 60, "#FDE68A", AMBER, 3) + text(150, 220, "Sole", 22, INK, 700, "middle")
    b += line(220, 230, 480, 690, AMBER, 6, arrow=True) + text(80, 420, "luce visibile", 22, AMBER, 700) + text(80, 448, "(onda corta) attraversa", 20, AMBER)
    b += path("M640,690 C660,560 640,450 650,170", RED, 5, arrow=True) + text(670, 200, "parte dell'infrarosso", 20, RED, 700) + text(670, 226, "esce nello spazio", 20, RED)
    b += path("M900,690 C910,600 920,520 930,450", RED, 5, arrow=True) + text(880, 600, "infrarosso (calore,", 20, RED, 700, "end") + text(880, 626, "onda lunga)", 20, RED, 700, "end")
    b += circle(930, 440, 14, BLUE, "none", 0)
    b += path("M930,455 C990,540 1080,600 1120,690", RED, 5, arrow=True, dash="10 8")
    b += path("M945,430 C1000,330 1050,250 1080,180", RED, 4, arrow=True, dash="10 8")
    b += text(1130, 640, "i gas serra lo riemettono", 20, RED, 700) + text(1130, 666, "anche verso il suolo", 20, RED, 700)
    b += rect(1180, 120, 360, 250, "#fff", LINE)
    b += lines(1205, 160, ["Gas serra: vapore acqueo,", "CO₂, metano, ozono", "Senza effetto serra: −18 °C", "Con effetto serra: +15 °C", "CO₂: 280 ppm (1750)", "→ oltre 420 ppm (2023)"], 21, INK, 400, lh=1.35)
    return page("L'effetto serra e il cambiamento climatico", b)
S["ENE-3-02_6"] = ene_3_02_6

# MAT-1-03 §4 — quadro comparativo
def mat_1_03_4():
    rows = [("PLA (bioplastica)", "da fonti vegetali, compostabile in impianti industriali", "serve un impianto di compostaggio", "maturo"),
            ("PHA", "biodegradabile anche in acqua di mare", "costo elevato, produzione complessa", "emergente"),
            ("Grafene", "proprietà meccaniche ed elettriche eccezionali", "produzione costosa e difficile", "ricerca"),
            ("Micelio", "compostabile, si ottiene dagli scarti", "teme l'umidità, poco resistente", "emergente"),
            ("Aerogel", "isolante termico eccezionale", "fragile e costoso", "nicchia"),
            ("Tessuti da PET riciclato", "riduce i rifiuti, costo competitivo", "rilascia microplastiche al lavaggio", "maturo"),
            ("Leghe a memoria di forma", "si muovono con precisione senza motori", "costose, legate alla temperatura", "nicchia")]
    col = {"maturo": (GREEN, GREEN_L), "emergente": (AMBER, AMBER_L), "ricerca": (VIOLET, VIOLET_L), "nicchia": (BLUE, BLUE_L)}
    xs = [60, 380, 900, 1360]
    b = rect(60, 140, 1480, 56, "#0F172A", "none", 0, 8)
    for x, t in zip(xs, ["Materiale", "Vantaggio principale", "Limite principale", "Mercato"]):
        b += text(x + 20, 177, t, 22, "#fff", 700)
    for i, (m, v, l, st) in enumerate(rows):
        y = 200 + i * 88
        b += rect(60, y, 1480, 82, "#fff" if i % 2 else "#F1F5F9", "none", 0, 0)
        b += text(80, y + 50, m, 22, INK, 800)
        b += text(400, y + 50, v, 19, GREEN)
        b += text(920, y + 50, l, 19, RED)
        c, f = col[st]
        b += pill(1380, y + 22, st, f, c, 20)
    return page("I materiali innovativi: il quadro comparativo", b)
S["MAT-1-03_4"] = mat_1_03_4

if __name__ == "__main__":
    for k, f in S.items(): save(k, f(), OUT)
    print(len(S))
