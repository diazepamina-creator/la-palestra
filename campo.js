/* ══════════════════════════════════════════════════════════════════════
   LA PALESTRA · el campo
   Dibuja una foto del motor: la cuerda con sus equipos, la regla y la
   bandera. No sabe nada de la cuenta ni de los pasos: le das una foto
   {cuerda, banquillo, bandera} y la pinta. Sin animación: eso es del
   reproductor, que vendrá después.
   ══════════════════════════════════════════════════════════════════════ */
(function (raiz) {
'use strict';
const T = raiz.Tirador;

const PLANTILLA =
  '<div class="escena">' +
    '<div class="friso" aria-hidden="true"></div>' +
    '<div class="columnata" aria-hidden="true"></div>' +
    '<div class="equipo izq"></div>' +
    '<div class="equipo der"></div>' +
    '<div class="marca"></div>' +
    '<div class="cuerda"></div>' +
    '<svg class="cuerdaFloja" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">' +
      '<defs><linearGradient id="gFloja" gradientUnits="userSpaceOnUse" x1="0" y1="17" x2="0" y2="24">' +
      '<stop offset="0" stop-color="#c2a86a"/><stop offset=".55" stop-color="#8a7442"/>' +
      '<stop offset="1" stop-color="#5e4e2c"/></linearGradient></defs>' +
      '<path d="M0 20.5 Q50 28.5 100 20.5"/></svg>' +
    '<div class="regla"></div>' +
    '<div class="nudo sin"><span class="tela"></span><span class="cifra">?</span></div>' +
  '</div>';

const PANDEO = 4;   // cuánto cuelga la bandera cuando nadie tira

/* prepara el campo dentro de un elemento vacío */
function monta(el){
  el.classList.add('campo');
  el.innerHTML = PLANTILLA;
  return el;
}

/* cuánto mide un paso de la regla para que quepa entera */
function pasoQueCabe(ancho, alcance){
  const p = Math.floor((ancho / 2 - 16) / (alcance + 1.4));
  return Math.max(15, Math.min(24, p));
}

function pintaRegla(regla, alcance, paso, bandera, hayGente, opciones){
  let h = '';
  for(let v = -alcance; v <= alcance; v++){
    const clase = (v === 0 ? ' cero' : '') + (hayGente && v === bandera ? ' aqui' : '') +
      (opciones.pin === v ? ' pronostico' : '') + (v % 2 === 0 ? ' par' : ' impar');
    h += '<span class="marca-n' + clase + '" data-v="' + v + '" style="left:calc(50% + ' + (v * paso) + 'px)"><i></i>' + v + '</span>';
  }
  regla.innerHTML = h;
  regla.style.setProperty('--paso', paso + 'px');
  regla.classList.toggle('ancha', paso >= 19);
  regla.classList.toggle('estrecha', paso < 18 || alcance > 8);
  /* «viva»: se puede tocar para decir dónde acabará la bandera */
  regla.classList.toggle('viva', !!opciones.viva);
}

/* pinta la foto. opciones: {alcance} para que la regla no cambie de tamaño
   a mitad de una película; {nuevos: [ids]} los que acaban de llegar;
   {viva} la regla se puede tocar; {pin} el número que dijo el alumno */
function pinta(el, foto, opciones){
  opciones = opciones || {};
  const cuerda = foto.cuerda || [], bandera = foto.bandera || 0;
  const alcance = Math.max(8, Math.min(12, opciones.alcance || Math.ceil(Math.abs(bandera))));
  const anchoCampo = el.clientWidth || 470;
  const paso = pasoQueCabe(anchoCampo, alcance);
  const hayGente = cuerda.length > 0;

  /* los tiradores: cuanta más fuerza, más grandes, y con la misma escala
     para todos los que están en el campo */
  const maxF = Math.max(1, ...cuerda.map(p => Math.abs(p.f)));
  const U = Math.min(27, 104 / (1 + 0.34 * Math.log(maxF)));
  const izq = el.querySelector('.equipo.izq'), der = el.querySelector('.equipo.der');
  izq.innerHTML = ''; der.innerHTML = '';
  const nuevos = opciones.nuevos || [];
  cuerda.forEach(p => {
    const d = document.createElement('div');
    d.className = 'tirador ' + (p.f < 0 ? 'izq' : 'der') + (p.venia ? ' venia-' + p.venia : '') +
      (Math.abs(p.f) === maxF && maxF > 1 ? ' laureado' : '') + (nuevos.indexOf(p.id) >= 0 ? ' nuevo' : '');
    d.dataset.id = p.id;
    d.setAttribute('aria-label', 'Tirador de fuerza ' + Math.abs(p.f) + ' del lado ' + (p.f < 0 ? 'izquierdo' : 'derecho'));
    d.innerHTML = T.dibujaTirador(p, U);
    (p.f < 0 ? izq : der).appendChild(d);
  });

  /* la bandera se desplaza con la suma; los equipos, con ella */
  const arrastre = hayGente ? Math.max(-alcance * paso, Math.min(alcance * paso, bandera * paso)) : 0;
  el.style.setProperty('--arrastre', arrastre + 'px');

  /* la cámara: si los equipos no caben, la escena entera se encoge */
  const anchoDe = f => T.medidasDe(Math.abs(f), U).w + 3;
  const anchoLado = neg => cuerda.filter(p => (p.f < 0) === neg).reduce((a, p) => a + anchoDe(p.f), 0);
  const bordeIzq = Math.min(-anchoLado(true) + arrastre, -(alcance + 1.4) * paso);
  const bordeDer = Math.max(anchoLado(false) + arrastre, (alcance + 1.4) * paso);
  const zoom = Math.max(0.45, Math.floor(Math.min(1, anchoCampo / (bordeDer - bordeIzq + 26)) * 20) / 20);
  const pan = Math.round((-(bordeIzq + bordeDer) / 2) * zoom / 4) * 4;
  const esc = el.querySelector('.escena');
  esc.style.width = (100 / zoom).toFixed(2) + '%';
  esc.style.transform = 'translateX(calc(-50% + ' + pan + 'px)) scale(' + zoom.toFixed(3) + ')';
  [izq, der].forEach(e => {
    e.style.transform = 'translateX(var(--arrastre,0px))';
    e.style.transformOrigin = (e === izq ? 'right' : 'left') + ' bottom';
  });

  const nudo = el.querySelector('.nudo');
  nudo.style.transform = 'translate(' + arrastre + 'px, ' + (hayGente ? 0 : PANDEO) + 'px)';
  nudo.classList.toggle('sin', !hayGente);
  nudo.classList.toggle('haciaIzq', hayGente && bandera < 0);
  nudo.querySelector('.cifra').textContent = bandera === 0 ? '0' : T.conSigno(bandera);
  el.classList.toggle('tensa', hayGente);
  pintaRegla(el.querySelector('.regla'), alcance, paso, bandera, hayGente, opciones);
  return {paso, zoom, alcance};
}
/* quién se entera de que se toca la regla (recibe el número tocado) */
function alTocarRegla(el, fn){
  el.querySelector('.regla').addEventListener('click', ev => {
    const m = ev.target.closest('.marca-n');
    if(m && el.querySelector('.regla').classList.contains('viva')) fn(parseInt(m.dataset.v, 10));
  });
}

raiz.Campo = {monta, pinta, pasoQueCabe, alTocarRegla};
})(window);
