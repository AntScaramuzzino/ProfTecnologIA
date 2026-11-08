from lib import *
import math
OUT = "out"
S = {}

# ALI-2-01 §3 — fotosintesi e nutrienti
def ali_2_01_3():
    # foglia stilizzata
    b = path("M560,520 C560,330 760,250 940,250 C940,430 800,560 560,520 Z", GREEN, 4, GREEN_L)
    b += path("M560,520 C680,440 800,350 920,268", GREEN, 3)
    b += text(760, 430, "foglia", 24, GREEN, 700, "middle")
    # input
    b += circle(150, 210, 50, AMBER_L, AMBER, 3) + text(150, 220, "☀", 40, AMBER, 400, "middle")
    b += text(230, 205, "luce solare", 26, AMBER, 700) + path("M210,250 C350,300 470,320 600,360", AMBER, 5, arrow=True)
    b += pill(80, 360, "CO₂ dall'aria", BLUE_L, BLUE, 26) + line(330, 380, 570, 420, BLUE, 5, arrow=True)
    b += pill(80, 600, "H₂O dal suolo", CYAN_L, CYAN, 26) + path("M330,620 C450,620 520,580 580,520", CYAN, 5, arrow=True)
    # output
    b += line(950, 330, 1140, 260, GREEN, 5, arrow=True) + pill(1150, 235, "O₂ nell'aria", GREEN_L, GREEN, 26)
    b += line(950, 420, 1140, 450, AMBER, 5, arrow=True) + pill(1150, 430, "glucosio C₆H₁₂O₆", AMBER_L, AMBER, 26)
    b += text(1150, 520, "il «carburante» per radici,", 22, MUTED) + text(1150, 550, "foglie, frutti e semi", 22, MUTED)
    b += rect(60, 680, 760, 140, "#fff", LINE)
    b += text(90, 730, "6 CO₂ + 6 H₂O + luce → C₆H₁₂O₆ + 6 O₂", 32, INK, 700)
    b += text(90, 785, "Fotosintesi clorofilliana", 22, MUTED)
    b += rect(860, 620, 680, 200, "#fff", LINE) + text(890, 665, "Nutrienti minerali assorbiti dalle radici", 23, INK, 700)
    b += lines(890, 710, ["Primari: azoto N · fosforo P · potassio K", "Secondari: calcio · magnesio · zolfo", "Micronutrienti: ferro · manganese · zinco · rame · boro"], 21, INK, 400, lh=1.45)
    return page("Come le piante si nutrono: fotosintesi e nutrienti", b)
S["ALI-2-01_3"] = ali_2_01_3

