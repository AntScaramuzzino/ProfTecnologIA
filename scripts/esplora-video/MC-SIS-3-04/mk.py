import json
S = [
 ("hook",0,"scuro","Che lavoro farai? Puoi partire da un'altra domanda: che cosa ti interessa?","Che cosa ti interessa?"),
 ("riasec",0,"chiaro","Il modello RIASEC, sviluppato tra gli anni Cinquanta e Settanta, è uno dei sistemi di orientamento più usati al mondo.","Il modello RIASEC"),
 ("sei",0,"scuro","Classifica le persone in sei tipi di interessi: uno per ogni lettera.","Sei tipi di interessi"),
 ("r",1,"scuro","Realistico: attività pratiche e concrete, con oggetti, macchine e strumenti. Come il meccanico o il tecnico elettronico.","Attività pratiche e concrete"),
 ("i",2,"chiaro","Investigativo: analizzare, ricercare, risolvere problemi. Come lo scienziato o l'analista di dati.","Analizzare e ricercare"),
 ("a",3,"scuro","Artistico: creatività, espressione, originalità, in ambienti non strutturati. Come il designer o il musicista.","Creatività e originalità"),
 ("s",4,"chiaro","Sociale: lavorare con le persone, insegnare, aiutare, curare. Come l'insegnante o lo psicologo.","Lavorare con le persone"),
 ("e",5,"scuro","Intraprendente: guidare, persuadere, organizzare, vendere. Come il manager o l'imprenditore.","Guidare e persuadere"),
 ("c",6,"chiaro","Convenzionale: ambienti strutturati, procedure chiare, precisione. Come il contabile o l'archivista.","Procedure chiare, precisione"),
 ("codice",7,"scuro","Ogni persona è una combinazione di questi tipi. Il codice è una tripletta: per esempio Investigativo, Sociale, Artistico.","Una tripletta"),
 ("strumento",7,"chiaro","Lo strumento non decide la tua professione: ti aiuta a capire in quali ambienti ti senti più a tuo agio e quali attività ti motivano.","Ti aiuta a capire"),
 ("finale",0,"chiaro","Il modello RIASEC: sei tipi di interessi per orientarti.",""),
]
json.dump({"mc":"MC-SIS-3-04","paragrafo":"Il modello RIASEC per l'orientamento vocazionale","scene":[dict(id=a,cap=b,registro=c,voce=d,didascalia=e) for a,b,c,d,e in S]},open('scaletta.json','w'),ensure_ascii=False,indent=1)
