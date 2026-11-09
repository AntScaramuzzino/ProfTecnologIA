import json
S=[
("hook",1,"scuro","I fogli per il disegno tecnico seguono una norma: la ISO 216.","La norma ISO 216"),
("serie",1,"chiaro","La serie principale si chiama serie A. I formati più usati vanno dall'A0 all'A5.","La serie A"),
("a0",1,"scuro","Il più grande è l'A0: 841 per 1189 millimetri.","A0: 841 × 1189"),
("meta1",2,"scuro","Dividi un foglio A0 a metà: ottieni due fogli A1, da 594 per 841 millimetri.","Due fogli A1"),
("meta2",2,"scuro","Dividi un A1 a metà e ottieni due A2. Poi un A2 diventa due A3. Un A3 diventa due A4. Un A4 diventa due A5.","Metà del precedente"),
("a4",2,"chiaro","L'A4 misura 210 per 297 millimetri: è il formato scolastico standard.","A4: 210 × 297"),
("rapp",3,"chiaro","La proprietà speciale: in ogni formato, il lato lungo diviso il lato corto fa sempre radice di due, circa uno virgola quattrocentoquattordici.","Sempre radice di due"),
("diag",3,"scuro","Per questo, ogni metà ha le stesse proporzioni del foglio intero.","Stesse proporzioni"),
("riduci",4,"scuro","Conseguenza pratica: hai un disegno su A3 in scala uno a cinquanta, e lo riduci al settanta virgola sette per cento per portarlo su A4.","Da A3 ad A4"),
("scala",4,"chiaro","La nuova scala diventa circa uno a settanta virgola sette: cinquanta diviso zero virgola settecentosette.","Circa 1:70,7"),
("area",4,"scuro","Il formato dimezza l'area, non le lunghezze.","Metà area"),
("cento",4,"scuro","Per passare da uno a cinquanta a uno a cento, devi ridurre le lunghezze al cinquanta per cento.","Lunghezze al 50%"),
("finale",0,"chiaro","Ogni formato è la metà del precedente, con le stesse proporzioni.",""),
]
json.dump({"scene":[dict(id=a,cap=b,registro=c,voce=d,didascalia=e) for a,b,c,d,e in S]},open("scaletta.json","w"),ensure_ascii=False,indent=1)
