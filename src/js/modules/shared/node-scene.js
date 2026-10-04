import { hasIndex } from '../../core/utils.js';

/*
 * Cena de nós com ponteiros, compartilhada pelos módulos de lista circular e de lista duplamente
 * encadeada. Cada passo carrega uma `scene` com os ponteiros de verdade, e o renderer desenha o que
 * o código fez até aquela linha e nada além disso:
 *
 * - `nodes`: `{ id, value, next, prev }`; `next` e `prev` são o id do nó apontado ou `null`
 *   (`prev` só existe na lista duplamente encadeada). O id de um nó da lista é a sua posição
 *   original e o nó novo recebe o id n;
 * - `row`: ids dos nós que já estão na fileira, na ordem em que são desenhados;
 * - `float`: `{ id, at }`, o nó recém-criado, que ainda não pertence à lista. Fica solto abaixo da
 *   fileira, em frente à vaga onde vai entrar (`at`: 'start' ou 'end'), até um nó da lista apontar
 *   para ele;
 * - `refs`: variáveis que apontam para nós (`inicio`, `temp`, `auxiliar`, `d`, `novoNo`); `null` é
 *   uma referência nula e uma chave ausente é uma variável ainda não atribuída;
 * - `linked` e `linkedPrev`: ids dos nós cujo `proximo` / `anterior` foi atribuído neste passo
 *   (a seta é animada);
 * - `vars`: `{ name, target, text, status, changed }` de cada parâmetro e variável do código, na ordem em
 *   que aparecem, para a barra de variáveis (`status`: 'param', 'unset' ainda sem valor, 'null' ou
 *   'set'; `changed`: atribuída neste passo). Ela fica sempre visível, mesmo fora da área rolada;
 * - `lane`: reserva a faixa do nó solto, para a altura da cena não mudar durante a execução;
 * - `doubly`: desenha também o ponteiro `anterior`; `tail`: a lista termina em nulo, então uma
 *   variável nula (o `temp` que passou do último nó) aparece sobre um selo `nulo` no fim da fileira.
 */

const NONE = '—';
const NULO = 'nulo';

/** Nós de uma lista com os ponteiros já ligados: circular (o último volta ao primeiro) ou duplamente encadeada. */
function initialNodes(kind, valores) {
  const n = valores.length;
  return valores.map((value, id) => (kind === 'doubly'
    ? { id, value, next: id < n - 1 ? id + 1 : null, prev: id > 0 ? id - 1 : null }
    : { id, value, next: (id + 1) % n, prev: null }));
}

const fmt = (value) => (Number.isInteger(value) ? String(value) : value.toLocaleString('pt-BR', { maximumFractionDigits: 2 }));
const range = (end, start = 0) => Array.from({ length: Math.max(0, end - start) }, (_, index) => start + index);

let runs = 0;

/**
 * Executa o algoritmo "como num depurador": `step` registra o estado atual como um passo, e as
 * demais funções mudam esse estado (ponteiros, variáveis, nó novo) antes do passo seguinte.
 * O painel de variáveis lista sempre os parâmetros e as variáveis do código, com `—` até que
 * sejam atribuídas. `finish` devolve os passos, cada um com o `run` da execução: o renderer só
 * anima de um passo para o outro dentro da mesma execução.
 */
