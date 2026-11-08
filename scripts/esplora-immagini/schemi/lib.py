"""Helper per schemi didattici SVG 1600x900, stile coerente."""
import html, subprocess, os

W, H = 1600, 900
INK = "#0F172A"; MUTED = "#475569"; LINE = "#CBD5E1"; BG = "#F8FAFC"
CYAN = "#0891B2"; CYAN_L = "#CFFAFE"; AMBER = "#D97706"; AMBER_L = "#FEF3C7"
GREEN = "#16A34A"; GREEN_L = "#DCFCE7"; RED = "#DC2626"; RED_L = "#FEE2E2"
VIOLET = "#7C3AED"; VIOLET_L = "#EDE9FE"; BLUE = "#2563EB"; BLUE_L = "#DBEAFE"
FONT = "Inter, DejaVu Sans, sans-serif"

def esc(s): return html.escape(str(s), quote=True)

def text(x, y, s, size=26, fill=INK, weight=400, anchor="start", italic=False, extra="", font=None):
    font = font or FONT
    st = ' font-style="italic"' if italic else ""
    return (f'<text x="{x}" y="{y}" font-family="{font}" font-size="{size}" fill="{fill}" '
            f'font-weight="{weight}" text-anchor="{anchor}"{st} {extra}>{esc(s)}</text>')

def lines(x, y, rows, size=24, fill=INK, weight=400, anchor="start", lh=1.3):
    return "".join(text(x, y + i * size * lh, r, size, fill, weight, anchor) for i, r in enumerate(rows))

def rect(x, y, w, h, fill="#fff", stroke=LINE, sw=2, r=14, extra=""):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" {extra}/>'

def line(x1, y1, x2, y2, c=INK, w=3, dash=None, arrow=False, arrow_start=False):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    me = f' marker-end="url(#a{c[1:]})"' if arrow else ""
    ms = f' marker-start="url(#s{c[1:]})"' if arrow_start else ""
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{c}" stroke-width="{w}"{d}{me}{ms} stroke-linecap="round"/>'

def path(d, c=INK, w=3, fill="none", arrow=False, dash=None):
    me = f' marker-end="url(#a{c[1:]})"' if arrow else ""
    da = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<path d="{d}" stroke="{c}" stroke-width="{w}" fill="{fill}"{me}{da} stroke-linecap="round" stroke-linejoin="round"/>'

def circle(cx, cy, r, fill="#fff", stroke=INK, sw=2):
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'

def pill(x, y, s, fill, color, size=20):
    w = int(len(s) * size * 0.6) + 28
    return rect(x, y, w, size + 16, fill, "none", 0, (size + 16) // 2) + text(x + w / 2, y + size + 2, s, size, color, 700, "middle")

def _markers():
    cols = [INK, MUTED, CYAN, AMBER, GREEN, RED, VIOLET, BLUE]
    out = []
    for c in cols:
        out.append(f'<marker id="a{c[1:]}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="{c}"/></marker>')
        out.append(f'<marker id="s{c[1:]}" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="{c}"/></marker>')
    return "<defs>" + "".join(out) + "</defs>"

def page(title, body, subtitle=None):
    head = (rect(0, 0, W, 96, "#0F172A", "none", 0, 0)
            + rect(0, 92, W, 4, CYAN, "none", 0, 0)
            + text(56, 62, title, 38, "#FFFFFF", 700))
    if subtitle:
        head += text(56, 140, subtitle, 24, MUTED, 400)
    foot = text(W - 40, H - 22, "Schema didattico · ProfTecnologIA", 16, "#94A3B8", 400, "end")
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
            + _markers() + rect(0, 0, W, H, BG, "none", 0, 0) + head + body + foot + "</svg>")

def save(name, svg, outdir):
    os.makedirs(outdir, exist_ok=True)
    p = os.path.join(outdir, name + ".svg")
    open(p, "w").write(svg)
    png = os.path.join(outdir, name + ".png")
    subprocess.run(["rsvg-convert", "-w", "1600", "-h", "900", p, "-o", png], check=True)
    return png

MONO = "DejaVu Sans Mono, monospace"