# ALI-2-02 §4 — etichetta alimentare (prodotto immaginario)
def ali_2_02_4():
    X, Y = 470, 140
    b = rect(X, Y, 660, 690, "#FFFBEB", "#A16207", 3, 18)
    b += text(X + 330, Y + 60, "FROLLINI AL CACAO", 34, INK, 800, "middle") + text(X + 330, Y + 92, "biscotti con cacao magro", 20, MUTED, 400, "middle")
    b += text(X + 30, Y + 145, "Ingredienti: farina di FRUMENTO, zucchero, burro (LATTE),", 18, INK)
    b += text(X + 30, Y + 170, "cacao magro 8%, UOVA, agenti lievitanti, sale.", 18, INK)
    # tabella
    ty = Y + 210
    b += rect(X + 30, ty, 400, 290, "#fff", INK, 2, 4) + text(X + 45, ty + 30, "Valori nutrizionali per 100 g", 18, INK, 700)
    rows = [("Energia", "2010 kJ / 480 kcal"), ("Grassi", "20 g"), ("  di cui saturi", "12 g"), ("Carboidrati", "66 g"), ("  di cui zuccheri", "26 g"), ("Proteine", "7 g"), ("Sale", "0,4 g")]
    for i, (k, v) in enumerate(rows):
        yy = ty + 64 + i * 32
        b += line(X + 30, yy - 22, X + 430, yy - 22, LINE, 1) + text(X + 45, yy, k, 17, INK) + text(X + 415, yy, v, 17, INK, 700, "end")
    b += text(X + 470, ty + 120, "Peso netto", 18, MUTED) + text(X + 470, ty + 150, "350 g", 30, INK, 800)
    b += text(X + 30, Y + 560, "Da consumarsi preferibilmente", 18, INK) + text(X + 30, Y + 585, "entro: 30/06/2027", 20, INK, 700)
    b += text(X + 30, Y + 640, "Prodotto immaginario a scopo didattico", 16, MUTED, 400, italic=True)
    def call(n, px, py, title, desc, side):
        c = CYAN
        s = circle(px, py, 18, c, "none", 0) + text(px, py + 7, n, 20, "#fff", 800, "middle")
        if side < 0:
            s += line(px - 20, py, 420, py, c, 2) + text(400, py - 6, title, 22, INK, 700, "end") + lines(400, py + 22, desc, 18, MUTED, 400, "end")
        else:
            s += line(px + 20, py, 1180, py, c, 2) + text(1200, py - 6, title, 22, INK, 700) + lines(1200, py + 22, desc, 18, MUTED)
        return s
    b += call("1", X - 10, Y + 60, "Denominazione", ["il nome legale del prodotto"], -1)
    b += call("2", X - 10, Y + 160, "Ingredienti", ["in ordine decrescente di peso"], -1)
    b += call("3", X + 670, Y + 160, "Allergeni", ["evidenziati (qui in maiuscolo)", "sono 14 quelli previsti in UE"], 1)
    b += call("4", X - 10, ty + 140, "Dichiarazione nutrizionale", ["sempre per 100 g: confronti equi"], -1)
    b += call("5", X + 670, ty + 135, "Quantità netta", ["peso senza l'imballaggio"], 1)
    b += call("6", X - 10, Y + 572, "Termine minimo o scadenza", ["«preferibilmente entro» ≠", "«da consumarsi entro»"], -1)
    return page("Come leggere un'etichetta alimentare", b)
S["ALI-2-02_4"] = ali_2_02_4

# ALI-2-05 §5 — simboli sul packaging
def ali_2_05_5():
    b = text(60, 150, "Riconosci il simbolo, poi chiediti: dice davvero che il prodotto verrà riciclato?", 24, INK, 700)
    cards = [
        ("resin", "Codice del materiale", "numero 1–7 nel triangolo", "Indica il tipo di plastica. Non dice se nel tuo comune viene riciclata."),
        ("mobius", "Ciclo di Möbius", "tre frecce che si inseguono", "Materiale tecnicamente riciclabile. Non garantisce che lo sia davvero."),
        ("tag", "Punto verde", "marchio del sistema di raccolta", "Il produttore ha finanziato il sistema di riciclo. Non vuol dire «riciclato»."),
        ("tag", "FSC", "marchio su carta e cartone", "Carta da foreste gestite in modo responsabile."),
        ("tag", "Ecolabel UE", "marchio europeo", "Il prodotto rispetta criteri ambientali fissati dall'UE."),
        ("tag", "Biologico UE", "marchio su alimenti", "Prodotto secondo le regole UE del biologico."),
        ("bin", "Omino col cestino", "invito generico", "Butta i rifiuti nel posto giusto. Non dice nulla sulla riciclabilità."),
    ]
    for i, (k, n, sub, d) in enumerate(cards):
        col, row = i % 4, i // 4
        x, y = 60 + col * 375, 190 + row * 330
        b += rect(x, y, 355, 310, "#fff", LINE)
        ix, iy = x + 177, y + 80
        if k == "resin":
            b += path(f"M{ix},{iy-50} L{ix+52},{iy+38} L{ix-52},{iy+38} Z", INK, 5)
            b += text(ix, iy + 24, "1", 40, INK, 800, "middle") + text(ix + 80, iy + 30, "PET", 22, INK, 700, "middle")
        elif k == "mobius":
            for a in (0, 120, 240):
                r1 = math.radians(a - 75); r2 = math.radians(a + 5)
                b += path(f"M{ix+42*math.cos(r1):.0f},{iy+42*math.sin(r1):.0f} A42,42 0 0 1 {ix+42*math.cos(r2):.0f},{iy+42*math.sin(r2):.0f}", GREEN, 7)
                ex, ey = ix + 42 * math.cos(r2), iy + 42 * math.sin(r2)
                tx, ty_ = -math.sin(r2), math.cos(r2)  # tangente (senso orario)
                nx, ny = math.cos(r2), math.sin(r2)
                p1 = (ex + tx * 16, ey + ty_ * 16); p2 = (ex + nx * 11, ey + ny * 11); p3 = (ex - nx * 11, ey - ny * 11)
                b += f'<path d="M{p1[0]:.0f},{p1[1]:.0f} L{p2[0]:.0f},{p2[1]:.0f} L{p3[0]:.0f},{p3[1]:.0f} Z" fill="{GREEN}"/>'
        elif k == "bin":
            b += rect(ix + 10, iy - 10, 40, 55, "none", INK, 4, 4) + circle(ix - 30, iy - 40, 10, INK, "none", 0)
            b += path(f"M{ix-30},{iy-28} L{ix-30},{iy+10} L{ix-45},{iy+45} M{ix-30},{iy+10} L{ix-15},{iy+45} M{ix-30},{iy-18} L{ix+5},{iy-5}", INK, 5)
        else:
            b += rect(ix - 70, iy - 40, 140, 80, "#F1F5F9", MUTED, 2, 10, 'stroke-dasharray="6 6"')
            b += text(ix, iy + 8, "marchio", 20, MUTED, 400, "middle", True)
        b += text(x + 20, y + 180, n, 24, INK, 800) + text(x + 20, y + 208, sub, 18, MUTED)
        words = d.split(); rows = [""]
        for w in words:
            if len(rows[-1] + " " + w) > 30: rows.append(w)
            else: rows[-1] = (rows[-1] + " " + w).strip()
        b += lines(x + 20, y + 245, rows, 19, INK)
    return page("I simboli sul packaging: cosa significano davvero", b)
