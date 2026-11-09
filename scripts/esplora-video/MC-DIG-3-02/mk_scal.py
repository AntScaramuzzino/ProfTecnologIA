import json
S = [
 ('hook',0,'scuro',"Fai una domanda a un chatbot: la risposta compare un pezzo alla volta. Come viene costruita?","Come viene costruita?"),
 ('llm',0,'chiaro',"Dietro c'è un LLM: una rete neurale addestrata su enormi quantità di testo per predire il token successivo.","Predire il token successivo"),
 ('token',1,'scuro',"Il testo non viene elaborato parola per parola, ma scomposto in token: unità che possono essere più piccole di una parola.","Scomposto in token"),
 ('bio',1,'chiaro',"Tecnologia potrebbe essere un solo token. Biotecnologia potrebbe essere due: bio più tecnologia.","Bio + tecnologia"),
 ('prob',2,'scuro',"Dato un prompt, il modello calcola, per ogni possibile token successivo, la probabilità che compaia in quella posizione.","Calcola la probabilità"),
 ('sceglie',3,'scuro',"Poi sceglie un token con alta probabilità, lo aggiunge al testo e ripete il processo.","Sceglie, aggiunge, ripete"),
 ('volta',3,'scuro',"Così la risposta nasce un token alla volta, ognuno condizionato da tutti i token precedenti.","Un token alla volta"),
 ('bassa',4,'chiaro',"Il parametro temperature regola quanto è casuale la scelta. Vicina a zero: quasi sempre il token più probabile, risposte prevedibili.","Temperature vicina a zero"),
 ('alta',4,'scuro',"Vicina a uno: più casualità. Risposte più creative, ma meno accurate.","Più creative, meno accurate"),
 ('capisce',5,'scuro',"Ma il modello non capisce. Impara correlazioni statistiche tra token, e non ha un modello interno del mondo.","Correlazioni statistiche"),
 ('roma',5,'chiaro',"Non sa che Roma è in Italia come lo sai tu: sa che Roma e Italia compaiono spesso insieme nei testi. Per questo può inventare fatti che suonano credibili.","Fatti che suonano credibili"),
 ('finale',0,'chiaro',"Un LLM non capisce: predice il token successivo.",""),
]
json.dump({'mc':'MC-DIG-3-02','paragrafo':'IA generativa: come funziona un LLM','scene':[dict(id=a,cap=b,registro=c,voce=d,didascalia=e,corallo='') for a,b,c,d,e in S]},open('scaletta.json','w'),ensure_ascii=False,indent=1)
