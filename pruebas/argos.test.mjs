/* Pruebas del ojo de Argos: node --test pruebas/ */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
globalThis.Palestra = require('../src/motor.js');
const A = require('../src/argos.js');
const E = require('../src/ejercicios.js');
const M = globalThis.Palestra;
const n = f => ({t: 'n', f}), mas = {t: '+'}, menos = {t: '-'};

test('la resolución bien hecha, como en el cuaderno', () => {
  const tok = [n(-3), mas, n(5), menos, n(-2), mas, {t: 'p', k: 3, pre: true}, {t: '('}, n(-2), mas, n(1), {t: ')'}];
  assert.deepEqual(A.resolucion(tok).map(A.texto),
    ['−3 + 5 = +2', '+2 − (−2) = +4', '3·(−2 + 1) = −3', '+4 + (−3) = +1']);
});

test('restar un negativo mal hecho: el primer fallo y lo de después arrastrado', () => {
  let s = 0; A.conAzar(() => [0, 0][s++] ?? 0);      // la primera candidata, el primer fallo
  const tok = [n(4), menos, n(-2), mas, n(3)];
  const r = A.conFallo(tok);
  assert.equal(r.malo, 0);
  assert.deepEqual(r.lineas, ['+4 − (−2) = +2', '+2 + 3 = +5']);
  assert.deepEqual(r.bien, ['+4 − (−2) = +6', '+6 + 3 = +9']);
  assert.match(r.por, /restar un negativo/);
});

test('con cuentas de las misiones: siempre hay un solo primer fallo y el final no cuadra', () => {
  let semilla = 7;
  const az = () => { semilla = (semilla * 9301 + 49297) % 233280; return semilla / 233280; };
  E.conAzar(az); A.conAzar(az);
  let hechas = 0;
  for(let i = 0; i < 300; i++){
    const ej = E.genera([1, 2, 4, 5][i % 4]);
    const r = A.conFallo(ej.tok);
    if(!r) continue;
    hechas++;
    assert.equal(r.lineas.length, r.bien.length);
    r.lineas.forEach((l, k) => { if(k < r.malo) assert.equal(l, r.bien[k], 'antes del fallo, todo bien'); });
    assert.notEqual(r.lineas[r.malo], r.bien[r.malo], 'la línea del fallo está mal');
    /* la última línea de la buena da el valor de la cuenta */
    const fin = r.bien[r.bien.length - 1].split('= ').pop();
    assert.equal(fin, M.conSigno(ej.valor), M.escribe(M.analiza(ej.tok)));
  }
  assert.ok(hechas > 150, 'la mayoría de las cuentas dan para un ojo de Argos: ' + hechas);
});

test('ningún fallo absurdo: con los dos tirando al mismo lado, el signo no se equivoca', () => {
  let semilla = 11;
  const az = () => { semilla = (semilla * 9301 + 49297) % 233280; return semilla / 233280; };
  E.conAzar(az); A.conAzar(az);
  for(let i = 0; i < 300; i++){
    const r = A.conFallo(E.genera([1, 2, 4, 5][i % 4]).tok);
    if(!r || !/signo del resultado|sumar las fuerzas/.test(r.por)) continue;
    const m = /^([+−]\d+) ([+−]) (\(?[+−]?\d+\)?)/.exec(r.bien[r.malo]);
    const a = Number(m[1].replace('−', '-')), b = Number(m[3].replace(/[()]/g, '').replace('−', '-'));
    const efec = m[2] === '−' ? -b : b;
    assert.notEqual(Math.sign(a), Math.sign(efec), r.bien[r.malo] + ' → ' + r.lineas[r.malo]);
  }
});
