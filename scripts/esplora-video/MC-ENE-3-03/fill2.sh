#!/bin/bash
cd "$(dirname "$0")"
export FRAMES=frames2 OUT=out2
mkdir -p frames2 out2
T=2603; S=868
for r in 1 2 3 4 5 6; do
  n=$(ls frames2 | wc -l); [ $n -ge $T ] && break
  node render.js 0 $S 30 & node render.js $S $((2*S)) 30 & node render.js $((2*S)) $T 30 & wait
done
SKIP=1 python3 build.py par-04 27.5 > build2.log 2>&1
