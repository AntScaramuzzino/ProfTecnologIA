import sys, asyncio, certifi
certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
import edge_tts
async def main(text, out, voice="it-IT-IsabellaNeural", rate="+0%"):
    c = edge_tts.Communicate(text, voice, rate=rate)
    await c.save(out)
asyncio.run(main(sys.argv[1], sys.argv[2], *(sys.argv[3:])))
