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

La app es **un solo `index.html`**, como las demás: se genera con `node construye.mjs` a partir de `src/`. Se edita `src/`, no `index.html`.

- `src/pagina.html` — la página: la ruta, la tablilla, el campo, el acta y las entrevistas, con los enlaces a los módulos.
- `src/motor.js` — el estado del campo (`Campo`), el analizador de la cuenta (`analiza`), el intérprete (`juega`) y el grabador de fotogramas (`graba`). No dibuja nada; vale en el navegador y en Node.
- `src/tirador.js` — el dibujo del tirador en SVG (de El pulso de los dioses).
- `src/campo.js` y `src/campo.css` — el campo: pinta una foto del motor (cuerda, regla, bandera).
- `src/tablilla.js` y `src/tablilla.css` — la tablilla: las teclas de barro, qué pieza puede ir tras cuál (`pulsa`) y la cuenta escrita (`htmlCuenta`).
- `src/reproductor.js` y `src/banquillo.css` — el reproductor: la foto k al instante y el paso k+1 animado; la predicción antes de los pasos clave; ▶▶.
- `src/cartela.css` — la cartela: la cuenta iluminada encima del campo.
- `src/personajes.js`, `src/zeus.js` y `src/personajes.css` — Jeferión, Listillón y Zeus, las caras que hablan y el rayo.
- `src/ejercicios.js` — las seis misiones, el generador de cuentas comprobado con el motor, el acta y el turno guardado.
- `src/entrevistas.js` y `src/entrevistas.css` — las entrevistas.
- `pruebas/` — `node --test pruebas/motor.test.mjs pruebas/ejercicios.test.mjs pruebas/construccion.test.mjs`. La última comprueba que `index.html` está al día.
- `construye.mjs` — funde `src/` en `index.html`.

## Pasos

1. ✅ El estado y el intérprete.
2. ✅ El campo quieto: tiradores, regla y bandera dibujados desde el estado.
3. ✅ La tablilla: teclas de barro, escribir la cuenta y el cálculo exacto.
4. ✅ El reproductor de fotogramas, con el banquillo.
5. ✅ Predicción y cartela.
6. ✅ Personajes: Zeus y el rayo, Listillón en la tablilla, Jeferión en el campo.
7. ✅ Ejercicios y ruta: seis misiones, el acta y el turno guardado.
8. ✅ Entrevistas.
9. ✅ Fundirlo todo en un solo HTML, como las demás apps.
