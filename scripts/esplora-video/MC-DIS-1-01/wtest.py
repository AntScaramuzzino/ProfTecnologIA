import asyncio, certifi, sys
certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
import edge_tts
async def wb(text):
    c = edge_tts.Communicate(text, "it-IT-IsabellaNeural", rate="+12%", boundary="WordBoundary")
    async for ch in c.stream():
        if ch["type"] == "WordBoundary": print(ch["text"], round(ch["offset"]/1e7,2), round(ch["duration"]/1e7,2))
for t in sys.argv[1:]: asyncio.run(wb(t)); print('--')
