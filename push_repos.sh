#!/bin/bash
export PATH=/opt/homebrew/bin:/usr/local/bin:$PATH

echo "--- pushing submodule ---"
cd ~/Documents/Cowork/TecnologIA/05_APP/tecnologia-sito-web
git push origin main 2>&1 | tail -4
echo "SUBMODULE_EXIT:$?"

echo "--- pushing parent ---"
cd ~/Documents/Cowork/TecnologIA
git push origin refactor/mc-template-v2 2>&1 | tail -4
echo "PARENT_EXIT:$?"
