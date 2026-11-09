import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
S=[
("lineare",1,"scuro","Estrai, produci, vendi, consuma, butta: è il modello lineare. Dalla culla alla tomba.",None,"Dalla culla alla tomba"),
("limite",1,"scuro","Funziona se le risorse sono abbondanti e lo spazio per i rifiuti è illimitato. Ma non lo sono.",None,"Non lo sono"),
("circolare",2,"scuro","L'economia circolare propone un modello alternativo: dalla culla alla culla.",None,"Dalla culla alla culla"),
("ciclo",2,"scuro","Prodotti e materiali sono progettati per essere riusati, riparati o riciclati, restando in ciclo il più a lungo possibile.",None,"Restare in ciclo"),
("obiettivo",2,"chiaro","L'obiettivo è eliminare i rifiuti come concetto: non gestirli, ma non produrli.",None,"Non produrli"),
("4r",3,"chiaro","Per ricordare le priorità ci sono le 4R: ridurre, riusare, riciclare, recuperare.","Per ricordare le priorità ci sono le quattro erre: ridurre, riusare, riciclare, recuperare.","Le 4R"),
("ridurre",3,"scuro","Ridurre viene prima: un rifiuto che non esiste non deve essere gestito.",None,"Prima: ridurre"),
("recuperare",3,"scuro","Recuperare energia dai rifiuti non riciclabili è meglio della discarica, ma peggio delle altre tre.",None,"Meglio della discarica"),
("bio",4,"scuro","Ci sono tre livelli. Nel ciclo biologico, cibo, fibre naturali e legno tornano all'ecosistema, per esempio con il compostaggio.",None,"Ciclo biologico"),
("tecnico",4,"scuro","Nel ciclo tecnico, metalli, plastica e vetro tornano nella produzione: il cobalto recuperato da una batteria di smartphone serve per una nuova batteria.",None,"Ciclo tecnico"),
("servizio",4,"chiaro","Infine il modello di servizio: si vende l'uso, non il prodotto. L'azienda resta proprietaria, e a fine vita lo recupera e lo ricicla.",None,"Vendere l'uso"),
("finale",0,"chiaro","Dalla culla alla culla: l'economia circolare.",None,""),
]
out=[]
for id,cap,reg,v,vt,did in S:
    d=dict(id=id,cap=cap,registro=reg,voce=v,didascalia=did,corallo="")
    if vt: d['voce_tts']=vt
    out.append(d)
json.dump({"scene":out},open('scaletta.json','w'),ensure_ascii=False,indent=1)
print(sum(len(x[3].split()) for x in S))