export function trace({ kind, valores, params = {}, locals, lane = false }) {
  const st = {
    nodes: initialNodes(kind, valores),
    values: new Map(valores.map((value, id) => [id, value])),
    row: range(valores.length),
    float: null,
    refs: {},
    linked: [],
    linkedPrev: [],
  };
  const steps = [];
  const shown = (target) => (target === undefined ? NONE : target === null ? NULO : fmt(st.values.get(target)));

  let previousRefs = null;

  const step = (line, title, description, tone = 'neutral', extra = {}) => {
    const { variables = {}, ...marks } = extra;
    const changed = previousRefs ? locals.filter((name) => st.refs[name] !== previousRefs[name]) : [];
    previousRefs = { ...st.refs };
    const vars = [
      ...Object.entries(params).map(([name, text]) => ({ name, text, status: 'param' })),
      ...locals.map((name) => {
        const target = st.refs[name];
        return { name, target, text: shown(target), status: target === undefined ? 'unset' : target === null ? 'null' : 'set', changed: changed.includes(name) };
      }),
    ];
    const scene = {
      nodes: st.nodes.map((node) => ({ ...node })),
      row: [...st.row],
      float: st.float && { ...st.float },
      refs: { ...st.refs },
      vars,
      linked: st.linked,
      linkedPrev: st.linkedPrev,
      lane,
      doubly: kind === 'doubly',
      tail: kind === 'doubly',
    };
    const panel = Object.fromEntries(locals.map((name) => [name, shown(st.refs[name])]));
    steps.push({
      scene, line, title, description, tone, output: [], ...marks, variables: { ...params, ...panel, ...variables },
    });
    st.linked = [];
    st.linkedPrev = [];
  };

  const nodeOf = (id) => st.nodes.find((node) => node.id === id);

  /** `novoNo ← novo No(dado)`: o nó existe, mas ninguém aponta para ele, e os ponteiros nascem nulos. */
  const create = (value, at) => {
    const id = st.values.size;
    st.values.set(id, value);
    st.nodes.push({ id, value, next: null, prev: null });
    st.float = { id, at };
    st.refs.novoNo = id;
    return id;
  };

  /** `no.proximo ← alvo` */
  const link = (id, target) => {
    nodeOf(id).next = target;
    st.linked.push(id);
  };

  /** `no.anterior ← alvo` */
  const linkPrev = (id, target) => {
    nodeOf(id).prev = target;
    st.linkedPrev.push(id);
  };

  /** O nó passa a fazer parte da fileira (um nó da lista já aponta para ele). */
  const join = (row) => {
    st.float = null;
    st.row = row;
  };

  /** O nó removido sai da memória no passo final. */
  const drop = (id) => {
    st.nodes = st.nodes.filter((node) => node.id !== id);
    st.row = st.row.filter((item) => item !== id);
  };

  const finish = () => {
    runs += 1;
    return steps.map((item) => ({ ...item, run: runs }));
  };

  return { st, step, create, link, linkPrev, join, drop, finish };
}

// Geometria da cena, em px. Tudo é posicionado em coordenadas fixas, então as setas são
// calculadas sem medir o DOM. Cada nó é `[anterior] valor próximo`, com as células de ponteiro nas pontas.
const NODE_H = 46;
const PAD = 14;
const TOP = 58; // faixa das fichas acima da fileira (até duas empilhadas)
const CHANNEL = 62; // faixa dos arcos abaixo da fileira
const FLOAT_GAP = 66; // distância entre a fileira e o nó solto
const CHIP_W = 70;
const CHIP_H = 20;
const CHIP_STEP = 23;
// Fichas das variáveis que apontam para o mesmo nó, da mais próxima para a mais distante.
const CHIP_ORDER = ['d', 'temp', 'auxiliar', 'novoNo', 'inicio'];
const CHIP_KIND = { inicio: 'inicio', novoNo: 'novo', d: 'alvo' };
const SHAPES = {
  circular: { prev: 0, value: 44, next: 28, pitch: 92 },
  doubly: { prev: 24, value: 40, next: 24, pitch: 126 },
};

function shapeOf(scene) {
  const base = SHAPES[scene.doubly ? 'doubly' : 'circular'];
  // Na lista duplamente encadeada as setas de ida e de volta saem em alturas diferentes, para não se sobreporem.
  return { ...base, width: base.prev + base.value + base.next, nextY: scene.doubly ? 15 : NODE_H / 2, prevY: 31 };
}

const dotOf = (p, pointer, shape) => (pointer === 'prev'
  ? { x: p.x + shape.prev / 2, y: p.y + shape.prevY }
  : { x: p.x + shape.prev + shape.value + shape.next / 2, y: p.y + shape.nextY });

const arrowHead = (x, y, direction) => ({
  right: `M${x} ${y}l-8 -4v8z`,
  left: `M${x} ${y}l8 -4v8z`,
  up: `M${x} ${y}l-4 8h8z`,
  down: `M${x} ${y}l-4 -8h8z`,
}[direction]);

