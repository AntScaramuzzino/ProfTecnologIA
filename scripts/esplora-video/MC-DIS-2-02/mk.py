import json
S=[
("hook",1,"scuro","L'assonometria cavaliera è la più semplice da costruire a mano, ed è molto usata anche nei manuali di montaggio.","Semplice da costruire"),
("assi",1,"scuro","Si parte dal punto d'origine O, e da lì si tracciano tre assi.","Tre assi da O"),
("xz",1,"scuro","L'asse ics, la larghezza, è orizzontale; l'asse zeta, l'altezza, è verticale, a novanta gradi.","Larghezza e altezza"),
("y",1,"scuro","L'asse ipsilon, la profondità, è obliquo: a quarantacinque gradi rispetto all'orizzontale.","Profondità a 45°"),
("riduz",2,"chiaro","Sull'asse obliquo le misure si moltiplicano per zero virgola cinque: vengono ridotte alla metà. Su ics e zeta restano reali: fattore uno.","Ridotte alla metà"),
("es",2,"scuro","Così, un oggetto profondo sessanta millimetri si disegna come se fosse profondo solo trenta.","Da 60 a 30 mm"),
("perche",2,"chiaro","La distorsione è voluta: a profondità intera, l'oggetto sembrerebbe troppo profondo e innaturale.","Una distorsione voluta"),
("c1",3,"scuro","Un parallelepipedo: su ics la larghezza reale, ottanta millimetri; su zeta l'altezza reale, cinquanta.","Larghezza e altezza reali"),
("c2",3,"scuro","Sull'asse ipsilon la profondità: sessanta millimetri reali diventano trenta sul disegno.","Profondità sull'asse y"),
("c3",3,"scuro","Completa le tre facce visibili con linee parallele agli assi. Gli spigoli nascosti, se vuoi, si tratteggiano.","Parallele agli assi"),
("front",4,"chiaro","La faccia frontale mantiene le proporzioni reali: solo la profondità è ridotta e inclinata.","Faccia frontale: proporzioni reali"),
("quando",4,"scuro","Per questo la cavaliera si preferisce per disegnare rapidamente a mano, o quando la faccia frontale ha una forma complessa.","Quando si preferisce"),
("finale",0,"chiaro","Faccia frontale reale, profondità a metà.",""),
]
json.dump({"scene":[dict(id=a,cap=b,registro=c,voce=d,didascalia=e,corallo="") for a,b,c,d,e in S]},open('scaletta.json','w'),ensure_ascii=False,indent=1)
