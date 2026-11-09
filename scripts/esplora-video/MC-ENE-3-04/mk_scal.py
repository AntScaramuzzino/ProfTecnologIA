import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
S=[
("hook",1,"scuro","Un circuito elettrico è un percorso chiuso, attraverso cui scorre la corrente.",None,"Un percorso chiuso"),
("aperto",1,"scuro","Se c'è un'interruzione, come un interruttore aperto o un filo rotto, la corrente non scorre.",None,"La corrente non scorre"),
("serie",2,"scuro","In serie, i componenti sono collegati uno dopo l'altro, lungo un unico percorso.",None,"Un unico percorso"),
("serieR",2,"chiaro","Tre resistenze da 10, 20 e 30 ohm, a 12 volt. Si sommano: 60 ohm.","Tre resistenze da dieci, venti e trenta ohm, a dodici volt. Si sommano: sessanta ohm.","Le resistenze si sommano"),
("serieI",2,"scuro","La corrente è la stessa in ogni punto: 12 diviso 60, cioè 0,2 ampere.","La corrente è la stessa in ogni punto: dodici diviso sessanta, cioè zero virgola due ampere.","Stessa in ogni punto"),
("serieV",2,"chiaro","La tensione, invece, si divide: 2, 4 e 6 volt. In tutto, 12.","La tensione, invece, si divide: due, quattro e sei volt. In tutto, dodici.","La tensione si divide"),
("natale1",2,"scuro","Nelle vecchie luci di Natale in serie, se si bruciava una lampadina, si spegnevano tutte.",None,"Si spegnevano tutte"),
("parallelo",3,"scuro","In parallelo, i componenti stanno su rami separati, collegati ai due terminali della sorgente: su ogni ramo, la stessa tensione.",None,"Rami separati"),
("paraI",3,"scuro","Con 60 e 30 ohm a 12 volt, la corrente si divide: 0,2 ampere in un ramo, 0,4 nell'altro.","Con sessanta e trenta ohm a dodici volt, la corrente si divide: zero virgola due ampere in un ramo, zero virgola quattro nell'altro.","La corrente si divide"),
("paraR",3,"chiaro","La resistenza equivalente è 20 ohm, e la corrente totale è 0,6 ampere.","La resistenza equivalente è venti ohm, e la corrente totale è zero virgola sei ampere.","Resistenza equivalente"),
("natale2",3,"scuro","Le luci LED moderne sono in parallelo: se si rompe una lampadina, solo quella si spegne.",None,"Solo quella si spegne"),
("casa",4,"scuro","Anche l'impianto di casa è in parallelo: spegni la luce in camera, e il corridoio resta acceso.",None,"Il corridoio resta acceso"),
("finale",0,"chiaro","Serie o parallelo: un percorso, o tanti rami.",None,""),
]
out=[]
for id,cap,reg,v,vt,did in S:
    d=dict(id=id,cap=cap,registro=reg,voce=v,didascalia=did,corallo="")
    if vt: d['voce_tts']=vt
    out.append(d)
json.dump({"scene":out},open('scaletta.json','w'),ensure_ascii=False,indent=1)
print(sum(len(x[3].split()) for x in S))
