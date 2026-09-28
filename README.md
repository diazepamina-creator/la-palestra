# La palestra

El tira y afloja de los números enteros, rehecho desde cero a partir de lo aprendido con *El pulso de los dioses*. Un manipulativo de una sola página para el aula, publicado con GitHub Pages.

## Las reglas

- **Lo que tira en la cuerda es lo que suma.** La bandera nunca se congela ni pasa por números que no están en la cuenta.
- **Un término compuesto se prepara en el banquillo y sale a tirar hecho.** Nivel 1: un jugador solo. Nivel 2: un paréntesis de sumas, que primero se reduce a uno y luego bebe. Nivel 3 o más: sin teatro, resultado exacto.
- **El signo va dentro del tirador; `+` y `−` son acciones:** «que entre» y «que se retire».
- **El alumno pasa los fotogramas.** ◀ ▶, predicción antes del paso que mueve la bandera, ▶▶ solo para repasar.
- **Poco texto y sin reordenar la cuenta.**
- **Nada que parpadee.**

## Ficheros

- `motor.js` — el estado del campo (`Campo`), el analizador de la cuenta (`analiza`), el intérprete (`juega`) y el grabador de fotogramas (`graba`). No dibuja nada; vale en el navegador y en Node.
- `pruebas/motor.test.mjs` — las pruebas del motor: `node --test pruebas/motor.test.mjs pruebas/ejercicios.test.mjs`.
- `tirador.js` — el dibujo del tirador en SVG (viene tal cual de El pulso de los dioses).
- `campo.js` y `src/campo.css` — el campo: pinta una foto del motor (cuerda, regla, bandera). Sin animación.
- `tablilla.js` y `src/tablilla.css` — la tablilla: las teclas de barro, qué pieza puede ir tras cuál (`pulsa`, función pura) y la cuenta escrita con colores (`htmlCuenta`).
- `reproductor.js` y `src/banquillo.css` — el reproductor: enseña la foto k al instante y, al avanzar, anima solo el paso que toca (llegar, beber en el banquillo, juntarse, salir a tirar, retirarse). ▶▶ repasa de un tirón.
- `personajes.js` y `src/personajes.css` — Jeferión, Listillón y Zeus dibujados por código (de El pulso de los dioses), las caras que hablan según el aviso y el rayo.
- `zeus.js` — los efectos del rayo cuando alguien se retira: Zeus se asoma, lanza, trueno, chamusca y humo. Solo efectos: el estado ya lo decide el motor.
- `ejercicios.js` y `pruebas/ejercicios.test.mjs` — los ejercicios y la ruta: seis misiones por niveles, el generador de cuentas comprobado con el motor, el acta de la jornada y el turno guardado 90 minutos.
- `src/cartela.css` — la cartela: la cuenta encima del campo con el trozo que se juega iluminado, la pregunta y el veredicto.
- `index.html` — la página: arranca en la ruta (la cuenta escrita, «¿dónde acaba la bandera?», ▶ Verlo en el campo); en modo libre la tablilla escribe la cuenta, `=` la graba con el motor y el reproductor la pasa con ◀ ▶ ⟲ ▶▶. Antes de un paso clave pregunta dónde acabará la bandera.

## Pasos

1. ✅ El estado y el intérprete.
2. ✅ El campo quieto: tiradores, regla y bandera dibujados desde el estado.
3. ✅ La tablilla: teclas de barro, escribir la cuenta y el cálculo exacto.
4. ✅ El reproductor de fotogramas, con el banquillo.
5. ✅ Predicción y cartela.
6. ✅ Personajes: Zeus y el rayo, Listillón en la tablilla, Jeferión en el campo.
7. ✅ Ejercicios y ruta: seis misiones, el acta y el turno guardado.
8. Entrevistas.
