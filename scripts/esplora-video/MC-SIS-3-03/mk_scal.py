import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
LS="Lìin Stàrtap"
S=[
("hook",1,"scuro","Hai un'idea. Funziona davvero? Non lo sai finché non la provi nel mondo reale.",None,"Nel mondo reale"),
("lean",1,"chiaro","Il metodo Lean Startup serve a sviluppare nuove imprese, o nuovi prodotti, con il minimo spreco di risorse.",f"Il metodo {LS} serve a sviluppare nuove imprese, o nuovi prodotti, con il minimo spreco di risorse.","Minimo spreco di risorse"),
("minimo",1,"scuro","Prima di costruire il prodotto completo, costruisci il prodotto minimo per testare le ipotesi più rischiose.",None,"Prima il prodotto minimo"),
("ciclo",1,"scuro","Il ciclo ha tre fasi: costruisci, misura, impara.",None,"Costruisci, misura, impara"),
("mvp",2,"chiaro","L'MVP è la versione più semplice possibile del prodotto. Non deve essere perfetto: deve permettere di testare le ipotesi chiave.","L'emmevuppì è la versione più semplice possibile del prodotto. Non deve essere perfetto: deve permettere di testare le ipotesi chiave.","La versione più semplice"),
("esempio",2,"scuro","Un servizio per dormire a casa di sconosciuti partì con una sola pagina web. Tre foto di un appartamento e un modulo di contatto. Niente pagamenti, niente mappe, niente recensioni.",None,"Tre foto e un modulo"),
("misura",3,"scuro","Poi misuri cosa succede: quante persone lo usano? Tornano dopo il primo uso? Quanto sono disposte a pagare?",None,"Misura cosa succede"),
("metriche",3,"chiaro","Le metriche devono essere collegate direttamente alle ipotesi che stai testando.",None,"Metriche legate alle ipotesi"),
("impara",4,"scuro","Infine impari: l'ipotesi era giusta? Allora scala: investi di più. Era sbagliata? Pivot, cioè cambia direzione, oppure stop.","Infine impari: l'ipotesi era giusta? Allora scala: investi di più. Era sbagliata? Pìvot, cioè cambia direzione, oppure stop.","Scala, pivot o stop"),
("pivot",4,"chiaro","Il pivot è un cambiamento strategico basato sui dati: non un fallimento, ma un aggiornamento della mappa.","Il pìvot è un cambiamento strategico basato sui dati: non un fallimento, ma un aggiornamento della mappa.","Un aggiornamento della mappa"),
("finale",0,"chiaro","Costruisci, misura, impara: il metodo Lean Startup.",f"Costruisci, misura, impara: il metodo {LS}.",""),
]
out=[]
for id,cap,reg,v,vt,did in S:
    d=dict(id=id,cap=cap,registro=reg,voce=v,didascalia=did,corallo="")
    if vt: d['voce_tts']=vt
    out.append(d)
json.dump({"scene":out},open('scaletta.json','w'),ensure_ascii=False,indent=1)
print(sum(len(x[3].split()) for x in S))
