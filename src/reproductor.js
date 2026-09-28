/* ══════════════════════════════════════════════════════════════════════
   LA PALESTRA · el reproductor
   Pasa los fotogramas de una película del motor. Enseña la foto k al
   instante (campo y banquillo) y, al avanzar, anima solo el paso que toca:
   el que llega, el que bebe, el que se retira, los que se juntan, el que
   sale a tirar. Al acabar cada paso, la foto siguiente manda: nada de lo
   que se ve sale de la animación, todo sale del motor.
   ══════════════════════════════════════════════════════════════════════ */
(function (raiz) {
'use strict';
const P = raiz.Palestra, C = raiz.Campo, T = raiz.Tirador, TL = raiz.Tablilla;

const REDUCIDO = raiz.matchMedia && raiz.matchMedia('(prefers-reduced-motion: reduce)').matches;
const espera = ms => new Promise(ok => setTimeout(ok, REDUCIDO ? 0 : ms));

/* ── el banquillo: los que se preparan y los frascos que esperan ── */
function pintaBanquillo(el, foto, k, pel, anim){
  anim = anim || {};
  const sitio = el.querySelector('.bq-sitio');
  sitio.innerHTML = foto.banquillo.map(q => {
    let c = 'bq tirador ' + (q.f < 0 ? 'izq' : 'der') + (q.venia ? ' venia-' + q.venia : '');
    if(anim.llega && anim.llega.indexOf(q.id) >= 0) c += ' llega';
    if(anim.trago === q.id) c += ' trago';
    if(anim.se && anim.se.indexOf(q.id) >= 0) c += ' se-va';
    if(anim.junta && anim.junta.indexOf(q.id) >= 0) c += ' junta';
    return '<span class="' + c + '" data-bq="' + q.id + '">' + T.dibujaTirador(q, 13) +
      '<b class="bq-f">' + P.conSigno(q.f) + '</b></span>';
  }).join('');
  /* los frascos de delante esperan aquí hasta que hay a quién dárselos */
  const usados = new Set();
  pel.pasos.slice(0, k).forEach(p => { if(p.tipo === 'bebe') p.m.forEach(i => usados.add(i)); });
  const esperan = pel.tok.map((t, i) => ({t, i})).filter(x => x.t.t === 'p' && x.t.pre && !usados.has(x.i));
  el.querySelector('.bq-banco').innerHTML = esperan.map(x => {
    const po = P.pocionDe(x.t.k);
    return '<span class="bq-espera pocion ' + TL.clasePoc(po).replace('pocion ', '') + (anim.baja === x.i ? ' baja' : '') + '" data-ti="' + x.i + '">' +
      TL.frascoHtml(po) + '<i>' + P.preTxt(x.t.k) + '</i></span>';
  }).join('');
  el.hidden = !pel.conBanquillo;
}

/* ── el reproductor ── */
function crea(o){
  const R = {pel: null, k: 0, jugando: false, tok: 0, repaso: 0, alcance: 8,
             pregunta: 0, dichos: {}, pin: null, pinPara: 0, veredicto: null};
  const campo = o.campo, banquillo = o.banquillo;
  const fotoDe = k => k ? R.pel.pasos[k - 1] : {cuerda: [], banquillo: [], bandera: 0, tipo: '', x: ''};
  const avisa = () => { if(o.alCambiar) o.alCambiar(R); };

  R.carga = function(pel){
    R.pel = pel; R.k = 0; R.jugando = false; R.tok++;
    R.pregunta = 0; R.dichos = {}; R.pin = null; R.pinPara = 0; R.veredicto = null;
    pel.conBanquillo = pel.pasos.some(p => p.banquillo.length) || pel.tok.some(t => t.t === 'p' && t.pre);
    R.alcance = Math.max(8, ...pel.pasos.map(p => Math.abs(p.bandera)));
    R.muestra(0);
  };
  /* la foto k, al instante */
  R.muestra = function(k, anim){
    if(!R.pel) return;
    R.k = Math.max(0, Math.min(R.pel.pasos.length, k));
    const foto = fotoDe(R.k);
    C.pinta(campo, foto, {alcance: R.alcance, nuevos: (anim && anim.nuevos) || [],
      viva: R.pregunta === R.k + 1, pin: R.pinPara === R.k || (R.jugando && R.pinPara === R.k + 1) ? R.pin : null});
    pintaBanquillo(banquillo, foto, R.k, R.pel, anim);
    avisa();
  };
  /* el paso k+1, animado */
  /* ▶: antes de un paso clave, primero la pregunta. Un segundo ▶ sin tocar la
     regla lo juega igual (para el profe en la pizarra) */
  R.avanza = async function(){
    if(!R.pel || R.jugando || R.k >= R.pel.pasos.length) return;
    const k = R.k, paso = R.pel.pasos[k];
    if(paso.clave && !(k in R.dichos) && !R.pregunta && !o.sinPreguntas){
      R.pregunta = k + 1;
      R.muestra(k);
      return;
    }
    R.pregunta = 0;
    /* el pronóstico solo vale la primera vez que se juega ese paso */
    if(!R.pendiente){ R.pin = null; R.pinPara = 0; }
    R.pendiente = false;
    R.veredicto = null;
    const tok = ++R.tok, vivo = () => R.tok === tok;
    R.jugando = true; avisa();
    const antes = fotoDe(k);
    const enBanco = id => antes.banquillo.some(q => q.id === id) || paso.banquillo.some(q => q.id === id);
    const idsNuevos = paso.cuerda.filter(q => !antes.cuerda.some(a => a.id === q.id)).map(q => q.id);
    const idsBqNuevos = paso.banquillo.filter(q => !antes.banquillo.some(a => a.id === q.id)).map(q => q.id);
    const idsIdos = antes.cuerda.filter(q => !paso.cuerda.some(a => a.id === q.id)).map(q => q.id);
    const idsBqIdos = antes.banquillo.filter(q => !paso.banquillo.some(a => a.id === q.id)).map(q => q.id);
    try{
      if(paso.tipo === 'bebe'){
        /* bebe el del banquillo cuya fuerza cambia entre una foto y la otra */
        const cambia = antes.banquillo.find(q => { const n = paso.banquillo.find(x => x.id === q.id); return n && n.f !== q.f; });
        const q0 = cambia || antes.banquillo[0] || {}, id = q0.id;
        const q1 = paso.banquillo.find(x => x.id === id) || q0;
        /* el frasco que baja del banco, si venía de delante */
        const ti = paso.m.find(i => R.pel.tok[i] && R.pel.tok[i].t === 'p' && R.pel.tok[i].pre);
        const k0 = kDe(paso);
        pintaBanquillo(banquillo, antes, k, R.pel, {baja: ti});
        await espera(ti !== undefined ? 500 : 0); if(!vivo()) return;
        /* EL TRAGO, como en el campo de siempre: saca el frasco, lo lleva a la
           boca, echa la cabeza atrás, el frasco se vacía y lo tira */
        const cambiaBando = (q0.f < 0) !== (q1.f < 0) && q1.f !== 0;
        const tono = cambiaBando ? 'bando' : (Math.abs(q1.f) > Math.abs(q0.f) ? 'mas' : 'menos');
        const color = tono === 'mas' ? 'var(--green)' : (tono === 'menos' ? '#86A7E8' : '#E14FC6');
        const nodo = banquillo.querySelector('.bq[data-bq="' + id + '"]');
        if(nodo && !REDUCIDO){
          nodo.style.setProperty('--pocion', color);
          nodo.classList.toggle('vial', Math.abs(k0) < 1);
          nodo.style.setProperty('--subeF', '0deg');
          nodo.style.setProperty('--vuelcaF', T.vuelcoQueEncaja(nodo, q0.f < 0 ? -70 : 70).toFixed(1) + 'deg');
          nodo.style.setProperty('--giraF', (q0.f < 0 ? -190 : 190) + 'deg');
          nodo.classList.add('trago');
        }
        await espera(2150); if(!vivo()) return;
        /* ya bebido: la fuerza nueva, la cara que le queda y el destello */
        C.pinta(campo, paso, {alcance: R.alcance});
        pintaBanquillo(banquillo, paso, k + 1, R.pel, {});
        const n2 = banquillo.querySelector('.bq[data-bq="' + id + '"]');
        if(n2 && !REDUCIDO){
          n2.classList.add('cara-' + tono);
          const gana = Math.abs(q1.f) >= Math.abs(q0.f);
          n2.classList.add(gana ? 'infla' : 'desinfla');
          if(Math.abs(q1.f) > Math.abs(q0.f)) n2.classList.add('posa');
          if(cambiaBando) n2.classList.add('traidor');
          const ch = document.createElement('span'); ch.className = 'chispa ' + tono; n2.appendChild(ch);
          for(let i = 0; i < 4; i++){
            const bu = document.createElement('span'); bu.className = 'burbuja';
            const d = 5 + Math.random() * 4;
            bu.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (30 + Math.random() * 40) + '%;top:' + (25 + Math.random() * 25) + '%;color:' + color +
              ';animation-delay:' + (i * 90) + 'ms;--dx:' + (Math.random() * 22 - 11) + 'px';
            n2.appendChild(bu);
          }
        }
        await espera(cambiaBando ? 1400 : 900);
      }else if(paso.tipo === 'junta'){
        pintaBanquillo(banquillo, antes, k, R.pel, {junta: idsBqIdos});
        await espera(900); if(!vivo()) return;
        R.muestra(k + 1, {llega: idsBqNuevos});
        await espera(500);
      }else if(paso.tipo === 'sale'){
        pintaBanquillo(banquillo, antes, k, R.pel, {se: idsBqIdos});
        await espera(450); if(!vivo()) return;
        R.muestra(k + 1, {nuevos: idsNuevos});
        tiron(campo);
        await espera(1000);
      }else if(paso.tipo === 'retira'){
        if(idsIdos.length){
          /* en la cuerda, retirarse es cosa de Zeus: se asoma, rayo, y humo */
          const id = idsIdos[0], nodo = campo.querySelector('.tirador[data-id="' + id + '"]');
          const q = antes.cuerda.find(x => x.id === id) || {f: 1};
          if(raiz.Zeus && nodo) await raiz.Zeus.fulmina(campo, nodo, q.f, espera);
          else await espera(500);
          if(!vivo()) return;
          R.muestra(k + 1);
          tiron(campo);
          await espera(1000);
        }else{
          pintaBanquillo(banquillo, antes, k, R.pel, {se: idsBqIdos});
          await espera(450); if(!vivo()) return;
          R.muestra(k + 1);
          await espera(300);
        }
      }else{ /* entra, pareja */
        R.muestra(k + 1, {nuevos: idsNuevos, llega: idsBqNuevos});
        if(idsNuevos.length && paso.bandera !== antes.bandera) tiron(campo);
        await espera(idsNuevos.length ? 1000 : 700);
      }
    }finally{
      if(vivo()){
        R.jugando = false;
        /* el veredicto del pronóstico, si lo hubo */
        if(R.pinPara === k + 1 && R.pin !== null)
          R.veredicto = {dicho: R.pin, real: paso.bandera, clavado: R.pin === paso.bandera};
        R.muestra(k + 1);
      }
    }
  };
  /* el alumno toca la regla: se apunta lo que dijo y se juega el paso */
  R.elige = function(v){
    if(!R.pregunta || R.jugando) return;
    const k = R.pregunta - 1;
    R.dichos[k] = v; R.pin = v; R.pinPara = k + 1; R.pendiente = true;
    R.pregunta = 0;
    R.avanza();
  };
  R.retrocede = function(){ R.repaso++; R.pregunta = 0; R.veredicto = null; if(!R.jugando && R.k > 0) R.muestra(R.k - 1); };
  R.principio = function(){ R.repaso++; R.pregunta = 0; R.veredicto = null; if(!R.jugando) R.muestra(0); };
  /* ▶▶: la película de un tirón; se para en cuanto se toca otro botón */
  R.repasa = async function(){
    if(!R.pel || R.jugando) return;
    R.pregunta = 0; R.muestra(0);
    const yo = ++R.repaso;
    o.sinPreguntas = true;
    try{
      while(R.k < R.pel.pasos.length && R.repaso === yo){
        await espera(350); if(R.repaso !== yo) return;
        await R.avanza();
      }
    }finally{ o.sinPreguntas = false; }
  };
  R.para = function(){ R.tok++; R.repaso++; R.jugando = false; R.pregunta = 0; };
  return R;
}

/* qué factor lleva un paso de beber: se lee de la cuenta pequeña «(−4)·(−2) = +8» */
function kDe(paso){
  const m = /\)\s*(·|:)\s*\(?([−+-]?\d+)\)?\s*=/.exec(paso.x || '');
  if(!m) return -1;
  const v = Number(m[2].replace('−', '-'));
  return m[1] === ':' ? 1 / v : v;
}
function tiron(campo){
  campo.classList.remove('tiron'); void campo.offsetWidth; campo.classList.add('tiron');
  setTimeout(() => campo.classList.remove('tiron'), 620);
}

raiz.Reproductor = {crea, pintaBanquillo};
})(window);
