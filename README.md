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
- `pruebas/motor.test.mjs` — las pruebas del motor: `node --test pruebas/motor.test.mjs`.
- `tirador.js` — el dibujo del tirador en SVG (viene tal cual de El pulso de los dioses).
- `campo.js` y `src/campo.css` — el campo: pinta una foto del motor (cuerda, regla, bandera). Sin animación.
- `index.html` — la página. Por ahora, un visor de fotogramas quietos sobre cuentas de muestra.

## Pasos

1. ✅ El estado y el intérprete.
2. ✅ El campo quieto: tiradores, regla y bandera dibujados desde el estado.
3. La tablilla: teclas de barro, escribir la cuenta y el cálculo exacto.
4. El reproductor de fotogramas, con el banquillo.
5. Predicción y cartela.
6. Personajes y pociones.
7. Ejercicios y ruta.
8. Entrevistas.
