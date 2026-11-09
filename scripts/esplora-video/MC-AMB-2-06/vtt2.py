import json
tl=json.load(open('timeline.json')); sc={s['id']:s for s in json.load(open('scaletta.json'))['scene']}
# cue = lista di righe; i token devono ricostruire la voce della scena in ordine
CUES={
'hook':[["Una smart city è piena di sensori,","che misurano grandezze fisiche"],["e mandano i dati","a un sistema centrale."]],
'spira':[["Nell'asfalto c'è una spira induttiva,","una bobina di filo metallico."],["Se passa un veicolo,","altera il campo magnetico"],["e il sensore lo rileva."]],
'limite':[["Così conta i veicoli","e misura la velocità media."],["Costa poco, ma non distingue","un'auto da una moto o da un camion."]],
'camera':[["Le telecamere con computer vision","riconoscono tipo di veicolo,"],["targa e velocità,","ma richiedono potenza di calcolo"],["e sollevano questioni di privacy."]],
'aria':[["I sensori dell'aria misurano","il particolato, il biossido di azoto,"],["l'ozono e il monossido di carbonio."]],
'soglia':[["Oltre le soglie europee, il sistema","può rallentare il traffico,"],["avvisare le persone vulnerabili o bloccare","l'accesso alle zone a basse emissioni."]],
'luce':[["Di notte, se non passa nessuno,","i lampioni smart dimezzano la luce."],["Se rilevano un movimento,","tornano alla piena potenza."]],
'risparmio':[["Il risparmio medio va","dal trenta al cinquanta per cento."],["A Roma, con circa trecentomila punti luce,","si stimano milioni di euro l'anno."]],
'rifiuti':[["Nei cassonetti, un sensore a ultrasuoni","misura il livello di riempimento"],["e lo trasmette in tempo reale","alla centrale."]],
'percorso':[["Così i camion seguono","una mappa di priorità aggiornata ogni ora,"],["non un percorso fisso."],["In alcune città, i percorsi","si riducono del venti, trenta per cento."]],
'finale':[["I sensori urbani misurano la città,","per gestirla con i dati."]],
}
def ts(x): h=int(x//3600); m=int(x%3600//60); s=x%60; return f"{h:02d}:{m:02d}:{s:06.3f}"
cues=[]
for t in tl['scenes']:
    s=sc[t['id']]; base=t['start']+t['L']; w=s['parole']; toks=s['voce'].split(); k=0
    for c in CUES[t['id']]:
        n=sum(len(l.split()) for l in c); ct=' '.join(c).split()
        assert ct==toks[k:k+n],(t['id'],ct,toks[k:k+n])
        for l in c: assert len(l)<=43 and len(l.split())>1,(l)
        cues.append([base+w[k][1], base+w[k+n-1][2]+0.3, '\n'.join(c)]); k+=n
    assert k==len(toks),t['id']
for i in range(len(cues)-1): cues[i][1]=min(cues[i][1],cues[i+1][0]-0.05)
for a,b,_ in cues: assert b>a
out=["WEBVTT",""]
for i,(a,b,x) in enumerate(cues,1): out+=[str(i),f"{ts(a)} --> {ts(b)}",x,""]
import os
open(os.environ.get('OUT','out')+'/par-02.vtt','w').write("\n".join(out)); print(len(cues))
