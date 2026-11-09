import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
S=[
("hook",1,"scuro","Il sistema di accumulo energetico più usato al mondo non usa batterie, né idrogeno. Usa l'acqua.",None,"Usa l'acqua"),
("dato",1,"chiaro","L'accumulo pompato rappresenta il 90% di tutta la capacità di accumulo installata nel mondo.","L'accumulo pompato rappresenta il novanta per cento di tutta la capacità di accumulo installata nel mondo.","Il 90% dell'accumulo"),
("bacini",2,"scuro","Servono due bacini d'acqua a quote diverse: uno a valle e uno in quota.",None,"Due bacini"),
("notte",2,"scuro","Quando c'è energia in eccesso, per esempio di notte, quando il consumo è basso,",None,"Energia in eccesso"),
("pompa",2,"scuro","si usano pompe elettriche per spingere l'acqua dal bacino a valle verso il bacino in quota.",None,"Acqua verso l'alto"),
("mgh",3,"chiaro","Salendo, l'acqua accumula energia potenziale gravitazionale: mgh. Massa, gravità, altezza.","Salendo, l'acqua accumula energia potenziale gravitazionale: emme gi acca. Massa, gravità, altezza.","Energia potenziale"),
("altezza",3,"scuro","Più massa d'acqua e più altezza: più energia immagazzinata.",None,"Più massa, più altezza"),
("scarica",4,"scuro","Quando serve energia, l'acqua scorre di nuovo verso il basso. Le pompe si trasformano in turbine, e si produce elettricità.",None,"Pompe come turbine"),
("resa",4,"chiaro","L'efficienza del ciclo è tra il 70 e l'85%: su 100 chilowattora usati per pompare, se ne recuperano da 70 a 85.","L'efficienza del ciclo è tra il settanta e l'ottantacinque per cento: su cento chilowattora usati per pompare, se ne recuperano da settanta a ottantacinque.","Efficienza 70–85%"),
("mondo",5,"chiaro","Nel mondo la capacità installata supera i 170 gigawatt. In Italia ci sono diversi impianti di questo tipo, nelle Alpi.","Nel mondo la capacità installata supera i centosettanta gigawatt. In Italia ci sono diversi impianti di questo tipo, nelle Alpi.","Oltre 170 GW"),
("limite",5,"scuro","Il limite: serve un sito con due bacini a quote diverse, abbastanza vicini. Non si può costruire ovunque.",None,"Non ovunque"),
("finale",0,"chiaro","Il gigante invisibile: l'acqua che accumula energia.",None,""),
]
out=[]
for id,cap,reg,v,vt,did in S:
    d=dict(id=id,cap=cap,registro=reg,voce=v,didascalia=did,corallo="")
    if vt: d['voce_tts']=vt
    out.append(d)
json.dump({"scene":out},open('scaletta.json','w'),ensure_ascii=False,indent=1)
print(sum(len(x[3].split()) for x in S))
