/* ══════════════════════════════════════════════════════════════════════
   LA PALESTRA · la tablilla
   La TABLI·CAS·IO, hecha como una calculadora científica de clase: arriba
   las teclas grises de función (pociones, paréntesis y potencias) y abajo
   las negras grandes (tiradores con su signo, + y −), con DEL y AC en
   amarillo. Donde se escribe la cuenta: tiradores con su signo,
   pociones, + y − como acciones, paréntesis y potencias. Sabe qué pieza
   puede ir después de cuál, escribe la cuenta como en el cuaderno y avisa
   cuando algo no encaja. No juega nada: eso es del motor.
   ══════════════════════════════════════════════════════════════════════ */
(function (raiz) {
'use strict';
const P = raiz.Palestra;
const SUP = {2: '²', 3: '³'};

/* ── dibujos de las teclas ── */
const CALAVERA =
  '<svg viewBox="0 0 16 16" aria-hidden="true">' +
    '<path fill="#2b0a22" d="M8 2.1c-3.1 0-5.2 2.1-5.2 4.9 0 1.6.7 2.8 1.7 3.5v1.3' +
      'c0 .7.6 1.3 1.3 1.3h4.4c.7 0 1.3-.6 1.3-1.3v-1.3c1-.7 1.7-1.9 1.7-3.5' +
      'c0-2.8-2.1-4.9-5.2-4.9z"/>' +
    '<circle fill="#fff" cx="5.9" cy="6.7" r="1.6"/><circle fill="#fff" cx="10.1" cy="6.7" r="1.6"/>' +
    '<path fill="#fff" d="M8 8.6l.85 1.5h-1.7z"/>' +
    '<rect fill="#fff" x="6.15" y="10.9" width="1.1" height="2.2" rx=".4"/>' +
    '<rect fill="#fff" x="8.75" y="10.9" width="1.1" height="2.2" rx=".4"/>' +
  '</svg>';
function frascoHtml(po){
  return '<span class="frasco">' +
      '<span class="corcho"></span><span class="cuello"></span>' +
      '<span class="asa i"></span><span class="asa d"></span>' +
      '<span class="vidrio"><span class="liquido"></span></span>' +
      (po.k < 0 ? '<span class="calavera">' + CALAVERA + '</span>' : '') +
    '</span>';
}
const clasePoc = po => 'pocion ' + (po.k < 0 ? 'bando' : (Math.abs(po.k) > 1 ? 'crece' : 'mengua')) +
  (Math.abs(po.k) < 1 ? ' mengua' : '');
/* el tirador pequeño de la tecla: se echa hacia atrás, hacia donde tira
   (los rojos hacia la izquierda, los azules hacia la derecha) */
function miniTirador(f){
  const c = f < 0 ? 'var(--izq)' : 'var(--der)', s = f < 0 ? -1 : 1;
  return '<svg viewBox="0 0 26 26" aria-hidden="true">' +
    '<path d="M' + (13 + 11 * s) + ' 15 H' + (13 - 12 * s) + '" stroke="#8a7442" stroke-width="2.2" stroke-linecap="round"/>' +
    '<circle cx="' + (13 + 3 * s) + '" cy="6" r="4.4" fill="' + c + '" stroke="#241C36" stroke-width="1"/>' +
    '<path d="M' + (13 + 4 * s) + ' 10.5 L' + (13 - 1 * s) + ' 18.5" stroke="' + c + '" stroke-width="5.5" stroke-linecap="round"/>' +
    '<path d="M' + (13 - 1 * s) + ' 18.5 L' + (13 - 5 * s) + ' 24 M' + (13 - 1 * s) + ' 18.5 L' + (13 + 3 * s) + ' 24"' +
    ' stroke="' + c + '" stroke-width="2.6" stroke-linecap="round"/></svg>';
}

/* ── la cuenta escrita, pieza a pieza; «clase(i)» marca las que se iluminan ── */
const numHtml = (f, primero) => '<span class="' + (f < 0 ? 'izq' : 'der') + '">' + P.numCuaderno(f, primero) + '</span>';
function htmlCuenta(tok, clase){
  let h = '', primero = true, abierta = '';
  tok.forEach((t, i) => {
    const sig = tok[i + 1];
    let x = '';
    /* un negativo elevado va siempre entre paréntesis: (−2)² no es −2² */
    if(t.t === 'n'){ x = numHtml(t.f, primero && !(sig && sig.t === 'e' && t.f < 0)); primero = false; }
    else if(t.t === 'e') x = '<sup class="tl-exp">' + t.n + '</sup>';
    else if(t.t === '+'){ x = '<span class="op"> + </span>'; primero = false; }
    else if(t.t === '-'){ x = '<span class="op">' + (primero ? '−' : ' − ') + '</span>'; primero = false; }
    else if(t.t === '('){ x = '<span class="op">(</span>'; primero = true; }
    else if(t.t === ')') x = '<span class="op">)</span>';
    else if(t.t === 'p'){ x = '<span class="poc">' + (t.pre ? P.preTxt(t.k) : P.etqDe(t.k)) + '</span>'; primero = false; }
    /* las piezas seguidas con la misma marca van en un solo recuadro */
    const c = clase ? clase(i) : '';
    if(c !== abierta){ if(abierta) h += '</span>'; if(c) h += '<span class="' + c + '">'; abierta = c; }
    h += x;
  });
  if(abierta) h += '</span>';
  return h;
}

/* ── qué pasa al pulsar una tecla: devuelve la cuenta nueva y, si algo no
   encaja, el aviso. Es una función pura: no toca la pantalla ── */
const esFactor = t => t && (t.t === 'n' || t.t === ')' || t.t === 'e' || (t.t === 'p' && !t.pre));
function pulsa(tok, tk){
  const T = tok.slice(), ult = T[T.length - 1];
  const abiertos = T.filter(t => t.t === '(').length - T.filter(t => t.t === ')').length;
  const no = aviso => ({tok, aviso});
  if(tk.t === 'n'){
    if(esFactor(ult)) T.push({t: '+'});          // dos tiradores seguidos: se suman
    T.push({t: 'n', f: tk.f});
  }else if(tk.t === '+' || tk.t === '-'){
    if(!ult || ult.t === '('){
      if(tk.t === '-') T.push({t: '-'});          // un menos delante del todo: vale
    }else if(ult.t === '+' || ult.t === '-') T[T.length - 1] = {t: tk.t};
    else if(ult.t === 'p' && ult.pre)
      return no('Después de <b>' + P.preTxt(ult.k) + '</b> tiene que venir a quién se lo das: un tirador o un paréntesis.');
    else T.push({t: tk.t});
  }else if(tk.t === '('){
    if(esFactor(ult)) T.push({t: '+'});
    T.push({t: '('});
  }else if(tk.t === ')'){
    if(abiertos <= 0) return no('No hay ningún paréntesis abierto que cerrar.');
    if(!esFactor(ult)) return no('Antes de cerrar, termina lo de dentro.');
    T.push({t: ')'});
  }else if(tk.t === 'p'){
    const po = P.pocionDe(tk.k);
    if(!po) return no('');
    if(esFactor(ult)) T.push({t: 'p', k: po.k, pre: false});
    else if(Number.isInteger(po.k)) T.push({t: 'p', k: po.k, pre: true});
    else return no('Un frasco de repartir no se puede poner <b>delante</b>: <b>2 : (…)</b> no es lo mismo que <b>(…) : 2</b>. Escribe primero a quién se reparte y luego el frasco.');
  }else if(tk.t === 'e'){
    if(!ult || (ult.t !== 'n' && ult.t !== ')'))
      return no('El <b>' + SUP[tk.n] + '</b> va pegado a un tirador o a un paréntesis: <b>(−2)²</b> o <b>(1 − 3)²</b>.');
    T.push({t: 'e', n: tk.n});
  }else if(tk.t === 'borra'){
    T.pop();
  }else if(tk.t === 'ac'){
    return {tok: [], aviso: ''};
  }
  return {tok: T, aviso: ''};
}

/* las pociones con tecla: seis, una fila de la calculadora. El motor conoce
   más (:3, ·(−3)) y las misiones las usan; para escribir a mano bastan estas */
const TECLAS_POC = [2, 3, 1/2, -1, -2, -1/2];

/* ── montar las teclas dentro de un elemento. «al» recibe cada tecla pulsada.
   «sobre» es el rótulo amarillo de encima, como las segundas funciones de
   una calculadora; aquí dice qué hace la tecla ── */
function monta(el, al){
  const fila = cls => { const d = document.createElement('div'); d.className = 'tl-fila ' + cls; el.appendChild(d); return d; };
  const tecla = (fil, html, cls, etq, tk, sobre) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = cls; b.innerHTML = html;
    b.setAttribute('aria-label', etq); b.title = etq;
    if(sobre) b.dataset.sobre = sobre;
    b.addEventListener('click', () => al(tk));
    fil.appendChild(b);
    return b;
  };
  /* las grises de función: las pociones, los paréntesis y las potencias */
  const ff = fila('tl-fun');
  TECLAS_POC.map(P.pocionDe).forEach(po => tecla(ff, frascoHtml(po) + '<span class="etq">' + po.e + '</span>', clasePoc(po) + ' tl-p', po.n + ', ' + po.e + ': ' + po.d, {t: 'p', k: po.k}));
  tecla(ff, '(', 'tl-o', 'Abre paréntesis', {t: '('}, 'abre');
  tecla(ff, ')', 'tl-o', 'Cierra paréntesis', {t: ')'}, 'cierra');
  tecla(ff, 'x²', 'tl-o tl-pot', 'Al cuadrado', {t: 'e', n: 2}, 'cuadrado');
  tecla(ff, 'x³', 'tl-o tl-pot', 'Al cubo', {t: 'e', n: 3}, 'cubo');
  /* las negras grandes: los tiradores, y + − DEL AC = */
  const fn = fila('tl-num');
  [-1, -2, -3, -4, -5].forEach(f => tecla(fn, miniTirador(f) + '<b>' + P.conSigno(f) + '</b>', 'tl-t izq', 'Tirador de ' + P.conSigno(f), {t: 'n', f}));
  [1, 2, 3, 4, 5].forEach(f => tecla(fn, miniTirador(f) + '<b>' + P.conSigno(f) + '</b>', 'tl-t der', 'Tirador de ' + P.conSigno(f), {t: 'n', f}));
  tecla(fn, '+', 'tl-o', 'Más: que entre', {t: '+'}, 'entra');
  tecla(fn, '−', 'tl-o', 'Menos: que se retire', {t: '-'}, 'se retira');
  tecla(fn, 'DEL', 'tl-o tl-amarilla', 'Borra lo último', {t: 'borra'}, 'borra uno');
  tecla(fn, 'AC', 'tl-o tl-amarilla', 'Borra la cuenta entera', {t: 'ac'}, 'borra todo');
  tecla(fn, '=', 'tl-o tl-igual', 'Igual: a jugar', {t: '='}, '¡a tirar!');
}

/* las teclas también desde el teclado del ordenador */
function teclaDeTeclado(ev){
  const m = {'+': {t: '+'}, '-': {t: '-'}, '(': {t: '('}, ')': {t: ')'}, 'Backspace': {t: 'borra'}, 'Delete': {t: 'ac'}, '=': {t: '='}, 'Enter': {t: '='}};
  if(m[ev.key]) return m[ev.key];
  if(/^[1-5]$/.test(ev.key)) return {t: 'n', f: ev.shiftKey || ev.altKey ? -Number(ev.key) : Number(ev.key)};
  return null;
}

raiz.Tablilla = {htmlCuenta, pulsa, monta, teclaDeTeclado, frascoHtml, clasePoc, miniTirador, CALAVERA};
})(window);
