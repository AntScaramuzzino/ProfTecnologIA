import json
S=[
("hook",0,"scuro","Pensa a una foto sul tuo telefono. Sembra un'immagine, ma dentro è una sequenza lunghissima di numeri.","Una sequenza di numeri","numeri"),
("megapixel",1,"scuro","Una foto da dodici megapixel contiene dodici milioni di pixel: dodici milioni di puntini.","12 milioni di pixel",""),
("pixel",1,"chiaro","Ogni pixel è un singolo puntino dell'immagine, e ha un colore.","Un puntino, un colore",""),
("rgb",2,"scuro","I colori digitali si costruiscono mescolando tre componenti: rosso, verde e blu. È il sistema RGB.","Rosso, verde, blu",""),
("valore",2,"chiaro","Ogni componente ha un valore da zero a duecentocinquantacinque.","Da 0 a 255",""),
("cambia",2,"scuro","Cambia di molto anche uno solo dei tre valori, e il colore cambia completamente.","Cambia un valore",""),
("byte",3,"scuro","Un numero da zero a duecentocinquantacinque occupa un byte, cioè otto bit. Con otto bit si scrivono duecentocinquantasei valori diversi.","1 byte = 8 bit",""),
("tre",3,"chiaro","Per ogni pixel servono quindi tre byte: uno per il rosso, uno per il verde, uno per il blu. In tutto, ventiquattro bit.","3 byte per pixel",""),
("totale",4,"chiaro","Dodici milioni di pixel per tre byte: trentasei milioni di byte, per una sola foto.","36 milioni di byte",""),
("binario",4,"scuro","Trentasei milioni di numeri da zero a duecentocinquantacinque, ognuno scritto con otto bit: in tutto, duecentottantotto milioni di bit. Solo zero e uno.","Solo 0 e 1",""),
("finale",0,"chiaro","Ogni foto è una sequenza di numeri.","",""),
]
json.dump({"scene":[dict(id=a,cap=b,registro=c,voce=d,didascalia=e,corallo=f) for a,b,c,d,e,f in S]},open('scaletta.json','w'),ensure_ascii=False,indent=1)
