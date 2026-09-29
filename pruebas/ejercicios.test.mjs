/* Pruebas de los ejercicios: node --test pruebas/ */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
globalThis.Palestra = require('../src/motor.js');
const E = require('../src/ejercicios.js');
const M = globalThis.Palestra;

/* un azar de mentira, que recorre la unidad a saltos: así se prueban muchas variantes sin repetir */
let semilla = 1;
E.conAzar(() => { semilla = (semilla * 9301 + 49297) % 233280; return semilla / 233280; });

test('cada nivel genera cuentas con teatro, enteras y del nivel que toca', () => {
  for(let nivel = 0; nivel <= 5; nivel++){
    for(let i = 0; i < 40; i++){
      const ej = E.genera(nivel);
      assert.ok(!ej.pel.sinTeatro, 'nivel ' + nivel + ': ' + M.escribe(ej.pel.arbol) + ' → ' + ej.pel.sinTeatro);
      assert.ok(Number.isInteger(ej.valor));
      assert.equal(ej.valor, ej.pel.valor);
      assert.ok(ej.pel.pasos.length >= 2);
      const nivelMotor = M.nivelCuenta(ej.pel.arbol);
      if(nivel === 0 || nivel === 1) assert.equal(nivelMotor, 0, M.escribe(ej.pel.arbol));
      if(nivel === 2 || nivel === 4) assert.equal(nivelMotor, 1, M.escribe(ej.pel.arbol));
      if(nivel === 3) assert.equal(nivelMotor, 2, M.escribe(ej.pel.arbol));
    }
  }
});

test('en «Alguien se retira» hay restas, y en «Pociones» siempre hay un frasco', () => {
  let restas = 0, frascos = 0;
  for(let i = 0; i < 30; i++){
    if(E.genera(1).tok.some(t => t.t === '-')) restas++;
    if(E.genera(2).tok.some(t => t.t === 'p')) frascos++;
  }
  assert.equal(restas, 30); assert.equal(frascos, 30);
});

test('la ruta avanza con la meta y se acaba en la última misión', () => {
  const r = E.nuevaRuta();
  assert.equal(r.i, 0);
  const meta = E.MISIONES[0].meta;
  for(let k = 1; k < meta; k++) assert.equal(E.acierta(r), false);
  assert.equal(E.acierta(r), true, 'con la meta se cumple');
  assert.equal(E.acierta(r), false, 'y no se cumple dos veces');
  assert.equal(r.hechas, meta);
  assert.ok(E.siguiente(r)); assert.equal(r.i, 1); assert.equal(r.hechas, 0);
  while(E.siguiente(r));
  assert.equal(r.i, E.MISIONES.length - 1);
});

test('el acta cuenta aciertos y fallos por misión', () => {
  const s = E.nuevaSesion(); s.t0 = 1000; s.nombre = 'Ana';
  const r = E.nuevaRuta();
  E.anota(s, r, true); E.anota(s, r, false); E.anota(s, r, false);
  E.siguiente(r); E.anota(s, r, true);
  const t = E.actaEnTexto(s, 1000 + 125000);
  assert.match(t, /Nombre: Ana/);
  assert.match(t, /Tiempo: 2 min 05 s/);
  assert.match(t, /Resueltas: 2   Falladas: 2   Acierto: 50%/);
  assert.match(t, /1\. Entra gente — 1 de 3  \(floja\)/);
  assert.match(t, /2\. Alguien se retira — 1 de 1\n/);
});

test('el acta lleva el detalle, ejercicio a ejercicio', () => {
  const s = E.nuevaSesion(); s.t0 = new Date(2026, 8, 28, 9, 40).getTime();
  const r = E.nuevaRuta(), t = s.t0 + 60000;
  /* el primero, a la primera y sin mirar */
  E.anota(s, r, true, {id: 1, cuenta: '−2 + 5', dicho: 3, valor: 3, visto: false}, t);
  /* el segundo: dos fallos, mira el campo y acierta */
  E.anota(s, r, false, {id: 2, cuenta: '2 − 5', dicho: 3, valor: -3, visto: false}, t);
  E.anota(s, r, false, {id: 2, cuenta: '2 − 5', dicho: 7, valor: -3, visto: true}, t);
  E.anota(s, r, true, {id: 2, cuenta: '2 − 5', dicho: -3, valor: -3, visto: true}, t);
  /* el tercero se queda sin resolver */
  E.anota(s, r, false, {id: 3, cuenta: '4 + (−1)', dicho: 5, valor: 3, visto: false}, t);
  assert.equal(s.ejercicios.length, 3);
  assert.deepEqual(s.ejercicios[1].d, [3, 7, -3]);
  assert.equal(s.mision[0].solas, 1, 'solo el primero sale sin mirar');
  const txt = E.actaEnTexto(s, s.t0 + 300000, r);
  assert.match(txt, /Ruta: misión 1 de 7 \(Entra gente\)/);
  assert.match(txt, /1\. Entra gente — 2 de 5, 1 sin mirar  \(floja\)/);
  assert.match(txt, /09:41  M1  −2 \+ 5 = \+3 · bien a la primera, sin mirar/);
  assert.match(txt, /M1  2 − 5 = −3 · bien tras 2 fallos \(\+3, \+7\), mirando el campo/);
  assert.match(txt, /M1  4 \+ \(−1\) = \+3 · sin resolver \(\+5\)/);
});

test('el turno se guarda, se lee y caduca a los 90 minutos', () => {
  const alm = new Map(); const st = {getItem: k => alm.get(k) ?? null, setItem: (k, v) => alm.set(k, v), removeItem: k => alm.delete(k)};
  const r = E.nuevaRuta(); r.i = 2; r.hechas = 3;
  const s = E.nuevaSesion(); s.t0 = 5000;
  E.guarda(r, s, st);
  const d = E.lee(st, 5000 + 60 * 60 * 1000);
  assert.equal(d.ruta.i, 2); assert.equal(d.ruta.hechas, 3);
  assert.equal(E.lee(st, 5000 + 91 * 60 * 1000), null, 'caducado');
  assert.equal(alm.size, 0, 'y borrado');
});
