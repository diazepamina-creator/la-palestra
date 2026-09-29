/* Pruebas de la tablilla: escribir y editar con el cursor. node --test pruebas/ */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
globalThis.Palestra = require('../src/motor.js');
const TL = require('../src/tablilla.js');
const M = globalThis.Palestra;

/* escribe una tira de teclas y devuelve la cuenta y el cursor */
const n = f => ({t: 'n', f}), mas = {t: '+'}, menos = {t: '-'}, izq = {t: 'izq'}, der = {t: 'der'}, borra = {t: 'borra'};
function teclea(teclas, ini){
  let tok = ini ? ini.tok : [], cur = ini ? ini.cur : 0, aviso = '';
  for(const tk of teclas){ const r = TL.pulsa(tok, tk, cur); tok = r.tok; cur = r.cur; aviso = r.aviso; }
  let txt = '';
  try{ txt = tok.length ? M.escribe(M.analiza(tok)) : ''; }catch(err){ txt = '(a medias)'; }
  return {tok, cur, aviso, txt};
}

test('sin mover el cursor, se escribe al final como siempre', () => {
  const r = teclea([n(-3), mas, n(5)]);
  assert.equal(r.txt, '−3 + 5');
  assert.equal(r.cur, 3);
});

test('el cursor va atrás y adelante, sin salirse', () => {
  let r = teclea([n(2), mas, n(4), izq, izq, izq, izq]);
  assert.equal(r.cur, 0);
  r = teclea([der, der, der, der, der], r);
  assert.equal(r.cur, 3);
});

test('se escribe donde está el cursor: 2 + 4 → 2 + 3 + 4', () => {
  const r = teclea([n(2), mas, n(4), izq, n(3)]);
  assert.equal(r.txt, '2 + 3 + 4');
  assert.equal(r.cur, 4, 'el cursor queda detrás de lo escrito');
});

test('delante del todo también: 5 − 1 → −2 + 5 − 1', () => {
  const r = teclea([n(5), menos, n(1), izq, izq, izq, n(-2)]);
  assert.equal(r.txt, '−2 + 5 − 1');
});

test('DEL borra lo que hay justo antes del cursor', () => {
  /* 2 + 4 − 1 con el cursor detrás del 4: se va el 4 */
  let r = teclea([n(2), mas, n(4), menos, n(1), izq, izq, borra]);
  assert.deepEqual(r.tok.map(t => t.t + (t.f || '')), ['n2', '+', '-', 'n1']);
  assert.equal(r.cur, 2);
  assert.equal(r.txt, '(a medias)', 'queda a medias; al pulsar = lo avisa el motor');
  /* y borrando también el + queda 2 − 1 */
  r = teclea([borra], r);
  assert.equal(r.txt, '2 − 1');
});

test('cambiar el signo: sobre un + se escribe un − y manda el nuevo', () => {
  const r = teclea([n(2), mas, n(4), izq, izq, menos]);
  assert.equal(r.txt, '2 − 4');
});

test('una poción donde está el cursor: (−2 + 1) con ·3 delante del paréntesis', () => {
  const ab = {t: '('}, ci = {t: ')'};
  const r = teclea([ab, n(-2), mas, n(1), ci, izq, izq, izq, izq, izq, {t: 'p', k: 3}]);
  assert.equal(r.tok[0].t, 'p'); assert.equal(r.tok[0].pre, true);
  assert.equal(M.graba(r.tok).valor, -3);
});

test('AC lo borra todo y deja el cursor al principio', () => {
  const r = teclea([n(2), mas, n(4), {t: 'ac'}]);
  assert.deepEqual(r.tok, []); assert.equal(r.cur, 0);
});

test('el cursor se dibuja en su sitio', () => {
  const tok = [n(2), mas, n(4)];
  const h = TL.htmlCuenta(tok, null, 1);
  assert.ok(h.indexOf('tl-cursor') > h.indexOf('>2<') && h.indexOf('tl-cursor') < h.indexOf('+'), h);
  assert.ok(TL.htmlCuenta(tok, null, 3).endsWith('<span class="tl-cursor" aria-hidden="true"></span>'));
  assert.ok(!TL.htmlCuenta(tok).includes('tl-cursor'), 'sin cursor, no se dibuja');
});
