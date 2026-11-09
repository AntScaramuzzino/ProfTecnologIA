import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
S=[
("hook",1,"scuro","La macchina a vapore richiedeva una caldaia esterna, pesante e ingombrante. Per un'automobile serviva qualcosa di più compatto.",None,"Qualcosa di più compatto"),
("interna",1,"scuro","Nel 1876 arriva il motore a quattro tempi a combustione interna: la combustione avviene dentro il cilindro.","Nel milleottocentosettantasei arriva il motore a quattro tempi a combustione interna: la combustione avviene dentro il cilindro.","Combustione interna"),
("parti",1,"scuro","Nel cilindro scorre un pistone, collegato all'albero motore. In alto ci sono la candela e due valvole.",None,"Le parti del motore"),
("aspira",2,"scuro","Primo tempo, aspirazione: il pistone scende, si apre la valvola di aspirazione ed entra una miscela di aria e benzina.",None,"Primo tempo: aspirazione"),
("comprime",2,"scuro","Secondo tempo, compressione: valvole chiuse, il pistone sale e comprime la miscela a circa un decimo del volume. Aumentano temperatura e pressione.",None,"Secondo tempo: compressione"),
("scoppio",2,"scuro","Terzo tempo, scoppio: la candela scocca una scintilla e la miscela esplode. I gas spingono il pistone verso il basso, con forza enorme.",None,"Terzo tempo: scoppio"),
("scarico",2,"scuro","Quarto tempo, scarico: si apre la valvola di scarico e il pistone, salendo, espelle i gas combusti verso lo scappamento.",None,"Quarto tempo: scarico"),
("attivo",2,"chiaro","Solo lo scoppio produce lavoro utile: gli altri tre tempi sono necessari, ma non ne producono.",None,"Un solo tempo attivo"),
("irregolare",3,"scuro","Con un solo cilindro, il motore sarebbe irregolare: produce forza solo nel terzo tempo.",None,"Un cilindro: irregolare"),
("cilindri",3,"scuro","I motori moderni hanno quattro o più cilindri, con cicli sfasati: mentre uno è in scoppio, un altro è in compressione, un terzo in aspirazione.",None,"Cicli sfasati"),
("uniforme",3,"chiaro","Il risultato è un moto rotatorio abbastanza uniforme.",None,"Abbastanza uniforme"),
("finale",0,"chiaro","Quattro tempi, e il ciclo ricomincia.",None,""),
]
out=[]
for id,cap,reg,v,vt,did in S:
    d=dict(id=id,cap=cap,registro=reg,voce=v,didascalia=did,corallo="")
    if vt: d['voce_tts']=vt
    out.append(d)
json.dump({"scene":out},open('scaletta.json','w'),ensure_ascii=False,indent=1)
print(sum(len(x[3].split()) for x in S))
