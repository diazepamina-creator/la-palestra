/* ══════════════════════════════════════════════════════════════════════
   LA PALESTRA · las entrevistas
   Zeus, Jeferión y Listillón contestan a lo que se les pregunte. Las
   preguntas y respuestas vienen tal cual de El pulso de los dioses; alguna
   respuesta trae una cuenta para verla en la tablilla.
   ══════════════════════════════════════════════════════════════════════ */
(function (raiz) {
'use strict';
const REDUCIDO = raiz.matchMedia && raiz.matchMedia('(prefers-reduced-motion: reduce)').matches;
const HABLAN = {jef: 'habla', lis: 'habla', zeus: 'habla'};
const ENTREVISTAS = {
  zeus: {nombre:'Zeus', cargo:'dios del rayo y árbitro de la palestra',
    hola:['enfada', 'Primera entrevista a cara descubierta en tres mil años. Tiene cinco minutos: los rayos no se lanzan solos.'],
    preguntas:[
      {id:'z1', p:'¿Por qué fulmina a los que se retiran?', pose:'enfada',
       r:'¡Porque abandonar un pulso a medias es de muy mala educación! Y además alguien tiene que llevar la cuenta: <b>cada rayo es una resta</b>. Sin rayo, nadie se enteraría de que el total ha cambiado.'},
      {id:'z1b', tras:'z1', p:'¿Y a los que entran no los fulmina?', pose:'rie',
       r:'¿A los que entran? ¡Si vienen a ayudar! <b>Entrar es sumar</b>, y sumar no necesita rayos. Necesita ganas.'},
      {id:'z2', p:'¿Es verdad que restar un negativo es sumar?', pose:'habla',
       r:'Mira: si retiro a uno que tiraba hacia la izquierda, la izquierda pierde fuerza y la bandera se va a la derecha. Eso es <b>− (−3) = +3</b>. No es magia. Bueno, un poco sí: la magia soy yo.'},
      {id:'z3', p:'¿Y si le mandan retirar a alguien que no está en el campo?', pose:'piensa',
       r:'No me voy a quedar con el rayo en la mano. Hago entrar una <b>pareja nula</b>, un +3 y un −3, que se anulan, y fulmino al −3. La bandera ni se inmuta… hasta que cae el rayo.'},
      {id:'z4', p:'¿Cuál es su número favorito?', pose:'rie',
       r:'El <b>cero</b>. Empate perfecto: nadie gana, nadie pierde, y yo me echo la siesta.'},
      {id:'z5', p:'¿Le duele el brazo de tanto lanzar rayos?', pose:'sorpresa',
       r:'Nadie me había preguntado eso en tres mil años… Un poco, sí. Sobre todo con el <b>menos delante de un paréntesis</b>: ¡hay rayo para todos los de dentro!'},
      {id:'z6', p:'¿Qué opina de Jeferión?', pose:'enfada',
       r:'Me paga en aceitunas. Y encima me pide que fulmine a los que tiran en su contra. ¡Yo soy <b>árbitro</b>, no su guardaespaldas! El rayo no mira de qué bando eres: mira a quién se retira.'},
      {id:'z7', p:'¿Alguna vez ha fallado un rayo?', pose:'calla', r:'Siguiente pregunta.'},
      {id:'z7b', tras:'z7', p:'Venga, en serio: ¿alguna vez?', pose:'piensa',
       r:'…Una vez. Me mandaron retirar a un <b>+2</b> y fulminé a un <b>−2</b>. La bandera se fue justo al revés: cuatro casillas de golpe. Desde entonces miro el <b>signo</b> dos veces antes de lanzar.'}
    ]},
  jef: {nombre:'Jeferión', cargo:'jefe del almacén de carros y patrocinador del equipo de la derecha',
    hola:['habla', 'Pregunte rápido, que tengo carros que cargar. Y hable bien de mí.'],
    preguntas:[
      {id:'j1', p:'¿Por qué lleva gafas, si es un dinosaurio?', pose:'habla',
       r:'Para leer las tablillas de Listillón. Escribe muy pequeño y con <b>muchos paréntesis</b>.'},
      {id:'j2', p:'¿Por qué siempre va con los de la derecha?', pose:'celebra',
       r:'¡Porque los de la derecha tiran hacia los positivos! Aunque Listillón dice que un <b>−5 tira más fuerte que un +3</b>. Me sigue doliendo.'},
      {id:'j2b', tras:'j2', p:'Entonces, ¿−5 es más que +3?', pose:'piensa',
       r:'Más <b>fuerte</b>, sí; más <b>grande</b>, no. El −5 tira con fuerza 5, pero en la regla queda más a la izquierda, así que es <b>menor</b>. Me lo ha explicado cuatro veces. Cinco con esta.'},
      {id:'j3', p:'¿Qué es lo que más le cuesta?', pose:'piensa',
       r:'Restar negativos. Si me quitan una deuda, gano, eso lo entiendo. Pero cuando lo veo escrito, <b>− (−3)</b>, me mareo. Hasta que cae el rayo y lo veo claro.'},
      {id:'j4', p:'¿Qué opina de las pociones de Traición?', pose:'celebra',
       r:'¡Mi poción favorita! Le cambia el bando al rival: <b>es un menos que se bebe</b>. Aunque una vez me la bebí yo por error y me pasé la tarde tirando en mi contra.'},
      {id:'j5', p:'¿Por qué Listillón tiene que escribirlo todo?', pose:'senala',
       r:'Porque lo que pasa en el campo se lo lleva el viento. Lo que se escribe con signos <b>se puede comprobar</b>. Y así nadie me discute las cuentas. Bueno, Listillón sí.'},
      {id:'j6', p:'¿Es usted buen jefe?', pose:'sorpresa',
       r:'¿Cómo que si soy…? ¡Pues claro! Pregúntele a Listillón. …Mejor no le pregunte.'},
      {id:'j7', p:'¿Qué haría con mil tiradores?', pose:'celebra',
       r:'¡Ganar! Aunque en el campo solo caben <b>cinco por lado</b>. Listillón dice que es una restricción del problema. Yo digo que es una injusticia.'}
    ]},
  lis: {nombre:'Listillón', cargo:'escriba oficial de Jeferión y autor de las tablillas',
    hola:['habla', 'Apunto las preguntas y contesto las respuestas. Por ese orden.'],
    preguntas:[
      {id:'l1', p:'¿Qué apunta en su tablilla?', pose:'habla', zoom:true,
       r:'Todo lo que pasa en el campo, <b>con signos</b>. Si entra un −3, escribo <b>+ (−3)</b>. Si se retira, <b>− (−3)</b>. Así el jefe no puede decir que no pasó. Y… bueno, algún dibujo.'},
      {id:'l2', p:'¿Por qué dice que el signo y la fuerza son dos preguntas?', pose:'senala',
       r:'Porque lo son. La <b>fuerza</b> es cuánto tira: el número sin signo. El <b>signo</b> es hacia dónde. El jefe mezcla las dos cosas y luego se enfada con la regla.'},
      {id:'l3', p:'¿Por qué el frasco espera en el banquillo?', pose:'senala',
       r:'Porque en <b>3·(−2 + 1)</b> el 3 está escrito antes de que haya nadie a quien dárselo. Se escribe en un orden y se juega en otro: eso es la <b>jerarquía</b>. ¿Quiere verlo?',
       prueba:[{t:'p',k:3},{t:'('},{t:'n',f:-2},{t:'+'},{t:'n',f:1},{t:')'}]},
      {id:'l4', p:'¿Qué es lo más difícil de ser escriba de Jeferión?', pose:'piensa',
       r:'Que lo quiere todo en positivo. Le digo que el total es −4 y me contesta: «Escríbelo más bonito». <b>El −4 ya es bonito</b>, jefe.'},
      {id:'l5', p:'¿Se lleva bien con Zeus?', pose:'sorpresa',
       r:'Nos respetamos. Él lanza los rayos y yo apunto las restas. Una vez se equivocó de tirador y… eso pregúnteselo a él.'},
      {id:'l6', p:'¿Por qué lleva ese sombrero?', pose:'celebra',
       r:'Es un <b>pétaso</b>, el sombrero de los viajeros y de Hermes. Y para que no me caigan encima los paréntesis: hay días que llueven.'},
      {id:'l7', p:'¿Qué le diría a quien odia los números negativos?', pose:'celebra',
       r:'Que no son malos: son <b>del otro bando</b>. Sin ellos no habría pulso, solo gente tirando de una cuerda hacia el mismo lado. Qué aburrimiento.'},
      {id:'l8', p:'¿Cómo sabe que una cuenta está bien?', pose:'senala',
       r:'La juego en el campo. Si la bandera para donde dice la cuenta, está bien. Si no, alguien se ha equivocado de signo. <b>Casi siempre es el signo</b>.'}
    ]}
};

/* LA TABLILLA DE LISTILLÓN, DE CERCA: lo que apunta hoy y, en un rincón,
   una caricatura del jefe riéndose, rayada a escondidas */
const TABLILLA_DE_CERCA = (() => {
  const T = '#4a3418';   // el trazo rayado en el barro
  const raya = (d, w) => '<path d="' + d + '" fill="none" stroke="' + T + '" stroke-width="' + (w || 1.6) + '" stroke-linecap="round" stroke-linejoin="round"/>';
  const texto = (x, y, s, tam, giro) => '<text x="' + x + '" y="' + y + '" font-family="Space Mono, monospace" font-size="' + tam + '" fill="' + T + '"' +
    (giro ? ' transform="rotate(' + giro + ' ' + x + ' ' + y + ')"' : '') + '>' + s + '</text>';
  return '<svg viewBox="0 0 320 200" role="img" aria-label="La tablilla de Listillón, de cerca: la cuenta con signos y una caricatura de Jeferión riéndose">' +
    '<defs><linearGradient id="tdc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6d4ac"/><stop offset="1" stop-color="#d2bb8a"/></linearGradient></defs>' +
    '<rect x="6" y="6" width="308" height="188" rx="14" fill="url(#tdc)" stroke="#8a6a3b" stroke-width="3"/>' +
    '<rect x="14" y="14" width="292" height="172" rx="9" fill="none" stroke="#b8a074" stroke-width="1.2" stroke-dasharray="3 4"/>' +
    /* lo apuntado, con signos */
    texto(26, 44, 'hoy, en el campo:', 11, -1) +
    texto(26, 72, 'entra −3   →  + (−3)', 14, -1.5) +
    texto(26, 98, 'se va −3   →  − (−3)', 14, -.5) +
    texto(26, 124, 'total: 0 (empate)', 11, -1) +
    raya('M24 132 q40 3 82 0 t50 1', 1.2) +
    texto(26, 160, 'el jefe: «escríbelo más bonito»', 11, -.8) +
    texto(26, 178, 'ya es bonito.', 11, .6) +
    /* la caricatura del jefe: dinosaurio cabezón, con gafas, púas, colita y carcajada */
    '<g transform="translate(226 92) rotate(6)">' +
      raya('M-26 -18 l-8 -2 l6 -6 M-27 -29 l-7 -5 l8 -3 M-20 -38 l-3 -8 l8 1', 1.6) +                  /* púas del cogote */
      raya('M-20 -6 Q-32 -36 -2 -43 Q24 -47 32 -29 Q40 -28 45 -23 Q49 -18 44 -14 L30 -10 Q20 -2 0 2 Q-16 4 -20 -6 Z', 2.2) + /* cráneo redondo, hocico corto */
      raya('M40 -24 l2 0', 1.6) +                                                                          /* el orificio */
      raya('M2 -14 L42 -18', 1.8) +                                                                        /* la boca, abierta de risa */
      raya('M8 -16 l2 -5 l3 5 l3 -5 l3 5 l3 -5 l3 5 l3 -5 l3 5', 1.3) +                                   /* dientes arriba */
      raya('M10 -12 l3 5 l3 -5 l3 5 l3 -5 l3 5', 1.3) +                                                   /* dientes abajo */
      raya('M0 -30 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M20 -32 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M8 -30 L12 -32', 1.8) + /* gafas */
      raya('M-6 -32 l4 3 M16 -34 l4 3', 1.4) +                                                             /* ojos apretados de reír */
      raya('M-8 4 q-6 18 4 30 M14 4 q6 16 -2 30 M-6 32 h32', 1.8) +                                        /* el cuerpo, de palo */
      raya('M-13 12 l-6 -2 l5 -4 M-13 22 l-6 -1 l5 -5', 1.4) +                                             /* púas en la espalda */
      raya('M-4 30 q-16 6 -26 -4 l-2 -6 l6 3', 1.6) +                                                      /* la cola */
      raya('M-6 12 l-14 -8 M12 12 l16 -6 l-2 6', 1.6) +                                                    /* los brazos, uno señalando */
      texto(-30, -54, 'JA JA JA', 13, -8) +
      texto(30, 44, 'el jefe', 10, 4) +
    '</g>' +
    /* la mano de Listillón tapando la esquina, que esto no lo vea nadie */
    raya('M262 186 q10 -22 34 -18 q16 4 18 22', 2) +
  '</svg>';
})();

/* monta la entrevista en su sección; o.alPrueba(tok) abre una cuenta en la tablilla */
function monta(el, o){
  const DIBUJA = raiz.Personajes.DIBUJA;
  const $ = c => el.querySelector(c);
  const ev = {quien: 'zeus', hechas: new Set(), tok: 0};
  const quien = $('.ev-quien');
  [['zeus', 'Zeus'], ['jef', 'Jeferión'], ['lis', 'Listillón']].forEach(([id, nom]) => {
    const b = document.createElement('button');
    b.dataset.q = id; b.type = 'button';
    b.innerHTML = '<span class="ev-mini">' + DIBUJA[id]('calla') + '</span>' + nom;
    b.addEventListener('click', () => elige(id));
    quien.appendChild(b);
  });
  function elige(q){
    ev.quien = q; ev.hechas = new Set();
    $('.ev-cara').dataset.q = q;          // para que mire hacia el bocadillo
    el.dataset.quien = q;                 // Zeus, además, sale en su nube y con su aureola
    quien.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.q === q)));
    const E = ENTREVISTAS[q];
    $('.ev-cartel').innerHTML = 'Hoy entrevistamos a <b>' + E.nombre + '</b>, ' + E.cargo + '.';
    $('.ev-pregunta').textContent = '';
    contesta(E.hola[0], E.hola[1]);
    pintaPreguntas();
  }
  function pintaPreguntas(){
    const E = ENTREVISTAS[ev.quien], L = $('.ev-lista');
    L.innerHTML = '';
    E.preguntas.filter(q => !q.tras || ev.hechas.has(q.tras)).forEach(q => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ev-p' + (ev.hechas.has(q.id) ? ' hecha' : '') + (q.tras ? ' repregunta' : '');
      b.innerHTML = (q.tras ? '<span class="ev-re">repregunta</span> ' : '') + q.p;
      b.addEventListener('click', () => pregunta(q));
      L.appendChild(b);
    });
  }
  function pregunta(q){
    ev.hechas.add(q.id);
    $('.ev-pregunta').innerHTML = '— ' + q.p;
    const esc = $('.ev-escena');       // en el móvil, que se vea quién contesta
    if(esc.getBoundingClientRect().top < 0) esc.scrollIntoView({behavior: 'smooth', block: 'start'});
    contesta(q.pose, q.r, q.prueba, q.zoom);
    pintaPreguntas();
  }
  /* la respuesta sale letra a letra, con la boca moviéndose; al acabar, la postura */
  function contesta(pose, html, prueba, conZoom){
    const tok = ++ev.tok;
    const cara = $('.ev-cara'), dibu = DIBUJA[ev.quien], txt = $('.ev-respuesta'), bp = $('.ev-prueba');
    bp.hidden = true;
    const zoom = $('.ev-zoom');
    if(zoom){ zoom.hidden = true; zoom.innerHTML = ''; }
    const trozos = html.split(/(<[^>]+>)/).filter(Boolean);
    const total = trozos.reduce((n, t) => n + (t[0] === '<' ? 0 : t.length), 0);
    const cierre = () => {
      if(ev.tok !== tok) return;
      txt.innerHTML = html;
      cara.innerHTML = dibu(pose);
      /* Zeus enfadado: truena */
      el.classList.remove('ev-trueno');
      if(ev.quien === 'zeus' && pose === 'enfada' && !REDUCIDO){ void el.offsetWidth; el.classList.add('ev-trueno'); }
      if(conZoom && zoom){ zoom.innerHTML = TABLILLA_DE_CERCA; zoom.hidden = false; }
      if(prueba && o && o.alPrueba){
        bp.hidden = false;
        bp.onclick = () => o.alPrueba(prueba.map(t => Object.assign({}, t, t.t === 'p' ? {pre: true} : {})));
      }
    };
    if(REDUCIDO){ cierre(); return; }
    let n = 0;
    const paso = () => {
      if(ev.tok !== tok) return;
      n = Math.min(total, n + 2);
      let quedan = n, h = '';
      for(const t of trozos){
        if(t[0] === '<'){ h += t; continue; }
        if(quedan <= 0) break;
        h += t.slice(0, quedan); quedan -= t.length;
      }
      txt.innerHTML = h;
      cara.innerHTML = dibu(Math.floor(n / 6) % 2 ? 'calla' : (pose === 'calla' ? 'calla' : HABLAN[ev.quien]));
      if(n < total) setTimeout(paso, 28); else cierre();
    };
    paso();
  }
  return {elige, abre: () => elige(ev.quien), calla: () => { ev.tok++; }};
}
raiz.Entrevistas = {ENTREVISTAS, monta, TABLILLA_DE_CERCA};
})(window);
