import json
S=[
("hook",0,"scuro","Ogni computer connesso a internet ha un indirizzo IP: un numero come questo. Ma tu digiti un nome. Chi lo traduce?","Chi traduce?","traduce"),
("dns",1,"scuro","Ci pensa il DNS, il Domain Name System. Converte i nomi di dominio, leggibili dagli umani, negli indirizzi IP numerici usati dai computer.","Dal nome al numero",""),
("elenco",1,"chiaro","Funziona come un elenco telefonico distribuito.","Un elenco distribuito","distribuito"),
("richiesta",2,"scuro","Il browser chiede il nome a un server DNS, il resolver, di solito del provider. Se ha la risposta nella sua cache, risponde subito.","Prima, la cache",""),
("root",3,"scuro","Altrimenti la cerca in una gerarchia. In cima ci sono i root server: 13 sistemi, gestiti da varie organizzazioni.","In cima, i root",""),
("tld",3,"scuro","Poi i server dei domini di primo livello, come punto it, punto com e punto org.","Domini di primo livello",""),
("autoritativi",3,"scuro","Infine i server autoritativi, gestiti da chi possiede il dominio specifico.","Chi possiede il dominio",""),
("percorso",4,"scuro","Il resolver chiede al root, che lo rimanda a punto it. Punto it lo rimanda al server di esempio punto it, che conosce l'indirizzo. La risposta torna al browser.","Passo per passo",""),
("spoofing",5,"scuro","Un attacco è il DNS spoofing: la risposta legittima viene sostituita con un indirizzo IP falso.","Una risposta falsa",""),
("frode",5,"scuro","Così l'utente viene reindirizzato su un sito fraudolento, senza che il browser mostri nessun errore visibile.","Nessun errore visibile",""),
("dnssec",6,"chiaro","La difesa è DNSSEC: una firma digitale che verifica l'autenticità delle risposte DNS.","Risposte verificate",""),
("finale",0,"chiaro","Il DNS: dal nome al numero.","",""),
]
json.dump({"scene":[dict(id=a,cap=b,registro=c,voce=d,didascalia=e,corallo=f) for a,b,c,d,e,f in S]},open("scaletta.json","w"),ensure_ascii=False,indent=1)
