/* ══════════════════════════════════════════════════════════════════════
   LA PALESTRA · el ojo de Argos
   Listillón copia la resolución de una cuenta, paso a paso como en el
   cuaderno, y se equivoca en uno: hay que encontrar la PRIMERA línea mal.
   Las líneas son de dos clases: el valor de un término compuesto
   («3·(−2 + 1) = −3») y el total que se va acumulando («+2 − (−2) = +4»).
   El fallo es de los que se cometen de verdad con los enteros, y lo de
   después sigue bien hecho a partir del error: así solo hay un primer fallo.
   Todo sale del motor: ni una cuenta escrita a mano.
   ══════════════════════════════════════════════════════════════════════ */
(function (raiz) {
'use strict';
const P = raiz.Palestra;
let azar = Math.random;
const elige = xs => xs[Math.floor(azar() * xs.length)];

const cs = P.conSigno;
const operando = v => v < 0 ? '(' + cs(v) + ')' : String(v);        // lo de la derecha, con paréntesis si es negativo
const valorDe = t => { const [n, d] = P.exacto({terms: [Object.assign({}, t, {sign: '+'})]}); return d === 1 ? n : null; };
const esCompuesto = t => !!(t.pre.length || t.post.length || t.exp > 1 || t.factor.t === 'g');
const textoTermino = t => P.escribe({terms: [Object.assign({}, t, {sign: '+'})]}, false);

/* la resolución: [{clase, ...}]. «forzar» = {i, r}: en la línea i, Listillón
   pone r en vez de lo que toca, y todo lo de después sale de ahí. null si
   algún término no da entero */
function construye(tok, forzar){
  const arbol = P.analiza(tok), lineas = [];
  let total = null;
  const pon = (l, bien) => { const i = lineas.length; const r = forzar && forzar.i === i ? forzar.r : bien; lineas.push(Object.assign(l, {r})); return r; };
  for(const t of arbol.terms){
    let v = valorDe(t);
    if(v === null) return null;
    if(esCompuesto(t)) v = pon({clase: 'termino', txt: textoTermino(t)}, v);
    const efec = t.sign === '-' ? -v : v;
    if(total === null){ total = efec; continue; }       // el primero no es una línea: es de donde se parte
    total = pon({clase: 'total', a: total, op: t.sign, b: v}, total + efec);
  }
  return lineas.length >= 2 ? lineas : null;
}
const resolucion = tok => construye(tok);
/* la línea escrita */
function texto(l){
  if(l.clase === 'termino') return l.txt + ' = ' + cs(l.r);
  return cs(l.a) + ' ' + (l.op === '-' ? '−' : '+') + ' ' + operando(l.b) + ' = ' + cs(l.r);
}

/* los fallos que se cometen de verdad, según la línea */
function fallos(l){
  const f = [];
  if(l.clase === 'termino'){
    if(l.r !== 0) f.push({r: -l.r, por: 'el signo de ' + (/[²³]/.test(l.txt) ? 'la potencia' : 'la multiplicación')});
    return f;
  }
  const bien = l.r, efec = l.op === '-' ? -l.b : l.b;
  if(l.op === '-' && l.b < 0) f.push({r: l.a - Math.abs(l.b), por: 'restar un negativo: si se retira uno que tira a la izquierda, la bandera va a la derecha'});
  if(l.op === '+' && l.b < 0) f.push({r: l.a + Math.abs(l.b), por: 'sumar un negativo: el que entra tira hacia la izquierda'});
  /* los dos siguientes solo tienen sentido cuando tiran en contra: con los
     dos hacia el mismo lado nadie se equivoca así */
  if(l.a !== 0 && efec !== 0 && Math.sign(l.a) !== Math.sign(efec)){
    f.push({r: Math.sign(l.a) * (Math.abs(l.a) + Math.abs(efec)), por: 'sumar las fuerzas cuando tiran en contra: se restan'});
    if(bien !== 0) f.push({r: -bien, por: 'el signo del resultado: gana el bando más fuerte'});
  }
  return f.filter(x => x.r !== bien);
}

/* la resolución con un fallo: {lineas, bien, malo, por}. «malo» es la
   primera línea mal; las de después arrastran el error */
function conFallo(tok){
  const L = construye(tok);
  if(!L) return null;
  const candidatas = L.map((l, i) => ({i, f: fallos(l)})).filter(c => c.f.length);
  if(!candidatas.length) return null;
  const c = elige(candidatas), f = elige(c.f);
  const M = construye(tok, {i: c.i, r: f.r});
  return {lineas: M.map(texto), bien: L.map(texto), malo: c.i, por: f.por};
}

const A = {resolucion, conFallo, texto, conAzar: f => { azar = f; }};
if(typeof module !== 'undefined' && module.exports) module.exports = A;
else raiz.Argos = A;
})(typeof window !== 'undefined' ? window : globalThis);
