import json, subprocess, sys
s = json.load(open("scaletta.json")); tot = 0
only = set(sys.argv[1:])
for i, sc in enumerate(s["scene"]):
    out = f"voce/{i:02d}-{sc['id']}.wav"
    if not only or sc["id"] in only:
        raw = f"voce/{i:02d}-{sc['id']}.raw.mp3"
        subprocess.run(["python3", "tts.py", sc["voce"], raw, "it-IT-IsabellaNeural", "+12%"], check=True)
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", raw, "-af",
                        "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse",
                        "-ar", "48000", "-ac", "1", out], check=True)
    d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out]))
    sc["voce_dur"] = round(d, 3); tot += d; print(sc["id"], round(d, 2))
print("tot", round(tot, 1))
json.dump(s, open("scaletta.json", "w"), ensure_ascii=False, indent=1)
