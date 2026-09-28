/* LA PALESTRA · los personajes: Jeferión, Listillón y Zeus, dibujados en SVG por código. Vienen tal cual de El pulso de los dioses (v8.7), con la pezuña de Jeferión y el pico de Listillón. */
(function (raiz) {
'use strict';
const MOV_REDUCIDO = raiz.matchMedia && raiz.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ZEUS_SVG =
  '<svg viewBox="0 0 120 90">' +
        '<defs>' +
      '<linearGradient id="zLuna" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#463D50"/>' +
        '<stop offset="1" stop-color="#2E2740"/>' +
      '</linearGradient>' +
      '<filter id="zSoft" x="-30%" y="-30%" width="160%" height="160%">' +
        '<feGaussianBlur stdDeviation=".7"/>' +
      '</filter>' +
            '<filter id="zGlow" x="-60%" y="-60%" width="220%" height="220%">' +
        '<feGaussianBlur stdDeviation="2.2" result="borroso"/>' +
        '<feMerge><feMergeNode in="borroso"/>' +
        '<feMergeNode in="SourceGraphic"/></feMerge>' +
      '</filter>' +
    '</defs>' +
        '<g transform="translate(0 10)">' +
        '<path class="siluZ" d="M43.5 28 L38 12 L46.5 18 L49 0 L54 14 L58 -6 ' +
      'L62 14 L67 0 L69.5 18 L74 12 L68.5 28 Q64 20 56 20 Q48 20 43.5 28 Z"/>' +
        '<path class="siluZ" d="M18 80 Q22 60 40 54 L84 54 Q102 59 106 80 Z"/>' +
            '<path class="rimZ" d="M40 56 Q62 65 88 80" fill="none" filter="url(#zSoft)" stroke-width="2.2"/>' +
    '<path class="rimZ" d="M36 61 Q57 69.5 80 80" fill="none" filter="url(#zSoft)" stroke-width="2"/>' +
        '<g class="brazoZ">' +
            '<path class="rimTrazoZ" d="M82 52 L100 42 L96 20" fill="none" ' +
        'filter="url(#zSoft)" ' +
        'stroke-width="14.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path class="siluTrazoZ" d="M82 52 L100 42 L96 20" fill="none" ' +
        'stroke-width="11.5" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<g class="punoZ" transform="rotate(-30 96 16)">' +
        '<rect class="siluZ" x="90.5" y="11" width="11" height="10" rx="3.2"/>' +
        '<circle class="siluZ" cx="93.6" cy="11.4" r="1.7"/>' +
        '<circle class="siluZ" cx="96.6" cy="11" r="1.7"/>' +
        '<circle class="siluZ" cx="99.4" cy="11.5" r="1.6"/>' +
        '<path class="rimZ" fill="none" stroke-width="1.3" d="M91.3 15.2 Q95 18 100.2 16.6"/>' +
      '</g>' +
            '<g class="boltZ" transform="rotate(-36 96 16)">' +
        '<path d="M99 -24 L103 -12 L98 -8 L104 4 L99 8 L105 20 L99 26 ' +
          'L105 38 L93 58 L96 38 L91 34 L96 22 L91 18 L96 6 L91 2 L96 -10 Z" ' +
          'fill="#E9B84E" stroke="rgba(16,11,26,.5)" stroke-width="1.1" ' +
          'filter="url(#zGlow)" stroke-linejoin="round"/>' +
        '<path d="M98.5 -20 L95.5 -8 L100.5 4 L95.9 9 L101.5 21 L96 27 ' +
          'L101 37 L94.6 53" ' +
          'fill="none" stroke="#FFF" stroke-width="1.2" ' +
          'stroke-linecap="round" opacity=".8"/>' +
      '</g>' +
    '</g>' +
        '<circle class="siluZ" cx="56" cy="26" r="13"/>' +
        '<g class="laurelZ">' +
    (() => {
      let h = '';
      for(const s of [-1, 1]) for(let i = 0; i < 5; i++){
        const hx = 56 + s * (12.2 - 2.35 * i), hy = 20.6 - i * 2.35;
        const rot = -s * (10 + i * 17);
        h += '<ellipse cx="' + hx + '" cy="' + hy + '" rx="2.05" ry=".95" ' +
          'transform="rotate(' + rot + ' ' + hx + ' ' + hy + ')"/>';
      }
      return h + '<circle cx="56" cy="10.9" r="1.15"/>';
    })() +
    '</g>' +
                '<ellipse class="haloZ" cx="51.6" cy="26.8" rx="3.5" ry="2.2" filter="url(#zSoft)"/>' +
    '<ellipse class="haloZ" cx="60.8" cy="26.8" rx="3.5" ry="2.2" filter="url(#zSoft)"/>' +
    '<path class="ojoZ" d="M48 25.6 L54.4 27.3 Q53.6 29.2 51.2 28.9 Q48.8 28.5 48 25.6 Z"/>' +
    '<path class="ojoZ" d="M64.4 25.6 L58 27.3 Q58.8 29.2 61.2 28.9 Q63.6 28.5 64.4 25.6 Z"/>' +
        '<path class="siluZ" d="M44.5 29 Q41 44 45.5 56 Q48.5 52.5 51.5 57.5 Q54 53.5 56.5 58 ' +
      'Q59 53.5 61.5 57.5 Q64.5 52.5 67.5 56 Q71.5 44 68.5 29 ' +
      'Q63 37 56.5 37 Q50 37 44.5 29 Z"/>' +
        '<path class="rimZ" filter="url(#zSoft)" opacity=".5" stroke-width="1.3" ' +
      'fill="none" d="M45.5 56 Q48.5 52.5 51.5 57.5 Q54 53.5 56.5 58 ' +
      'Q59 53.5 61.5 57.5 Q64.5 52.5 67.5 56"/>' +
        '<path class="rimZ" filter="url(#zSoft)" opacity=".55" stroke-width="1.2" ' +
      'fill="none" d="M49.5 34 Q47.5 42 50.5 50 M62.5 34 Q64.5 42 61.5 50 ' +
      'M56 38 Q56 45 56 51"/>' +
    '<path class="rimZ" filter="url(#zSoft)" opacity=".4" stroke-width="1.5" ' +
      'fill="none" d="M40 68 Q48 73 56 70 M66 70 Q74 73 82 68"/>' +
    '</g>' +
  '</svg>';
const TINTA = '#241C36';
function brazo(x0, y0, ang, largo, grosor, color, mano){
  const r = ang * Math.PI / 180;
  const x1 = x0 + Math.cos(r) * largo, y1 = y0 + Math.sin(r) * largo;
  return '<path d="M' + x0 + ' ' + y0 + ' L' + x1.toFixed(1) + ' ' + y1.toFixed(1) + '" stroke="' + TINTA +
    '" stroke-width="' + (grosor + 2.4) + '" stroke-linecap="round"/>' +
    '<path d="M' + x0 + ' ' + y0 + ' L' + x1.toFixed(1) + ' ' + y1.toFixed(1) + '" stroke="' + color +
    '" stroke-width="' + grosor + '" stroke-linecap="round"/>' +
    (mano ? mano(x1, y1, ang) : '');
}
/* brazo con codo: dos tramos */
function brazo2(x0, y0, a1, l1, a2, l2, g, color, mano){
  const r1 = a1 * Math.PI / 180, r2 = a2 * Math.PI / 180;
  const xc = x0 + Math.cos(r1) * l1, yc = y0 + Math.sin(r1) * l1;
  const x1 = xc + Math.cos(r2) * l2, y1 = yc + Math.sin(r2) * l2;
  const d = 'M' + x0 + ' ' + y0 + ' L' + xc.toFixed(1) + ' ' + yc.toFixed(1) + ' L' + x1.toFixed(1) + ' ' + y1.toFixed(1);
  return '<path d="' + d + '" fill="none" stroke="' + TINTA + '" stroke-width="' + (g + 2.4) +
    '" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="' + g +
    '" stroke-linecap="round" stroke-linejoin="round"/>' + (mano ? mano(x1, y1, a2) : '');
}
/* ── JEFERIÓN ── cocodrilo jefe: gafas redondas, laurel, banda morada */
const JV = {piel:'#8CBF4F', sombra:'#5F8F32', vientre:'#C9DE8A', banda:'#7E5C86', oro:'#E9B84E', laurel:'#6E9A2E'};
/* la mano de Jeferión es la pezuña de la manaza, en pequeño: una bola con
   dos dedos rechonchos y la punta de cuerno, mirando hacia donde va el brazo.
   Contorno y relleno por separado, para que el contorno salga de una pieza */
function manoJ(x, y, ang, k){
  const formas = '<circle r="4.2"/><ellipse cx="3.6" cy="-2.3" rx="3.3" ry="2.5"/><ellipse cx="3.6" cy="2.3" rx="3.3" ry="2.5"/>';
  const cuerno = cy => '<path d="M4.6 ' + (cy - 2.28).toFixed(2) + ' A3.3 2.5 0 0 1 4.6 ' + (cy + 2.28).toFixed(2) +
    ' Z" fill="#9A7650" stroke="' + TINTA + '" stroke-width=".8" stroke-linejoin="round"/>';
  return '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + (ang || 0).toFixed(0) + ') scale(' + (k || 1.4) + ')">' +
    '<g fill="' + TINTA + '" stroke="' + TINTA + '" stroke-width="2">' + formas + '</g>' +
    '<g fill="' + JV.piel + '">' + formas + '</g>' +
    cuerno(-2.3) + cuerno(2.3) +
    '<path d="M1.6 0 H4.4" stroke="' + TINTA + '" stroke-width=".9" stroke-linecap="round"/></g>';
}
/* señalar con pezuña: la pezuña entera apunta, un poco más grande */
function manoJdedo(x, y, ang){
  return manoJ(x, y, ang, 1.55);
}
function jeferion(pose){
  pose = pose || 'habla';
  const P = {
    habla:   {bI:[100,14,80,12], bD:[-70,16,-100,12], boca:.6, ojo:'normal', mira:[-1,0]},
    senala:  {bI:[100,14,80,12], bD:[-10,14,-5,8,'dedo'], boca:.3, ojo:'normal', mira:[1,0]},
    sorpresa:{bI:[-160,12,-110,12], bD:[-40,16,-60,12], boca:1, ojo:'grande', mira:[0,-.3]},
    celebra: {bI:[-165,12,-105,13], bD:[-30,16,-80,13], boca:.85, ojo:'feliz', mira:[0,0]},
    piensa:  {bI:[100,14,80,12], bD:[200,16,225,14], boca:0, ojo:'arriba', mira:[.3,-1]},
    calla:   {bI:[100,14,80,12], bD:[110,14,80,12], boca:0, ojo:'normal', mira:[-1,0]},
    asoma:   {boca:0, ojo:'normal', mira:[1,.2]}
  }[pose];
  const asoma = pose === 'asoma';
  const brazoDe = (x, y, b) => brazo2(x, y, b[0], b[1], b[2], b[3], 6.2, JV.piel, b[4] === 'dedo' ? manoJdedo : manoJ);
  let s = '<svg viewBox="0 0 100 100" class="pj pj-jef pose-' + pose + '" aria-hidden="true">';
  if(asoma) s += '<g transform="translate(4 40)">';
  if(!asoma){
  /* cola, por detrás */
  s += '<path d="M66 88 Q88 90 95 76 Q90 84 80 83 Q72 82 66 80 Z" fill="' + JV.sombra + '" stroke="' + TINTA + '" stroke-width="1.4" stroke-linejoin="round"/>';
  s += '<path d="M78 82 l2 -4 l2 3.4 l2.4 -4.2 l1.8 3.6" fill="none" stroke="' + TINTA + '" stroke-width="1.1" stroke-linejoin="round"/>';
  /* brazo de atrás */
  s += brazoDe(33, 62, P.bI);
  /* cuerpo */
  s += '<path d="M24 98 Q22 66 38 56 L62 56 Q78 64 76 98 Z" fill="' + JV.piel + '" stroke="' + TINTA + '" stroke-width="1.6" stroke-linejoin="round"/>';
  s += '<path d="M36 98 Q36 72 48 64 Q60 70 62 98 Z" fill="' + JV.vientre + '" opacity=".9"/>';
  s += '<path d="M40 76 H58 M39 84 H60 M38 92 H61" stroke="' + JV.sombra + '" stroke-width="1" opacity=".55"/>';
  /* banda */
  s += '<path d="M30 60 Q50 76 70 96" stroke="' + TINTA + '" stroke-width="9.4" fill="none"/>';
  s += '<path d="M30 60 Q50 76 70 96" stroke="' + JV.banda + '" stroke-width="7.2" fill="none"/>';
  s += '<path d="M30.6 58.4 Q51 74.4 71.4 94.4" stroke="' + JV.oro + '" stroke-width="1.2" fill="none" opacity=".9"/>';
  }
  /* cabeza: cráneo y hocico largo hacia la izquierda */
  const ab = P.boca * 7;                         // cuánto se abre la mandíbula
  s += '<g class="cabeza">';
  const giro = 'rotate(' + (-P.boca * 16).toFixed(1) + ' 42 44)';
  if(P.boca > .1) s += '<path d="M10 41 Q26 46 42 44 L40 52 Q24 54 10 46 Z" fill="#B5484A" stroke="' + TINTA + '" stroke-width="1.2" transform="rotate(' + (-P.boca * 8).toFixed(1) + ' 42 44)"/>';
  s += '<path d="M42 50 Q30 54 14 52 Q6 51 6 46 Q6 42 12 42 L38 43 Z" transform="' + giro + '" fill="' + JV.sombra + '" stroke="' + TINTA + '" stroke-width="1.5" stroke-linejoin="round"/>';
  if(P.boca > .1) s += '<path d="M13 43 l1.6 -2.4 l1.6 2.4 M21 43.6 l1.6 -2.4 l1.6 2.4" transform="' + giro + '" fill="#fff" stroke="' + TINTA + '" stroke-width=".7"/>';
  s += '<path d="M60 44 Q62 22 46 18 Q36 16 32 24 L10 29 Q3 30 3 36 Q3 42 10 42 L38 44 Q48 50 60 44 Z" fill="' + JV.piel + '" stroke="' + TINTA + '" stroke-width="1.6" stroke-linejoin="round"/>';
  /* dientes */
  s += '<path d="M12 42 l1.6 2.6 l1.6 -2.6 M19 42.4 l1.6 2.6 l1.6 -2.6 M26 43 l1.6 2.6 l1.6 -2.6" fill="#fff" stroke="' + TINTA + '" stroke-width=".7" stroke-linejoin="round"/>';
  /* orificios y escamas */
  s += '<circle cx="7.5" cy="33.2" r="1.1" fill="' + TINTA + '"/><circle cx="11" cy="32.2" r="1.1" fill="' + TINTA + '"/>';
  s += '<path d="M18 33 q2 -1.6 4 0 M25 32 q2 -1.6 4 0" fill="none" stroke="' + JV.sombra + '" stroke-width="1"/>';
  /* ojos con gafas redondas */
  const [mx, my] = P.mira;
  const ojo = (cx, cy) => {
    let o = '<circle cx="' + cx + '" cy="' + cy + '" r="6.6" fill="#F4F7FB" stroke="' + TINTA + '" stroke-width="2.4"/>';
    if(P.ojo === 'feliz') o += '<path d="M' + (cx - 3.4) + ' ' + (cy + 1) + ' q3.4 -4 6.8 0" fill="none" stroke="' + TINTA + '" stroke-width="1.8" stroke-linecap="round"/>';
    else{
      const r = P.ojo === 'grande' ? 3.1 : 2.4;
      o += '<circle cx="' + (cx + mx * 2.4) + '" cy="' + (cy + my * 2.4) + '" r="' + r + '" fill="#140F1F"/>' +
           '<circle cx="' + (cx + mx * 2.4 + .9) + '" cy="' + (cy + my * 2.4 - .9) + '" r=".8" fill="#fff"/>';
    }
    return o;
  };
  s += ojo(37, 22) + ojo(51, 21);
  s += '<path d="M43.6 21.6 H44.4" stroke="' + TINTA + '" stroke-width="2"/>';
  /* laurel */
  s += '<path d="M31 17 Q44 5 60 14" fill="none" stroke="' + JV.laurel + '" stroke-width="1.6" stroke-linecap="round"/>';
  [[33,14,-40],[37,10.6,-25],[42,8.6,-10],[47,8.2,5],[52,9.2,18],[57,11.6,32]].forEach(([x,y,a]) => {
    s += '<ellipse cx="' + x + '" cy="' + y + '" rx="3.2" ry="1.4" transform="rotate(' + a + ' ' + x + ' ' + y + ')" fill="#8DB84A" stroke="' + TINTA + '" stroke-width=".6"/>';
  });
  s += '</g>';
  if(asoma){
    s += '</g>';
    /* las pezuñas agarradas al borde, con los cuernos por encima */
    [[26,97,-80],[70,97,-100]].forEach(([x,y,a]) => { s += manoJ(x, y, a, 1.7); });
  }else s += brazoDe(64, 62, P.bD);
  s += '</svg>';
  return s;
}
/* ── LISTILLÓN ── escriba: pájaro azul, gorra roja, su tablilla bajo el ala */
const LV = {pluma:'#57B8D6', sombra:'#3F9CBC', gorra:'#C0392B', pico:'#E9B84E', tabla:'#C8B48B'};
function listillon(pose){
  pose = pose || 'habla';
  const P = {
    habla:   {ala:[10,13,-40,9], tabla:'bajo', pico:.6, ceja:'seria', mira:[1,0]},
    senala:  {ala:[-15,16,-10,10], tabla:'bajo', pico:.3, ceja:'seria', mira:[1,0], dedo:true},
    sorpresa:{ala:[5,14,-40,9], tabla:'bajo', pico:1, ceja:'alta', mira:[0,-.3]},
    celebra: {ala:[-8,15,-50,11], tabla:'arriba', pico:.8, ceja:'alegre', mira:[0,0]},
    piensa:  {ala:[160,10,-120,12], tabla:'bajo', pico:0, ceja:'piensa', mira:[.4,-1]},
    calla:   {ala:[110,12,80,8], tabla:'bajo', pico:0, ceja:'seria', mira:[1,0]},
    asoma:   {pico:0, ceja:'seria', mira:[.6,.3]}
  }[pose];
  const asoma = pose === 'asoma';
  let s = '<svg viewBox="0 0 100 100" class="pj pj-lis pose-' + pose + '" aria-hidden="true">';
  if(asoma) s += '<g transform="translate(-4 42)">';
  if(!asoma){
  /* patas */
  s += '<path d="M42 90 v8 M40 98 h6 M56 90 v8 M54 98 h6" stroke="#D9962B" stroke-width="2.4" stroke-linecap="round"/>';
  /* cuerpo */
  s += '<ellipse cx="50" cy="70" rx="26" ry="23" fill="' + LV.pluma + '" stroke="' + TINTA + '" stroke-width="1.6"/>';
  s += '<ellipse cx="54" cy="76" rx="15" ry="14" fill="#9ED7EA" opacity=".75"/>';
  s += '<path d="M24 74 q-8 4 -10 12 q7 -3 12 -4" fill="' + LV.sombra + '" stroke="' + TINTA + '" stroke-width="1.3" stroke-linejoin="round"/>';
  /* tablilla bajo el ala (o en alto) */
  const tabla = P.tabla === 'arriba'
    ? '<g transform="rotate(-8 30 22)"><rect x="18" y="12" width="26" height="18" rx="2" fill="' + LV.tabla + '" stroke="' + TINTA + '" stroke-width="1.4"/><path d="M22 18 H40 M22 22 H36 M22 26 H38" stroke="' + TINTA + '" stroke-width=".9" opacity=".5"/></g>'
    : '<g transform="rotate(-6 30 70)"><rect x="16" y="60" width="26" height="18" rx="2" fill="' + LV.tabla + '" stroke="' + TINTA + '" stroke-width="1.4"/><path d="M20 66 H38 M20 70 H34 M20 74 H36" stroke="' + TINTA + '" stroke-width=".9" opacity=".5"/></g>';
  if(P.tabla !== 'arriba') s += tabla;
  /* ala que sujeta la tablilla */
  s += P.tabla === 'arriba'
    ? brazo2(34, 58, -120, 14, -80, 10, 7, LV.pluma, null)
    : '<path d="M30 62 Q40 58 44 70 Q38 76 30 74 Z" fill="' + LV.pluma + '" stroke="' + TINTA + '" stroke-width="1.3" stroke-linejoin="round"/>';
  if(P.tabla === 'arriba') s += tabla;
  }
  /* cabeza */
  s += '<g class="cabeza">';
  /* pico: abre por la mandíbula de abajo. Va por detrás de la cabeza, así
     sale del contorno en vez de parecer pegado encima */
  const ab = P.pico * 6;
  s += '<path d="M63 40 L85 ' + (43.5 + ab * .5).toFixed(1) + ' Q80 ' + (46 + ab).toFixed(1) + ' 69 ' + (46 + ab).toFixed(1) + ' L63 45 Z" fill="#D9962B" stroke="' + TINTA + '" stroke-width="1.2" stroke-linejoin="round"/>';
  s += '<path d="M63 32 Q78 34 89 40.5 Q80 43 63 43 Z" fill="' + LV.pico + '" stroke="' + TINTA + '" stroke-width="1.3" stroke-linejoin="round"/>';
  s += '<circle cx="54" cy="36" r="19" fill="' + LV.pluma + '" stroke="' + TINTA + '" stroke-width="1.6"/>';
  /* ojos */
  const [mx, my] = P.mira;
  const ojo = (cx, cy, r) => (P.ceja === 'alegre'
    ? '<path d="M' + (cx - 3) + ' ' + (cy + 1) + ' q3 -4 6 0" fill="none" stroke="' + TINTA + '" stroke-width="1.8" stroke-linecap="round"/>'
    : '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r + (P.ceja === 'alta' ? 1 : 0)) + '" fill="#F4F7FB" stroke="' + TINTA + '" stroke-width="1"/>' +
      '<circle cx="' + (cx + mx * 1.6) + '" cy="' + (cy + my * 1.6) + '" r="' + (r * .5) + '" fill="#140F1F"/>');
  s += ojo(58, 34, 4.4) + ojo(68, 33, 4);
  /* cejas: la cara es la de las fichas, cejijunto */
  const cj = {seria:[[53,27,62,29],[64,28.6,72,26]], alta:[[53,25,62,23.4],[64,23,72,24.6]],
              alegre:[[53,27,62,26],[64,25.6,72,27]], piensa:[[53,26,62,28],[64,26,72,24]]}[P.ceja];
  cj.forEach(c => { s += '<path d="M' + c[0] + ' ' + c[1] + ' L' + c[2] + ' ' + c[3] + '" stroke="' + TINTA + '" stroke-width="2.4" stroke-linecap="round"/>'; });
  /* gorra con visera hacia delante */
  s += '<path d="M36 26 Q40 8 56 9 Q70 10 72 24 Z" fill="' + LV.gorra + '" stroke="' + TINTA + '" stroke-width="1.5" stroke-linejoin="round"/>';
  s += '<path d="M60 22 Q74 19 82 24 Q74 26 62 26 Z" fill="#A5301F" stroke="' + TINTA + '" stroke-width="1.3" stroke-linejoin="round"/>';
  s += '<path d="M37 24 Q54 20 71 23" fill="none" stroke="#fff" stroke-width="1.2" opacity=".55"/>';
  s += '<circle cx="54" cy="9.6" r="2" fill="#A5301F" stroke="' + TINTA + '" stroke-width="1"/>';
  s += '</g>';
  if(asoma){
    s += '</g>';
    [[22,97],[80,97]].forEach(([x,y]) => {
      s += '<path d="M' + (x - 8) + ' ' + (y + 3) + ' Q' + x + ' ' + (y - 9) + ' ' + (x + 8) + ' ' + (y + 3) + '" fill="' + LV.pluma + '" stroke="' + TINTA + '" stroke-width="1.4"/>' +
        '<path d="M' + (x - 3) + ' ' + (y - 3) + ' l-1 4 M' + x + ' ' + (y - 4) + ' v4 M' + (x + 3) + ' ' + (y - 3) + ' l1 4" stroke="' + TINTA + '" stroke-width=".9" stroke-linecap="round"/>';
    });
  }
  /* ala libre */
  if(!asoma){
    const a = P.ala;
    s += brazo2(70, 62, a[0], a[1], a[2], a[3], 7, LV.pluma, P.dedo ? (x, y, g) => {
      const r = g * Math.PI / 180;
      return '<path d="M' + x.toFixed(1) + ' ' + y.toFixed(1) + ' l' + (Math.cos(r) * 5).toFixed(1) + ' ' + (Math.sin(r) * 5).toFixed(1) +
        '" stroke="' + TINTA + '" stroke-width="3.6" stroke-linecap="round"/>' +
        '<path d="M' + x.toFixed(1) + ' ' + y.toFixed(1) + ' l' + (Math.cos(r) * 5).toFixed(1) + ' ' + (Math.sin(r) * 5).toFixed(1) +
        '" stroke="' + LV.sombra + '" stroke-width="1.8" stroke-linecap="round"/>';
    } : null);
  }
  s += '</svg>';
  return s;
}

/* ── LAS CARAS SEGÚN LO QUE DICEN ── Listillón celebra cuando se acierta,
   piensa cuando algo no sale y señala cuando manda mirar; al hablar, mueve
   el pico. Jeferión celebra al cumplir la misión. */
const DIBUJA = {jef: jeferion, lis: listillon};
function ponCara(c, quien, pose, hablar){
  if(!c) return;
  clearInterval(c._parla);
  c.innerHTML = DIBUJA[quien](pose);
  c.dataset.pose = pose;
  if(!hablar || MOV_REDUCIDO || (pose !== 'habla' && pose !== 'senala')) return;
  let n = 0;
  c._parla = setInterval(() => {
    n++;
    c.innerHTML = DIBUJA[quien](n % 2 ? 'calla' : pose);
    if(n >= 7){ clearInterval(c._parla); c.innerHTML = DIBUJA[quien](pose); }
  }, 170);
}
function poseDeTexto(h){
  const t = String(h).replace(/<[^>]+>/g, '').trim();
  if(!t) return null;
  if(/^(Correcto|Eso es|Bien|Exacto|Muy bien|Cazad|¡)|La bandera acaba en|Misión cumplida|tu cuenta vale|Y sin abrir/.test(t)) return 'celebra';
  if(/^(No\b|Ahí no|Espera|Falta|Todavía no)|no se puede|No caben|se saldría|a medias|Sobra|no es lo mismo|torcido|se ha quedado en suma|sin mirar el bando|Has sumado antes|Has quitado solo|Has juntado/.test(t)) return 'piensa';
  if(/^(Mira|Fíjate|Ábrel|Si no l|Cada ▶|Arrastra)/.test(t)) return 'senala';
  return 'habla';
}
const ZV = {piel:'#E7B58C', sombra:'#C98E66', barba:'#F4F1EA', barbaS:'#CFCBD8', toga:'#EEF0F6', togaS:'#C9CEDF',
            oro:'#E9B84E', ojo:'#FFE27A', rayo:'#F5C542'};
function rayoZ(x, y, esc, giro){
  return '<g transform="translate(' + x + ' ' + y + ') rotate(' + giro + ') scale(' + esc + ')">' +
    '<path d="M0 -22 L9 -22 L3 -6 L11 -6 L-5 22 L-1 2 L-8 2 Z" fill="' + ZV.rayo + '" stroke="' + TINTA +
    '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M2 -19 L6 -19 L1.5 -8" fill="none" stroke="#fff" stroke-width="1.2" opacity=".75"/></g>';
}
function manoZ(x, y){
  return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4.8" fill="' + ZV.piel + '" stroke="' + TINTA + '" stroke-width="1.3"/>';
}
function zeus(pose){
  pose = pose || 'habla';
  const P = {
    habla:   {bI:[110,14,70,12], bD:[-50,15,-95,12], rayo:'mano', boca:.5, ceja:'serio', ojo:'abierto'},
    enfada:  {bI:[110,14,70,12], bD:[-80,15,-100,14], rayo:'alto', boca:.7, ceja:'furia', ojo:'abierto'},
    rie:     {bI:[140,10,40,14], bD:[40,12,150,12], rayo:'suelo', boca:1, ceja:'alegre', ojo:'cerrado'},
    piensa:  {bI:[110,14,70,12], bD:[200,14,240,12], rayo:'suelo', boca:0, ceja:'piensa', ojo:'arriba'},
    sorpresa:{bI:[-140,14,-110,12], bD:[-40,14,-70,12], rayo:'suelo', boca:.9, ceja:'alta', ojo:'grande'},
    calla:   {bI:[110,14,70,12], bD:[110,14,70,12], rayo:'suelo', boca:0, ceja:'serio', ojo:'abierto'}
  }[pose];
  const brazoDe = (x, y, b) => brazo2(x, y, b[0], b[1], b[2], b[3], 7.4, ZV.piel, manoZ);
  const fin = (x0, y0, b) => {
    const r1 = b[0] * Math.PI / 180, r2 = b[2] * Math.PI / 180;
    return [x0 + Math.cos(r1) * b[1] + Math.cos(r2) * b[3], y0 + Math.sin(r1) * b[1] + Math.sin(r2) * b[3]];
  };
  let s = '<svg viewBox="0 0 100 100" class="pj pj-zeus pose-' + pose + '" aria-hidden="true">';
  if(P.rayo === 'suelo') s += rayoZ(88, 80, .8, 18);
  /* brazo de atrás */
  s += brazoDe(32, 64, P.bI);
  /* túnica */
  s += '<path d="M18 100 Q18 70 34 60 L66 60 Q82 70 82 100 Z" fill="' + ZV.toga + '" stroke="' + TINTA + '" stroke-width="1.6" stroke-linejoin="round"/>';
  s += '<path d="M34 60 Q46 78 44 100 M58 62 Q54 80 60 100" fill="none" stroke="' + ZV.togaS + '" stroke-width="1.4"/>';
  s += '<path d="M30 62 L70 96" stroke="' + TINTA + '" stroke-width="6.2"/><path d="M30 62 L70 96" stroke="' + ZV.oro + '" stroke-width="4.2"/>';
  /* barba: nube por debajo de la cara */
  const nube = (pts, fill) => pts.map(([x, y, r]) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + fill + '"/>').join('');
  const barba = [[38,50,8],[46,56,9],[54,56,9],[62,50,8],[42,62,7],[50,66,8],[58,62,7],[50,72,6]];
  s += '<g>' + nube(barba.map(([x,y,r]) => [x,y,r + 1.3]), TINTA) + nube(barba, ZV.barba) + '</g>';
  /* pelo: nube por detrás de la cabeza */
  const pelo = [[34,34,7],[35,24,7],[42,17,7],[50,15,7],[58,17,7],[65,24,7],[66,34,7]];
  s += nube(pelo.map(([x,y,r]) => [x,y,r + 1.3]), TINTA) + nube(pelo, ZV.barba);
  /* corona de puntas, como su silueta en el campo */
  s += '<path d="M36 18 L38 6 L42 14 L46 2 L50 12 L54 2 L58 14 L62 6 L64 18 Z" fill="' + ZV.oro + '" stroke="' + TINTA + '" stroke-width="1.3" stroke-linejoin="round"/>';
  /* cara */
  s += '<ellipse cx="50" cy="36" rx="13" ry="14" fill="' + ZV.piel + '" stroke="' + TINTA + '" stroke-width="1.5"/>';
  s += '<path d="M48 38 Q50 44 52 38" fill="' + ZV.sombra + '" stroke="' + TINTA + '" stroke-width="1"/>';
  /* ojos: brillan como en el campo */
  const ojo = (cx) => {
    if(P.ojo === 'cerrado') return '<path d="M' + (cx - 3) + ' 33 q3 -3 6 0" fill="none" stroke="' + TINTA + '" stroke-width="1.8" stroke-linecap="round"/>';
    const r = P.ojo === 'grande' ? 3.4 : 2.6, dy = P.ojo === 'arriba' ? -1.2 : 0;
    return '<circle cx="' + cx + '" cy="' + (33 + dy) + '" r="' + (r + 1.6) + '" fill="' + ZV.ojo + '" opacity=".35"/>' +
      '<circle cx="' + cx + '" cy="' + (33 + dy) + '" r="' + r + '" fill="' + ZV.ojo + '" stroke="' + TINTA + '" stroke-width="1"/>' +
      '<circle cx="' + cx + '" cy="' + (33 + dy) + '" r="' + (r * .42) + '" fill="#140F1F"/>';
  };
  s += ojo(44.5) + ojo(55.5);
  /* cejas pobladas */
  const cj = {serio:[[39,28,48,29],[52,29,61,28]], furia:[[39,26,48,30.5],[52,30.5,61,26]],
              alegre:[[39,28,48,26],[52,26,61,28]], piensa:[[39,27,48,29],[52,27,61,25]],
              alta:[[39,24,48,23],[52,23,61,24]]}[P.ceja];
  cj.forEach(c => { s += '<path d="M' + c[0] + ' ' + c[1] + ' L' + c[2] + ' ' + c[3] + '" stroke="' + TINTA + '" stroke-width="4.4" stroke-linecap="round"/>' +
    '<path d="M' + c[0] + ' ' + c[1] + ' L' + c[2] + ' ' + c[3] + '" stroke="' + ZV.barba + '" stroke-width="2.6" stroke-linecap="round"/>'; });
  /* bigote y boca */
  const ab = P.boca * 5;
  if(P.boca > .1) s += '<ellipse cx="50" cy="' + (48 + ab * .3) + '" rx="' + (3 + P.boca * 2) + '" ry="' + (1 + ab * .6) + '" fill="#7A2B2B" stroke="' + TINTA + '" stroke-width="1"/>';
  s += '<path d="M40 46 Q45 42 50 45 Q55 42 60 46 Q55 48 50 46.4 Q45 48 40 46 Z" fill="' + ZV.barba + '" stroke="' + TINTA + '" stroke-width="1.1" stroke-linejoin="round"/>';
  /* brazo de delante, con el rayo si lo lleva */
  const [hx, hy] = fin(68, 64, P.bD);
  if(P.rayo === 'alto') s += rayoZ(hx, hy - 12, 1.05, 12);
  if(P.rayo === 'mano') s += rayoZ(hx + 4, hy - 8, .75, 20);
  s += brazoDe(68, 64, P.bD);
  s += '</svg>';
  return s;
}

/* ── LAS ENTREVISTAS ──────────────────────────────────────────────────────
   Se elige a quién entrevistar y qué preguntarle; contesta con su voz y su
   postura. Son respuestas escritas a mano (nada de inteligencia artificial):
   cómicas, pero cada una lleva dentro una idea de los enteros. Algunas
   preguntas abren otra («repregunta»), y alguna respuesta invita a
   comprobarlo en la tablilla de Listillón.                                  */
DIBUJA.zeus = zeus;
DIBUJA.zeus = zeus;
raiz.Personajes = {jeferion, listillon, zeus, DIBUJA, ponCara, poseDeTexto, ZEUS_SVG, TINTA, JV, LV, ZV};
})(window);
