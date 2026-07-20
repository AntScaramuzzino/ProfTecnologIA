#!/bin/bash
# Rimuove blobs editoriali grandi da tutta la history git
# Esegui da root del repo (refactor/mc-template-v2)

set -e
REPO="/Users/antonioscaramuzzino/Documents/Cowork/TecnologIA"
RESULT="$REPO/filter_branch_result.txt"

echo "START $(date)" > "$RESULT"
cd "$REPO"

echo "Branch corrente: $(git branch --show-current)" >> "$RESULT"
echo "Commits prima: $(git log --oneline | wc -l)" >> "$RESULT"

# Rimuove 08_TESTI/TESTI/ e 08_TESTI/Altri Testi/ da ogni commit
git filter-branch --force --index-filter \
  'git rm -r --cached --ignore-unmatch "08_TESTI/TESTI" && git rm -r --cached --ignore-unmatch "08_TESTI/Altri Testi"' \
  --prune-empty --tag-name-filter cat -- --all >> "$RESULT" 2>&1

echo "filter-branch DONE $(date)" >> "$RESULT"

# Pulizia refs originali e reflog
rm -rf .git/refs/original/
git reflog expire --expire=now --all >> "$RESULT" 2>&1
echo "reflog expire DONE" >> "$RESULT"

# GC aggressivo per liberare spazio
git gc --prune=now --aggressive >> "$RESULT" 2>&1
echo "GC DONE $(date)" >> "$RESULT"

echo "Commits dopo: $(git log --oneline | wc -l)" >> "$RESULT"
du -sh .git >> "$RESULT"
echo "COMPLETE" >> "$RESULT"
