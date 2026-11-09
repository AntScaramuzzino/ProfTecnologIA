import json
S = [
 ("hook",0,"scuro","Il ciclo di vita non è un semplice «nasce e muore». È un sistema di sette fasi: il ciclo tecnologico.","Sette fasi"),
 ("estr",1,"scuro","Tutto inizia con l'estrazione. Una miniera di rame lavora centinaia di tonnellate di roccia per ottenere pochi chili di metallo puro.","Tonnellate per pochi chili"),
 ("lav",2,"scuro","Poi la lavorazione: nell'altoforno, a millecinquecento gradi, il minerale di ferro diventa ferro fuso.","Diventa ferro fuso"),
 ("energia",2,"chiaro","Un chilo di alluminio dalla bauxite richiede circa quattordici kilowattora. Rifonderlo ne richiede solo il cinque per cento.","Solo il 5%"),
 ("prod",3,"scuro","Poi la produzione: il motore di un'auto può essere prodotto in Germania, la carrozzeria in Polonia, i sedili in Romania. È la catena di fornitura.","Catena di fornitura"),
 ("log",4,"scuro","Poi la logistica. Una felpa di cotone può percorrere quarantamila chilometri prima di arrivare a te.","40.000 km"),
 ("uso",5,"chiaro","Nell'uso conta la durata: un jeans che dura dieci anni ha un impatto per anno molto inferiore a uno che dura un anno.","Conta la durata"),
 ("fine",6,"scuro","Poi il fine vita: discarica, incenerimento, riciclo, riuso o compostaggio. Riuso e riparazione sono la strada più efficiente.","La strada più efficiente"),
 ("rec",7,"scuro","Infine il recupero: il materiale torna alla lavorazione come materia prima secondaria, e il ciclo si chiude.","Il ciclo si chiude"),
 ("circ",7,"chiaro","È l'economia circolare. Non più estrai, produci, usa, butta, ma: estrai, produci, usa, recupera, riproduci.","Economia circolare"),
 ("finale",0,"chiaro","Sette fasi, un solo ciclo: il ciclo tecnologico.",""),
]
json.dump({"scene":[dict(id=a,cap=b,registro=c,voce=d,didascalia=e) for a,b,c,d,e in S]},open('scaletta.json','w'),ensure_ascii=False,indent=1)
print(sum(len(x[3].split()) for x in S))