S["ALI-2-05_5"] = ali_2_05_5

# AMB-2-02 §7 — classi energetiche
def amb_2_02_7():
    cl = [("A4", "< 15", "Casa passiva"), ("A3", "15–30", "Edificio nZEB"), ("A2", "30–45", "Nuova costruzione standard"),
          ("A1", "45–60", "Ristrutturazione recente ben isolata"), ("B", "60–90", "Edificio anni 2000"), ("C", "90–120", "Edificio anni '90"),
          ("D", "120–160", "Edificio anni '80 senza isolamento"), ("E", "160–200", "Edificio anni '70"), ("F", "200–250", "Edificio anni '60–'70 non ristrutturato"), ("G", "> 250", "Edificio storico non isolato")]
    colors = ["#166534", "#15803D", "#16A34A", "#4ADE80", "#A3E635", "#FACC15", "#FB923C", "#F97316", "#EF4444", "#B91C1C"]
    b = text(60, 150, "Fabbisogno di energia non rinnovabile in kWh per m² all'anno (APE)", 22, MUTED)
    for i, (c, v, e) in enumerate(cl):
        y = 170 + i * 66; w = 260 + i * 52
        b += path(f"M60,{y} L{60+w},{y} L{60+w+28},{y+28} L{60+w},{y+56} L60,{y+56} Z", "none", 0, colors[i])
        b += text(84, y + 40, c, 30, "#fff" if i not in (3, 4, 5) else INK, 800)
        b += text(60 + w - 12, y + 38, v, 22, "#fff" if i not in (3, 4, 5) else INK, 700, "end")
        b += text(60 + w + 50, y + 38, e, 21, INK)
    b += rect(1180, 170, 360, 400, "#fff", LINE)
    b += lines(1205, 215, ["In Italia il 65% delle", "abitazioni è in classe", "E, F o G.", "", "Una casa in classe G", "consuma circa 7 volte", "più di una in A4, per la", "stessa temperatura."], 22, INK, 400, lh=1.35)
    return page("Le classi energetiche degli edifici: dalla G alla A4", b)
S["AMB-2-02_7"] = amb_2_02_7

