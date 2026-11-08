from lib import *
import math, random
OUT = "out"
S = {}

# ENE-3-04 §1 — cos'è la corrente elettrica
def ene_3_04_1():
    b = text(60, 160, "Dentro un filo di rame", 26, INK, 700)
    x0, y0, w, h = 60, 190, 1000, 330
    b += rect(x0, y0, w, h, "#FDE7D2", "#B45309", 4, 40)
    random.seed(3)
    for r in range(4):
        for c in range(12):
            x = x0 + 60 + c * 80 + (40 if r % 2 else 0); y = y0 + 60 + r * 72
            if x > x0 + w - 40: continue
            b += circle(x, y, 22, RED_L, RED, 2) + text(x, y + 9, "+", 26, RED, 800, "middle")
    for k in range(26):
        r = k % 3; x = x0 + 70 + (k // 3) * 105 + random.random() * 30; y = y0 + 96 + r * 72
        b += circle(x, y, 9, CYAN, "none", 0) + line(x + 14, y, x + 44, y, CYAN, 2, arrow=True)
    # legenda
    b += circle(1110, 250, 22, RED_L, RED, 2) + text(1110, 259, "+", 26, RED, 800, "middle")
    b += lines(1150, 245, ["ioni di rame (nucleo + elettroni", "interni): restano al loro posto,", "vibrano soltanto"], 22, INK)
    b += circle(1110, 380, 9, CYAN, "none", 0) + line(1124, 380, 1154, 380, CYAN, 2, arrow=True)
    b += lines(1170, 375, ["elettroni liberi: si spostano", "tutti insieme lungo il filo", "= corrente elettrica"], 22, INK)
    # pila
    b += rect(60, 570, 1000, 220, "#fff", LINE)
    b += text(90, 615, "La tensione (V) è la «spinta» che li mette in moto", 24, INK, 700)
    b += rect(110, 650, 120, 90, "#E2E8F0", INK, 2, 8) + text(140, 710, "−", 40, INK, 800, "middle") + text(200, 710, "+", 40, INK, 800, "middle")
    b += text(170, 770, "pila", 20, MUTED, 400, "middle")
    b += line(260, 695, 1000, 695, CYAN, 4, arrow=True)
    b += text(630, 680, "verso degli elettroni: dal polo − al polo +", 22, CYAN, 700, "middle")
    b += rect(1110, 570, 430, 220, CYAN_L, "none")
    b += lines(1140, 615, ["Come l'acqua in un tubo:", "corrente = flusso d'acqua", "tensione = pressione", "senza pressione, niente flusso"], 23, INK, 400, lh=1.45)
    return page("L'elettricità: che cosa si muove davvero", b)
S["ENE-3-04_1"] = ene_3_04_1

# ENE-3-04 §4 — potenza elettrica
def ene_3_04_4():
    items = [("Lampadina LED", 8), ("Caricatore telefono", 15), ("Televisore", 100), ("Asciugacapelli", 2000)]
    b = text(60, 160, "Potenza tipica di alcuni apparecchi (watt)", 26, INK, 700)
    b += text(60, 195, "valori indicativi: il dato preciso è sull'etichetta di ogni apparecchio", 20, MUTED, 400, italic=True)
    x0, maxw = 360, 1020
    for i, (n, p) in enumerate(items):
        y = 230 + i * 92
        bw = max(4, p / 2000 * maxw)
        b += text(x0 - 20, y + 42, n, 24, INK, 700, "end")
        b += rect(x0, y + 12, bw, 48, AMBER if p > 500 else CYAN, "none", 0, 6)
        b += text(x0 + bw + 14, y + 46, f"{p:,} W".replace(",", "."), 24, INK, 700)
    b += text(x0, 620, "L'asciugacapelli assorbe circa 250 volte la potenza di una lampadina LED.", 22, MUTED)
    b += rect(60, 660, 700, 160, "#fff", LINE)
    b += lines(90, 705, ["P = V × I", "LED a 5 V con 0,4 A → P = 5 × 0,4 = 2 W"], 26, INK, 700, lh=1.5)
    b += rect(800, 660, 740, 160, AMBER_L, "none")
    b += lines(830, 705, ["Energia (kWh) = potenza (kW) × tempo (h)", "2 kW per 1,5 h → 3 kWh"], 26, INK, 700, lh=1.5)
    return page("La potenza elettrica", b)
S["ENE-3-04_4"] = ene_3_04_4

# INF-1-02 §4 — variabili
def inf_1_02_4():
    vars_ = [("temperatura", "28", "numero", CYAN), ("nome_utente", '"Giulia"', "testo", VIOLET), ("sessione_aperta", "vero", "vero/falso", GREEN)]
    b = text(60, 165, "Una variabile = una scatola con un'etichetta e UN solo valore alla volta", 26, INK, 700)
    for i, (n, v, t, c) in enumerate(vars_):
        x = 80 + i * 500
        b += rect(x, 200, 420, 60, c, "none", 0, 10) + text(x + 210, 241, n, 28, "#fff", 700, "middle", font=MONO)
        b += rect(x, 255, 420, 170, "#fff", c, 4, 10) + text(x + 210, 360, v, 52, INK, 700, "middle", font=MONO)
        b += text(x + 210, 460, "tipo: " + t, 22, MUTED, 400, "middle")
    # cambio valore
    b += rect(60, 520, 1480, 300, "#fff", LINE)
    b += text(90, 565, "Il valore cambia mentre l'algoritmo gira: il nuovo valore sostituisce il vecchio", 24, INK, 700)
    steps = [("mattino", "temperatura ← 28", "28"), ("pomeriggio", "temperatura ← 35", "35")]
    for k, (when, instr, val) in enumerate(steps):
        x = 110 + k * 720
        b += text(x, 620, when, 22, MUTED, 700)
        b += text(x, 665, instr, 30, CYAN, 700, font=MONO)
        b += rect(x + 380, 600, 220, 150, "#fff", CYAN, 4, 10) + rect(x + 380, 600, 220, 40, CYAN, "none", 0, 10)
        b += text(x + 490, 628, "temperatura", 20, "#fff", 700, "middle", font=MONO)
        if k == 1:
            b += text(x + 440, 705, "28", 34, "#94A3B8", 700, "middle", font=MONO) + line(x + 415, 695, x + 465, 695, RED, 3)
            b += text(x + 545, 715, "35", 44, INK, 800, "middle", font=MONO)
        else:
            b += text(x + 490, 715, val, 44, INK, 800, "middle", font=MONO)
    b += line(720, 690, 800, 690, MUTED, 3, arrow=True)
    return page("Variabili: dove metti i dati mentre lavori", b)
S["INF-1-02_4"] = inf_1_02_4

# INF-2-02 §3 — numeri primi e RSA
def inf_2_02_3():
    b = rect(60, 150, 700, 300, GREEN_L, "none") + text(90, 200, "Moltiplicare: facile", 28, GREEN, 800)
    b += text(410, 320, "17 × 19 = 323", 56, INK, 800, "middle", font=MONO)
    b += text(90, 410, "Un solo calcolo, risultato immediato.", 22, INK)
    b += rect(840, 150, 700, 300, RED_L, "none") + text(870, 200, "Fattorizzare: difficile", 28, RED, 800)
    b += text(1190, 270, "323 = ? × ?", 50, INK, 800, "middle", font=MONO)
    tries = ["323 ÷ 2 no", "323 ÷ 3 no", "323 ÷ 5 no", "323 ÷ 7 no", "323 ÷ 11 no", "323 ÷ 13 no", "323 ÷ 17 = 19 ✓"]
    for i, t in enumerate(tries):
        b += text(870 + (i % 4) * 165, 330 + (i // 4) * 40, t, 20, GREEN if "✓" in t else MUTED, 700 if "✓" in t else 400, font=MONO)
    b += text(870, 425, "Bisogna provare un divisore dopo l'altro.", 22, INK)
    b += line(770, 300, 830, 300, MUTED, 3, arrow=True)
    # scala
    b += rect(60, 490, 1480, 330, "#fff", LINE)
    b += text(90, 540, "Con numeri enormi la differenza diventa abissale", 26, INK, 700)
    rows = [("due primi da 2 cifre", "prodotto da 3 cifre", "pochi tentativi", GREEN),
            ("due primi da 600 cifre", "prodotto da 1200 cifre", "più anni dell'età dell'universo", RED)]
    for i, (a, p, t, c) in enumerate(rows):
        y = 600 + i * 90
        b += pill(90, y, a, "#E2E8F0", INK, 22) + line(420, y + 19, 500, y + 19, MUTED, 3, arrow=True)
        b += pill(520, y, p, "#E2E8F0", INK, 22) + line(840, y + 19, 920, y + 19, MUTED, 3, arrow=True)
        b += pill(940, y, "per scomporlo: " + t, RED_L if c == RED else GREEN_L, c, 20)
    b += text(90, 790, "RSA (1977) usa chiavi da 2048 o 4096 bit: per questo è sicuro con i computer di oggi.", 22, MUTED)
    return page("Perché la crittografia RSA è difficile da rompere", b)
S["INF-2-02_3"] = inf_2_02_3

# SIS-3-03 §3 — Business Model Canvas (disposizione standard di Osterwalder)
def sis_3_03_3():
    x0, y0, W5, Htop, Hbot = 60, 150, 1480, 470, 200
    cw = W5 / 5
    def cell(x, y, w, h, n, t, d, c, f):
        return (rect(x, y, w, h, f, c, 3, 10) + circle(x + 30, y + 32, 18, c, "none", 0)
                + text(x + 30, y + 40, n, 20, "#fff", 800, "middle") + text(x + 58, y + 40, t, 22, INK, 700)
                + lines(x + 18, y + 82, d, 21, MUTED))
    b = ""
    b += cell(x0, y0, cw, Htop, "8", "Partner chiave", ["fornitori, alleati,", "chi fa ciò che", "non fai tu"], VIOLET, VIOLET_L)
    b += cell(x0 + cw, y0, cw, Htop / 2, "7", "Attività chiave", ["cosa fai ogni giorno"], VIOLET, VIOLET_L)
    b += cell(x0 + cw, y0 + Htop / 2, cw, Htop / 2, "6", "Risorse chiave", ["cosa ti serve"], VIOLET, VIOLET_L)
    b += cell(x0 + 2 * cw, y0, cw, Htop, "2", "Proposta di valore", ["quale problema", "risolvi per il", "cliente"], AMBER, AMBER_L)
    b += cell(x0 + 3 * cw, y0, cw, Htop / 2, "4", "Relazioni", ["come interagisci", "con i clienti"], CYAN, CYAN_L)
    b += cell(x0 + 3 * cw, y0 + Htop / 2, cw, Htop / 2, "3", "Canali", ["come li raggiungi"], CYAN, CYAN_L)
    b += cell(x0 + 4 * cw, y0, cw, Htop, "1", "Segmenti di clienti", ["chi servi:", "clienti specifici,", "non «tutti»"], CYAN, CYAN_L)
    b += cell(x0, y0 + Htop, W5 / 2, Hbot, "9", "Struttura dei costi", ["quanto costa far funzionare l'impresa"], RED, RED_L)
    b += cell(x0 + W5 / 2, y0 + Htop, W5 / 2, Hbot, "5", "Fonti di ricavo", ["vendita, abbonamento, freemium, pubblicità, licenza"], GREEN, GREEN_L)
    b += text(60, 860, "9 blocchi · i numeri indicano l'ordine di compilazione: prima i clienti, poi il valore, poi come lo consegni e come lo costruisci", 19, MUTED)
    return page("Il Business Model Canvas", b)
S["SIS-3-03_3"] = sis_3_03_3

if __name__ == "__main__":
    for k, f in S.items(): save(k, f(), OUT)
    print(len(S))
