/* ══════════════════════════════════════════════════════════════════════
   LA PALESTRA · Zeus y el rayo
   Cuando alguien se retira de la cuerda, Zeus se asoma por arriba, lanza
   el rayo y el tirador se va entre humo. Todo son efectos sobre el campo:
   no cambian el estado, que ya viene decidido por el motor.
   ══════════════════════════════════════════════════════════════════════ */
(function (raiz) {
'use strict';
const REDUCIDO = raiz.matchMedia && raiz.matchMedia('(prefers-reduced-motion: reduce)').matches;
/* las medidas, en píxeles del campo: el modo aula agranda la página con zoom
   y getBoundingClientRect las da ya agrandadas */
const rect = el => {
  const r = el.getBoundingClientRect(), k = parseFloat(getComputedStyle(document.body).zoom) || 1;
  if(k === 1) return r;
  return {left: r.left / k, right: r.right / k, top: r.top / k, bottom: r.bottom / k, width: r.width / k, height: r.height / k};
};
const varaDe = f => Math.max(0, Math.min(1, Math.log(Math.max(1, Math.abs(f))) / Math.log(12)));

/* Zeus se asoma encima del tirador (a un lado, para no taparlo) */
function asoma(campo, elT){
  const rc = rect(campo), rn = rect(elT);
  const cxV = rn.left + rn.width / 2 - rc.left;
  let cx = cxV - 72, zurdo = false;
  if(cx < 66){ cx = Math.min(rc.width - 66, cxV + 72); zurdo = true; }
  let z = campo.querySelector('.zeus');
  if(!z){
    z = document.createElement('div');
    z.className = 'zeus';
    z.innerHTML = raiz.Personajes.ZEUS_SVG;
    campo.appendChild(z);
  }
  z.classList.remove('disipa', 'sinCetro', 'resplandece', 'lanza');
  z.classList.toggle('zurdo', zurdo);
  z.style.left = cx.toFixed(0) + 'px';
  z.style.setProperty('--asomo', '-12px');
  requestAnimationFrame(() => z.classList.add('fuera'));
  return z;
}
function lanza(z){
  z.classList.add('lanza', 'resplandece');
  setTimeout(() => z.classList.remove('lanza'), 240);
}
function seVa(z){
  z.classList.remove('resplandece');
  z.classList.add('disipa');
  setTimeout(() => { z.classList.remove('fuera'); setTimeout(() => z.classList.remove('sinCetro', 'disipa'), 430); }, 560);
}
function trueno(campo, fza){
  campo.style.setProperty('--sac', (.55 + 1.15 * varaDe(fza)).toFixed(2));
  campo.classList.remove('trueno'); void campo.offsetWidth; campo.classList.add('trueno');
  setTimeout(() => campo.classList.remove('trueno'), 380);
}
function chamusca(campo, elT, fza){
  const rc = rect(campo), rn = rect(elT);
  const m = document.createElement('span');
  m.className = 'chamusca';
  m.style.left = (rn.left + rn.width / 2 - rc.left).toFixed(0) + 'px';
  m.style.bottom = Math.max(8, Math.round(rc.bottom - rn.bottom + 2)) + 'px';
  m.style.setProperty('--mn', (.7 + .75 * varaDe(fza)).toFixed(2));
  campo.appendChild(m);
  setTimeout(() => m.remove(), 4200);
}
function rayo(campo, elT, fza){
  const u = varaDe(fza);
  const rc = rect(campo), rn = rect(elT);
  const cx = rn.left + rn.width / 2 - rc.left;
  const cy = Math.max(12, rn.top - rc.top + 6);
  let sx = cx, sy = 12;
  const punoZ = campo.querySelector('.zeus.fuera .punoZ');
  if(punoZ){ const rz = rect(punoZ); sx = rz.left + rz.width / 2 - rc.left; sy = rz.top + rz.height - rc.top + 1; }
  let d = 'M' + sx.toFixed(0) + ' ' + sy.toFixed(0);
  const tramos = 4 + Math.round(3 * u), amplitud = 8 + 14 * u, dirV = cx >= sx ? 1 : -1;
  for(let i = 1; i <= tramos; i++){
    const t = i / tramos;
    const dx = (i === tramos ? 0 : dirV * (i % 2 ? 1 : -1) * (amplitud * (1 - t) + 3));
    d += ' L' + (sx + (cx - sx) * t + dx).toFixed(0) + ' ' + (sy + (cy - sy) * t).toFixed(0);
  }
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'rayo');
  svg.style.setProperty('--gh', (4.4 + 7.6 * u).toFixed(1));
  svg.style.setProperty('--gn', (1.4 + 2.4 * u).toFixed(1));
  svg.style.setProperty('--bh', (1.3 + 2.4 * u).toFixed(1) + 'px');
  svg.style.setProperty('--ah', (.42 + .3 * u).toFixed(2));
  svg.setAttribute('width', String(Math.round(rc.width)));
  svg.setAttribute('height', String(Math.round(rc.height)));
  [['r-halo'], ['r-nucleo']].forEach(([c]) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('class', c); svg.appendChild(p); });
  campo.appendChild(svg);
  setTimeout(() => svg.remove(), 700);
  const fog = document.createElement('span');
  fog.className = 'fogonazo';
  fog.style.setProperty('--af', (.28 + .42 * u).toFixed(2));
  campo.appendChild(fog);
  setTimeout(() => fog.remove(), 420);
}
function humo(campo, elT){
  const rc = rect(campo), rn = rect(elT);
  const cx = rn.left + rn.width / 2 - rc.left, cy = rn.top + rn.height * 0.55 - rc.top;
  for(let i = 0; i < 7; i++){
    const h = document.createElement('span');
    h.className = 'humo';
    h.style.left = cx.toFixed(0) + 'px'; h.style.top = cy.toFixed(0) + 'px';
    h.style.setProperty('--hx', (Math.random() * 26 - 13).toFixed(0) + 'px');
    h.style.setProperty('--hy', (-4 - Math.random() * 16).toFixed(0) + 'px');
    h.style.animationDelay = (i * 35) + 'ms';
    campo.appendChild(h);
    setTimeout(() => h.remove(), 950);
  }
}
/* la escena entera: Zeus se asoma, lanza, el tirador se va. Devuelve una
   promesa que se cumple cuando el tirador ya no está; Zeus se retira solo */
function fulmina(campo, elT, fza, espera){
  if(REDUCIDO || !elT){ if(elT) elT.classList.add('saliendo'); return espera(REDUCIDO ? 60 : 500); }
  const z = asoma(campo, elT);
  return espera(560).then(() => {
    lanza(z);
    return espera(180);
  }).then(() => {
    z.classList.add('sinCetro');
    rayo(campo, elT, fza); trueno(campo, fza); chamusca(campo, elT, fza);
    elT.classList.add('fulminado', 'saliendo');
    humo(campo, elT);
    setTimeout(() => seVa(z), 700);
    return espera(520);
  });
}
raiz.Zeus = {fulmina, asoma, seVa, rayo, trueno, humo};
})(window);