# AMB-2-02 §8 — bolletta
def amb_2_02_8():
    vv = [("Quota energia", "kWh consumati", "variabile: dipende da quanto consumi", CYAN, CYAN_L),
          ("Quota potenza", "potenza contrattuale (es. 3 kW)", "fissa: si paga anche senza consumare", VIOLET, VIOLET_L),
          ("Trasporto e distribuzione", "gestione delle reti", "va a chi porta l'energia fino a casa", BLUE, BLUE_L),
          ("Oneri di sistema", "incentivi, sussidi, costi del passato", "finanziano scelte di interesse generale", AMBER, AMBER_L),
          ("Imposte", "IVA + accisa", "IVA 10% o 22% secondo il tipo di utenza", RED, RED_L)]
    b = rect(60, 140, 520, 690, "#fff", INK, 3, 10) + text(90, 190, "BOLLETTA ELETTRICA", 26, INK, 800)
    b += text(90, 225, "fac-simile semplificato", 18, MUTED, 400, italic=True)
    for i, (n, s, d, c, f) in enumerate(vv):
        y = 260 + i * 105
        b += rect(90, y, 460, 85, f, c, 2, 8) + text(110, y + 38, n, 22, INK, 700) + text(110, y + 66, s, 18, MUTED)
        b += line(560, y + 42, 640, y + 42, c, 3, arrow=True)
        b += text(660, y + 50, d, 22, INK)
    b += rect(1180, 560, 360, 260, AMBER_L, "none")
    b += lines(1205, 605, ["Esempio dal testo:", "termostato da 22 °C a 20 °C", "→ consumi di riscaldamento", "−10/14% ogni anno"], 22, INK, 400, lh=1.4)
    b += text(660, 830, "Totale da pagare = somma delle cinque voci", 22, INK, 700)
    return page("Come si legge una bolletta elettrica", b)
S["AMB-2-02_8"] = amb_2_02_8

# AMB-2-04 §2 — orientamento solare
def amb_2_04_2():
    cx, cy = 480, 520
    b = text(60, 150, "Pianta vista dall'alto · Italia (emisfero nord)", 22, MUTED)
    # archi solari sul lato sud (in basso)
    b += path(f"M{cx-330},{cy-150} A340,340 0 0 0 {cx+330},{cy-150}", AMBER, 4)
    b += path(f"M{cx-170},{cy+110} A190,120 0 0 0 {cx+170},{cy+110}", CYAN, 4)
    b += text(60, cy - 210, "estate: arco ampio, sole alto", 20, AMBER, 700)
    b += text(cx, cy + 270, "inverno: arco corto, sole basso", 20, CYAN, 700, "middle")
    b += rect(cx - 140, cy - 130, 280, 150, "#fff", INK, 4, 4)
    b += rect(cx - 120, cy + 12, 240, 16, CYAN, "none", 0, 2)  # finestre sud
    b += rect(cx - 30, cy - 138, 60, 14, MUTED, "none", 0, 2)  # piccola finestra nord
    b += text(cx, cy - 45, "edificio", 22, INK, 700, "middle")
    b += text(cx, cy - 160, "N · poche aperture, sempre in ombra", 20, INK, 700, "middle")
    b += text(cx, cy + 60, "S · grandi finestre", 20, CYAN, 700, "middle")
    b += text(cx - 160, cy - 50, "O · sole al pomeriggio", 20, INK, 700, "end")
    b += text(cx + 160, cy - 50, "E · sole al mattino", 20, INK, 700)
    # bussola
    b += line(100, 300, 100, 200, INK, 4, arrow=True) + text(100, 190, "N", 24, INK, 800, "middle")
    # sezione
    X = 1000
    b += text(X, 190, "Sezione nord–sud a mezzogiorno (42° N)", 22, INK, 700)
    gy = 720
    b += line(X, gy, 1560, gy, INK, 3) + rect(X + 60, gy - 220, 220, 220, "#fff", INK, 3, 2)
    b += path(f"M{X+40},{gy-220} L{X+340},{gy-220}", INK, 6)
    b += rect(X + 272, gy - 170, 12, 130, CYAN, "none", 0, 2)
    b += text(X + 60, gy + 30, "N", 20, MUTED, 700) + text(X + 270, gy + 30, "S", 20, MUTED, 700)
    ca, sa = math.cos(math.radians(71)), math.sin(math.radians(71))
    b += line(X + 340 + 330 * ca, gy - 222 - 330 * sa, X + 342, gy - 226, AMBER, 4, arrow=True)
    b += text(X + 410, gy - 470, "estate ≈ 71°: fermato", 21, AMBER, 700, "end") + text(X + 410, gy - 444, "dalla sporgenza del tetto", 20, AMBER, 400, "end")
    cw_, sw_ = math.cos(math.radians(25)), math.sin(math.radians(25))
    b += line(X + 284 + 280 * cw_, gy - 60 - 280 * sw_, X + 290, gy - 62, CYAN, 4, arrow=True)
    b += text(1560, gy - 46, "inverno ≈ 25°: entra", 21, CYAN, 700, "end") + text(1560, gy - 20, "fino in fondo alla stanza", 20, CYAN, 400, "end")
    b += lines(X, 790, ["Le finestre a sud possono ridurre del 30–40%", "il fabbisogno di riscaldamento invernale."], 21, MUTED)
    return page("L'orientamento solare: perché le finestre a sud", b)
