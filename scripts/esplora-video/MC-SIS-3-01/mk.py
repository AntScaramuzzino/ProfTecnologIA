import json
S=[
('intro',0,'scuro',"Le economie non crescono in modo lineare e continuo. Seguono un ciclo economico ricorrente, con quattro fasi.","Un ciclo, quattro fasi"),
('espansione',1,'scuro',"Espansione: l'economia cresce, la disoccupazione cala, i consumi aumentano, le aziende investono.","L'economia cresce"),
('prestiti',1,'chiaro',"Le banche concedono prestiti facilmente. La fase positiva si autoalimenta.","Si autoalimenta"),
('picco',2,'scuro',"Picco: il tasso di crescita raggiunge il massimo.","Crescita al massimo"),
('inflazione',2,'chiaro',"L'inflazione, cioè l'aumento dei prezzi, può accelerare, perché la domanda supera l'offerta.","La domanda supera l'offerta"),
('tassi',2,'scuro',"Le banche centrali alzano i tassi di interesse, per rallentare la crescita e contenere l'inflazione.","Tassi di interesse in salita"),
('recessione',3,'scuro',"Recessione: la crescita rallenta, o diventa negativa.","Crescita negativa"),
('trimestri',3,'chiaro',"La definizione tecnica: due trimestri consecutivi di PIL in calo.","Due trimestri consecutivi"),
('effetti',3,'scuro',"La disoccupazione sale. Le aziende riducono gli investimenti. I consumi calano.","Disoccupazione su, consumi giù"),
('ripresa',4,'scuro',"Ripresa: l'economia ricomincia a crescere, partendo dal basso.","Si riparte dal basso"),
('politiche',4,'chiaro',"Spesa statale e taglio dei tassi di interesse: le politiche pubbliche accelerano la ripresa.","Politiche pubbliche"),
('ripete',0,'scuro',"Il ciclo si ripete, con durata e intensità diverse.","Durata e intensità diverse"),
('storia',0,'chiaro',"La Grande Recessione del 2008-2009 è stata uno dei cicli negativi più severi dal 1929.","Dal 1929"),
('pandemia',0,'scuro',"Nel 2020 la pandemia ha causato una recessione globale rapidissima, seguita da una ripresa altrettanto rapida.","Giù e su, rapidissimi"),
('finale',0,'chiaro',"Espansione, picco, recessione, ripresa: è il ciclo economico.",""),
]
json.dump({'scene':[dict(id=a,cap=b,registro=c,voce=d,didascalia=e) for a,b,c,d,e in S]},open('scaletta.json','w'),ensure_ascii=False,indent=1)
