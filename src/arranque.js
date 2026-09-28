/* ══════════════════════════════════════════════════════════════════════
   LA PALESTRA · la escena de inicio
   La app en pequeño, como en Las piezas de Miut: entra un −3 y tira a la
   izquierda; entra un +5, tira más fuerte a la derecha, y la bandera acaba
   en +2. Debajo se va escribiendo la cuenta, −3 + 5 = +2, y sale el
   nombre. Unos cuatro segundos; se salta tocando, o con Intro, espacio o
   Esc. Solo al abrir la app, no al recargar en la misma sesión (eso, y
   «Sin animación» y «menos movimiento», lo decide la cabecera).
   No hay dibujo propio: el campo es el de verdad y las fotos, del motor.
   ══════════════════════════════════════════════════════════════════════ */
(function (raiz) {
'use strict';
const P = raiz.Palestra, C = raiz.Campo, TL = raiz.Tablilla;
const CUENTA = [{t: 'n', f: -3}, {t: '+'}, {t: 'n', f: 5}];
const VISTA = 'palestra.inicio';

function escena(el, alAcabar){
  try{ raiz.sessionStorage.setItem(VISTA, 'visto'); }catch(err){}
  const h = document.documentElement;
  h.dataset.inicio = 'si';
  el.hidden = false;
  const campo = el.querySelector('.inCampo'), cuenta = el.querySelector('.inCuenta'), titulo = el.querySelector('.inTitulo');
  C.monta(campo);
  const pel = P.graba(CUENTA), alcance = 6;
  C.pinta(campo, {cuerda: [], banquillo: [], bandera: 0}, {alcance});

  const ts = [];
  let hecho = false;
  const luego = (ms, fn) => ts.push(setTimeout(fn, ms));
  function fin(){
    if(hecho) return;
    hecho = true;
    ts.forEach(clearTimeout);
    removeEventListener('keydown', tecla, true);
    /* primero se va la escena; luego aparece la página */
    el.classList.add('fuera');
    setTimeout(() => {
      el.hidden = true; delete h.dataset.inicio;
      const m = document.querySelector('main');
      if(m && m.animate) m.animate([{opacity: 0}, {opacity: 1}], {duration: 350, easing: 'ease-out'});
      if(alAcabar) alAcabar();
    }, 480);
  }
  /* mientras dura, las teclas no llegan a la tablilla */
  function tecla(ev){
    ev.stopPropagation();
    if(['Enter', ' ', 'Escape'].includes(ev.key)){ ev.preventDefault(); fin(); }
  }
  el.addEventListener('click', fin);
  addEventListener('keydown', tecla, true);

  /* la cuenta de abajo, con el trozo que se juega iluminado */
  const escribe = (hasta, on, igual) => {
    cuenta.innerHTML = TL.htmlCuenta(CUENTA.slice(0, hasta), i => i === on ? 'ct-on' : '') +
      (igual ? ' <span class="op">=</span> <b class="inRes">' + P.conSigno(pel.valor) + '</b>' : '');
  };
  const tiron = () => { campo.classList.remove('tiron'); void campo.offsetWidth; campo.classList.add('tiron'); };
  const entra = k => { const p = pel.pasos[k]; C.pinta(campo, p, {alcance, nuevos: [p.cuerda[p.cuerda.length - 1].id]}); };

  luego(650, () => { entra(0); escribe(1, 0); });
  luego(1750, () => { entra(1); escribe(3, 2); tiron(); });
  luego(2750, () => escribe(3, -1, true));
  luego(3150, () => titulo.classList.add('ve'));
  luego(4650, fin);
}

raiz.Arranque = {escena};
})(window);
