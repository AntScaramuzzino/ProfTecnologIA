# Immagini ESPLORA per paragrafo (Canva AI)

Ogni MC ha `public/assets/esplora/{mcId}/manifest.json`:

```json
{ "mc": "MC-XXX-n-nn", "fonte": "...", "immagini": [
  { "paragrafo": "<titolo ### esatto>", "file": "par-01.webp", "alt": "...", "prompt": "<prompt Canva>" }
]}
```

- L'immagine compare in testa al paragrafo `###` con lo stesso titolo (il primo paragrafo, che
  il sito accorpa in "Introduzione", riceve la prima immagine del manifest).
- Tutte le immagini compaiono anche nella **Galleria visuale** di ESPLORA con il prompt come didascalia.

Pipeline: `generate-image` (Canva, 16:9) → un design Canva contenitore con una pagina per immagine
(`insert_fill` 1920×1080) → `export-design` JPG 1600 px → conversione WebP q80 (`build_manifest.py`).
