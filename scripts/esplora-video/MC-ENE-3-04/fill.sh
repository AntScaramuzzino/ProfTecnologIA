#!/bin/bash
cd "$(dirname "$0")"
export FRAMES=frames2 OUT=out2
mkdir -p frames2 out2
T=$(python3 -c "import json,math;print(math.ceil(json.load(open('timeline.json'))['total']*30))"); S=$(( (T+2)/3 ))
for r in 1 2 3 4; do
  n=$(ls frames2 | wc -l); [ $n -ge $T ] && break
  node render.js 0 $S 30 & node render.js $S $((2*S)) 30 & node render.js $((2*S)) $T 30 & wait
done
SKIP=1 python3 build.py par-05 58.0 > build2.log 2>&1
echo DONE >> build2.log
