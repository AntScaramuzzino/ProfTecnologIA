import json
S = [
 ("hook",0,"scuro","Come ci si sposta in città? Ogni mezzo occupa spazio.","Ogni mezzo occupa spazio"),
 ("auto",1,"scuro","In automobile, con una media di 1,2 persone a bordo, ogni passeggero in movimento occupa 23 metri quadrati.","Passeggero in movimento"),
 ("busmetro",1,"chiaro","In autobus, con 60 passeggeri, ognuno ne occupa 0,4. In metropolitana, appena 0,2.","Autobus e metropolitana"),
 ("bicipiedi",1,"scuro","In bicicletta servono da 3 a 4 metri quadrati. A piedi, 0,5.","In bicicletta, a piedi"),
 ("confronto",1,"chiaro","Spostare le stesse persone con mezzi pubblici e bici richiede enormemente meno spazio, meno energia, meno inquinamento.","Enormemente meno spazio"),
 ("portata",2,"scuro","Conta anche quante persone passano ogni ora per metro di corsia: in auto da 600 a 1.200, in metro da 10.000 a 20.000.","Persone ogni ora"),
 ("citta",2,"chiaro","Per questo città dense come Tokyo, Barcellona e Amsterdam puntano su trasporto pubblico e ciclabilità.","Città dense"),
 ("sprawl",3,"scuro","Il modello opposto è lo sprawl urbano: la città si espande senza controllo, a bassa densità.","Sprawl urbano"),
 ("espansione",3,"scuro","Villette, centri commerciali, capannoni e parcheggi: ogni funzione è separata, raggiungibile solo in auto.","Raggiungibile solo in auto"),
 ("conseguenze",3,"chiaro","Occupa molto suolo agricolo, crea dipendenza dall'auto e rende il trasporto pubblico insostenibile: troppo poca densità per riempire un autobus.","Troppo poca densità"),
 ("suolo",4,"scuro","In Italia, secondo l'ISPRA, ogni anno si consumano in media 57 chilometri quadrati di suolo agricolo.","57 km² ogni anno"),
 ("finale",0,"chiaro","Mezzi pubblici, bici e piedi: le stesse persone, in molto meno spazio.",""),
]
json.dump({"scene":[dict(id=a,cap=b,registro=c,voce=d,didascalia=e) for a,b,c,d,e in S]},open('scaletta.json','w'),ensure_ascii=False,indent=1)
