/* ══════════════════════════════════════════════════════════════════════
   LA PALESTRA · el sonido
   Todo sintetizado en el navegador (Web Audio): ni un archivo, la app sigue
   siendo un solo HTML. Bajito, para el aula, y se quita en Ajustes.
     graderio  el público, cuando se tira de la cuerda
     rugido    Jeferión, cuando se acierta
     graznido  Listillón, cuando algo no sale (y en su entrevista)
     trueno    el rayo de Zeus: el chasquido y el retumbo
     descorche el tapón de la poción
     trago     glup, glup, glup
   El navegador no deja sonar nada hasta que se toca la página: el primer
   sonido espera a ese primer toque.
   ══════════════════════════════════════════════════════════════════════ */
(function (raiz) {
'use strict';
let ctx = null, salida = null, ruido = null, activo = true;

function prepara(){
  if(ctx) return ctx;
  const AC = raiz.AudioContext || raiz.webkitAudioContext;
  if(!AC) return null;
  ctx = new AC();
  const comp = ctx.createDynamicsCompressor();
  salida = ctx.createGain(); salida.gain.value = .5;
  salida.connect(comp); comp.connect(ctx.destination);
  /* dos segundos de ruido blanco, para el público, el trueno y los chasquidos */
  ruido = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = ruido.getChannelData(0);
  for(let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return ctx;
}
/* una envolvente: sube en «a», se mantiene hasta «s» y se apaga hasta «r» */
function env(g, t, pico, a, s, r){
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(pico, t + a);
  g.gain.setValueAtTime(pico, t + a + s);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + s + r);
}
function ruidoDesde(t, dur){
  const f = ctx.createBufferSource(); f.buffer = ruido; f.loop = true;
  f.start(t, Math.random() * 1.5); f.stop(t + dur + .05);
  return f;
}
const filtro = (tipo, frec, q) => { const f = ctx.createBiquadFilter(); f.type = tipo; f.frequency.value = frec; if(q) f.Q.value = q; return f; };
const cadena = (...nodos) => { for(let i = 0; i < nodos.length - 1; i++) nodos[i].connect(nodos[i + 1]); return nodos[nodos.length - 1]; };

const SONIDOS = {
  /* el público: un «¡oooh!» de muchas voces, ruido en la banda de la voz que sube y baja */
  graderio(t){
    [520, 780, 1150].forEach((fr, i) => {
      const g = ctx.createGain(), bp = filtro('bandpass', fr, 1.4);
      bp.frequency.setValueAtTime(fr * .85, t); bp.frequency.linearRampToValueAtTime(fr * 1.1, t + .5);
      const trem = ctx.createOscillator(), tg = ctx.createGain();
      trem.frequency.value = 5 + i * 1.7; tg.gain.value = .25;
      trem.connect(tg); tg.connect(g.gain); trem.start(t); trem.stop(t + 1.3);
      cadena(ruidoDesde(t, 1.3), bp, g, salida);
      env(g, t, .16 - i * .03, .18, .35, .7);
    });
  },
  /* Jeferión: un rugido grave que gruñe (una sierra que baja, temblando) */
  rugido(t){
    const o = ctx.createOscillator(), g = ctx.createGain(), lp = filtro('lowpass', 700, 2);
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(62, t + .85);
    const gru = ctx.createOscillator(), gg = ctx.createGain();
    gru.frequency.value = 28; gg.gain.value = .5;
    gru.connect(gg); gg.connect(g.gain);
    cadena(o, lp, g, salida);
    env(g, t, .32, .07, .35, .5);
    o.start(t); o.stop(t + 1); gru.start(t); gru.stop(t + 1);
    /* el aliento, por encima */
    const ga = ctx.createGain();
    cadena(ruidoDesde(t, .9), filtro('bandpass', 380, 1.2), ga, salida);
    env(ga, t, .12, .06, .3, .45);
  },
  /* Listillón: dos graznidos cortos, de pájaro, que caen */
  graznido(t){
    [0, .17].forEach((dt, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain(), bp = filtro('bandpass', 1700, 3);
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(1350 - i * 150, t + dt); o.frequency.exponentialRampToValueAtTime(620 - i * 60, t + dt + .12);
      cadena(o, bp, g, salida);
      env(g, t + dt, .22, .01, .05, .08);
      o.start(t + dt); o.stop(t + dt + .16);
    });
  },
  /* Zeus: el chasquido del rayo y, detrás, el retumbo que se aleja */
  trueno(t){
    const gc = ctx.createGain();
    cadena(ruidoDesde(t, .2), filtro('highpass', 1800), gc, salida);
    env(gc, t, .55, .004, .03, .14);
    const gr = ctx.createGain(), lp = filtro('lowpass', 260, .7);
    lp.frequency.setValueAtTime(320, t + .05); lp.frequency.exponentialRampToValueAtTime(90, t + 2);
    cadena(ruidoDesde(t + .05, 2.2), lp, gr, salida);
    env(gr, t + .05, .7, .06, .2, 1.8);
    const g2 = ctx.createGain();
    cadena(ruidoDesde(t + .5, 1.6), filtro('lowpass', 140, .7), g2, salida);
    env(g2, t + .5, .45, .15, .1, 1.2);
  },
  /* el tapón de la poción: un «¡plop!» que cae de tono y un chasquidito */
  descorche(t){
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(620, t); o.frequency.exponentialRampToValueAtTime(140, t + .08);
    cadena(o, g, salida);
    env(g, t, .45, .004, .01, .09);
    o.start(t); o.stop(t + .14);
    const gc = ctx.createGain();
    cadena(ruidoDesde(t, .03), filtro('highpass', 3000), gc, salida);
    env(gc, t, .18, .002, .004, .02);
  },
  /* el trago: tres «glup» que suben un poco, como el líquido que baja */
  trago(t){
    [0, .26, .52].forEach((dt, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain(), bp = filtro('bandpass', 420, 4);
      o.type = 'sine';
      o.frequency.setValueAtTime(170 + i * 12, t + dt); o.frequency.exponentialRampToValueAtTime(290 + i * 15, t + dt + .09);
      o.frequency.exponentialRampToValueAtTime(150, t + dt + .16);
      cadena(o, bp, g, salida);
      env(g, t + dt, .5, .015, .05, .1);
      o.start(t + dt); o.stop(t + dt + .2);
    });
  }
};

/* suena, si está activo; «retraso» en segundos */
function toca(nombre, retraso){
  if(!activo || !SONIDOS[nombre]) return;
  try{
    if(!prepara()) return;
    if(ctx.state === 'suspended') ctx.resume();
    SONIDOS[nombre](ctx.currentTime + .02 + (retraso || 0));
  }catch(err){}
}
/* el primer toque de la página abre el sonido (lo exige el navegador) */
if(raiz.addEventListener) raiz.addEventListener('pointerdown', () => { if(activo) try{ prepara() && ctx.state === 'suspended' && ctx.resume(); }catch(err){} }, {once: true});

raiz.Sonido = {toca, activo: v => { activo = !!v; }, NOMBRES: Object.keys(SONIDOS)};
})(window);
