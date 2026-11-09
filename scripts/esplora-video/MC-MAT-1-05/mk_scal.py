import json
S=[
("intro",0,"scuro","Il ferro che usiamo ogni giorno non è quasi mai puro: è sempre una lega.","Sempre una lega"),
("puro",1,"chiaro","Il ferro puro serve a poco: è morbido, arrugginisce in fretta e non regge quasi nessuna struttura.","Ferro puro: serve poco"),
("lega",1,"scuro","Lo mescoliamo con altri elementi, in proporzioni controllate: le due leghe principali sono ghisa e acciaio.","Ghisa e acciaio"),
("altoforno",2,"scuro","La ghisa si ottiene nell'altoforno: un impianto industriale alto fino a 60 metri.","Alto fino a 60 m"),
("carica",2,"scuro","Dall'alto si caricano minerale di ferro, coke e calcare. Dal basso si soffia aria compressa.","Carica dall'alto"),
("cola",2,"scuro","Si arriva fino a 1.500 gradi. Il ferro fuso scivola in basso e si raccoglie sul fondo; sopra galleggia la scoria.","Fino a 1.500 °C"),
("ghisa",3,"chiaro","Quella raccolta sul fondo è la ghisa: ferro con una percentuale di carbonio tra il 2 e il 4,5%.","Carbonio: 2–4,5%"),
("fragile",3,"scuro","La ghisa è dura e regge il peso, ma è fragile: non si deforma, si spezza di colpo, senza dare segnali.","Dura ma fragile"),
("acciaio",4,"chiaro","Se nella ghisa riduciamo il carbonio, tra lo 0,02 e il 2%, otteniamo l'acciaio.","Meno carbonio: acciaio"),
("duttile",4,"scuro","L'acciaio dolce, prima di rompersi, si deforma in modo visibile: un segnale d'allarme prezioso.","Un segnale d'allarme"),
("famiglia",5,"chiaro","L'acciaio è una famiglia: dolce per edifici e automobili, ad alto carbonio per le lame, inossidabile, con il cromo, per le posate.","Una famiglia di acciai"),
("finale",0,"chiaro","Sembra una variazione piccola, ma il carbonio cambia completamente le proprietà del materiale.","Il carbonio cambia tutto"),
]
json.dump({"scene":[dict(id=a,cap=b,registro=c,voce=d,didascalia=e) for a,b,c,d,e in S]},open('scaletta.json','w'),ensure_ascii=False,indent=1)
