import json
S=[
("hook",1,"scuro","Il sistema di proiezione ortogonale più usato in Europa, e in Italia, è il metodo di Monge.","Il metodo di Monge","Monge"),
("monge",1,"chiaro","Porta il nome del matematico francese Gaspard Monge, che lo sistematizzò nel 1795. Si chiama anche metodo del primo diedro, o metodo europeo.","Gaspard Monge, 1795",""),
("raggi",1,"scuro","Le linee di proiezione sono parallele tra loro e perpendicolari al piano, come se il punto di proiezione fosse a distanza infinita.","Parallele e perpendicolari",""),
("triedro",2,"scuro","Si collocano tre piani perpendicolari tra loro: insieme formano il triedro.","Tre piani: il triedro","triedro"),
("pv",2,"scuro","Sul piano verticale si proietta il prospetto: la vista frontale.","Piano verticale: prospetto",""),
("po",2,"scuro","Sul piano orizzontale si proietta la pianta: la vista dall'alto.","Piano orizzontale: pianta",""),
("pl",2,"scuro","Sul piano laterale si proietta il fianco: l'oggetto visto da sinistra.","Piano laterale: fianco",""),
("lt",2,"scuro","I tre piani si intersecano sulle linee di terra, che restano sul foglio come riferimento.","Le linee di terra",""),
("apri",3,"scuro","Immagina l'oggetto in una scatola trasparente: sei pareti, sei possibili viste. Ora apri la scatola e distendi tutto su un foglio piano.","Apri la scatola","scatola"),
("foglio",3,"chiaro","In pratica si usano tre viste. Il prospetto va in alto a sinistra. La pianta va sotto, allineata in verticale. Il fianco va a destra, sulla stessa linea.","Tre viste allineate",""),
("linee",4,"scuro","Gli spigoli visibili si disegnano con linea continua; quelli nascosti, che non si vedono da quella direzione, con linea tratteggiata.","Continua o tratteggiata",""),
("finale",4,"chiaro","Tre viste, senza deformazioni prospettiche: gli spigoli paralleli ai piani si misurano direttamente sul foglio.","",""),
]
json.dump({"scene":[dict(id=a,cap=b,registro=c,voce=d,didascalia=e,corallo=f) for a,b,c,d,e,f in S]},open("scaletta.json","w"),ensure_ascii=False,indent=1)
