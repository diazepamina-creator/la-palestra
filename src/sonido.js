/* ══════════════════════════════════════════════════════════════════════
   LA PALESTRA · el sonido
   Todo sintetizado en el navegador (Web Audio): ni un archivo, la app sigue
   siendo un solo HTML. Se quita en Ajustes.
     graderio  el público, cuando se tira de la cuerda
     rugido    Jeferión, cuando se acierta
     graznido  Listillón, cuando algo no sale (y en su entrevista)
     trueno    el rayo de Zeus: el chasquido, el estallido y el retumbo
     descorche el corcho de la poción, y el burbujeo
     trago     glup, glup, glup
   Los altavoces de un móvil o de un portátil casi no dan nada por debajo de
   150 Hz: lo que importa de cada sonido va por encima, donde se oye.
   El navegador no deja sonar nada hasta que se toca la página: el primer
   sonido espera a ese primer toque.
   ══════════════════════════════════════════════════════════════════════ */
(function (raiz) {
'use strict';
let activo = true;
/* A: el contexto en uso, su salida y el ruido. El de la página se crea al
   primer sonido; «renderiza» monta uno sin conexión para grabar un sonido */
let A = null, vivo = null;

function monta(ctx){
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14; comp.ratio.value = 4;
  const salida = ctx.createGain(); salida.gain.value = .9;
  salida.connect(comp); comp.connect(ctx.destination);
  const ruido = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
  const d = ruido.getChannelData(0);
  for(let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return {ctx, salida, ruido};
}
function prepara(){
  if(vivo) return vivo;
  const AC = raiz.AudioContext || raiz.webkitAudioContext;
  if(!AC) return null;
  vivo = monta(new AC());
  return vivo;
}

/* ── piezas ── */
/* una envolvente: sube en «a», se mantiene «s» y se apaga en «r» */
function env(g, t, pico, a, s, r){
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(pico, t + a);
  g.gain.setValueAtTime(pico, t + a + s);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + s + r);
}
const gan = v => { const g = A.ctx.createGain(); g.gain.value = v === undefined ? 1 : v; return g; };
function ruidoDesde(t, dur){
  const f = A.ctx.createBufferSource(); f.buffer = A.ruido; f.loop = true;
  f.start(t, Math.random() * 2); f.stop(t + dur + .05);
  return f;
}
function osc(tipo, t, dur){ const o = A.ctx.createOscillator(); o.type = tipo; o.start(t); o.stop(t + dur + .05); return o; }
const filtro = (tipo, frec, q) => { const f = A.ctx.createBiquadFilter(); f.type = tipo; f.frequency.value = frec; if(q) f.Q.value = q; return f; };
const cadena = (...n) => { for(let i = 0; i < n.length - 1; i++) n[i].connect(n[i + 1]); return n[n.length - 1]; };
/* aspereza: recorta la onda con suavidad (para el rugido y el graznido) */
function aspero(k){
  const w = A.ctx.createWaveShaper(), n = 1024, c = new Float32Array(n);
  for(let i = 0; i < n; i++){ const x = i / (n - 1) * 2 - 1; c[i] = Math.tanh(k * x) / Math.tanh(k); }
  w.curve = c; return w;
}
/* un oscilador que tiembla: modula la frecuencia de «o» con «hz» de «prof» */
function vibrato(o, t, dur, hz, prof){
  const l = osc('sine', t, dur), g = gan(prof);
  l.frequency.value = hz; l.connect(g); g.connect(o.frequency);
}
/* un temblor de volumen, para gruñir o para que el trueno ruede */
function temblor(g, t, dur, hz, prof){
  const l = osc('sine', t, dur), p = gan(prof);
  l.frequency.value = hz; l.connect(p); p.connect(g.gain);
}

const SONIDOS = {
  /* el público: un «¡oooh!» de muchas voces, ruido en la banda de la voz que sube y baja */
  graderio(t){
    [520, 780, 1150].forEach((fr, i) => {
      const g = gan(), bp = filtro('bandpass', fr, 1.4);
      bp.frequency.setValueAtTime(fr * .85, t); bp.frequency.linearRampToValueAtTime(fr * 1.1, t + .5);
      temblor(g, t, 1.3, 5 + i * 1.7, .06);
      cadena(ruidoDesde(t, 1.3), bp, g, A.salida);
      env(g, t, .5 - i * .08, .18, .35, .7);
    });
  },
  /* Jeferión: el rugido de un dinosaurio. Dos sierras algo desafinadas que
     suben un poco y caen, ásperas, por la boca (formantes de 550 y 1100 Hz),
     con el gruñido y el aliento */
  rugido(t){
    const dur = 1.25, mezcla = gan();
    [0, 7].forEach(des => {
      const o = osc('sawtooth', t, dur);
      o.detune.value = des * 10;
      o.frequency.setValueAtTime(150, t); o.frequency.linearRampToValueAtTime(185, t + .15);
      o.frequency.exponentialRampToValueAtTime(95, t + dur);
      vibrato(o, t, dur, 6, 5);
      o.connect(mezcla);
    });
    const garganta = cadena(mezcla, aspero(3.2), gan(.6));
    const boca = gan();
    [[550, 2.2, 1], [1100, 3, .7], [1900, 4, .3]].forEach(([f, q, v]) => cadena(garganta, filtro('bandpass', f, q), gan(v), boca));
    const g = gan(); cadena(boca, filtro('lowpass', 2600), g, A.salida);
    env(g, t, 1.1, .1, .5, .62);
    temblor(g, t, dur, 27, .35);                              // el gruñido
    const ga = gan();                                          // el aliento
    cadena(ruidoDesde(t, dur), filtro('bandpass', 900, .8), ga, A.salida);
    env(ga, t, .22, .08, .45, .6);
  },
  /* Listillón: dos graznidos de pájaro, «¡craa, craa!»: una sierra que tiembla
     rápido, pasada por dos formantes nasales */
  graznido(t){
    [[0, 640, 520], [.27, 590, 470]].forEach(([dt, f0, f1]) => {
      const t0 = t + dt, dur = .22;
      const o = osc('sawtooth', t0, dur);
      o.frequency.setValueAtTime(f0, t0); o.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
      vibrato(o, t0, dur, 48, 55);
      const voz = cadena(o, aspero(2));
      const g = gan();
      [[1150, 5, 1], [2600, 6, .8], [3700, 7, .35]].forEach(([f, q, v]) => cadena(voz, filtro('bandpass', f, q), gan(v), g));
      g.connect(A.salida);
      env(g, t0, .9, .012, .1, .1);
    });
  },
  /* Zeus: el chasquido del rayo (tres latigazos), el estallido y el retumbo
     que rueda y se aleja; con cuerpo entre 150 y 900 Hz, que es lo que se oye */
  trueno(t){
    [[0, 1], [.045, .7], [.1, .55]].forEach(([dt, v]) => {
      const g = gan();
      cadena(ruidoDesde(t + dt, .12), filtro('highpass', 1200), filtro('peaking', 3200, 1), g, A.salida);
      env(g, t + dt, v, .002, .01, .07);
    });
    const gb = gan(), lp = filtro('lowpass', 1100, .7);                  // el estallido
    lp.frequency.setValueAtTime(1100, t + .06); lp.frequency.exponentialRampToValueAtTime(260, t + 1.4);
    cadena(ruidoDesde(t + .06, 2.4), lp, gb, A.salida);
    env(gb, t + .06, 1.2, .03, .15, 2);
    const gr = gan(), bp = filtro('bandpass', 380, .6);                   // el retumbo que rueda
    bp.frequency.setValueAtTime(420, t + .35); bp.frequency.exponentialRampToValueAtTime(200, t + 3);
    cadena(ruidoDesde(t + .35, 2.8), bp, gr, A.salida);
    env(gr, t + .35, .85, .25, .4, 2.1);
    temblor(gr, t + .35, 2.8, 4.3, .35);
    temblor(gr, t + .35, 2.8, 2.1, .25);
  },
  /* el corcho de la poción: el chasquido, el «¡plop!» que cae de tono, la
     boca de la botella que resuena y, después, el burbujeo mágico */
  descorche(t){
    const o = osc('sine', t, .12), g = gan();
    o.frequency.setValueAtTime(1100, t); o.frequency.exponentialRampToValueAtTime(360, t + .045);
    cadena(o, g, A.salida);
    env(g, t, 1.2, .002, .008, .07);
    const gc = gan();
    cadena(ruidoDesde(t, .03), filtro('bandpass', 1500, 1.4), gc, A.salida);
    env(gc, t, 1, .001, .006, .02);
    const gr = gan();
    cadena(ruidoDesde(t, .15), filtro('bandpass', 2300, 22), gr, A.salida);
    env(gr, t, 1.4, .002, .01, .1);
    const gf = gan();                                                     // el burbujeo
    cadena(ruidoDesde(t + .06, .45), filtro('highpass', 4500), gf, A.salida);
    env(gf, t + .06, .16, .05, .15, .25);
    temblor(gf, t + .06, .45, 17, .04);
  },
  /* el trago: tres «glup» que suben un poco, como el líquido que baja */
  trago(t){
    [0, .26, .52].forEach((dt, i) => {
      const o = osc('sine', t + dt, .2), g = gan(), bp = filtro('bandpass', 420, 4);
      o.frequency.setValueAtTime(170 + i * 12, t + dt); o.frequency.exponentialRampToValueAtTime(290 + i * 15, t + dt + .09);
      o.frequency.exponentialRampToValueAtTime(150, t + dt + .16);
      cadena(o, bp, g, A.salida);
      env(g, t + dt, 1.6, .015, .05, .1);
    });
  }
};

/* suena, si está activo; «retraso» en segundos */
function toca(nombre, retraso){
  if(!activo || !SONIDOS[nombre]) return;
  try{
    if(!prepara()) return;
    if(vivo.ctx.state === 'suspended') vivo.ctx.resume();
    A = vivo;
    SONIDOS[nombre](vivo.ctx.currentTime + .02 + (retraso || 0));
  }catch(err){}
}
/* graba un sonido sin que suene: para escucharlo aparte o medirlo */
async function renderiza(nombre, seg){
  const OAC = raiz.OfflineAudioContext || raiz.webkitOfflineAudioContext;
  const ctx = new OAC(1, Math.ceil(44100 * (seg || 3.5)), 44100);
  const antes = A; A = monta(ctx);
  SONIDOS[nombre](.02);
  A = antes;
  return ctx.startRendering();
}
/* el primer toque de la página abre el sonido (lo exige el navegador) */
if(raiz.addEventListener) raiz.addEventListener('pointerdown', () => {
  if(activo) try{ const v = prepara(); if(v && v.ctx.state === 'suspended') v.ctx.resume(); }catch(err){}
}, {once: true});

raiz.Sonido = {toca, renderiza, activo: v => { activo = !!v; }, NOMBRES: Object.keys(SONIDOS)};
})(window);
