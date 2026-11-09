import sys, asyncio, certifi
certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
import edge_tts
async def main(text):
    c = edge_tts.Communicate(text, "it-IT-IsabellaNeural", rate="+12%", boundary="WordBoundary")
    ws=[]; audio=b''
    async for ch in c.stream():
        if ch["type"]=="WordBoundary": ws.append(ch["text"])
        elif ch["type"]=="audio": audio+=ch["data"]
    open('/tmp/claude-0/-home-claude/809a26b1-5d80-5cdc-a2fd-43580359ca86/scratchpad/v-MAT-1-04/wt.mp3','wb').write(audio)
    print(ws)
asyncio.run(main(sys.argv[1]))
