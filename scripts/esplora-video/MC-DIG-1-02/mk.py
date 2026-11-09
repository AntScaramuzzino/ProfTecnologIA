import json
S=[
("hook",0,"scuro","Quando cerchi qualcosa online, non stai cercando in tutto internet in tempo reale.","Non in tempo reale"),
("indice",0,"chiaro","Stai cercando in un indice: un elenco enorme, costruito in anticipo. Il processo ha tre fasi.","Un indice, preparato prima"),
("crawler",1,"scuro","Prima fase: programmi automatici chiamati crawler, cioè ragni, girano continuamente per il web.","Crawler: i ragni"),
("link",1,"scuro","Seguono i link da una pagina all'altra. Le pagine trovate possono essere lette, ma non tutte vengono indicizzate.","Non tutte indicizzate"),
("catalogo",2,"scuro","Seconda fase: ogni pagina visitata viene analizzata e aggiunta all'indice.","Analizzata e aggiunta"),
("voci",2,"chiaro","L'indice associa le parole chiave alle pagine in cui compaiono, come l'indice analitico alla fine di un libro.","Parole chiave, pagine"),
("enorme",2,"scuro","Ma qui le pagine sono centinaia di miliardi, e il numero cambia nel tempo.","Centinaia di miliardi"),
("ranking",3,"scuro","Terza fase: quando cerchi, l'algoritmo di ranking ordina i risultati, combinando centinaia di fattori.","Ordinare i risultati"),
("fattori",3,"chiaro","Tra i principali: quanti siti autorevoli rimandano alla pagina, se risponde davvero alla domanda, se è aggiornata, e quante persone ci cliccano.","Alcuni fattori principali"),
("verita",4,"scuro","Attenzione: il motore di ricerca non sa se una pagina è vera o falsa. Valuta i link e la popolarità, non la veridicità.","Non la veridicità"),
("valuta",4,"chiaro","Una pagina molto linkata e popolare può comunque contenere informazioni sbagliate.","Popolare, ma sbagliata"),
("finale",0,"chiaro","Per questo non basta cercare: bisogna anche valutare quello che trovi.",""),
]
json.dump({"scene":[dict(id=a,cap=b,registro=c,voce=d,didascalia=e) for a,b,c,d,e in S]},open('scaletta.json','w'),ensure_ascii=False,indent=1)
