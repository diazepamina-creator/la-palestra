/* Pruebas del motor: node --test pruebas/ */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const M = createRequire(import.meta.url)('../src/motor.js');

/* una cuenta escrita en corto: n(−2) p(3) pre(3) e(2) + - ( ) */
const T = {
  n: f => ({t: 'n', f}), mas: {t: '+'}, menos: {t: '-'}, ab: {t: '('}, ci: {t: ')'},
  p: k => ({t: 'p', k, pre: false}), pre: k => ({t: 'p', k, pre: true}), e: n => ({t: 'e', n})
};
const banderas = pel => pel.pasos.map(p => p.bandera);
const tipos = pel => pel.pasos.map(p => p.tipo);

test('2 + 4·(−2): el 4 se prepara en el banquillo y sale hecho', () => {
  const pel = M.graba([T.n(2), T.mas, T.n(4), T.p(-2)]);
  assert.equal(pel.valor, -6);
  assert.equal(pel.nivel, 1);
  assert.deepEqual(tipos(pel), ['entra', 'entra', 'bebe', 'sale']);
  assert.deepEqual(banderas(pel), [2, 2, 2, -6]);
  assert.deepEqual(pel.pasos[1].banquillo.map(p => p.f), [4]);
  assert.deepEqual(pel.pasos[2].banquillo.map(p => p.f), [-8]);
  assert.equal(pel.pasos[3].banquillo.length, 0);
  assert.equal(pel.pasos[3].cuerda[1].venia, 'der', 'sale con los pantalones del bando de antes');
  assert.deepEqual(pel.pasos.map(p => p.clave), [false, false, false, true]);
  assert.equal(pel.pasos[2].x, '(+4)·(−2) = −8');
  assert.equal(pel.pasos[3].x, 'sale a tirar el −8');
});

test('3 − (−4)·(−2): la bandera va 3 → −5 sin pasar por −1 ni 11', () => {
  const pel = M.graba([T.n(3), T.menos, T.n(-4), T.p(-2)]);
  assert.equal(pel.valor, -5);
  assert.deepEqual(banderas(pel), [3, 3, 3, 3, -5]);
  assert.deepEqual(tipos(pel), ['entra', 'entra', 'bebe', 'bebe', 'sale']);
  assert.equal(pel.pasos[3].x, 'el menos: cambia de bando');
  assert.ok(!banderas(pel).includes(-1) && !banderas(pel).includes(11));
});

test('(−1)·(−2 + (−3) + (−1)): nivel 2, el paréntesis se reduce antes de beber', () => {
  const pel = M.graba([T.pre(-1), T.ab, T.n(-2), T.mas, T.n(-3), T.mas, T.n(-1), T.ci]);
  assert.equal(pel.nivel, 2);
  assert.equal(pel.valor, 6);
  assert.deepEqual(tipos(pel), ['entra', 'entra', 'entra', 'junta', 'bebe', 'sale']);
  assert.deepEqual(banderas(pel), [0, 0, 0, 0, 0, 6]);
  assert.equal(pel.pasos[3].x, 'el paréntesis vale −6');
  assert.deepEqual(pel.pasos[3].banquillo.map(p => p.f), [-6]);
  assert.equal(pel.pasos[4].x, '(−6)·(−1) = +6');
});

test('−2 + 3·(−2 + 1) = −5', () => {
  const pel = M.graba([T.n(-2), T.mas, T.pre(3), T.ab, T.n(-2), T.mas, T.n(1), T.ci]);
  assert.equal(pel.valor, -5);
  assert.deepEqual(banderas(pel), [-2, -2, -2, -2, -2, -5]);
});

test('4 − (3 − 5): dentro del banquillo también se resta con pareja nula', () => {
  const pel = M.graba([T.n(4), T.menos, T.ab, T.n(3), T.menos, T.n(5), T.ci]);
  assert.equal(pel.valor, 6);
  assert.deepEqual(tipos(pel), ['entra', 'entra', 'pareja', 'retira', 'junta', 'bebe', 'sale']);
  assert.deepEqual(banderas(pel), [4, 4, 4, 4, 4, 4, 6]);
  assert.equal(pel.pasos[4].x, 'el paréntesis vale −2');
});

test('(2 + (−2))·3: el paréntesis vale 0 y no sale nadie', () => {
  const pel = M.graba([T.ab, T.n(2), T.mas, T.n(-2), T.ci, T.p(3)]);
  assert.equal(pel.valor, 0);
  assert.equal(pel.pasos.at(-1).x, 'vale 0: no sale nadie');
  assert.equal(pel.pasos.at(-1).cuerda.length, 0);
});

