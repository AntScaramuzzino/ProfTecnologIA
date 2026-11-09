import json, asyncio, certifi
certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
import edge_tts
s = json.load(open("scaletta.json"))
async def wb(text):
    c = edge_tts.Communicate(text, "it-IT-IsabellaNeural", rate="+12%", boundary="WordBoundary")
    ws = []
    async for ch in c.stream():
        if ch["type"] == "WordBoundary":
            ws.append([ch["text"], ch["offset"]/1e7, (ch["offset"]+ch["duration"])/1e7])
    return ws
async def main():
    for sc in s["scene"]:
        ws = await wb(sc["voce"]); o = ws[0][1]
        sc["parole"] = [[w, round(a-o,2), round(b-o,2)] for w,a,b in ws]
        print(sc["id"], " ".join(f"{w}@{a}" for w,a,b in sc["parole"]))
    json.dump(s, open("scaletta.json","w"), ensure_ascii=False, indent=1)
asyncio.run(main())