/** Posição de cada nó: os da fileira em vagas consecutivas e o nó solto abaixo da vaga onde vai entrar. */
function layout(scene, shape) {
  const { row, float, refs, lane } = scene;
  const before = refs.inicio === null && row.length ? 1 : 0; // a lista vazia ("nulo") ocupa a primeira vaga
  const gap = float ? before + (float.at === 'start' ? 0 : row.length) : -1;
  const tailSlot = before + row.length + (float ? 1 : 0);
  const hasTail = Boolean(scene.tail) && tailSlot > 0; // a vaga do selo `nulo` do fim é sempre reservada
  const slots = Math.max(1, tailSlot + (hasTail ? 1 : 0));
  const slotX = (slot) => PAD + slot * shape.pitch + (shape.pitch - shape.width) / 2;
  const rowBottom = TOP + NODE_H;
  const pos = new Map();
  row.forEach((id, index) => {
    const slot = before + index + (float && gap <= before + index ? 1 : 0);
    pos.set(id, { x: slotX(slot), y: TOP, slot });
  });
  if (float) pos.set(float.id, { x: slotX(gap), y: rowBottom + FLOAT_GAP, slot: gap, float: true });
  return {
    pos,
    slotX,
    tailSlot,
    hasTail,
    rowBottom,
    width: slots * shape.pitch + 2 * PAD,
    height: lane ? rowBottom + FLOAT_GAP + NODE_H + 32 : rowBottom + CHANNEL,
  };
}

/** Nós da fileira que não são mais alcançados a partir de `inicio` (removidos da lista). */
function lostNodes(scene) {
  const byId = new Map(scene.nodes.map((node) => [node.id, node]));
  const reached = new Set();
  let id = scene.refs.inicio;
  while (typeof id === 'number' && byId.has(id) && !reached.has(id)) {
    reached.add(id);
    id = byId.get(id).next;
  }
  return new Set(scene.row.filter((item) => !reached.has(item)));
}

/** Fichas com o nome de cada variável, acima do nó para o qual ela aponta (abaixo, para o nó solto). */
function chipsOf(scene, geo, shape) {
  const groups = new Map();
  CHIP_ORDER.forEach((name) => {
    const target = scene.refs[name];
    if (target === undefined) return;
    if (target === null && name !== 'inicio' && !geo.hasTail) return;
    const key = target === null ? (name === 'inicio' ? 'nulo' : 'tail') : target;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(name);
  });
  const chips = [];
  groups.forEach((names, key) => {
    let p;
    if (key === 'nulo') p = { x: geo.slotX(0), y: TOP };
    else if (key === 'tail') p = { x: geo.slotX(geo.tailSlot), y: TOP };
    else p = geo.pos.get(key);
    if (!p) return;
    const below = Boolean(p.float);
    names.forEach((name, k) => {
      const y = below ? p.y + NODE_H + 8 + k * CHIP_STEP : p.y - 6 - CHIP_H - k * CHIP_STEP;
      chips.push({ name, kind: CHIP_KIND[name] || 'cursor', x: p.x + shape.width / 2 - CHIP_W / 2, y, below, near: k === 0 });
    });
  });
  return chips;
}

