import asyncio, certifi
certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
import edge_tts
async def wb(text):
    c = edge_tts.Communicate(text, "it-IT-IsabellaNeural", rate="+12%", boundary="WordBoundary")
    ws=[]
    async for ch in c.stream():
        if ch["type"]=="WordBoundary": ws.append(ch["text"])
    return ws
for t in ["Quello di Internet è TCP/IP, due protocolli.","quattro numeri da 0 a 255. circa 4,3 miliardi: esauriti nel 2011. IPv4 e IPv6, a 128 bit.","fino a 1.500 byte. Un'email di 2 megabyte diventa circa 1.400 pacchetti. l'indirizzo d'ordine po' UDP"]:
    print(asyncio.run(wb(t)))
