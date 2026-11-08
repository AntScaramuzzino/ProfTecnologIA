import json, math, subprocess, os
out = subprocess.check_output(["node", "shots.js", "chk3"]).decode().splitlines()[0]
open("timeline.json", "w").write(out)
tot = math.ceil(json.loads(out)["total"] * 30); W = 6; step = (tot + W - 1) // W
os.makedirs("frames2", exist_ok=True)
for i in range(W):
    a, b = i * step, min(tot, (i + 1) * step)
    subprocess.Popen(["node", "render.js", str(a), str(b), "30"], stdout=open(f"log{i}.txt", "w"), stderr=subprocess.STDOUT, start_new_session=True)
print(tot)
