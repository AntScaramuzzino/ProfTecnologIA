import asyncio, certifi, sys
certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
import edge_tts
async def wb(text):
    c = edge_tts.Communicate(text, "it-IT-IsabellaNeural", rate="+12%", boundary="WordBoundary")
    ws = []
    async for ch in c.stream():
        if ch["type"] == "WordBoundary": ws.append(ch["text"])
    return ws
print(asyncio.run(wb(sys.argv[1])))
