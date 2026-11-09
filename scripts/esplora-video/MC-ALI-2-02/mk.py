import json
S = [
 ("hook",0,"scuro","Un surgelato parte dal produttore e arriva nel freezer di casa tua. In mezzo, c'è un lungo viaggio.","Un lungo viaggio","viaggio"),
 ("regola",1,"chiaro","Per tutto il viaggio, il prodotto deve restare a meno diciotto gradi, o anche più freddo: dall'inizio alla fine.","Dall'inizio alla fine",""),
 ("nome",1,"scuro","Questa continuità si chiama catena del freddo.","Catena del freddo","freddo"),
 ("viaggio",1,"scuro","È un sistema logistico complesso: mezzi di trasporto refrigerati, celle frigorifere nei magazzini, banchi frigoriferi nei supermercati. Fino al freezer di casa.","Un sistema logistico",""),
 ("interrotta",2,"scuro","Ma la catena può interrompersi, anche solo per poche ore.","Anche poche ore",""),
 ("risveglio",2,"chiaro","Allora i microrganismi si risvegliano, e iniziano a moltiplicarsi.","Iniziano a moltiplicarsi","moltiplicarsi"),
 ("vivi",3,"chiaro","Se il prodotto viene ricongelato, restano lì dentro: congelati, ma vivi. Pronti a ripartire alla scongelazione successiva.","Congelati, ma vivi","vivi"),
 ("avviso",3,"scuro","Ecco perché sui surgelati trovi l'avviso: non ricongelare dopo lo scongelamento. Non perché diventi subito pericoloso, ma perché uno scongelamento sbagliato può favorire i microrganismi.","Non ricongelare",""),
 ("secondo",3,"chiaro","Un secondo congelamento non elimina i microrganismi, e può peggiorare la qualità del prodotto.","Non li elimina","elimina"),
 ("segnali",4,"chiaro","Come riconosci una catena interrotta? Brina in eccesso, con grandi cristalli di ghiaccio. Prodotto ammassato: si è scongelato e ricongelato. Confezione gonfia: i microrganismi hanno prodotto gas.","Una catena interrotta","interrotta"),
 ("finale",4,"chiaro","La catena del freddo: meno diciotto gradi, senza interruzioni, dalla produzione al tuo freezer.","—",""),
]
json.dump({"capitoli":["La catena","Se si interrompe","Non ricongelare","I segnali"],"scene":[dict(id=a,cap=b,registro=c,voce=d,didascalia=e,corallo=f) for a,b,c,d,e,f in S]},open("scaletta.json","w"),ensure_ascii=False,indent=1)
