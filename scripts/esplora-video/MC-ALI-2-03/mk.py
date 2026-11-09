import json
S = [
 ("hook",0,"scuro","Ogni volta che mangi, introduci nel corpo centinaia di molecole diverse. Che fine fanno?","Che fine fanno?","fanno?"),
 ("percorso",0,"scuro","L'apparato digerente le scompone, le trasforma e le distribuisce alle cellule. È chimica e biologia applicata.","Chimica e biologia","Chimica"),
 ("bocca",1,"chiaro","Tutto inizia in bocca. I denti sminuzzano il cibo, e la saliva, con l'enzima amilasi, comincia a trasformare gli amidi in zuccheri più semplici.","Amidi in zuccheri","zuccheri"),
 ("stomaco",2,"scuro","Nello stomaco, l'acido cloridrico, a pi acca tra uno e due, e la pepsina attaccano le proteine, spezzandole.","Proteine spezzate",""),
 ("duodeno",3,"chiaro","Nel duodeno, la bile prodotta dal fegato emulsiona i grassi in microgoccioline, e i succhi pancreatici completano la digestione.","Grassi in microgoccioline","microgoccioline"),
 ("tenue",4,"scuro","Nell'intestino tenue, le molecole più piccole vengono assorbite attraverso le pareti intestinali e passano nel sangue.","Passano nel sangue",""),
 ("crasso",5,"chiaro","Nell'intestino crasso arrivano le fibre, che non si digeriscono. Le fermentano i miliardi di batteri del microbioma, producendo acidi grassi a catena corta, utili al colon.","Fibre fermentate","fermentate"),
 ("tempo",6,"scuro","Dal primo boccone a quando i nutrienti raggiungono le cellule, passano tra le quattro e le otto ore.","Tra 4 e 8 ore",""),
 ("nutrienti",6,"chiaro","I nutrienti sono di due grandi categorie. I macronutrienti danno energia e i mattoni per i tessuti. I micronutrienti non danno energia, ma regolano migliaia di reazioni.","Due grandi categorie","categorie"),
 ("finale",6,"chiaro","Mangiare è chimica e biologia: e funziona in modo diverso a seconda di quello che mangi.","—",""),
]
json.dump({"capitoli":["Bocca","Stomaco","Duodeno","Intestino tenue","Intestino crasso"],
 "scene":[dict(id=a,cap=b,registro=c,voce=d,didascalia=e,corallo=f) for a,b,c,d,e,f in S]}, open("scaletta.json","w"), ensure_ascii=False, indent=1)
print(sum(len(x[3].split()) for x in S))
