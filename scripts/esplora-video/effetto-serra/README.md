# Video "L'effetto serra in 90 secondi" (MC-ENE-3-02 §6)

Animazione SVG con `render(t)` puro (kit.js + scenes.js), voce sintetica edge-tts it-IT-IsabellaNeural, colonna sonora sintetizzata (score.py).

1. `python3 tts.py` / `words.py`: voce per scena e tempi delle parole → scaletta.json → data.js
2. Font in `fonts/` (Poppins ExtraBold/Medium, Instrument Serif, JetBrains Mono, da github.com/google/fonts)
3. `node render.js <da> <a> 30` → fotogrammi JPEG; `score.py` → musica; mix con ffmpeg (sidechain) → MP4
Output pubblicato: public/assets/esplora/MC-ENE-3-02/par-06.mp4 (+ poster, sottotitoli .vtt)
