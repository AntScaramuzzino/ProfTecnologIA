import json
S=[
("hook",0,"scuro","Il sistema operativo, un videogioco, un sistema di raccomandazione: sembrano programmi diversissimi.","Programmi diversissimi?","diversissimi"),
("tre",0,"chiaro","Eppure qualsiasi programma è costruito combinando solo tre strutture fondamentali. Solo tre.","Solo tre strutture","tre"),
("seq",1,"scuro","La prima è la sequenza: istruzioni eseguite una dopo l'altra, nell'ordine in cui sono scritte.","Una dopo l'altra",""),
("semaforo",1,"scuro","Il semaforo che fa rosso, poi verde, poi giallo, è una sequenza.","Rosso, verde, giallo",""),
("incrocio",1,"chiaro","In un incrocio immaginario, però, devi coordinare le sequenze di due semafori: i percorsi che si incrociano non devono avere il verde insieme.","Sequenze da coordinare",""),
("sel",2,"scuro","La seconda è la selezione: una biforcazione. Il programma controlla una condizione e sceglie quale ramo eseguire, così può reagire in modo diverso a situazioni diverse.","Una biforcazione",""),
("quiz",2,"chiaro","Nel quiz: se la risposta è corretta, aggiungi un punto e vai alla prossima domanda. Altrimenti mostra il feedback e riprova, o vai avanti: dipende dal gioco.","Se corretta… altrimenti",""),
("iter",3,"scuro","La terza è l'iterazione, o ciclo: un blocco di istruzioni che si ripete.","Istruzioni che si ripetono",""),
("modi",3,"chiaro","Si può ripetere un numero fisso di volte, per esempio dieci; finché non hai risposto a tutte le domande; oppure per sempre, come il ciclo principale di un videogioco.","Fisso, finché, per sempre",""),
("mille",3,"scuro","Così il computer fa cose ripetitive senza che tu debba riscrivere le stesse istruzioni mille volte.","Senza riscrivere mille volte",""),
("sintesi",0,"scuro","Sequenza, selezione, iterazione: combinandole, si costruisce qualsiasi programma.","Tre strutture combinate",""),
("finale",0,"chiaro","Solo tre strutture, per qualsiasi programma.","",""),
]
json.dump({"scene":[dict(id=a,cap=b,registro=c,voce=d,didascalia=e,corallo=f) for a,b,c,d,e,f in S]},open("scaletta.json","w"),ensure_ascii=False,indent=1)
