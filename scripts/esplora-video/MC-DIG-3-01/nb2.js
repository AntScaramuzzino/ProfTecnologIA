// 2 — event-driven (chiaro): causa (evento) a sinistra subito, poi effetto
scene('evento', { make: (W) => ({
  capAt: W('quando'), last: W('evento'),
  render(t) {
    let s = lightBg(); const ink = C.ink;
    s += E(t, -0.3, pillTag(960, 200, 'EVENT-DRIVEN', ink, C.ivory, 'middle'), { dy: 0 });
    s += E(t, -0.2, card(170, 270, 620, 470), { dy: 0 });
    s += pop(t, 0.05, 300, 470, bolt(300, 470, 1.3, C.coral, ink));
    s += E(t, 0.2, T(480, 668, 'EVENTO', { f: 'pop', size: 64, fill: ink, a: 'middle' }), { dy: 12 });
    s += E(t, W('accade'), IT(400, 470, 'accade', { size: 56, fill: ink }) + IT(400, 534, 'qualcosa', { size: 56, fill: ink }), { dy: 12 });
    const pa = eo((t - W('istruzioni') + 0.1) / 0.45);
    if (pa > 0) s += arrow(830, 505, 830 + 250 * pa, 505, ink, 6);
    s += E(t, W('istruzioni'), card(1130, 270, 620, 470), { dy: 0 });
    s += E(t, W('istruzioni'), T(1440, 370, 'ISTRUZIONI', { f: 'pop', size: 56, fill: ink, a: 'middle' }), { dy: 12 });
    for (let i = 0; i < 3; i++) {
      const f = eo((t - W('eseguono') - i * 0.25) / 0.3);
      s += E(t, W('istruzioni') + 0.1 + i * 0.1, `<rect x="1230" y="${430 + i * 90}" width="420" height="60" rx="10" fill="${mix(C.cream, C.ink, 0.22 * f)}" stroke="${ink}" stroke-width="3"/>`, { dy: 10 });
    }
    s += E(t, W('eseguono'), IT(1440, 715, 'si eseguono', { size: 40, fill: ink, a: 'middle' }), { dy: 8 });
    return s + caption(t, W('quando'), 'Quando accade qualcosa', '', true);
  } }) });

