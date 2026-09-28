/* ══════════════════════════════════════════════════════════════════════
   LA PALESTRA · los ejercicios y la ruta
   Genera cuentas de cada nivel del andamiaje y las comprueba con el motor:
   una cuenta vale si tiene teatro (cabe en el campo, sin niveles de más)
   y da un entero. La ruta son las misiones, en orden, con su meta.
   Sin pantalla: la página decide cómo enseñarlo.
   ══════════════════════════════════════════════════════════════════════ */
(function (raiz) {
'use strict';
const P = raiz.Palestra;

const n = f => ({t: 'n', f}), MAS = {t: '+'}, MENOS = {t: '-'}, AB = {t: '('}, CI = {t: ')'};
const po = k => ({t: 'p', k, pre: false}), pre = k => ({t: 'p', k, pre: true}), e = x => ({t: 'e', n: x});

const MISIONES = [
  {t: 'Entra gente',        nivel: 0, meta: 4, d: 'Entrar es <b>sumar</b>, con su signo.'},
  {t: 'Alguien se retira',  nivel: 1, meta: 4, d: 'Retirarse es <b>restar</b>. Si no está, entra su pareja.'},
  {t: 'Pociones',           nivel: 2, meta: 4, d: 'El frasco se bebe en el <b>banquillo</b>. Con calavera, cambia de bando.'},
  {t: 'El paréntesis',      nivel: 3, meta: 4, d: 'Primero se <b>reduce</b> el paréntesis; luego bebe.'},
  {t: 'Potencias',          nivel: 4, meta: 3, d: '<b>(−2)²</b> no es <b>−2²</b>.'},
  {t: 'Todo junto',         nivel: 5, meta: 5, d: 'De todo un poco.'}
];

/* el azar se puede sustituir en las pruebas */
let azar = Math.random;
const elige = lista => lista[Math.floor(azar() * lista.length)];
const fuerza = () => elige([1, 2, 3, 4, 5]);
const conSigno = () => elige([1, -1]) * fuerza();
const POC_ENTERAS = [2, 3, -1, -2, -3], POC_TODAS = [2, 3, 1/2, 1/3, -1, -2, -3, -1/2];

/* una cuenta al azar de cada nivel; puede no valer (se comprueba después) */
function plantilla(nivel){
  switch(nivel){
    case 0: return azar() < .5 ? [n(conSigno()), MAS, n(conSigno())] : [n(conSigno()), MAS, n(conSigno()), MAS, n(conSigno())];
    case 1: {
      const a = conSigno();
      /* la mitad de las veces se retira alguien que está; la otra mitad, pareja nula */
      if(azar() < .5) return [n(a), MENOS, n(a)].length && [n(a), MAS, n(conSigno()), MENOS, n(a)];
      return azar() < .5 ? [n(a), MENOS, n(conSigno())] : [n(a), MAS, n(conSigno()), MENOS, n(conSigno())];
    }
    case 2: {
      const k = elige(POC_TODAS), a = conSigno(), b = conSigno();
      return elige([
        [n(a), MAS, n(b), po(k)],
        [n(a), MENOS, n(b), po(k)],
        [n(b), po(k), MAS, n(a)],
        Number.isInteger(k) ? [n(a), MAS, pre(k), n(b)] : [n(a), MAS, n(b), po(k)]
      ]);
    }
    case 3: {
      const k = elige(POC_ENTERAS), a = conSigno(), b = conSigno(), c = conSigno();
      return elige([
        [n(a), MAS, pre(k), AB, n(b), MAS, n(c), CI],
        [n(a), MENOS, AB, n(b), MAS, n(c), CI],
        [n(a), MENOS, AB, n(b), MENOS, n(c), CI],
        [AB, n(b), MAS, n(c), CI, po(k)],
        [pre(k), AB, n(b), MAS, n(c), CI, MAS, n(a)]
      ]);
    }
    case 4: {
      const a = conSigno(), b = elige([1, 2, 3]);
      return elige([
        [n(a), MAS, n(-b), e(2)],
        [MENOS, n(b), e(2)],
        [n(-b), e(3)],
        [n(a), MENOS, n(-b), e(2)],
        [n(-b), e(2), MAS, n(a)]
      ]);
    }
    default: return plantilla(1 + Math.floor(azar() * 4));
  }
}

/* una cuenta del nivel que vale: con teatro y resultado entero */
function genera(nivel){
  for(let i = 0; i < 60; i++){
    const tok = plantilla(nivel);
    let pel;
    try{ pel = P.graba(tok); }catch(err){ continue; }
    if(pel.sinTeatro || pel.valor === null) continue;
    if(pel.pasos.length < 2) continue;
    return {tok, valor: pel.valor, pel};
  }
  /* si el azar se empeña, una segura */
  const tok = [n(2), MAS, n(-3)];
  return {tok, valor: -1, pel: P.graba(tok)};
}

/* ── la ruta: dónde va el alumno ── */
function nuevaRuta(){ return {i: 0, hechas: 0, hecho: false, tropezo: false}; }
/* un acierto: devuelve si con este se cumple la misión */
function acierta(ruta){
  const m = MISIONES[ruta.i];
  if(ruta.hechas < m.meta) ruta.hechas++;
  if(ruta.hechas >= m.meta && !ruta.hecho){ ruta.hecho = true; return true; }
  return false;
}
function siguiente(ruta){
  if(ruta.i >= MISIONES.length - 1) return false;
  ruta.i++; ruta.hechas = 0; ruta.hecho = false; ruta.tropezo = false;
  return true;
}

/* ── el acta de la jornada ──
   Por misión, cuántas se resuelven, cuántas respuestas fallan y cuántas salen
   sin mirar el campo. Y ejercicio a ejercicio: la cuenta, lo que se contestó
   (con los fallos por delante) y si se miró antes de acertar. */
function nuevaSesion(){ return {t0: Date.now(), bien: 0, mal: 0, mision: {}, ejercicios: []}; }
/* det = {id, cuenta, dicho, valor, visto}: el ejercicio que se está contestando */
function anota(sesion, ruta, ok, det, ahora){
  sesion[ok ? 'bien' : 'mal']++;
  const m = sesion.mision[ruta.i] || (sesion.mision[ruta.i] = {bien: 0, mal: 0, solas: 0});
  m[ok ? 'bien' : 'mal']++;
  if(!det) return;
  if(ok && !det.visto) m.solas = (m.solas || 0) + 1;
  const lista = sesion.ejercicios || (sesion.ejercicios = []);
  let e = lista[lista.length - 1];
  if(!e || e.id !== det.id){
    e = {id: det.id, m: ruta.i, c: det.cuenta, v: det.valor, d: [], ok: false, visto: false, t: ahora || Date.now()};
    lista.push(e);
    if(lista.length > 400) lista.shift();
  }
  e.d.push(det.dicho); e.ok = ok; e.visto = !!det.visto;
}
function reloj(ms){
  const s = Math.max(0, Math.round(ms / 1000));
  return Math.floor(s / 60) + ' min ' + String(s % 60).padStart(2, '0') + ' s';
}
const firma = v => v > 0 ? '+' + v : v < 0 ? '−' + (-v) : '0';
const dos = x => String(x).padStart(2, '0');
const hora = ms => { const f = new Date(ms); return dos(f.getHours()) + ':' + dos(f.getMinutes()); };
/* un ejercicio del acta en palabras: «a la primera, sin mirar», «tras 2 fallos (+3, −1), mirando»… */
function comoFue(e){
  const fallos = e.ok ? e.d.slice(0, -1) : e.d;
  let t = e.ok ? (fallos.length ? 'bien tras ' + fallos.length + (fallos.length === 1 ? ' fallo' : ' fallos') : 'bien a la primera')
    : 'sin resolver';
  if(fallos.length) t += ' (' + fallos.map(firma).join(', ') + ')';
  if(e.ok) t += e.visto ? ', mirando el campo' : ', sin mirar';
  return t;
}
function actaEnTexto(sesion, ahora, ruta){
  ahora = ahora || Date.now();
  const total = sesion.bien + sesion.mal, f = new Date(ahora);
  let t = 'LA PALESTRA · acta de la jornada\n';
  t += 'Nombre: ' + (sesion.nombre || '(sin nombre)') + '\n';
  t += 'Fecha: ' + dos(f.getDate()) + '/' + dos(f.getMonth() + 1) + '/' + f.getFullYear() + '  ' + dos(f.getHours()) + ':' + dos(f.getMinutes()) + '\n';
  t += 'Tiempo: ' + reloj(ahora - sesion.t0) + '\n';
  if(ruta) t += 'Ruta: misión ' + (ruta.i + 1) + ' de ' + MISIONES.length + ' (' + MISIONES[ruta.i].t + ')' + (ruta.hecho ? ', cumplida' : '') + '\n';
  t += 'Resueltas: ' + sesion.bien + '   Falladas: ' + sesion.mal + '   Acierto: ' + (total ? Math.round(100 * sesion.bien / total) : 0) + '%\n';
  t += 'Por misión:\n';
  const claves = Object.keys(sesion.mision).sort((a, b) => a - b);
  if(!claves.length) t += '  (ninguna anotada)\n';
  claves.forEach(i => {
    const m = sesion.mision[i];
    t += '  ' + (Number(i) + 1) + '. ' + MISIONES[i].t + ' — ' + m.bien + ' de ' + (m.bien + m.mal) +
      (m.solas ? ', ' + m.solas + ' sin mirar' : '') + (m.mal > m.bien ? '  (floja)' : '') + '\n';
  });
  const ejs = sesion.ejercicios || [];
  if(ejs.length){
    t += 'Ejercicio a ejercicio:\n';
    ejs.forEach(e => {
      t += '  ' + hora(e.t) + '  M' + (e.m + 1) + '  ' + e.c + ' = ' + firma(e.v) + ' · ' + comoFue(e) + '\n';
    });
  }
  return t;
}

/* ── el turno guardado: se retoma al recargar, dentro de la misma clase ── */
const GUARDADO = 'palestra.turno.v1', CADUCA = 90 * 60 * 1000;
function guarda(ruta, sesion, alm){
  try{ (alm || raiz.localStorage).setItem(GUARDADO, JSON.stringify({v: 1, ts: Date.now(), ruta, sesion})); }catch(err){}
}
function lee(alm, ahora){
  try{
    const d = JSON.parse((alm || raiz.localStorage).getItem(GUARDADO) || 'null');
    if(!d || d.v !== 1 || !d.ruta || !d.sesion) return null;
    if((ahora || Date.now()) - d.sesion.t0 > CADUCA){ borra(alm); return null; }
    if(d.ruta.i < 0 || d.ruta.i >= MISIONES.length) return null;
    return d;
  }catch(err){ return null; }
}
function borra(alm){ try{ (alm || raiz.localStorage).removeItem(GUARDADO); }catch(err){} }

const E = {MISIONES, genera, plantilla, nuevaRuta, acierta, siguiente, nuevaSesion, anota, reloj, actaEnTexto, comoFue, hora,
  guarda, lee, borra, conAzar: f => { azar = f; }};
if(typeof module !== 'undefined' && module.exports) module.exports = E;
else raiz.Ejercicios = E;
})(typeof window !== 'undefined' ? window : globalThis);