/** Uma seta por ponteiro não nulo, saindo do ponto da célula do ponteiro. */
function wiresOf(scene, geo, shape, lost, faded) {
  const { pos, rowBottom } = geo;
  const pointers = scene.doubly ? ['next', 'prev'] : ['next'];
  const links = [];
  scene.nodes.forEach((node) => {
    const from = pos.get(node.id);
    if (!from) return;
    pointers.forEach((pointer) => {
      const target = node[pointer];
      const to = target === null ? null : pos.get(target);
      if (!to) return;
      let kind = 'arc';
      if (to.float) kind = 'toFloat';
      else if (from.float) kind = 'fromFloat';
      else if (to.slot === from.slot + (pointer === 'next' ? 1 : -1)) kind = 'straight';
      const marked = pointer === 'next' ? scene.linked : scene.linkedPrev;
      links.push({ node, pointer, from, to, kind, fresh: marked.includes(node.id), lost: lost.has(node.id) });
    });
  });

  // Setas que chegam pela base (ou pelo topo, no nó solto) de um nó: cada uma recebe um ponto de
  // chegada próprio, e as mais longas passam por fora das mais curtas para não se cruzarem.
  const span = (link) => Math.abs(link.to.slot - link.from.slot);
  const arrivals = links.filter((link) => link.kind !== 'straight');
  const order = (link) => (link.from.slot < link.to.slot ? span(link) : 1000 - span(link));
  arrivals.forEach((link) => {
    const group = arrivals.filter((other) => other.to === link.to).sort((a, b) => order(a) - order(b));
    link.anchor = link.to.x + shape.prev + shape.value / 2 + (group.indexOf(link) - (group.length - 1) / 2) * 12;
  });
  arrivals.filter((link) => link.kind === 'arc').sort((a, b) => span(a) - span(b)).forEach((link, rank) => {
    link.depth = 24 + rank * 14;
  });

  return links.map((link) => {
    const { from, to, kind, pointer } = link;
    const dot = dotOf(from, pointer, shape);
    let path;
    let head;
    if (kind === 'straight') {
      const tipX = pointer === 'next' ? to.x : to.x + shape.width;
      path = `M${dot.x} ${dot.y}H${tipX}`;
      head = arrowHead(tipX, dot.y, pointer === 'next' ? 'right' : 'left');
    } else if (kind === 'toFloat') {
      path = `M${dot.x} ${dot.y}C${dot.x} ${dot.y + 58} ${link.anchor} ${to.y - 52} ${link.anchor} ${to.y}`;
      head = arrowHead(link.anchor, to.y, 'down');
    } else if (kind === 'fromFloat') {
      path = `M${dot.x} ${dot.y}C${dot.x} ${dot.y - 70} ${link.anchor} ${rowBottom + 70} ${link.anchor} ${rowBottom}`;
      head = arrowHead(link.anchor, rowBottom, 'up');
    } else {
      const bottom = rowBottom + link.depth;
      const direction = link.anchor >= dot.x ? 1 : -1;
      const radius = Math.min(12, Math.abs(link.anchor - dot.x) / 2);
      path = `M${dot.x} ${dot.y}V${bottom - radius}Q${dot.x} ${bottom} ${dot.x + direction * radius} ${bottom}`
        + `H${link.anchor - direction * radius}Q${link.anchor} ${bottom} ${link.anchor} ${bottom - radius}V${rowBottom}`;
      head = arrowHead(link.anchor, rowBottom, 'up');
    }
    const classes = ['circ-link', pointer];
    if (link.fresh) classes.push('fresh');
    else if (link.lost) classes.push('lost');
    else if (faded(link.node.id) || faded(link.node[pointer])) classes.push('fade');
    return `<g class="${classes.join(' ')}"><path class="circ-wire" pathLength="1" d="${path}"/><path class="circ-head" d="${head}"/><circle class="circ-dot" cx="${dot.x}" cy="${dot.y}" r="3.5"/></g>`;
  }).join('');
}

// Posições do último passo desenhado: é a partir delas que nós e fichas deslizam até o novo lugar.
// Só há animação entre passos da mesma execução (`step.run`) e nunca ao redesenhar o mesmo passo.
let lastRender = { step: null, run: null, positions: new Map() };

function previousPositions(step, positions) {
  if (lastRender.step === step) return null;
  const previous = lastRender.run === step.run ? lastRender.positions : null;
  lastRender = { step, run: step.run, positions };
  return previous;
}

// A cena é recriada a cada passo, o que zeraria a rolagem horizontal das listas que não cabem na
// tela. A posição é guardada antes de redesenhar e restaurada em `afterRenderScene`, que também leva
// para a área visível o que mudou no passo.
let scrollLeft = 0;

function focusOf(step, geo) {
  const { scene } = step;
  const cursorOffEnd = scene.tail && ['temp', 'auxiliar', 'd'].some((name) => scene.refs[name] === null);
  const id = step.changedIndices?.[0] ?? step.foundIndices?.[0] ?? scene.linked[0] ?? scene.linkedPrev[0]
    ?? (cursorOffEnd ? scene.row.at(-1) : null) ?? scene.refs.temp ?? scene.refs.auxiliar
    ?? scene.float?.id ?? scene.refs.inicio;
  return typeof id === 'number' ? geo.pos.get(id) : null;
}

