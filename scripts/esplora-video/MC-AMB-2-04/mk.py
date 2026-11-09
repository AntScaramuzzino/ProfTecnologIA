import json
S=[
("hook",0,"scuro","Tra estate e inverno, l'angolo del sole cambia moltissimo. Guardiamo Roma, a quarantadue gradi di latitudine Nord.","Estate contro inverno"),
("estate",1,"scuro","A mezzogiorno del ventuno giugno, solstizio d'estate, il sole è alto settantuno gradi e mezzo: quasi verticale.","Estate: 71,5°"),
("equinozio",1,"scuro","Agli equinozi, il ventuno marzo e il ventuno settembre, scende a quarantotto gradi.","Equinozi: 48°"),
("inverno",1,"scuro","Il ventuno dicembre, solstizio d'inverno, scende a ventiquattro gradi e mezzo: molto basso.","Inverno: 24,5°"),
("aggetto",2,"chiaro","Qui entra in gioco l'aggetto: il bordo del tetto, o un balcone, che sporge sopra la finestra.","L'aggetto"),
("blocca",2,"scuro","D'estate il sole è alto, quasi verticale: l'aggetto lo blocca, e la luce non entra.","Estate: sole bloccato"),
("entra",2,"scuro","D'inverno il sole è basso, quasi orizzontale: la luce passa sotto l'aggetto ed entra in profondità.","Inverno: luce dentro"),
("profondita",2,"scuro","Ma l'aggetto deve avere la giusta profondità. Dipende dall'altezza della finestra e dalla latitudine.","La giusta profondità"),
("formula",3,"chiaro","L'altezza del sole segue una formula: novanta gradi, meno la latitudine, più la declinazione, che vale più ventitré e mezzo d'estate, meno ventitré e mezzo d'inverno.","La formula"),
("milano",3,"scuro","A Milano, a quarantacinque gradi Nord, il sole sale a sessantotto gradi e mezzo d'estate e scende a ventuno e mezzo d'inverno. Quarantasette gradi di differenza.","47° di differenza"),
("principio",4,"scuro","Non serve impararla a memoria: conta il principio. La geometria solare è prevedibile.","Geometria prevedibile"),
("finale",0,"chiaro","E una casa ben progettata usa questa prevedibilità come strumento di controllo climatico passivo.",""),
]
json.dump({"scene":[dict(id=a,cap=b,registro=c,voce=d,didascalia=e) for a,b,c,d,e in S]},open('scaletta.json','w'),ensure_ascii=False,indent=1)
