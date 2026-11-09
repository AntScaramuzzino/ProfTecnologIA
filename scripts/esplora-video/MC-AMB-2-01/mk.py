import json
S=[
("hook",0,"scuro","Restare in piedi","Durante un terremoto, come fa un edificio a restare in piedi?"),
("rischio",1,"chiaro","Circa il 44%","L'Italia è uno dei Paesi a più alto rischio sismico d'Europa: circa il 44% del territorio è in zona sismica 1 o 2."),
("laterale",2,"scuro","Spinta laterale, ripetuta","Un terremoto non spinge gli edifici verso il basso: li sposta lateralmente, in modo rapido e ripetuto."),
("taglio",2,"scuro","Forze di taglio enormi","Questo crea forze di taglio enormi, che la struttura deve assorbire senza crollare."),
("isolatori",3,"scuro","Isolatori sismici","La tecnica più efficace è l'isolamento alla base: tra l'edificio e le fondazioni si inseriscono gli isolatori sismici."),
("strati",3,"chiaro","Gomma e acciaio","Sono cuscinetti di gomma e acciaio a strati, che si deformano in orizzontale."),
("confronto",3,"scuro","Edificio: soli 2–3 cm","Il suolo si sposta in orizzontale dai 20 ai 30 centimetri; l'edificio sopra gli isolatori, solo dai 2 ai 3."),
("dondolio",3,"scuro","Leggero dondolamento","Chi è dentro avverte un leggero dondolamento, non uno scuotimento violento."),
("costi",3,"chiaro","Può ridurre i danni","Il costo di costruzione aumenta tra il 5 e il 10%, ma i danni da terremoto possono ridursi tra il 70 e l'80%."),
("controventi",4,"scuro","Diagonali in acciaio","Nei telai si usano anche i controventi: diagonali in acciaio che trasformano le forze laterali in trazione e compressione."),
("dissipatori",5,"scuro","Energia in calore","I dissipatori, invece, assorbono l'energia del sisma e la trasformano in calore. Quelli viscosi funzionano come gli ammortizzatori di un'auto."),
("finale",0,"chiaro","","Strutture antisismiche: progettate per assorbire le forze del sisma senza crollare."),
]
json.dump({"scene":[dict(id=a,cap=b,registro=c,didascalia=d,voce=e) for a,b,c,d,e in S]},open("scaletta.json","w"),ensure_ascii=False,indent=1)
