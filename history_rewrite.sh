#!/bin/bash
set -e
ROOT='/Users/antonioscaramuzzino/Documents/Cowork/TecnologIA'
cd "$ROOT"
echo '=== Rimuovi dall index corrente ==='
git rm -r --cached --ignore-unmatch '08_TESTI/TESTI/' '08_TESTI/Altri Testi/' 2>&1 | tail -5
echo 'INDEX_CLEAN'
git commit -m 'chore: rimuovi binari editoriali dal tracking (PDF editori, PlaneT.zip)' 2>&1 | tail -3
echo 'COMMITTED'
echo '=== filter-branch ==='
git filter-branch --force --index-filter 'git rm -r --cached --ignore-unmatch 08_TESTI/TESTI/ 08_TESTI/Altri\ Testi/ 2>/dev/null || true' --prune-empty -- --all 2>&1 | tail -5
echo 'FILTER_DONE'
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive 2>&1 | tail -3
du -sh .git
echo 'ALL_DONE' | tee "$ROOT/history_rewrite_result.txt"