// Menor escala em que a cena ainda é legível; abaixo disso ela rola em vez de encolher.
const MIN_SCALE = 0.72;

export function afterRenderScene({ step, stage }) {
  const scroller = stage.querySelector('.node-scroll');
  const board = stage.querySelector('.circ-board');
  if (!scroller || !board) return;

  // A cena é encolhida para caber na largura do painel, para que todas as variáveis fiquem à vista.
  const natural = parseFloat(board.style.width);
  const scale = Math.min(1, Math.max(MIN_SCALE, (scroller.clientWidth - 4) / natural));
  if (scale < 1) board.style.zoom = scale.toFixed(3);

  scroller.scrollLeft = scrollLeft;
  if (scroller.scrollWidth <= scroller.clientWidth) return;
  const shape = shapeOf(step.scene);
  const p = focusOf(step, layout(step.scene, shape));
  if (!p) return;
  const x = (p.x + shape.width / 2) * scale;
  const margin = 60;
  if (x > scroller.scrollLeft + margin && x < scroller.scrollLeft + scroller.clientWidth - margin) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  scroller.scrollTo({ left: Math.max(0, x - scroller.clientWidth / 2), behavior: reduced ? 'auto' : 'smooth' });
}

/** Desenha a cena do passo. `showLost` acrescenta à legenda o nó "fora da lista" (algoritmos de remoção). */
export function renderScene({ state, step, icons, escapeText, showLost = false }) {
  const { scene } = step;
  scrollLeft = lastRender.run === step.run ? document.querySelector('.node-scroll')?.scrollLeft ?? 0 : 0;
  const shape = shapeOf(scene);
  const geo = layout(scene, shape);
  const lost = lostNodes(scene);
  const chips = chipsOf(scene, geo, shape);
  const valueOf = (id) => scene.nodes.find((node) => node.id === id)?.value;
  const target = (id) => (id === null ? NULO : `nó ${escapeText(valueOf(id))}`);

  // Nós e fichas que mudaram de lugar deslizam do último passo desenhado; os que acabaram de
  // surgir aparecem com um "pop".
  const positions = new Map([
    ...[...geo.pos].map(([id, p]) => [`n${id}`, p]),
    ...chips.map((chip) => [`c:${chip.name}`, chip]),
  ]);
  const previous = previousPositions(step, positions);
  const motion = (key, p) => {
    if (!previous) return { cls: '', vars: '' };
    const before = previous.get(key);
    if (!before) return { cls: ' born', vars: '' };
    const dx = before.x - p.x;
    const dy = before.y - p.y;
    return dx || dy ? { cls: ' glide', vars: `;--dx:${dx}px;--dy:${dy}px` } : { cls: '', vars: '' };
  };
  const moved = (id) => motion(`n${id}`, geo.pos.get(id) || { x: 0, y: 0 }).cls === ' glide';

  const cell = (kind, pointer) => `<span class="circ-${kind}${pointer === null ? ' null' : ''}">${pointer === null ? NULO : ''}</span>`;
  const nodes = scene.nodes.filter((node) => geo.pos.has(node.id)).map((node) => {
    const p = geo.pos.get(node.id);
    const classes = ['circ-node'];
    if (p.float) classes.push('detached');
    if (lost.has(node.id)) classes.push('lost');
    if (hasIndex(step.processedIndices, node.id)) classes.push('processed');
    if (hasIndex(step.changedIndices, node.id)) classes.push('changed');
    if (hasIndex(step.activeIndices, node.id)) classes.push('active');
    if (hasIndex(step.foundIndices, node.id)) classes.push('found');
    if (state.inspectedItem === node.id) classes.push('inspected');
    const links = `próximo: ${target(node.next)}${scene.doubly ? `, anterior: ${target(node.prev)}` : ''}`;
    const { cls, vars } = motion(`n${node.id}`, p);
    return `<div class="circ-slot${cls}" style="left:${p.x}px;top:${p.y}px${vars}">`
      + `<button type="button" class="${classes.join(' ')}" data-module-action="inspect-item" data-index="${node.id}" aria-label="Nó com valor ${escapeText(node.value)}, ${links}">`
      + `${scene.doubly ? cell('prev', node.prev) : ''}<span class="circ-value">${escapeText(node.value)}</span>${cell('next', node.next)}`
      + '</button></div>';
  }).join('');

  const pillAt = (slot) => `<span class="circ-null" style="left:${geo.slotX(slot) + shape.width / 2 - 28}px;top:${TOP + (NODE_H - 28) / 2}px">${NULO}</span>`;
  const tailUsed = geo.hasTail && Object.entries(scene.refs).some(([name, id]) => id === null && name !== 'inicio');
  const pills = (scene.refs.inicio === null ? pillAt(0) : '') + (tailUsed ? pillAt(geo.tailSlot) : '');

  const chipHtml = chips.map((chip) => {
    const { cls, vars } = motion(`c:${chip.name}`, chip);
    const classes = ['circ-chip', chip.kind, chip.below ? 'below' : '', chip.near ? 'near' : ''].filter(Boolean).join(' ');
    return `<div class="circ-pos${cls}" style="left:${chip.x}px;top:${chip.y}px${vars}"><span class="${classes}">${escapeText(chip.name)}</span></div>`;
  }).join('');

  const wires = wiresOf(scene, geo, shape, lost, (id) => id !== null && geo.pos.has(id) && moved(id));

  const inspected = state.inspectedItem === null ? null : scene.nodes.find((node) => node.id === state.inspectedItem);
  const inspection = inspected
    ? `<div class="inspection-card">${icons.info}<span>Nó selecionado</span><strong>valor = ${escapeText(inspected.value)}, proximo = ${target(inspected.next)}${scene.doubly ? `, anterior = ${target(inspected.prev)}` : ''}</strong></div>`
    : '';

  const varsHtml = scene.vars.map((item) => {
    const kind = item.status === 'param' ? 'param' : CHIP_KIND[item.name] || 'cursor';
    // Variável que ainda aponta para um nó já removido: o nó saiu da cena, mas a variável continua valendo.
    const gone = item.status === 'set' && !scene.nodes.some((node) => node.id === item.target);
    const classes = ['circ-var', kind, item.status === 'unset' || item.status === 'null' ? item.status : '', gone ? 'gone' : '', item.changed ? 'changed' : ''].filter(Boolean).join(' ');
    return `<span class="${classes}"><b>${escapeText(item.name)}</b><i>${item.status === 'param' ? '=' : '→'}</i><span>${escapeText(item.text)}${gone ? ' (removido)' : ''}</span></span>`;
  }).join('');

  const arrowLegend = scene.doubly
    ? '<span><i class="legend-dot next"></i> próximo</span><span><i class="legend-dot prev"></i> anterior</span>'
    : '';
  const lostLegend = showLost ? '<span><i class="legend-dot lost"></i> fora da lista</span>' : '';

  return `
    <div class="node-stage">
      <div class="node-dimensions"><span>nós na lista: ${scene.row.length}</span></div>
      <div class="circ-vars" aria-label="Variáveis do algoritmo">${varsHtml}</div>
      <div class="node-scroll">
        <div class="circ-board${scene.doubly ? ' doubly' : ''}" style="width:${geo.width}px;height:${geo.height}px;--w:${shape.width}px;--pw:${shape.prev}px;--vw:${shape.value}px">
          ${nodes}${pills}
          <svg class="circ-wires" style="width:${geo.width}px;height:${geo.height}px" viewBox="0 0 ${geo.width} ${geo.height}" aria-hidden="true">${wires}</svg>
          ${chipHtml}
        </div>
      </div>
      <div class="node-legend" aria-label="Legenda">
        <span><i class="legend-dot current"></i> atual</span>
        <span><i class="legend-dot compared"></i> alterado</span>
        <span><i class="legend-dot processed"></i> processado</span>
        <span><i class="legend-dot result"></i> resultado</span>
        ${arrowLegend}${lostLegend}
      </div>
    </div>${inspection}`;
}
