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
- `src/campo.js` y `src/campo.css` — el campo: pinta una foto del motor (cuerda, regla, bandera). Arriba, el Olimpo: una franja de cielo donde Zeus se asoma apoyado en el friso sin tapar el campo; el friso, las columnas y el suelo se quedan quietos y solo la escena se aleja con la cámara.
- `src/tablilla.js` y `src/tablilla.css` — la tablilla: la TABLI·CAS·IO de Listillón, de arcilla y de broma con hechura de calculadora científica (pantalla de barro alisado, teclas de función de barro claro, las de número con barniz negro, DEL y AC en ocre); qué pieza puede ir tras cuál (`pulsa`) y la cuenta escrita (`htmlCuenta`).
- `src/reproductor.js` y `src/banquillo.css` — el reproductor: la foto k al instante y el paso k+1 animado; la predicción antes de los pasos clave; ▶▶.
- `src/cartela.css` — la cartela: la cuenta iluminada encima del campo.
- `src/personajes.js`, `src/zeus.js` y `src/personajes.css` — Jeferión, Listillón y Zeus, las caras que hablan y el rayo.
- `src/ejercicios.js` — las nueve misiones (entre ellas «Fuerza y bando», con `generaCanon`, y «Escríbelo», del campo a la cuenta, con `comparaEscrito`), el generador de cuentas comprobado con el motor, el acta y el turno guardado.
- `src/entrevistas.js` y `src/entrevistas.css` — las entrevistas.
- `src/argos.js` — el ojo de Argos: la resolución de Listillón, paso a paso como en el cuaderno, con un fallo de los de verdad (restar o sumar un negativo, sumar las fuerzas que tiran en contra, el signo de un producto o una potencia); hay que tocar la primera línea mal.
- `src/piel.css` — la piel: la disposición de Las piezas de Miut (la cabecera con pestañas, las hojas, los botones, las cajas de lo que dicen Listillón y Jeferión, el acta y el pie) sobre la arena rastrillada de la palestra, de día o de noche, o el papel del proyector. La letra: Cinzel en los rótulos y Alegreya Sans para leer; las cuentas, en Space Mono.
- `src/ajustes.css` — el campo a la luz del día (arena de día y proyector) y el modo aula para la pizarra digital (la lógica de los ajustes va en `src/pagina.html`).
- `src/arranque.js` y `src/arranque.css` — la escena de inicio, como en Las piezas de Miut: −3 + 5 = +2 jugado en el campo de verdad y el nombre. Solo al abrir la app; se salta tocando y se quita en Ajustes.
- `src/sonido.js` — el sonido, sintetizado con Web Audio (sin archivos): el graderío al tirar, el rugido de Jeferión al acertar, el graznido de Listillón al fallar, el trueno de Zeus, el descorche y el trago de las pociones. Bajito, y se quita en Ajustes.
- `VERSION` — el número de versión; `construye.mjs` lo pone en la página.
- `pruebas/` — `node --test pruebas/*.test.mjs`: el motor, los ejercicios, la tablilla (escribir y editar con el cursor) y la construcción, que comprueba que `index.html` está al día.
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
10. ✅ Ajustes (colores, modo aula, velocidad, preguntas), empezar de cero y el acta ejercicio a ejercicio.
11. ✅ La escena de inicio.
12. ✅ La disposición de Las piezas de Miut (pestañas, hojas y botones) sobre la arena de la palestra.
13. ✅ La TABLI·CAS·IO: la tablilla de arcilla con hechura de calculadora, modelada a mano, con Listillón trazado con una ramita; cursor ◀ ▶ para editar y las pociones en × y ÷.
14. ✅ El ojo de Argos: encontrar el primer fallo (traído de El pulso de los dioses).
15. ✅ Escríbelo: ver lo que pasa en el campo y escribir la cuenta (traído de El pulso de los dioses).
16. ✅ Fuerza y bando: la fuerza sin signo y el orden en la regla (el canon de El pulso de los dioses).
17. ✅ El sonido, y la pata de Listillón sujetando su tablilla en la entrevista.
