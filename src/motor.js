/* ══════════════════════════════════════════════════════════════════════
   LA PALESTRA · el motor
   El estado del campo, la cuenta escrita en la tablilla, el intérprete que
   la juega y el grabador que la convierte en fotogramas. Aquí no se dibuja
   nada: todo lo de la pantalla vive aparte y lee lo que sale de aquí.

   Las reglas que manda todo esto:
   · Lo que tira en la cuerda es lo que suma. La bandera nunca se congela.
   · Un término compuesto se prepara en el banquillo y sale a tirar hecho.
       nivel 1: un jugador solo (4·(−2), (−3)², −(−4)·(−2))
       nivel 2: un paréntesis de sumas: se reduce a uno y luego bebe
       nivel 3 o más: sin teatro; la cuenta se hace exacta, con fracciones
   · El signo va dentro del tirador; + y − son «que entre» y «que se retire».
   ══════════════════════════════════════════════════════════════════════ */
(function (raiz) {
'use strict';

const MAX_F = 12;      // fuerza máxima de un tirador en la palestra
const TOPE_LADO = 5;   // en cada lado tiran cinco como mucho

const POCIONES = [
  {k: 2,    e: '·2',    n: 'Doblón',          d: 'tira el doble'},
  {k: 3,    e: '·3',    n: 'Triplón',         d: 'tira el triple'},
  {k: 1/2,  e: ':2',    n: 'Aguada',          d: 'se queda en la mitad'},
  {k: 1/3,  e: ':3',    n: 'Aguachirle',      d: 'se queda en un tercio'},
  {k: -1,   e: '·(−1)', n: 'Traición',        d: 'misma fuerza, otro bando'},
  {k: -2,   e: '·(−2)', n: 'Traición doble',  d: 'el doble de fuerza, y en contra'},
  {k: -3,   e: '·(−3)', n: 'Traición triple', d: 'el triple de fuerza, y en contra'},
  {k: -1/2, e: ':(−2)', n: 'Traición aguada', d: 'la mitad de fuerza, y en contra'}
];
const pocionDe = k => POCIONES.find(p => Math.abs(p.k - k) < 1e-9) || null;

/* ── cómo se escriben los números ── */
const conSigno = n => n === 0 ? '0' : (n > 0 ? '+' : '−') + Math.abs(n);
/* como en el cuaderno: el primero sin paréntesis, los negativos de después
   entre paréntesis y los positivos sin signo */
const numCuaderno = (f, primero) => primero ? (f < 0 ? conSigno(f) : String(f))
  : (f < 0 ? '(' + conSigno(f) + ')' : String(f));
const etqDe = k => { const po = pocionDe(k); return po ? po.e : '·' + k; };
const preTxt = k => (k < 0 ? '(' + conSigno(k) + ')' : String(k)) + '·';

class ErrorPalestra extends Error {
  constructor(msg, tipo){ super(msg); this.tipo = tipo || 'campo'; }
}

/* ══════════════════════════════════════════════════════════════════════
   EL CAMPO: la cuerda y el banquillo. Un solo objeto con todo el estado.
   Cada tirador: {id, f, venia}. «venia» guarda de qué bando venía quien
   cambió de bando con una traición: sale con los pantalones de antes.
   ══════════════════════════════════════════════════════════════════════ */
class Campo {
  constructor(){ this.cuerda = []; this.banquillo = []; this.sig = 1; }
  suma(){ return this.cuerda.reduce((a, p) => a + p.f, 0); }
  busca(id){ return this.cuerda.find(p => p.id === id) || this.banquillo.find(p => p.id === id) || null; }
  enBanquillo(id){ return this.banquillo.some(p => p.id === id); }
  foto(){
    const copia = l => l.map(p => ({id: p.id, f: p.f, venia: p.venia || null}));
    return {cuerda: copia(this.cuerda), banquillo: copia(this.banquillo), bandera: this.suma()};
  }
  /* la cuerda tiene sus límites; el banquillo no */
  comprueba(){
    const izq = this.cuerda.filter(p => p.f < 0).length, der = this.cuerda.length - izq;
    if(izq > TOPE_LADO || der > TOPE_LADO)
      throw new ErrorPalestra('No caben: en cada lado tiran cinco como mucho, y aquí serían ' + Math.max(izq, der) + '.');
    const s = this.suma();
    if(Math.abs(s) > MAX_F)
      throw new ErrorPalestra('La bandera se saldría de la regla, que llega hasta ±' + MAX_F + ': acabaría en ' + conSigno(s) + '.');
  }
  entra(f, alBanquillo){
    const p = {id: this.sig++, f, venia: null};
    (alBanquillo ? this.banquillo : this.cuerda).push(p);
    if(!alBanquillo) this.comprueba();
    return p.id;
  }
  retira(id){
    const p = this.busca(id);
    if(!p) throw new ErrorPalestra('No hay nadie con ese número a quien retirar.');
    this.cuerda = this.cuerda.filter(q => q.id !== id);
    this.banquillo = this.banquillo.filter(q => q.id !== id);
  }
  /* beber: la fuerza se multiplica; si cambia de signo, cambia de bando */
  bebe(id, k){
    const p = this.busca(id);
    if(!p) return;
    const v = p.f * k;
    if(!Number.isInteger(v))
      throw new ErrorPalestra('El de ' + conSigno(p.f) + ' no se puede repartir así: le tocaría ' +
        String(Math.round(v * 100) / 100).replace('.', ',') + ', y aquí se tira con fuerzas enteras.');
    if(Math.abs(v) > MAX_F)
      throw new ErrorPalestra('Un tirador de fuerza ' + Math.abs(v) + ' no cabe en la palestra: como mucho ' + MAX_F + '.');
    if((p.f < 0) !== (v < 0) && v !== 0) p.venia = p.venia || (p.f < 0 ? 'izq' : 'der');
    p.f = v;
    if(!this.enBanquillo(id)) this.comprueba();
  }
  /* varios se juntan en uno que vale su suma (0: no queda nadie) */
  junta(ids){
    if(!ids.length) return null;
    const enBanco = this.enBanquillo(ids[0]);
    const lista = enBanco ? this.banquillo : this.cuerda;
    const s = ids.reduce((a, id) => a + ((lista.find(p => p.id === id) || {f: 0}).f), 0);
    const resto = lista.filter(p => ids.indexOf(p.id) < 0);
    let nuevo = null;
    if(s){ nuevo = {id: this.sig++, f: s, venia: null}; resto.push(nuevo); }
    if(enBanco) this.banquillo = resto; else this.cuerda = resto;
    if(!enBanco) this.comprueba();
    return nuevo ? nuevo.id : null;
  }
  /* del banquillo a la cuerda, ya hecho */
  sale(ids){
    ids.forEach(id => {
      const p = this.banquillo.find(q => q.id === id);
      if(!p) return;
      this.banquillo = this.banquillo.filter(q => q.id !== id);
      this.cuerda.push(p);
    });
    this.comprueba();
  }
}

/* ══════════════════════════════════════════════════════════════════════
   LA CUENTA. Piezas de la tablilla:
     {t:'n', f}          un tirador con su signo
     {t:'+'} {t:'-'}     que entre, que se retire
     {t:'('} {t:')'}
     {t:'p', k, pre}     una poción: delante (3·) o detrás (·3)
     {t:'e', n}          al cuadrado (2) o al cubo (3)
   El analizador la convierte en un árbol:
     expr  = {terms:[term]}
     term  = {sign, si, pre:[{k, ti}], factor, exp, ei, post:[k], postI:[i]}
     factor= {t:'n', f, a, z} | {t:'g', expr, a, z}
   Las letras a, z, si, ti, ei, postI son posiciones en la tablilla: con
   ellas la cartela ilumina el trozo que se está jugando.
   ══════════════════════════════════════════════════════════════════════ */
function analiza(T){
  let i = 0;
  const err = m => { throw new ErrorPalestra(m, 'cuenta'); };
  function expr(){
    const terms = [];
    let sign = '+', si = null;
    if(T[i] && T[i].t === '-'){ sign = '-'; si = i; i++; }
    for(;;){
      terms.push(Object.assign({sign, si}, term()));
      if(T[i] && (T[i].t === '+' || T[i].t === '-')){ sign = T[i].t; si = i; i++; continue; }
      break;
    }
    return {terms};
  }
  function term(){
    const pre = [], post = [], postI = [];
    while(T[i] && T[i].t === 'p' && T[i].pre){ pre.push({k: T[i].k, ti: i}); i++; }
    let factor;
    if(!T[i]) err('La cuenta se ha quedado a medias: falta a quién darle el frasco o el número de detrás.');
    if(T[i].t === 'n'){ factor = {t: 'n', f: T[i].f, a: i, z: i}; i++; }
    else if(T[i].t === '('){
      const a = i; i++;
      const dentro = expr();
      if(!T[i] || T[i].t !== ')') err('Falta cerrar un paréntesis.');
      factor = {t: 'g', expr: dentro, a, z: i}; i++;
    }else err('Ahí falta un tirador o un paréntesis.');
    let exp = 1, ei = null;
    if(T[i] && T[i].t === 'e'){ exp = T[i].n; ei = i; i++; }
    while(T[i] && T[i].t === 'p' && !T[i].pre){ post.push(T[i].k); postI.push(i); i++; }
    return {pre, factor, exp, ei, post, postI};
  }
  if(!T || !T.length) err('Todavía no has escrito nada.');
  const e = expr();
  if(i < T.length) err('Sobra algo al final: ' + (T[i].t === ')' ? 'un paréntesis que no se abrió.' : 'revisa la cuenta.'));
  return e;
}

/* la cuenta escrita, en texto plano (la pantalla la colorea aparte) */
const SUP = {2: '²', 3: '³'};
function escribe(e, primero){
  let h = '';
  e.terms.forEach((t, n) => {
    if(t.sign === '-') h += (n === 0 ? '−' : ' − ');
    else if(n > 0) h += ' + ';
    const ini = (primero === undefined || primero) && n === 0 && t.sign === '+';
    t.pre.forEach(p => { h += preTxt(p.k); });
    h += t.factor.t === 'n' ? numCuaderno(t.factor.f, ini && !t.pre.length && !(t.exp > 1 && t.factor.f < 0))
                            : '(' + escribe(t.factor.expr, true) + ')';
    if(t.exp > 1) h += SUP[t.exp] || '^' + t.exp;
    t.post.forEach(k => { h += etqDe(k); });
  });
  return h;
}

/* ── la cuenta hecha a mano, en fracciones exactas: para lo que no cabe ── */
const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while(b){ [a, b] = [b, a % b]; } return a || 1; };
const frac = (n, d) => { if(d < 0){ n = -n; d = -d; } const g = mcd(n, d); return [n / g, d / g]; };
const fracDe = k => Number.isInteger(k) ? [k, 1] : frac(Math.sign(k), Math.round(1 / Math.abs(k)));
function exacto(e){
  let tot = [0, 1];
  e.terms.forEach(t => {
    let v = t.factor.t === 'n' ? [t.factor.f, 1] : exacto(t.factor.expr);
    if(t.exp > 1) v = [Math.pow(v[0], t.exp), Math.pow(v[1], t.exp)];
    t.pre.map(p => p.k).concat(t.post).forEach(k => { const f = fracDe(k); v = frac(v[0] * f[0], v[1] * f[1]); });
    if(t.sign === '-') v = [-v[0], v[1]];
    tot = frac(tot[0] * v[1] + v[0] * tot[1], tot[1] * v[1]);
  });
  return tot;
}
const fracTxt = ([n, d]) => d === 1 ? (n < 0 ? conSigno(n) : String(n)) : (n < 0 ? '−' : '') + Math.abs(n) + '/' + d;

/* ══════════════════════════════════════════════════════════════════════
   EL INTÉRPRETE. Juega el árbol sobre un campo y va contando cada paso
   a «cuenta(paso)». Un paso es {tipo, m, x}: qué ha pasado, qué trozo de la
   tablilla se ilumina (posiciones) y la cuenta pequeña en palabras.
   ══════════════════════════════════════════════════════════════════════ */
const rango = (a, z) => { const r = []; for(let q = a; q <= z; q++) r.push(q); return r; };
const conSi = (t, r) => t.si === null || t.si === undefined ? r : [t.si].concat(r);
const trozoFactor = t => rango(t.factor.a, t.factor.z).concat(t.ei !== null && t.ei !== undefined ? [t.ei] : []);
const trozoTermino = t => conSi(t, rango(t.pre.length ? t.pre[0].ti : t.factor.a,
  t.postI.length ? t.postI[t.postI.length - 1] : (t.ei !== null && t.ei !== undefined ? t.ei : t.factor.z)));
const opTxt = k => Number.isInteger(k) ? '·' + (k < 0 ? '(' + conSigno(k) + ')' : k) : etqDe(k);
const cuentaBebe = (f, k) => '(' + conSigno(f) + ')' + opTxt(k) + ' = ' + conSigno(f * k);

const esSuelto = t => t.factor.t === 'n' && !t.pre.length && !t.post.length && !(t.exp > 1);
const esCompuesto = t => !!(t.pre.length || t.post.length || t.exp > 1 || (t.sign === '-' && !esSuelto(t)));
/* nivel de un término: 0 suelto, 1 un jugador, 2 un paréntesis de sumas, 3 más hondo */
function nivelDe(t){
  if(!esCompuesto(t)) return t.factor.t === 'g' ? Math.max(0, ...t.factor.expr.terms.map(nivelDe)) : 0;
  if(t.factor.t === 'n') return 1;
  return t.factor.expr.terms.some(u => esCompuesto(u) || u.factor.t === 'g') ? 3 : 2;
}
const nivelCuenta = e => Math.max(0, ...e.terms.map(nivelDe));

function juega(arbol, campo, cuenta){
  const di = (tipo, m, x) => cuenta({tipo, m, x: x || ''});
  let enBanco = false;

  function expr(e, ambito){
    for(const t of e.terms){
      if(t.sign === '-' && esSuelto(t)){
        /* restar: se retira uno con ese número; si no lo hay, entra su pareja
           nula (suman 0) y se retira el que toca */
        const f = t.factor.f;
        const id = ambito.find(q => campo.busca(q).f === f);
        if(id !== undefined){
          ambito.splice(ambito.indexOf(id), 1);
          campo.retira(id);
          di('retira', conSi(t, [t.factor.a]), 'se va el ' + conSigno(f));
        }else{
          const a = campo.entra(f, enBanco), b = campo.entra(-f, enBanco);
          di('pareja', conSi(t, [t.factor.a]), 'no hay ' + conSigno(f) + ': entran ' + conSigno(f) + ' y ' + conSigno(-f) + ' (suman 0)');
          ambito.push(b);
          campo.retira(a);
          di('retira', conSi(t, [t.factor.a]), 'se va el ' + conSigno(f));
        }
        continue;
      }
      if(esCompuesto(t)){
        if(enBanco) throw new ErrorPalestra('Aquí hay un paréntesis que bebe con otra operación dentro: demasiados niveles para el teatro.', 'nivel');
        enBanco = true;
        let ids = termino(t);
        enBanco = false;
        const v = ids.length === 1 ? campo.busca(ids[0]).f : null;
        campo.sale(ids);
        di('sale', trozoTermino(t), !ids.length ? 'vale 0: no sale nadie'
          : (v !== null ? 'sale a tirar el ' + conSigno(v) : 'salen a tirar'));
        ambito.push(...ids);
      }else{
        ambito.push(...termino(t));
      }
    }
    return ambito;
  }

  function termino(t){
    let ids;
    if(t.factor.t === 'n'){
      ids = [campo.entra(t.factor.f, enBanco)];
      di('entra', esCompuesto(t) ? [t.factor.a] : conSi(t, [t.factor.a]), enBanco ? 'se prepara en el banquillo' : '');
    }else{
      ids = expr(t.factor.expr, []);
      if(enBanco && ids.length !== 1){
        /* en el banquillo, lo normal: primero se reduce el paréntesis */
        const s = ids.reduce((a, id) => a + campo.busca(id).f, 0);
        const nuevo = campo.junta(ids);
        di('junta', rango(t.factor.a, t.factor.z), 'el paréntesis vale ' + (s ? conSigno(s) : '0'));
        ids = nuevo === null ? [] : [nuevo];
      }
    }
    /* la potencia: elevar es multiplicar por sí mismo; el tirador se bebe su
       propio frasco una vez menos que el exponente */
    if(t.exp > 1 && ids.length){
      const v = campo.busca(ids[0]).f;
      if(v !== 1 && v !== 0){
        if(!pocionDe(v)) throw new ErrorPalestra('Para elevar, el tirador se bebe su propio frasco, y no hay frasco de ·' + v + '.');
        for(let r = 1; r < t.exp; r++){
          const f0 = campo.busca(ids[0]).f;
          campo.bebe(ids[0], v);
          di('bebe', trozoFactor(t), cuentaBebe(f0, v));
        }
      }
    }
    const beben = (k, m) => ids.forEach(id => { const f0 = campo.busca(id).f; campo.bebe(id, k); di('bebe', m, cuentaBebe(f0, k)); });
    /* primero los frascos de delante (el más cercano antes), luego los de detrás */
    t.pre.slice().reverse().forEach(p => beben(p.k, [p.ti].concat(trozoFactor(t))));
    t.post.forEach((k, n) => beben(k, trozoFactor(t).concat([t.postI[n]])));
    /* el menos de delante de un término compuesto: cambia de bando */
    if(t.sign === '-' && !esSuelto(t))
      ids.forEach(id => { const f0 = campo.busca(id).f; campo.bebe(id, -1); di('bebe', trozoTermino(t), 'el menos: cambia de bando'); });
    return ids;
  }

  return expr(arbol, []);
}

/* ══════════════════════════════════════════════════════════════════════
   EL GRABADOR. Juega la cuenta entera de una vez y guarda una foto del
   campo tras cada paso: la película. Quien la reproduce solo tiene que
   enseñar la foto k y animar el paso de la k−1 a la k.
   ══════════════════════════════════════════════════════════════════════ */
function graba(tok){
  const arbol = analiza(tok);
  const nivel = nivelCuenta(arbol);
  const pel = {arbol, tok, nivel, pasos: [], valor: null, exacto: null, sinTeatro: null};
  const campo = new Campo();
  try{
    juega(arbol, campo, paso => {
      const foto = campo.foto();
      const antes = pel.pasos.length ? pel.pasos[pel.pasos.length - 1].bandera : 0;
      pel.pasos.push(Object.assign(paso, foto, {
        /* paso clave: mueve la bandera y merece una predicción antes */
        clave: (paso.tipo === 'retira' || paso.tipo === 'sale') && foto.bandera !== antes
      }));
    });
    pel.valor = campo.suma();
  }catch(e){
    if(!(e instanceof ErrorPalestra) || e.tipo === 'cuenta') throw e;
    /* no cabe en el campo o es demasiado hondo: sin teatro, pero la cuenta se hace igual */
    pel.pasos = [];
    pel.exacto = exacto(arbol);
    pel.valor = pel.exacto[1] === 1 ? pel.exacto[0] : null;
    pel.sinTeatro = e.message;
  }
  if(pel.exacto === null) pel.exacto = [pel.valor, 1];
  return pel;
}

const motor = {MAX_F, TOPE_LADO, POCIONES, pocionDe, conSigno, numCuaderno, etqDe, preTxt,
  ErrorPalestra, Campo, analiza, escribe, exacto, fracTxt, nivelDe, nivelCuenta, juega, graba};
if(typeof module !== 'undefined' && module.exports) module.exports = motor;
else raiz.Palestra = motor;
})(typeof window !== 'undefined' ? window : globalThis);
