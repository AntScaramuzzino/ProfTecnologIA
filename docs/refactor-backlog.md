# Refactor Backlog — MC Template v2

**Branch:** `refactor/mc-template-v2`
**Aggiornato:** 2026-07-19
**P0 completato:** ✅ · **P1 completato:** ✅ · **P2+ da fare:** vedi sotto

---

## Completati nella sessione 2026-07-19

| ID | Task | Esito |
|----|------|-------|
| UX-DIS-1 | Laboratorio GeoGebra: perpendicolare a una retta nel punto P | Attività autonoma embeddabile, animazione in 4 passi, prova LLL, download `.ggb`, integrazione in MC-DIS-1-01 dentro la sezione Costruzione 1 |

---

## P2 — Miglioramenti UX/accessibilità (priorità media)

| ID | Task | Note |
|----|------|------|
| P2.1 | **Stepper mobile sopra i tab** — mostrare "3/5 OSSERVA" come progress indicator su viewport <480px | Alternativa visiva alla tab bar su schermi molto piccoli |
| P2.2 | **Keyboard navigation migliorata nel MCNavigator** — `ArrowLeft`/`ArrowRight` tra i tab come da pattern WAI-ARIA Tabs | Attualmente solo click/touch |
| P2.3 | **Focus management al cambio tab** — spostare il focus al primo elemento del pannello quando si cambia zona via tastiera | Requisito WCAG 2.4.3 |
| P2.4 | **Scroll-to-top del pannello al cambio tab** — su mobile il contenuto del tab precedente rimane scrollato | `panelRef.current?.scrollTo(0, 0)` in `useEffect` |
| P2.5 | **AccordionSection: opzione "espandi tutti"** — pulsante toggle per aprire/chiudere tutti gli item contemporaneamente | Utile per stampa e screen reader |
| P2.6 | **RubricaDrawer: versione stampabile** — aggiungere link "Stampa rubrica" che apre la tabella in una nuova tab pulita | CSS `@media print` già presente in globals.css |

---

## P3 — Feature nuove (priorità bassa)

| ID | Task | Note |
|----|------|------|
| P3.1 | **Progress tracker per zona** — segnare le zone visitate con un indicatore (✓ verde) salvato su localStorage | Già presente `useProgress.ts` in lib/ — da collegare al navigator |
| P3.2 | **MCNavigator: URL hash sync** — aggiornare `#zona` nell'URL al cambio tab per deep-link diretto a una zona | `window.history.replaceState` in `persistTab` |
| P3.3 | **LevelTabs: memoria del livello per MC** — salvare il livello selezionato su localStorage con chiave `mc-level-${mcId}` | Analogo alla P1.2 del navigator |
| P3.4 | **ResourcesPanel: contatore "non disponibile"** — mostrare badge rosso sui chip senza contenuto reale | Già strutturato, richiede solo styling aggiuntivo |
| P3.5 | **Aside mobile** — i contenuti della colonna aside (Framework, Tag, Prerequisiti) sono nascosti su mobile; aggiungere un pannello espandibile sotto il navigator | Attualmente `hidden lg:block` sull'aside |
| P3.6 | **Smooth scroll anchor INNESCA** — il primo caricamento potrebbe partire da INNESCA scrollato a metà pagina; aggiungere `scrollTo(0,0)` al mount | Edge case su reload pagina |

---

## Debt tecnico da risolvere

| ID | Problema | File | Urgenza |
|----|----------|------|---------|
| D1 | `ReadableBodyInTab` in MCPageClient duplica logica da `ReadableText` in page.tsx originale — da unificare in `lib/readable-text.tsx` | `MCPageClient.tsx` | Media |
| D2 | `splitSperimentaByLevel` usa slice con offset fisso (+15) per saltare l'header — fragile se il testo del titolo cambia lunghezza | `MCPageClient.tsx` line 90 | Media |
| D3 | Il parser rubrica in `RubricaDrawer` cerca `📋 Rubrica` ma alcune MC potrebbero non avere l'emoji nel titolo — aggiungere fallback su prima tabella della sezione AGISCI | `RubricaDrawer.tsx` | Bassa |
| D4 | `.fuse_hidden` file nel mount FUSE impedisce `npm run build` in place — build deve avvenire in `/tmp`; da risolvere con `distDir` in `next.config.ts` o via CI/CD su host | `next.config.ts` | Bassa (workaround OK) |
| D5 | `MCNavigator` usa `storageKey` basato sui tab ID concatenati — se i tab cambiano (MC con solo 3 zone), la chiave cambia e la cache è persa; usare `mcId` come namespace | `MCNavigator.tsx` | Bassa |

---

## Note per il merge

Prima del merge su `main`:
1. Verificare su almeno 3 MC diverse: MAT-1-01, DIS-1-01, ENE-3-01 (con formula cards)
2. Eseguire `npm run build` su host macOS (non in VM) per confermare output identico
3. Risolvere D1 (readable-text unificato) se si vuole mantenere la codebase pulita
4. Aggiornare `DEPLOY_NETLIFY.md` con nota sul branch

---

*Generato automaticamente da agent refactor — 2026-05-11*