S["AMB-2-04_2"] = amb_2_04_2

# AMB-2-04 §4 — massa termica e sfasamento
def amb_2_04_4():
    x0, y0, w, h = 120, 180, 900, 500
    b = text(60, 160, "Temperatura nelle 24 ore", 24, INK, 700)
    b += line(x0, y0 + h, x0 + w, y0 + h, INK, 2) + line(x0, y0, x0, y0 + h, INK, 2)
    for hh in range(0, 25, 6):
        x = x0 + hh / 24 * w
        b += line(x, y0 + h, x, y0 + h + 8, INK, 2) + text(x, y0 + h + 34, f"{hh}:00", 18, MUTED, 400, "middle")
    def curve(peak_h, amp, base, c):
        pts = []
        for i in range(0, 241):
            t = i / 10
            v = base + amp * math.cos((t - peak_h) / 24 * 2 * math.pi)
            pts.append(f"{x0 + t/24*w:.1f},{y0 + h - v:.1f}")
        return path("M" + " L".join(pts), c, 5)
    b += curve(15, 170, 260, AMBER) + curve(25, 50, 240, CYAN)
    b += rect(x0 + 20, y0 + 10, 300, 74, "#fff", LINE, 1, 8)
    b += line(x0 + 36, y0 + 34, x0 + 76, y0 + 34, AMBER, 5) + text(x0 + 88, y0 + 41, "aria esterna (picco 15:00)", 18, INK)
    b += line(x0 + 36, y0 + 64, x0 + 76, y0 + 64, CYAN, 5) + text(x0 + 88, y0 + 71, "parete interna di mattone", 18, INK)
    xa, xb = x0 + 15 / 24 * w, x0 + 23.6 / 24 * w
    b += line(xa, y0 + h - 450, xb, y0 + h - 450, MUTED, 2, arrow=True, arrow_start=True) + text((xa + xb) / 2, y0 + h - 462, "sfasamento 8–12 h", 20, INK, 700, "middle")
    b += text(x0 + 10, y0 + h + 70, "La curva interna è anche più piatta: il muro attenua gli sbalzi.", 20, MUTED)
    # barre massa termica
    X = 1090
    b += text(X, 160, "Massa termica (kJ/m³·K)", 24, INK, 700)
    mats = [("Aria", 1.2), ("Polistirolo", 37), ("Legno di pino", 890), ("Mattone pieno", 1360), ("Calcestruzzo", 1760), ("Pietra calcarea", 2030), ("Acqua", 4186)]
    for i, (n, v) in enumerate(mats):
        y = 200 + i * 78
        b += text(X, y + 20, n, 19, INK, 700)
        bw = max(3, v / 4186 * 330)
        b += rect(X, y + 30, bw, 26, CYAN if v > 500 else "#94A3B8", "none", 0, 4)
        b += text(X + bw + 10, y + 50, f"{v:,}".replace(",", ".").replace(".2", ",2") if v != 1.2 else "1,2", 18, INK)
    return page("La massa termica: il muro che accumula calore", b)
S["AMB-2-04_4"] = amb_2_04_4

if __name__ == "__main__":
    for k, f in S.items(): save(k, f(), OUT)
    print(len(S))
