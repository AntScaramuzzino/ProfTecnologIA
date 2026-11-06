"""Elenca i paragrafi ### della sezione ESPLORA di ogni MC (con estratto)."""
import re, sys, glob, json, os
def paragrafi(path, excerpt=0):
    txt=open(path,encoding='utf-8').read()
    m=re.search(r'^## [^\n]*ESPLORA[^\n]*\n(.*?)(?=^## )', txt, re.S|re.M)
    if not m: return []
    out=[]; cur=None
    for line in m.group(1).split('\n'):
        h=re.match(r'^###\s+(.+?)\s*$', line)
        if h:
            cur={'paragrafo':h.group(1).strip(),'testo':''}; out.append(cur)
        elif cur is not None and excerpt and len(cur['testo'])<excerpt and line.strip() and not line.startswith('#'):
            cur['testo']+=re.sub(r'[*_>`]','',line.strip())+' '
    for o in out: o['testo']=o['testo'][:excerpt]
    return out
if __name__=='__main__':
    pat=sys.argv[1]; ex=int(sys.argv[2]) if len(sys.argv)>2 else 0
    for f in sorted(glob.glob(f'data/testi/**/{pat}_completa.md', recursive=True)):
        mc=os.path.basename(f).replace('_completa.md','')
        ps=paragrafi(f,ex)
        print(f'=== {mc} ({len(ps)})')
        for i,p in enumerate(ps,1):
            print(f'{i}. {p["paragrafo"]}' + (f'\n   {p["testo"]}' if ex else ''))