test('(−3)² = 9 y −2³ = −8', () => {
  const a = M.graba([T.n(-3), T.e(2)]);
  assert.equal(a.valor, 9);
  assert.deepEqual(tipos(a), ['entra', 'bebe', 'sale']);
  assert.equal(a.pasos[1].x, '(−3)·(−3) = +9');
  const b = M.graba([T.menos, T.n(2), T.e(3)]);
  assert.equal(b.valor, -8);
  assert.deepEqual(tipos(b), ['entra', 'bebe', 'bebe', 'bebe', 'sale']);
});

test('2 − 5 en la cuerda: pareja nula y retirada, y se pregunta al retirar', () => {
  const pel = M.graba([T.n(2), T.menos, T.n(5)]);
  assert.equal(pel.valor, -3);
  assert.deepEqual(tipos(pel), ['entra', 'pareja', 'retira']);
  assert.deepEqual(banderas(pel), [2, 2, -3]);
  assert.deepEqual(pel.pasos.map(p => p.clave), [false, false, true]);
});

test('1 + 2 + (−3): las sumas sueltas van directas a la cuerda, sin banquillo', () => {
  const pel = M.graba([T.n(1), T.mas, T.n(2), T.mas, T.n(-3)]);
  assert.equal(pel.nivel, 0);
  assert.ok(pel.pasos.every(p => p.banquillo.length === 0));
  assert.deepEqual(banderas(pel), [1, 3, 0]);
});

test('2·(1 + 3·(−1)): nivel 3, sin teatro pero con resultado exacto', () => {
  const pel = M.graba([T.pre(2), T.ab, T.n(1), T.mas, T.pre(3), T.n(-1), T.ci]);
  assert.equal(pel.nivel, 3);
  assert.equal(pel.pasos.length, 0);
  assert.equal(pel.valor, -4);
  assert.match(pel.sinTeatro, /demasiados niveles/);
});

test('1:2: no cabe con fuerzas enteras, pero la cuenta exacta da 1/2', () => {
  const pel = M.graba([T.n(1), T.p(1/2)]);
  assert.equal(pel.pasos.length, 0);
  assert.equal(pel.valor, null);
  assert.equal(M.fracTxt(pel.exacto), '1/2');
  assert.match(pel.sinTeatro, /no se puede repartir/);
});

test('la cuerda tiene límites: seis por un lado no caben, y la bandera no pasa de ±12', () => {
  const seis = [T.n(3)]; for(let i = 0; i < 5; i++) seis.push(T.mas, T.n(1));
  assert.match(M.graba(seis).sinTeatro, /cinco como mucho/);
  assert.match(M.graba([T.n(5), T.mas, T.n(5), T.mas, T.n(5)]).sinTeatro, /se saldría de la regla/);
  assert.equal(M.graba([T.n(5), T.mas, T.n(5), T.mas, T.n(5)]).valor, 15);
});

test('el banquillo no tiene límites: (3 + 3 + 3 + 3 + 3 + 3):3 = 6', () => {
  const t = [T.ab, T.n(3)]; for(let i = 0; i < 5; i++) t.push(T.mas, T.n(3)); t.push(T.ci, T.p(1/3));
  const pel = M.graba(t);
  assert.equal(pel.valor, 6);
  assert.equal(pel.pasos.length, 6 + 1 + 1 + 1);
});

test('el analizador avisa de las cuentas mal escritas', () => {
  assert.throws(() => M.analiza([]), /Todavía no/);
  assert.throws(() => M.analiza([T.n(2), T.mas]), /a medias/);
  assert.throws(() => M.analiza([T.ab, T.n(2)]), /Falta cerrar/);
  assert.throws(() => M.analiza([T.n(2), T.ci]), /no se abrió/);
  assert.throws(() => M.analiza([T.mas, T.n(2)]), /falta un tirador/);
});

test('la cuenta se escribe como en el cuaderno', () => {
  const esc = t => M.escribe(M.analiza(t));
  assert.equal(esc([T.n(-2), T.mas, T.pre(3), T.ab, T.n(-2), T.mas, T.n(1), T.ci]), '−2 + 3·(−2 + 1)');
  assert.equal(esc([T.n(3), T.menos, T.n(-4), T.p(-2)]), '3 − (−4)·(−2)');
  assert.equal(esc([T.n(-3), T.e(2)]), '(−3)²');
  assert.equal(esc([T.menos, T.n(2), T.e(3)]), '−2³');
  assert.equal(esc([T.n(1), T.p(1/2), T.mas, T.n(2)]), '1:2 + 2');
});

test('la cartela sabe qué trozo iluminar en cada paso', () => {
  const pel = M.graba([T.n(2), T.mas, T.n(4), T.p(-2)]);
  assert.deepEqual(pel.pasos[0].m, [0]);         // el 2
  assert.deepEqual(pel.pasos[1].m, [2]);         // el 4
  assert.deepEqual(pel.pasos[2].m, [2, 3]);      // 4·(−2)
  assert.deepEqual(pel.pasos[3].m, [1, 2, 3]);   // + 4·(−2)
});
