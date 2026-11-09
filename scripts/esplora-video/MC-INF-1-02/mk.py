import json
S = [
 ("hook",0,"scuro","Qualsiasi algoritmo, anche il programma più complesso mai scritto, può essere scritto con tre sole strutture di controllo.","Tre sole strutture"),
 ("seq",1,"scuro","La prima è la sequenza: le istruzioni vengono eseguite una dopo l'altra, nell'ordine in cui sono scritte.","Una dopo l'altra"),
 ("somma",1,"chiaro","Per sommare due numeri: leggi il primo, leggi il secondo, somma, mostra il risultato. In quell'ordine. Sempre.","In quell'ordine. Sempre."),
 ("sel",2,"scuro","La seconda è la selezione: se una condizione è vera, il programma esegue un blocco di istruzioni; se è falsa, ne esegue un altro, o niente.","Vera o falsa?"),
 ("clima",2,"chiaro","Per esempio: se la temperatura è sopra i trenta gradi, accendi il condizionatore. Altrimenti, lascialo spento.","Sopra i 30 °C?"),
 ("cond",2,"scuro","La condizione deve essere verificabile in modo oggettivo. «Se fa caldo» è ambiguo. «Se supera trenta gradi» è una misura precisa.","Una misura precisa"),
 ("ciclo",3,"scuro","La terza è l'iterazione, o ciclo: un blocco di istruzioni viene ripetuto finché una condizione rimane vera, o per un numero fisso di volte.","Finché rimane vera"),
 ("msg",3,"chiaro","Per esempio: finché ci sono messaggi non letti, leggi il prossimo e segnalo come letto.","Messaggi non letti"),
 ("combina",4,"scuro","Qualsiasi programma, da un semplice calcolatore all'intelligenza artificiale generativa, si può sempre costruire combinando queste tre strutture.","Combinando tre strutture"),
 ("teorema",4,"chiaro","Lo hanno dimostrato nel 1966 Corrado Böhm e Giuseppe Jacopini: è il teorema di Böhm-Jacopini.","Teorema di Böhm-Jacopini"),
 ("finale",0,"chiaro","Sequenza, selezione, iterazione: le tre strutture.",""),
]
json.dump({"scene":[dict(id=a,cap=b,registro=c,voce=d,didascalia=e) for a,b,c,d,e in S]},open('scaletta.json','w'),ensure_ascii=False,indent=1)
print(sum(len(x[3]) for x in S))
