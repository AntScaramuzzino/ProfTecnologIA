import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
S=[
("hook",1,"scuro","Una centrale idroelettrica trasforma l'energia potenziale dell'acqua accumulata in quota in energia elettrica.",None,"Dall'acqua all'elettricità"),
("condotte",1,"scuro","Primo passo: l'acqua scende dalla diga fino alla centrale, attraverso le condotte forzate.",None,"Condotte forzate"),
("turbina",1,"scuro","Poi l'acqua in movimento fa girare una turbina idraulica. E la turbina aziona un generatore elettrico.",None,"Turbina e generatore"),
("pelton",2,"scuro","Per dislivelli molto alti, oltre i 200 metri, e portate ridotte, si usa la turbina Pelton: getti ad alta velocità colpiscono cucchiai a doppia curva.","Per dislivelli molto alti, oltre i duecento metri, e portate ridotte, si usa la turbina Pelton: getti ad alta velocità colpiscono cucchiai a doppia curva.","Turbina Pelton"),
("kaplan",2,"scuro","Per dislivelli bassi, sotto i 30 metri, e portate elevate, come nei grandi fiumi, si usa la Kaplan: le sue pale sono regolabili.","Per dislivelli bassi, sotto i trenta metri, e portate elevate, come nei grandi fiumi, si usa la Kaplan: le sue pale sono regolabili.","Turbina Kaplan"),
("paratoie",3,"scuro","Il grande vantaggio dell'idroelettrico: è dispacciabile, cioè si regola a piacimento aprendo o chiudendo le paratoie.",None,"Dispacciabile"),
("bilancio",3,"chiaro","Serve più elettricità? Si aumenta il flusso. Ce n'è troppa? Si riduce. Così si bilancia la rete.",None,"Bilanciare la rete"),
("pompa",4,"scuro","Con il pompaggio, quando l'elettricità è in eccesso, la si usa per pompare acqua dal bacino inferiore a quello superiore.",None,"Acqua verso l'alto"),
("rilascio",4,"scuro","Quando l'elettricità scarseggia, si rilascia l'acqua verso il basso e si genera elettricità: una batteria fatta d'acqua.",None,"Una batteria d'acqua"),
("dato",4,"chiaro","È la forma di accumulo più diffusa al mondo. In Italia la capacità di pompaggio installata è di circa 7.700 megawatt.","È la forma di accumulo più diffusa al mondo. In Italia la capacità di pompaggio installata è di circa settemila settecento megawatt.","Pompaggio in Italia"),
("finale",0,"chiaro","L'acqua che scende: energia rinnovabile che si può regolare.",None,""),
]
out=[]
for id,cap,reg,v,vt,did in S:
    d=dict(id=id,cap=cap,registro=reg,voce=v,didascalia=did,corallo="")
    if vt: d['voce_tts']=vt
    out.append(d)
json.dump({"scene":out},open('scaletta.json','w'),ensure_ascii=False,indent=1)
print(sum(len(x[3].split()) for x in S))
