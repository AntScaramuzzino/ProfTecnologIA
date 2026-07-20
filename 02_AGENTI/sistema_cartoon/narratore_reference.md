# Reference image del narratore — coerenza di serie

Per evitare che il volto del narratore cambi tra le scene (limite di Veo, che non ricorda i personaggi tra una generazione e l'altra), ogni cartoon definisce **una reference image fissa** del narratore e la usa come **ingrediente** in tutte le scene in cui il narratore compare.

## Regola
1. Alla **prima MC di un'area**, si genera una volta il **ritratto canonico** del narratore (`professione_futura`) con il prompt-ritratto qui sotto.
2. Si salva l'immagine come `public/assets/cartoon/<MC-ID>/narratore_ref.png` (campo `narratore.reference_image` nello `storyboard.json`).
3. In Google Vids/Veo, in ogni scena col narratore si aggiunge quella immagine tramite **"Ingredienti" → carica immagine** (o si riusa lo stesso "Avatar AI" fisso), così il volto resta identico.
4. L'Agente 2 include sempre nel prompt il richiamo testuale al look fisso (ridondanza utile), ma la coerenza vera la dà la reference image.

## Esempio — MC-MAT-1-02 · narratore: Supply Chain Sustainability Manager

**Look fisso (canonico):** adulto uomo, 35–40 anni, capelli scuri corti, barba corta curata, giacca tecnica azzurra leggera su camicia bianca, sorriso calmo a bocca chiusa, postura aperta e rassicurante.

**Prompt-ritratto (EN) per generare `narratore_ref.png`:**
> Semi-photorealistic 3D animated character portrait, cinematic warm lighting, 16:9. A friendly adult man aged about 35-40, short dark hair, short trimmed beard, wearing a light blue technical jacket over a white shirt, calm closed-mouth smile, open reassuring posture, neutral soft studio background. Head and upper body, front view, consistent character reference sheet look. Absolutely no on-screen text, no letters, no writing anywhere in the frame.

**Uso come ingrediente:** in Vids, pannello Veo → **Ingredienti** → carica `narratore_ref.png` → poi scrivi il prompt della scena. Il narratore manterrà lo stesso volto in Scena 1 e Scena 7 (e in ogni altra MC della stessa area).

## Nota di verità (dal test del 15/07/2026)
Nel test di MC-MAT-1-02 le scene del narratore sono state generate **senza** reference image, quindi il volto di Scena 1 e Scena 7 non coincide perfettamente. Applicando questa procedura (reference image come ingrediente) il volto diventa coerente. Il passaggio "carica immagine in Ingredienti" è **manuale** nella UI attuale di Vids: la skill lo eseguirà via browser quando la reference `.png` è disponibile nel percorso indicato.
