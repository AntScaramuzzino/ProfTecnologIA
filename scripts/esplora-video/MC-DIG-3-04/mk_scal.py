import json
S=[
("hook",1,"scuro","Le WCAG 2.1 organizzano i requisiti di accessibilità intorno a quattro principi.","Le W C A G due punto uno organizzano i requisiti di accessibilità intorno a quattro principi.","Quattro principi",""),
("pour",1,"chiaro","Le loro iniziali formano un acronimo: P, O, U, R.","Le loro iniziali formano un acronimo: pi, o, u, erre.","Un acronimo: POUR",""),
("perc",2,"scuro","La P indica Percepibile: chi non vede o non sente deve avere sempre un'alternativa.","La pi indica Percepibile: chi non vede o non sente deve avere sempre un'alternativa.","Sempre un'alternativa",""),
("alt",2,"scuro","Un'immagine importante deve avere un testo alternativo, che lo screen reader legge ad alta voce. Un video con audio, i sottotitoli.",None,"Testo alternativo",""),
("contrasto",2,"chiaro","Il testo deve avere un contrasto sufficiente con lo sfondo: almeno 4,5 a 1 per il testo normale.",None,"Almeno 4,5 a 1",""),
("oper",3,"scuro","La O indica Operabile: l'interfaccia deve poter essere usata con qualsiasi periferica di input.",None,"Qualsiasi periferica",""),
("tastiera",3,"scuro","Il test minimo è la tastiera: ogni funzione raggiungibile con il mouse deve esserlo anche solo con Tab, Invio, Spazio e frecce.",None,"Anche da tastiera",""),
("compr",4,"chiaro","La U indica Comprensibile: gergo non spiegato e frasi troppo lunghe mettono in difficoltà chi ha dislessia o disturbi cognitivi.",None,"Linguaggio chiaro",""),
("preved",4,"scuro","Anche l'interfaccia deve essere prevedibile: se la pagina cambia in modo inaspettato dopo un click, chi ha disabilità cognitive può disorientarsi.",None,"Niente sorprese",""),
("robusto",5,"scuro","La R indica Robusto: deve funzionare con browser e tecnologie assistive di oggi e di domani, come screen reader e display Braille.","La erre indica Robusto: deve funzionare con browser e tecnologie assistive di oggi e di domani, come screen reader e display Braille.","Oggi e domani",""),
("html",5,"chiaro","HTML semantico: un bottone deve essere un vero tag button, non un div. Lo screen reader legge la struttura, non l'aspetto.","Acca ti emme elle semantico: un bottone deve essere un vero tag button, non un div. Lo screen reader legge la struttura, non l'aspetto.","Struttura, non aspetto",""),
("finale",0,"chiaro","Percepibile, operabile, comprensibile, robusto.",None,"",""),
]
out=[]
for id,cap,reg,v,vt,did,cor in S:
    d=dict(id=id,cap=cap,registro=reg,voce=v,didascalia=did,corallo=cor)
    if vt: d['voce_tts']=vt
    out.append(d)
json.dump({"scene":out},open('scaletta.json','w'),ensure_ascii=False,indent=1)
