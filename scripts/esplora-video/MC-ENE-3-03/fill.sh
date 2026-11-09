#!/bin/bash
cd "$(dirname "$0")"
for r in 1 2 3 4 5 6; do
  n=$(ls frames | wc -l); [ $n -ge 2572 ] && break
  node render.js 0 858 30 & node render.js 858 1716 30 & node render.js 1716 2572 30 & wait
done
SKIP=1 python3 build.py par-04 29.8 > build.log 2>&1
