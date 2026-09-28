/* El tirador, dibujado en SVG a partir de su fuerza y su bando. Viene tal cual de El pulso de los dioses (v8.7): la geometría del cuerpo, la pose de tirar y el frasco en la mano. */
(function (raiz) {
'use strict';
const conSigno = n => n === 0 ? '0' : (n > 0 ? '+' : '−') + Math.abs(n);
const SUELO_CSS = 52, CUERDA_CSS = 82, CUERDA_ALTO = 7;
const CUERDA_Y = CUERDA_CSS + CUERDA_ALTO / 2 - SUELO_CSS;
const CAB_ALTA = 0.78;
function medidasDe(fz, U){
  const torso  = U * (1 + 0.34 * Math.log(fz));
  const ancho  = Math.min(32, 14 * (1 + 0.55 * Math.log(fz)));
  const m      = Math.max(0, Math.min(11, Math.round(Math.log(fz) * 4.2)));
  const cab    = 17 + m * 0.5;
  const pierna = 17 + m * 0.4;
  const brazoL = 16 + m * 0.6, brazoH = 8 + m * 0.4;
      const w = Math.max(cab + 10, ancho + brazoL + 22);
  const h = pierna + torso + cab + 22;
  return {torso, ancho, m, cab, pierna, brazoL, brazoH, w, h, u:Math.max(3, torso/fz)};
}
function frascoEnMano(mx, my, gr, parte){
    const an = gr * 1.12, al = gr * 1.95;
    const bocaX = mx, bocaY = my - gr * .5;
  const cuello =
    '<rect class="fr-corcho" x="' + (-an * .28).toFixed(1) + '" y="-2" width="' +
      (an * .56).toFixed(1) + '" height="2.2" rx="1"/>' +
    '<rect class="fr-cuello" x="' + (-an * .22).toFixed(1) + '" y="0" width="' +
      (an * .44).toFixed(1) + '" height="' + (al * .22).toFixed(1) + '" rx="1"/>';
    const X = n => n.toFixed(1);
    const anfora =
    '<g class="fr-forma anf">' +
      '<path class="fr-vidrio" d="M' + X(-an*.22) + ' ' + X(al*.2) +
        ' C' + X(-an*.62) + ' ' + X(al*.3) + ' ' + X(-an*.56) + ' ' + X(al*.6) +
          ' ' + X(-an*.3) + ' ' + X(al*.8) +
        ' Q' + X(-an*.22) + ' ' + X(al*.87) + ' ' + X(-an*.2) + ' ' + X(al*.93) +
        ' L' + X(an*.2) + ' ' + X(al*.93) +
        ' Q' + X(an*.22) + ' ' + X(al*.87) + ' ' + X(an*.3) + ' ' + X(al*.8) +
        ' C' + X(an*.56) + ' ' + X(al*.6) + ' ' + X(an*.62) + ' ' + X(al*.3) +
          ' ' + X(an*.22) + ' ' + X(al*.2) + ' Z"/>' +
            '<rect class="fr-pie" x="' + X(-an*.24) + '" y="' + X(al*.93) +
        '" width="' + X(an*.48) + '" height="' + X(al*.07) + '" rx="' + X(al*.02) + '"/>' +
            '<path class="fr-asa" d="M' + X(-an*.2) + ' ' + X(al*.26) +
        ' q' + X(-an*.34) + ' ' + X(al*.06) + ' ' + X(-an*.28) + ' ' + X(al*.2) + '"/>' +
      '<path class="fr-asa" d="M' + X(an*.2) + ' ' + X(al*.26) +
        ' q' + X(an*.34) + ' ' + X(al*.06) + ' ' + X(an*.28) + ' ' + X(al*.2) + '"/>' +
      '<g class="fr-liqG">' +
        '<rect class="fr-liq" x="' + X(-an*.3) + '" y="' + X(al*.34) +
          '" width="' + X(an*.6) + '" height="' + X(al*.55) + '" rx="' + X(an*.08) + '"/>' +
      '</g>' +
    '</g>';
  const vial =
    '<g class="fr-forma via">' +
      '<path class="fr-vidrio" d="M' + X(-an*.2) + ' ' + X(al*.2) +
        ' L' + X(-an*.2) + ' ' + X(al*.82) +
        ' Q' + X(-an*.2) + ' ' + X(al*.99) + ' 0 ' + X(al*.99) +
        ' Q' + X(an*.2) + ' ' + X(al*.99) + ' ' + X(an*.2) + ' ' + X(al*.82) +
        ' L' + X(an*.2) + ' ' + X(al*.2) + ' Z"/>' +
      '<g class="fr-liqG">' +
        '<rect class="fr-liq" x="' + X(-an*.19) + '" y="' + X(al*.46) +
          '" width="' + X(an*.38) + '" height="' + X(al*.5) + '" rx="' + X(an*.06) + '"/>' +
      '</g>' +
    '</g>';
  const panza = anfora + vial;
  return '<g transform="translate(' + bocaX.toFixed(1) + ' ' + bocaY.toFixed(1) + ')">' +
    '<g class="frascoMano">' + (parte === 'cuello' ? cuello : panza) + '</g>' +
  '</g>';
}
function dibujaTirador(p, U){
  const fz = Math.abs(p.f), d = medidasDe(fz, U);
  const cx = d.w / 2, suelo = d.h;
  const dir = p.f < 0 ? 1 : -1;
  const ang = -dir * 19 * Math.PI / 180;
  const co = Math.cos(ang), si = Math.sin(ang);
    const gira = (x, y) => [ cx + (x - cx) * co - (y - suelo) * si,
                           suelo + (x - cx) * si + (y - suelo) * co ];
  const [hx, hy] = gira(cx, suelo - d.pierna - d.torso);
  const [kx, ky] = gira(cx, suelo - d.pierna);
    const bx0 = cx + dir * d.cab * 0.16;
  const by0 = suelo - d.pierna - d.torso - d.cab * CAB_ALTA + d.cab * 0.28;
  const yCuerda = suelo - CUERDA_Y;
  const m1x = cx + dir * (d.brazoL + 4), m2x = m1x - dir * (d.brazoH * 1.1);
  const p1x = cx + dir * d.pierna * 0.52, p2x = cx - dir * d.pierna * 0.34;
    const codoX = hx + (m2x - hx) * 0.48 - dir * 2;
  const codoY = hy + (yCuerda - hy) * 0.52 + 3;
    const dxA = m1x - hx, dyA = yCuerda - hy;
  const lA = Math.hypot(dxA, dyA) || 1;
  const nxA = -dir * dyA / lA, nyA = dir * dxA / lA;
  const flexA = Math.min(8, lA * 0.17);
    const c1x = hx + dxA * 0.46 + nxA * flexA;
  const c1y = hy + dyA * 0.46 + nyA * flexA;
    const bicX = hx + (c1x - hx) * 0.42, bicY = hy + (c1y - hy) * 0.42;
  const bicA = Math.atan2(c1y - hy, c1x - hx) * 180 / Math.PI;
    const L1 = Math.hypot(codoX - hx, codoY - hy);
  const L2 = Math.hypot(m2x - codoX, yCuerda - codoY);
  const bocaSvgX = cx + (bx0 - cx) * Math.cos(ang) - (by0 - suelo) * Math.sin(ang);
  const bocaSvgY = suelo + (bx0 - cx) * Math.sin(ang) + (by0 - suelo) * Math.cos(ang);
  const dist = Math.min(L1 + L2 - 0.5, Math.hypot(bocaSvgX - hx, bocaSvgY - hy));
  const cosCodo = Math.max(-1, Math.min(1, (dist*dist - L1*L1 - L2*L2) / (2*L1*L2)));
  const th2 = Math.acos(cosCodo) * (dir > 0 ? -1 : 1);
  const th1 = Math.atan2(bocaSvgY - hy, bocaSvgX - hx) -
              Math.atan2(L2 * Math.sin(th2), L1 + L2 * Math.cos(th2));
    const gr = x => {
    let g = x * 180 / Math.PI;
    while(g > 180) g -= 360;
    while(g < -180) g += 360;
    return g.toFixed(1) + 'deg';
  };
    const lado = p.f < 0 ? -1 : 1;
  const AJ_HOMBRO = -28 * Math.PI / 180, AJ_CODO = -30 * Math.PI / 180;
  const giroHumero = th1 - Math.atan2(codoY - hy, codoX - hx) + lado * AJ_HOMBRO;
  const giroAnte   = (th1 + th2) - Math.atan2(yCuerda - codoY, m2x - codoX) -
                     (th1 - Math.atan2(codoY - hy, codoX - hx)) + lado * AJ_CODO;
    const capsula = (x1, y1, r1, x2, y2, r2) => {
    const dx = x2 - x1, dy = y2 - y1, dist = Math.hypot(dx, dy) || 1;
    const a = Math.atan2(dy, dx);
    const b = Math.acos(Math.max(-1, Math.min(1, (r1 - r2) / dist)));
    const pt = (x, y, r, ang) => (x + r * Math.cos(ang)).toFixed(1) + ' ' +
                                 (y + r * Math.sin(ang)).toFixed(1);
    return 'M' + pt(x1, y1, r1, a + b) + ' L' + pt(x2, y2, r2, a + b) +
      ' A' + r2.toFixed(1) + ' ' + r2.toFixed(1) + ' 0 0 0 ' + pt(x2, y2, r2, a - b) +
      ' L' + pt(x1, y1, r1, a - b) +
      ' A' + r1.toFixed(1) + ' ' + r1.toFixed(1) + ' 0 1 0 ' + pt(x1, y1, r1, a + b) + ' Z';
  };
  const miembro = (x1, y1, r1, x2, y2, r2, cl) => {
    const d = capsula(x1, y1, r1, x2, y2, r2);
    return ['<path class="borde ' + (cl ? cl + '-c' : '') + '" d="' + d + '"/>',
            '<path class="carne ' + (cl || '') + '" d="' + d + '"/>'];
  };
      const asomaCuerda = (x, y, r) =>
    '<rect class="entredos" x="' + (x - r * .55).toFixed(1) + '" y="' +
      (y - CUERDA_ALTO * .30).toFixed(1) + '" width="' + (r * 1.1).toFixed(1) +
      '" height="' + (CUERDA_ALTO * .60).toFixed(1) + '" rx="1"/>';
    const puno = (x, y, r, ang, extra, voltea) => {
    const w = r * 2.1, h = r * 1.72;
        const ar = (Math.abs(ang) > 90 ? 1 : -1) * (voltea ? -1 : 1);
        const puBase = capsula(-w * .34, ar * h * .16, h * .34,
                            w * .02, ar * h * .44, h * .27);
    const puYema = capsula( w * .02, ar * h * .44, h * .27,
                            w * .30, ar * h * .06, h * .17);
    return '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) +
      ') rotate(' + ang.toFixed(1) + ')">' +
      '<rect class="cuerpo puno' + (extra ? ' ' + extra : '') + '" x="' + (-w / 2).toFixed(1) +
        '" y="' + (-h / 2).toFixed(1) + '" width="' + w.toFixed(1) +
        '" height="' + h.toFixed(1) + '" rx="' + (h * .42).toFixed(1) + '"/>' +
      '<path class="surco" d="M' + (w * .30).toFixed(1) + ' ' + (-h * .30).toFixed(1) +
        ' q' + (w * .13).toFixed(1) + ' ' + (h * .30).toFixed(1) + ' 0 ' + (h * .60).toFixed(1) +
        ' M' + (w * .08).toFixed(1) + ' ' + (-h * .32).toFixed(1) +
        ' q' + (w * .13).toFixed(1) + ' ' + (h * .32).toFixed(1) + ' 0 ' + (h * .64).toFixed(1) + '"/>' +
      '<path class="borde" d="' + puBase + '"/>' +
      '<path class="borde" d="' + puYema + '"/>' +
      '<path class="carne pulgar" d="' + puBase + '"/>' +
      '<path class="carne pulgar" d="' + puYema + '"/>' +
            '<path class="surco" d="M' + (-w * .02).toFixed(1) + ' ' + (ar * h * .22).toFixed(1) +
        ' Q' + (w * .06).toFixed(1) + ' ' + (ar * h * .40).toFixed(1) +
        ' ' + (w * .10).toFixed(1) + ' ' + (ar * h * .58).toFixed(1) + '"/>' +
            '<path class="surco" d="M' + (-w * .44).toFixed(1) + ' ' + (-h * .24).toFixed(1) +
        ' Q' + (-w * .38).toFixed(1) + ' 0 ' + (-w * .44).toFixed(1) + ' ' + (h * .24).toFixed(1) + '"/>' +
      '<path class="surco" d="M' + (-w * .40).toFixed(1) + ' ' + (ar * h * .48).toFixed(1) +
        ' Q' + (-w * .31).toFixed(1) + ' ' + (ar * h * .30).toFixed(1) +
        ' ' + (-w * .22).toFixed(1) + ' ' + (ar * h * .48).toFixed(1) + '"/>' +
      '<ellipse class="brillo brilloPuno" cx="' + (-w * .06).toFixed(1) + '" cy="' +
        (ar * h * .34).toFixed(1) + '" rx="' + (w * .16).toFixed(1) +
        '" ry="' + (h * .10).toFixed(1) + '"/>' +
    '</g>';
  };
    const zapato = (cx0, base, largo, hacia) => {
    const p = (dx, dy) => (cx0 + hacia * dx).toFixed(1) + ' ' + (base + dy).toFixed(1);
    return '<path class="cuerpo pie" d="M' + p(-largo * .42, 0) +
      ' L' + p(largo * .46, 0) +
      ' Q' + p(largo * .62, 0) + ' ' + p(largo * .58, -2.1) +
      ' Q' + p(largo * .22, -3.6) + ' ' + p(-largo * .12, -3.4) +
      ' Q' + p(-largo * .42, -3.2) + ' ' + p(-largo * .42, 0) + ' Z"/>' +
      '<path class="suela" d="M' + p(-largo * .40, -.3) + ' L' + p(largo * .52, -.3) + '"/>';
  };
    const huso = (largo, alto, ang, sesgo) => {
    const a = largo, ar = (Math.abs(ang) > 90 ? 1 : -1) * alto, k = sesgo || 0;
    return '<path class="cuerpo" d="M' + (-a).toFixed(1) + ' 0' +
      ' C' + (-a * (.45 + k)).toFixed(1) + ' ' + ar.toFixed(1) +
      ',' + (a * (.30 - k * 1.6)).toFixed(1) + ' ' + (ar * .96).toFixed(1) +
      ',' + a.toFixed(1) + ' 0' +
      ' C' + (a * .35).toFixed(1) + ' ' + (-ar * .40).toFixed(1) +
      ',' + (-a * .45).toFixed(1) + ' ' + (-ar * .46).toFixed(1) +
      ',' + (-a).toFixed(1) + ' 0 Z"/>';
  };
    const trazoUno = (x1, y1, x2, y2, gr, cl) =>
    '<line class="' + cl + '" x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) +
    '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) +
    '" stroke-width="' + gr.toFixed(1) + '" stroke-linecap="round"/>';
  const linea = (x1, y1, x2, y2, gr, cl, clC) =>
    trazoUno(x1, y1, x2, y2, gr + 2.6, 'contorno ' + (clC || '')) +
    trazoUno(x1, y1, x2, y2, gr, cl || 'trazo');
  let bloques = '';
    for(let b = 0; b < fz; b++){
    const y = suelo - d.pierna - d.u * (b + 1) + 0.5;
    const x0 = cx - d.ancho / 2;
    bloques += '<rect class="cuerpo" x="' + x0.toFixed(1) + '" y="' + y.toFixed(1) +
      '" width="' + d.ancho.toFixed(1) + '" height="' + (d.u - 1).toFixed(1) + '" rx="2"/>';
        if(p.f < 0)
      bloques += '<rect class="trama" x="' + x0.toFixed(1) + '" y="' + y.toFixed(1) +
        '" width="' + d.ancho.toFixed(1) + '" height="' + (d.u - 1).toFixed(1) +
        '" rx="2" fill="url(#trama' + p.id + ')"/>';
    bloques += '<rect class="brillo" x="' + (x0 + 1.5).toFixed(1) + '" y="' + (y + 1).toFixed(1) +
      '" width="' + (d.ancho - 3).toFixed(1) + '" height="1.5" rx="1"/>';
  }
    const yCab = suelo - d.pierna - d.torso - d.cab * CAB_ALTA;
  const yHombros = suelo - d.pierna - d.torso;
  const ojoX = cx + dir * d.cab * 0.16;
  return '<svg width="' + d.w.toFixed(0) + '" height="' + d.h.toFixed(0) +
      '" viewBox="0 0 ' + d.w.toFixed(0) + ' ' + d.h.toFixed(0) +
      '" style="--gHum:' + gr(giroHumero) + ';--gAnt:' + gr(giroAnte) +
            ';--dir:' + dir + '" aria-hidden="true">' +
        '<defs>' +
    '<pattern id="trama' + p.id + '" width="7" height="7" patternUnits="userSpaceOnUse" ' +
      'patternTransform="rotate(35)">' +
      '<rect x="0" y="0" width="2.6" height="7" fill="rgba(16,11,26,.32)"/>' +
    '</pattern>' +
    '<clipPath id="clip' + p.id + '">' +
      '<rect x="-40" y="-40" width="' + (d.w + 80).toFixed(0) + '" height="' +
        (yCuerda - CUERDA_ALTO / 2 + 40).toFixed(1) + '"/>' +
      '<rect x="-40" y="' + (yCuerda + CUERDA_ALTO / 2).toFixed(1) + '" width="' +
        (d.w + 80).toFixed(0) + '" height="' + (d.h + 40).toFixed(0) + '"/>' +
    '</clipPath></defs>' +
    '<ellipse class="sombraP" cx="' + cx.toFixed(1) + '" cy="' + (suelo - 1) +
      '" rx="' + (d.pierna * .6).toFixed(1) + '" ry="2.5"/>' +
                miembro(kx, ky, d.pierna * .19, p2x, suelo - 3.4, d.pierna * .11, 'pata').join('') +
    miembro(kx, ky, d.pierna * .20, p1x, suelo - 3.4, d.pierna * .115, 'pata').join('') +
        zapato(p1x + dir * 1.5, suelo - .6, d.pierna * .42, dir) +
    zapato(p2x - dir * .5, suelo - .6, d.pierna * .38, dir) +
    '<g transform="rotate(' + (-dir * 19) + ' ' + cx.toFixed(1) + ' ' + suelo + ')">' +
      bloques +
            linea(cx, yHombros + 1, cx, yCab + d.cab * .42, d.cab * .34) +
      '<circle class="cuerpo" cx="' + cx.toFixed(1) + '" cy="' + yCab.toFixed(1) +
        '" r="' + (d.cab / 2).toFixed(1) + '"/>' +
            '<path class="oscuro" d="M' + (cx - d.cab*.44).toFixed(1) + ' ' + (yCab - d.cab*.27).toFixed(1) +
        ' a' + (d.cab/2+1).toFixed(1) + ' ' + (d.cab/2+1).toFixed(1) + ' 0 0 1 ' +
        (d.cab*.88).toFixed(1) + ' 0 z"/>' +
            (p.f < 0
        ? '<rect class="banda" x="' + (cx - d.cab*.44).toFixed(1) + '" y="' +
          (yCab - d.cab*.27).toFixed(1) + '" width="' + (d.cab*.88).toFixed(1) +
          '" height="1.6" rx=".8"/>'
        : '') +
                        (() => {
        const by = yCab - d.cab * .27, R = d.cab * .5;
        let g = '';
        for(const s of [-1, 1]){
                    g += '<path class="rama" d="M' + (cx + s * R * .88).toFixed(1) + ' ' +
            (by + 1.2).toFixed(1) + ' Q' + (cx + s * R * .72).toFixed(1) + ' ' +
            (by - 3.1).toFixed(1) + ' ' + (cx + s * 1.2).toFixed(1) + ' ' +
            (by - 4.1).toFixed(1) + '" fill="none"/>';
          for(let i = 0; i < 5; i++){
            const u = i / 4;
            const hx = cx + s * (R * (.86 - .30 * u) - u * u * 1.6);
            const hy = by + .9 - u * 5.1;
            const lado = i % 2 ? -1 : 1;
            const rot = -s * (16 + i * 15) + lado * 8 * s;
            g += '<ellipse cx="' + (hx + s * lado * .55).toFixed(1) + '" cy="' +
              (hy - lado * .5).toFixed(1) + '" rx="' + (2.35 - i * .21).toFixed(2) +
              '" ry="' + (.86 - i * .07).toFixed(2) + '" transform="rotate(' +
              rot.toFixed(0) + ' ' + hx.toFixed(1) + ' ' + hy.toFixed(1) + ')"/>';
          }
        }
        return '<g class="laurel">' + g +
          '<circle class="baya" cx="' + (cx - 1.15).toFixed(1) + '" cy="' + (by - 4.15).toFixed(1) + '" r=".78"/>' +
          '<circle class="baya" cx="' + (cx + 1.15).toFixed(1) + '" cy="' + (by - 4.15).toFixed(1) + '" r=".78"/>' +
          '<circle class="baya" cx="' + cx.toFixed(1) + '" cy="' + (by - 5.3).toFixed(1) + '" r=".72"/></g>';
      })() +
            (() => {
        const yOjo = yCab + 1.8;
                const techo = d.cab * .28 - 2.75;
        const ax = -2.45, ay = .55;
        const k = Math.max(.40, Math.min(1, (techo - ay) / 3.22));
        const bx = ax + .98 * k, by = ay + 2.19 * k;
        const px = bx - 2.03 * k, py = by + 1.03 * k;
        const X = f => (ojoX + dir * f).toFixed(1), Y = v => (yOjo + v).toFixed(1);
        return '<path d="M' + X(ax) + ' ' + Y(ay) + ' L' + X(bx) + ' ' + Y(by) +
          ' L' + X(px) + ' ' + Y(py) + '" fill="none" stroke="rgba(16,11,26,.72)" ' +
          'stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>';
      })() +
      '<circle class="blanco" cx="' + ojoX.toFixed(1) + '" cy="' + (yCab + 1.8).toFixed(1) + '" r="2.3"/>' +
      '<circle class="blanco" cx="' + (ojoX - dir * 5).toFixed(1) + '" cy="' + (yCab + 1.8).toFixed(1) + '" r="2"/>' +
      '<g transform="translate(' + (ojoX + dir * .7).toFixed(1) + ' ' + (yCab + 2).toFixed(1) +
        ')"><circle class="pupila ojoD" r="1.1"/></g>' +
      '<g transform="translate(' + (ojoX - dir * 4.4).toFixed(1) + ' ' + (yCab + 2).toFixed(1) +
        ')"><circle class="pupila ojoI" r="1"/></g>' +
            '<g transform="translate(' + (ojoX - dir * 2.15).toFixed(1) + ' ' + (yCab - .8).toFixed(1) +
        ')"><rect class="parpado" x="-5.2" y="0" width="10.4" height="5.6" rx="2.6"/></g>' +
            '<g transform="translate(' + (cx - dir * d.cab * .36).toFixed(1) + ' ' +
        (yCab - d.cab * .04).toFixed(1) +
        ')"><path class="sudor" d="M0 -2.3 C1.6 -.4 1.6 1.1 0 2 C-1.6 1.1 -1.6 -.4 0 -2.3 Z"/></g>' +
                        '<g transform="translate(' + (ojoX - dir * 1).toFixed(1) + ' ' +
        (yCab + d.cab*.28 + 1).toFixed(1) + ')"><rect class="rasgo boca" ' +
        'x="-2.5" y="-1" width="5" height="2" rx="1"/></g>' +
            '<g transform="translate(' + ojoX.toFixed(1) + ' ' + (yCab - d.cab*.13).toFixed(1) +
        ')"><rect class="rasgo ceja cejaD" x="-2.3" y="-.7" width="4.6" height="1.4" rx=".7"/></g>' +
      '<g transform="translate(' + (ojoX - dir * 5).toFixed(1) + ' ' + (yCab - d.cab*.13).toFixed(1) +
        ')"><rect class="rasgo ceja cejaI" x="-2.3" y="-.7" width="4.6" height="1.4" rx=".7"/></g>' +
    '</g>' +
            '<g class="trasCuerda" clip-path="url(#clip' + p.id + ')">' +
    '<g transform="translate(' + hx.toFixed(1) + ' ' + hy.toFixed(1) + ')">' +
      '<g class="brazoFuera">' +
        miembro(0, 0, d.brazoH * .5, codoX - hx, codoY - hy, d.brazoH * .38)[0] +
                '<g transform="translate(' + ((codoX - hx) * .42).toFixed(1) + ' ' +
          ((codoY - hy) * .42).toFixed(1) + ') rotate(' +
          (Math.atan2(codoY - hy, codoX - hx) * 180 / Math.PI).toFixed(1) + ')">' +
          huso(d.brazoH * .82, d.brazoH * .84,
               Math.atan2(codoY - hy, codoX - hx) * 180 / Math.PI, 0) +
        '</g>' +
        miembro(0, 0, d.brazoH * .5, codoX - hx, codoY - hy, d.brazoH * .38)[1] +
        '<g transform="translate(' + (codoX - hx).toFixed(1) + ' ' + (codoY - hy).toFixed(1) + ')">' +
          '<g class="anteFuera">' +
            (() => {
              const dxF = m2x - codoX, dyF = yCuerda - codoY;
              const angF = Math.atan2(dyF, dxF) * 180 / Math.PI;
              const capF = miembro(0, 0, d.brazoH * .4, dxF, dyF, d.brazoH * .24);
              return capF[0] +
                '<g transform="translate(' + (dxF * .36).toFixed(1) + ' ' +
                  (dyF * .36).toFixed(1) + ') rotate(' + angF.toFixed(1) + ')">' +
                  huso(d.brazoH * 1.30, d.brazoH * .60, angF, .16) +
                '</g>' +
                capF[1];
            })() +
            frascoEnMano(m2x - codoX, yCuerda - codoY, d.brazoH, 'panza') +
                        puno(m2x - codoX, yCuerda - codoY, d.brazoH * .58,
                 Math.atan2(yCuerda - codoY, m2x - codoX) * 180 / Math.PI, 'palma', true) +
                        frascoEnMano(m2x - codoX, yCuerda - codoY, d.brazoH, 'cuello') +
            '<ellipse class="penumbra" cx="' + (m2x - codoX).toFixed(1) + '" cy="' +
              (yCuerda - codoY).toFixed(1) + '" rx="' + (d.brazoH * .62).toFixed(1) +
              '" ry="' + (d.brazoH * .54).toFixed(1) + '"/>' +
          '</g>' +
        '</g>' +
      '</g>' +
    '</g>' +
    '</g>' +
        (() => {
            const cap = miembro(hx, hy, d.brazoH * .56, c1x, c1y, d.brazoH * .42);
      const triX = hx + (c1x - hx) * .34, triY = hy + (c1y - hy) * .34;
      return cap[0] +
        '<g transform="translate(' + bicX.toFixed(1) + ' ' + bicY.toFixed(1) +
          ') rotate(' + bicA.toFixed(1) + ')">' +
                    huso(d.brazoH * .95, d.brazoH * 1.02, bicA, 0) +
        '</g>' +
        '<g transform="translate(' + triX.toFixed(1) + ' ' + triY.toFixed(1) +
          ') rotate(' + (bicA + 180).toFixed(1) + ')">' +
          huso(d.brazoH * .88, d.brazoH * .66, bicA + 180, .1) +
        '</g>' +
        cap[1];
    })() +
    '<g transform="translate(' + bicX.toFixed(1) + ' ' + bicY.toFixed(1) +
      ') rotate(' + bicA.toFixed(1) + ')">' +
      (() => {
        const a = d.brazoH * 1.22, h = d.brazoH * 1.02;
        const ar = (Math.abs(bicA) > 90 ? 1 : -1) * h;
        return '<ellipse class="brillo" cx="' + (-a * .18).toFixed(1) + '" cy="' +
          (ar * .5).toFixed(1) + '" rx="' + (a * .32).toFixed(1) +
          '" ry="' + (Math.abs(ar) * .2).toFixed(1) + '"/>';
      })() +
    '</g>' +
    '<ellipse class="cuerpo" cx="' + c1x.toFixed(1) + '" cy="' + c1y.toFixed(1) +
      '" rx="' + (d.brazoH * .44).toFixed(1) + '" ry="' + (d.brazoH * .42).toFixed(1) + '"/>' +
        (() => {
      const dxA2 = m1x - c1x, dyA2 = yCuerda - c1y;
      const angA = Math.atan2(dyA2, dxA2) * 180 / Math.PI;
      const cxA = c1x + dxA2 * .36, cyA = c1y + dyA2 * .36;
            const cap = miembro(c1x, c1y, d.brazoH * .44, m1x, yCuerda, d.brazoH * .26);
      return cap[0] +
        '<g transform="translate(' + cxA.toFixed(1) + ' ' + cyA.toFixed(1) +
          ') rotate(' + angA.toFixed(1) + ')">' +
                    huso(d.brazoH * 1.45, d.brazoH * .70, angA, .16) +
        '</g>' +
        cap[1] +
        '<g transform="translate(' + cxA.toFixed(1) + ' ' + cyA.toFixed(1) +
          ') rotate(' + angA.toFixed(1) + ')">' +
          '<ellipse class="brillo" cx="' + (-d.brazoH * .22).toFixed(1) + '" cy="' +
          ((Math.abs(angA) > 90 ? 1 : -1) * d.brazoH * .36).toFixed(1) +
          '" rx="' + (d.brazoH * .34).toFixed(1) +
          '" ry="' + (d.brazoH * .14).toFixed(1) + '"/>' +
        '</g>';
    })() +
        '<ellipse class="sombraP" cx="' + m1x.toFixed(1) + '" cy="' + (yCuerda + 3.4).toFixed(1) +
      '" rx="' + (d.brazoH * .58).toFixed(1) + '" ry="1.5"/>' +
    '<ellipse class="sombraP sombraM2" cx="' + m2x.toFixed(1) + '" cy="' + (yCuerda + 3.4).toFixed(1) +
      '" rx="' + (d.brazoH * .52).toFixed(1) + '" ry="1.4"/>' +
    puno(m1x, yCuerda, d.brazoH * .52,
         Math.atan2(yCuerda - c1y, m1x - c1x) * 180 / Math.PI) +
    asomaCuerda(m1x, yCuerda, d.brazoH * .52) +
        '<text class="num" x="' +
      Math.max(8, Math.min(d.w - 8, gira(cx, yCab)[0])).toFixed(1) +
      '" y="12">' + fz + '</text>' +
    '</svg>';
}
raiz.Tirador = {dibujaTirador, medidasDe, frascoEnMano, conSigno, SUELO_CSS, CUERDA_CSS, CUERDA_Y};
})(window);
