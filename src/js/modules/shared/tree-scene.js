import { hasIndex } from '../../core/utils.js';
import { locale } from '../../core/i18n.js';

/*
 * Cena de árvore binária, usada pelo módulo de Árvore Binária de Busca. Como em node-scene.js, cada
 * passo carrega uma `scene` com os ponteiros de verdade, e o renderer desenha o que o código fez até
 * aquela linha e nada além disso:
 *
 * - `nodes`: `{ id, value, origin, left, right, h }`. `left` e `right` são o id do filho, `null` (nulo)
 *   ou `undefined` (campo ainda não atribuído, só no construtor). `origin` é o valor que o nó teve ao
 *   nascer: depois de `atual.valor ← suc.valor` o valor muda, mas o nó é o mesmo. `h` é a altura
 *   guardada no nó (só nas árvores AVL; fica desatualizada até o código executar `nó.altura ← ...`);
 * - `root`: id da raiz (`null` com a árvore vazia);
 * - `float`: id do nó recém-criado, que ainda não pertence à árvore. Fica isolado à direita, até um
 *   ponteiro (`raiz`, `pai.esquerda`, `pai.direita`) passar a apontar para ele;
 * - `refs`: variáveis que apontam para nós (`raiz`, `atual`, `pai`, `suc`, `paiSuc`, `filho`, `novo`);
 *   `null` é uma referência nula e uma chave ausente é uma variável ainda não atribuída;
 * - `nullAt`: de onde veio cada referência nula (`{ parent, side }`), para desenhar o selo `nulo` na
 *   vaga do filho que não existe e pôr ali a ficha da variável;
 * - `reached`, `lost`, `depth`: nós alcançáveis a partir da raiz, nós que deixaram de ser alcançados
 *   (removidos) e a profundidade de cada nó (a última conhecida, para os removidos);
 * - `visited` e `fresh`: nós pelos quais `atual`/`suc` já passaram (o caminho) e nós cuja ligação com o
 *   pai foi atribuída neste passo (a seta é animada);
 * - `vars`: `{ name, target, text, status, changed }` de cada parâmetro e variável do código, para a
 *   barra de variáveis, que fica sempre visível;
 * - `badges`: `{ id: texto }`, o selo abaixo de cada nó (a ordem de visita nos percursos);
 * - `fb`: `{ id: fator }`, o fator de balanceamento já calculado de alguns nós (selo azul, ou vermelho
 *   quando |FB| > 1) ao lado da altura guardada.
 *
 * A posição horizontal de um nó é a sua ordem entre todos os nós que passam pela execução (`ranks`,
 * calculada uma vez por execução): inserir ou remover um nó não empurra os demais, e uma rotação
 * (que preserva a ordem em ordem) só muda a altura do nó. A vertical é a profundidade atual, então um
 * nó promovido sobe um nível. Sem `levels` no layout, o número de níveis é o da execução inteira.
 */

const NONE = '—';
const NULO = 'nulo';

export const fmt = (value) => (Number.isInteger(value) ? String(value) : value.toLocaleString(locale, { maximumFractionDigits: 2 }));

// ---------------------------------------------------------------------------------------------
// Estrutura
// ---------------------------------------------------------------------------------------------

/** Árvore obtida inserindo `valores` na ordem (iguais à direita). O id de um nó é a sua posição na lista. */
export function buildTree(valores) {
  const nodes = [];
  let root = null;
  valores.forEach((value, id) => {
    nodes.push({ id, value, left: null, right: null });
    if (root === null) {
      root = id;
      return;
    }
    let current = nodes[root];
    for (;;) {
      const side = value < current.value ? 'left' : 'right';
      if (current[side] === null) {
        current[side] = id;
        break;
      }
      current = nodes[current[side]];
    }
  });
  return { nodes, root };
}

/** Nós em ordem (esquerda, nó, direita) a partir de `start`. */
export function inorder(tree, start = tree.root) {
  const out = [];
  const walk = (id) => {
    if (typeof id !== 'number') return;
    walk(tree.nodes[id].left);
    out.push(id);
    walk(tree.nodes[id].right);
  };
  walk(start);
  return out;
}

/** Nós de `start` em pré-ordem (nó, esquerda, direita). */
export function preorder(tree, start = tree.root) {
  const out = [];
  const walk = (id) => {
    if (typeof id !== 'number') return;
    out.push(id);
    walk(tree.nodes[id].left);
    walk(tree.nodes[id].right);
  };
  walk(start);
  return out;
}

/** Nós de `start` em pós-ordem (esquerda, direita, nó). */
export function postorder(tree, start = tree.root) {
  const out = [];
  const walk = (id) => {
    if (typeof id !== 'number') return;
    walk(tree.nodes[id].left);
    walk(tree.nodes[id].right);
    out.push(id);
  };
  walk(start);
  return out;
}

/** Nós de `start` em largura: nível por nível, da esquerda para a direita. */
export function levelorder(tree, start = tree.root) {
  const out = [];
  const queue = typeof start === 'number' ? [start] : [];
  while (queue.length) {
    const id = queue.shift();
    out.push(id);
    ['left', 'right'].forEach((side) => {
      if (typeof tree.nodes[id][side] === 'number') queue.push(tree.nodes[id][side]);
    });
  }
  return out;
}

/** Altura em arestas: uma folha tem altura 0 e o nó nulo, −1. */
export function heightOf(tree, id = tree.root) {
  if (typeof id !== 'number') return -1;
  const node = tree.nodes[id];
  return 1 + Math.max(heightOf(tree, node.left), heightOf(tree, node.right));
}

/** Profundidade (arestas desde a raiz) de cada nó alcançável, como um `Map`. */
export function depthsOf(tree) {
  const depth = new Map();
  const walk = (id, d) => {
    if (typeof id !== 'number' || depth.has(id)) return;
    depth.set(id, d);
    walk(tree.nodes[id].left, d + 1);
    walk(tree.nodes[id].right, d + 1);
  };
  walk(tree.root, 0);
  return depth;
}

/** Pai e lado (`left`/`right`) de cada nó alcançável, exceto a raiz. */
export function parentsOf(tree) {
  const parents = new Map();
  depthsOf(tree).forEach((_, id) => {
    ['left', 'right'].forEach((side) => {
      const child = tree.nodes[id][side];
      if (typeof child === 'number') parents.set(child, { parent: id, side });
    });
  });
  return parents;
}

/** Ordem horizontal de cada nó (em ordem), número de vagas e de níveis da árvore. */
export function layoutOf(tree) {
  const order = inorder(tree);
  return { ranks: new Map(order.map((id, rank) => [id, rank])), slots: order.length, levels: heightOf(tree) + 1 };
}

// ---------------------------------------------------------------------------------------------
// Execução como num depurador
// ---------------------------------------------------------------------------------------------

const CHIP_ORDER = ['raiz', 'atual', 'No', 'nó', 'pai', 'suc', 'paiSuc', 'filho', 'novo', 'temp', 'y', 'x', 'T2'];
// Fichas que aparecem sobre o selo `nulo` quando a árvore está vazia.
const EMPTY_CHIPS = ['raiz', 'atual', 'No', 'nó', 'pai'];
const CHIP_KIND = {
  raiz: 'inicio', atual: 'atual', No: 'atual', nó: 'atual', pai: 'cursor', suc: 'alvo', paiSuc: 'cursor', filho: 'filho', novo: 'novo', temp: 'alvo', y: 'cursor', x: 'novo', T2: 'filho',
};

let runs = 0;

function reachFrom(nodes, rootId) {
  const depth = new Map();
  const queue = typeof rootId === 'number' ? [[rootId, 0]] : [];
  while (queue.length) {
    const [id, d] = queue.shift();
    if (depth.has(id)) continue;
    depth.set(id, d);
    ['left', 'right'].forEach((side) => {
      if (typeof nodes[id][side] === 'number') queue.push([nodes[id][side], d + 1]);
    });
  }
  return depth;
}

/**
 * Executa o algoritmo "como num depurador": `step` registra o estado atual como um passo, e as
 * demais funções mudam esse estado (variáveis, ponteiros, nó novo) antes do passo seguinte.
 * `tree` é a árvore de partida (`buildTree`) e `layout` a ordem horizontal de todos os nós da
 * execução (`layoutOf` da árvore em que aparecem todos). O painel de variáveis lista sempre os
 * parâmetros e as variáveis do código, com `—` até serem atribuídas.
 */
export function treeTrace({ tree, layout, params = {}, locals, allNulls = false }) {
  const st = {
    nodes: tree.nodes.map((node) => ({ ...node, origin: node.value })),
    refs: { raiz: tree.root },
    nullAt: {},
    float: null,
    visited: [],
    fresh: [],
    gone: new Set(),
    lastDepth: new Map(),
    badges: new Map(),
    fb: new Map(),
    // Durante uma rotação, o ponteiro do pai ainda aponta para `from` (o nó que vai descer), mas a
    // cena já desenha `to` (o nó que sobe) no lugar dele, como nos slides, até o chamador ligar o retorno.
    alias: null,
    params: { ...params },
  };
  const steps = [];
  let assigned = new Set();

  const shown = (target) => {
    if (target === undefined) return NONE;
    if (target === null) return NULO;
    const node = st.nodes[target];
    const text = node.value === node.origin ? fmt(node.value) : `${fmt(node.value)} [nó ${fmt(node.origin)}]`;
    // Variável que ainda aponta para um nó já removido: o nó saiu da cena, mas a variável continua valendo.
    return st.gone.has(target) ? `${text} (removido)` : text;
  };

  const step = (line, title, description, tone = 'neutral', extra = {}) => {
    const { variables = {}, ...marks } = extra;
    // Com um alias ativo, os ponteiros de fora da subárvore girada que apontam para `from` valem `to`.
    const { alias } = st;
    const inside = alias ? new Set(reachFrom(st.nodes, alias.to).keys()) : null;
    const link = (owner, pointer) => (alias && pointer === alias.from && !inside.has(owner) ? alias.to : pointer);
    const view = alias ? st.nodes.map((node) => ({ ...node, left: link(node.id, node.left), right: link(node.id, node.right) })) : st.nodes;
    const root = alias ? link(null, st.refs.raiz ?? null) : st.refs.raiz ?? null;
    const depth = reachFrom(view, root);
    depth.forEach((d, id) => st.lastDepth.set(id, d));
    const alive = view.filter((node) => !st.gone.has(node.id));
    const lost = alive.filter((node) => !depth.has(node.id) && node.id !== st.float).map((node) => node.id);
    const vars = [
      ...Object.entries(st.params).map(([name, text]) => ({ name, text, status: 'param' })),
      ...locals.map((name) => {
        const target = st.refs[name];
        return { name, target, text: shown(target), status: target === undefined ? 'unset' : target === null ? 'null' : 'set', changed: assigned.has(name) };
      }),
    ];
    const nullAt = {};
    Object.entries(st.nullAt).forEach(([name, at]) => {
      if (st.refs[name] === null) nullAt[name] = at;
    });
    const scene = {
      nodes: alive.map(({ id, value, origin, left, right, h }) => ({ id, value, origin, left, right, h })),
      root,
      float: st.float,
      refs: { ...st.refs },
      nullAt,
      reached: [...depth.keys()],
      lost,
      depth: Object.fromEntries([...st.lastDepth].filter(([id]) => !st.gone.has(id))),
      visited: [...st.visited],
      fresh: [...st.fresh],
      vars,
      badges: Object.fromEntries(st.badges),
      fb: Object.fromEntries(st.fb),
      ranks: layout.ranks,
      slots: layout.slots,
      levels: layout.levels,
      allNulls,
    };
    const panel = Object.fromEntries(locals.map((name) => [name, shown(st.refs[name])]));
    steps.push({
      scene, line, title, description, tone, output: [], ...marks, variables: { ...st.params, ...panel, ...variables },
    });
    assigned = new Set();
    st.fresh = [];
  };

  /** `novo ← CRIAR_NÓ(valor)`: o nó existe, mas ninguém aponta para ele, e `esquerda`/`direita` nascem nulos. */
  const create = (value, name = 'novo', { pending = false, h } = {}) => {
    const id = st.nodes.length;
    st.nodes.push({
      id, value, origin: value, left: pending ? undefined : null, right: pending ? undefined : null, ...(h === undefined ? {} : { h }),
    });
    st.float = id;
    if (name) {
      st.refs[name] = id;
      assigned.add(name);
    }
    return id;
  };

  /** `variavel ← alvo` (`at` diz de qual ponteiro nulo veio, para o selo `nulo`). */
  const set = (name, target, at = null) => {
    st.refs[name] = target;
    if (target === null && at) st.nullAt[name] = at;
    else delete st.nullAt[name];
    assigned.add(name);
    if (typeof target === 'number') {
      if (name === 'raiz' && st.float === target) st.float = null;
      if ((name === 'atual' || name === 'suc') && !st.visited.includes(target)) st.visited.push(target);
    }
  };

  /** `variavel ← pai.esquerda` / `pai.direita`; devolve o id do filho (ou `null`). */
  const follow = (name, parentId, side) => {
    const child = st.nodes[parentId][side] ?? null;
    set(name, child, child === null ? { parent: parentId, side } : null);
    return child;
  };

  /** `pai.esquerda ← filho` / `pai.direita ← filho`; ligar o nó solto o faz entrar na árvore. */
  const setChild = (parentId, side, childId) => {
    st.nodes[parentId][side] = childId;
    if (typeof childId === 'number') {
      if (st.float === childId) st.float = null;
      st.fresh.push(childId);
    }
  };

  /** `atual.valor ← novoValor` */
  const setValue = (id, value) => {
    st.nodes[id].value = value;
  };

  /** O nó removido sai da memória no passo final. */
  const drop = (id) => {
    st.gone.add(id);
  };

  /** Selo abaixo do nó (por exemplo, `3º`, a ordem de visita); sem `text`, tira o selo. */
  const badge = (id, text = null) => {
    if (text === null) st.badges.delete(id);
    else st.badges.set(id, text);
  };

  const clearBadges = () => st.badges.clear();

  /** `nó.altura ← ...`: a altura guardada no nó. */
  const setHeight = (id, h) => {
    st.nodes[id].h = h;
  };

  /** Mostra o fator de balanceamento já calculado de um nó; sem `value`, tira o selo. */
  const setFb = (id, value = null) => {
    if (value === null) st.fb.delete(id);
    else st.fb.set(id, value);
  };

  const clearFb = () => st.fb.clear();

  /** Liga o alias de uma rotação (`to` sobe para o lugar de `from`); sem argumentos, desliga. */
  const setAlias = (from = null, to = null) => {
    st.alias = from === null ? null : { from, to };
  };

  /** Variáveis locais de uma nova chamada: voltam a "não atribuídas" e o caminho percorrido recomeça. */
  const clear = (names) => {
    names.forEach((name) => {
      delete st.refs[name];
      delete st.nullAt[name];
    });
    st.visited = [];
  };

  const finish = () => {
    runs += 1;
    const floatCol = steps.some((item) => item.scene.float !== null);
    // Fichas empilhadas sobre a raiz (ou sobre o selo `nulo`, com a árvore vazia): reservam altura no topo.
    const rootStack = Math.max(1, ...steps.map(({ scene }) => (scene.root === null
      ? EMPTY_CHIPS.filter((name) => scene.refs[name] === null && !scene.nullAt[name]).length
      : CHIP_ORDER.filter((name) => scene.refs[name] === scene.root).length)));
    // Layout sem `levels` (árvores que giram): vale a maior profundidade de toda a execução.
    const levels = layout.levels ?? Math.max(1, ...steps.flatMap(({ scene }) => Object.values(scene.depth)).map((d) => d + 1));
    return steps.map((item) => ({
      ...item, run: runs, scene: { ...item.scene, floatCol, rootStack, levels },
    }));
  };

  const node = (id) => st.nodes[id];
  const setParams = (next) => {
    st.params = { ...next };
  };

  return {
    st, node, step, create, set, follow, setChild, setValue, drop, badge, clearBadges, setHeight, setFb, clearFb, setAlias, clear, setParams, finish,
  };
}

// ---------------------------------------------------------------------------------------------
// Desenho
// ---------------------------------------------------------------------------------------------

// Geometria da cena, em px. Tudo é posicionado em coordenadas fixas, então as setas e as fichas
// são calculadas sem medir o DOM.
const R = 21; // raio do nó
const PITCH = 64; // largura de cada vaga (uma por nó, em ordem)
const PADX = 44; // margem lateral: cabe a ficha de um nó da borda
const CHIP_W = 54;
const CHIP_H = 20;
const CHIP_STEP = 23;
const STUB = { w: 38, h: 18, dx: 21, dy: 52 }; // selo `nulo` na vaga do filho que não existe
const MIN_SCALE = 0.72;

function geometry(scene) {
  const levels = Math.max(1, scene.levels);
  const gap = levels <= 5 ? 72 : Math.max(54, Math.floor(288 / (levels - 1)));
  const top = 12 + Math.max(1, scene.rootStack ?? 1) * CHIP_STEP;
  const cols = Math.max(scene.slots + (scene.floatCol ? 1 : 0), 5);
  const cx = (rank) => PADX + rank * PITCH + PITCH / 2;
  const cy = (depth) => top + R + depth * gap;
  return {
    gap, top, cx, cy, levels, width: cols * PITCH + 2 * PADX, height: cy(levels - 1) + R + 76,
  };
}

/** Centro de cada nó visível. */
function positions(scene, geo) {
  const pos = new Map();
  scene.nodes.forEach((node) => {
    if (node.id === scene.float) {
      pos.set(node.id, { x: geo.cx(scene.slots), y: geo.cy(geo.levels - 1), float: true });
      return;
    }
    const rank = scene.ranks.get(node.id);
    const depth = scene.depth[node.id];
    if (rank === undefined || depth === undefined) return;
    pos.set(node.id, { x: geo.cx(rank), y: geo.cy(depth), lost: scene.lost.includes(node.id) });
  });
  return pos;
}

// Posições do último passo desenhado: é a partir delas que nós e fichas deslizam até o novo lugar.
// Só há animação entre passos da mesma execução (`step.run`) e nunca ao redesenhar o mesmo passo.
let lastRender = { step: null, run: null, positions: new Map() };

function previousPositions(step, current) {
  if (lastRender.step === step) return null;
  const previous = lastRender.run === step.run ? lastRender.positions : null;
  lastRender = { step, run: step.run, positions: current };
  return previous;
}

// A cena é recriada a cada passo, o que zeraria a rolagem horizontal das árvores que não cabem na
// tela. A posição é guardada antes de redesenhar e restaurada em `afterRenderTree`.
let scrollLeft = 0;

function focusOf(step) {
  const { scene } = step;
  const id = step.changedIndices?.[0] ?? step.foundIndices?.[0] ?? step.activeIndices?.[0]
    ?? scene.refs.atual ?? scene.refs.No ?? scene.float ?? scene.root;
  return typeof id === 'number' ? id : null;
}

export function afterRenderTree({ step, stage }) {
  const scroller = stage.querySelector('.node-scroll');
  const board = stage.querySelector('.circ-board');
  if (!scroller || !board) return;

  // A cena é encolhida para caber na largura do painel, para que todas as fichas fiquem à vista.
  const natural = parseFloat(board.style.width);
  const scale = Math.min(1, Math.max(MIN_SCALE, (scroller.clientWidth - 4) / natural));
  if (scale < 1) board.style.zoom = scale.toFixed(3);

  scroller.scrollLeft = scrollLeft;
  if (scroller.scrollWidth <= scroller.clientWidth) return;
  const geo = geometry(step.scene);
  const id = focusOf(step);
  const p = id === null ? null : positions(step.scene, geo).get(id);
  if (!p) return;
  const x = p.x * scale;
  const margin = 60;
  if (x > scroller.scrollLeft + margin && x < scroller.scrollLeft + scroller.clientWidth - margin) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  scroller.scrollTo({ left: Math.max(0, x - scroller.clientWidth / 2), behavior: reduced ? 'auto' : 'smooth' });
}

const DEFAULT_LEGEND = [['current', 'atual'], ['processed', 'visitado'], ['compared', 'alterado'], ['result', 'resultado']];

/**
 * Altura (arestas) de um nó da cena. No meio de uma rotação os ponteiros chegam a formar um ciclo
 * (`x.direito ← y` enquanto `y.esquerdo` ainda é `x`), então um nó que já está no caminho não conta.
 */
function heightIn(scene, id, path = new Set()) {
  if (typeof id !== 'number' || path.has(id)) return -1;
  const node = scene.nodes.find((item) => item.id === id);
  if (!node) return -1;
  path.add(id);
  const height = 1 + Math.max(heightIn(scene, node.left, path), heightIn(scene, node.right, path));
  path.delete(id);
  return height;
}

/**
 * Desenha a cena do passo. `legend` é uma lista de `[classe, rótulo]` e `extra` é um HTML opcional
 * (a pilha de chamadas ou a fila dos percursos) colocado entre a árvore e a legenda.
 */
export function renderTree({
  state, step, icons, escapeText, legend = DEFAULT_LEGEND, extra = '',
}) {
  const { scene } = step;
  scrollLeft = lastRender.run === step.run ? document.querySelector('.node-scroll')?.scrollLeft ?? 0 : 0;
  const geo = geometry(scene);
  const pos = positions(scene, geo);
  const reached = new Set(scene.reached);
  const nodeOf = (id) => scene.nodes.find((node) => node.id === id);
  const valueOf = (id) => nodeOf(id)?.value;
  const target = (id) => (typeof id === 'number' ? `nó ${escapeText(fmt(valueOf(id)))}` : NULO);

  // Lado em que cada nó alcançável pendura no pai (os chips ficam do lado de fora, longe da aresta).
  const sideOf = new Map();
  scene.reached.forEach((id) => {
    ['left', 'right'].forEach((side) => {
      const child = nodeOf(id)?.[side];
      if (typeof child === 'number' && reached.has(child)) sideOf.set(child, side === 'left' ? -1 : 1);
    });
  });

  // Vagas `nulo`: uma por ponteiro nulo de onde veio uma variável (ou todas, em `allNulls`).
  const stubs = new Map();
  const addStub = (parent, side) => {
    const key = `${parent}:${side}`;
    if (!stubs.has(key) && pos.get(parent)) stubs.set(key, { parent, side, names: [] });
    return stubs.get(key);
  };
  if (scene.allNulls) {
    scene.nodes.forEach((node) => {
      ['left', 'right'].forEach((side) => {
        if (node[side] === null && pos.get(node.id) && !pos.get(node.id).lost) addStub(node.id, side);
      });
    });
  }
  const emptyNames = [];
  CHIP_ORDER.forEach((name) => {
    const id = scene.refs[name];
    if (id !== null) return;
    const at = scene.nullAt[name];
    if (at) {
      const stub = addStub(at.parent, at.side);
      if (stub) stub.names.push(name);
    } else if (scene.root === null && EMPTY_CHIPS.includes(name)) {
      emptyNames.push(name);
    }
  });

  // O selo `nulo` fica na diagonal, abaixo do pai, na vaga do filho que não existe.
  const stubPos = (stub) => {
    const p = pos.get(stub.parent);
    return { x: p.x + (stub.side === 'left' ? -STUB.dx : STUB.dx), y: p.y + STUB.dy };
  };

  // Fichas: uma pilha por nó, para cima (ou para baixo, no nó solto e no selo `nulo`).
  const chips = [];
  const placeChips = (names, anchor, mode) => {
    names.forEach((name, k) => {
      let x = anchor.x - CHIP_W / 2;
      let y;
      if (mode === 'below') y = anchor.y + anchor.h / 2 + 5 + k * CHIP_STEP;
      else {
        y = anchor.y - anchor.h / 2 - 6 - CHIP_H - k * CHIP_STEP;
        x += (anchor.side || 0) * 14;
      }
      chips.push({
        name, kind: CHIP_KIND[name] || 'cursor', x, y, below: mode === 'below', near: k === 0,
      });
    });
  };
  const byNode = new Map();
  CHIP_ORDER.forEach((name) => {
    const id = scene.refs[name];
    if (typeof id !== 'number' || !pos.get(id)) return;
    if (!byNode.has(id)) byNode.set(id, []);
    byNode.get(id).push(name);
  });
  byNode.forEach((names, id) => {
    const p = pos.get(id);
    placeChips(names, {
      x: p.x, y: p.y, h: 2 * R, side: p.float ? 0 : sideOf.get(id) || 0,
    }, 'above');
  });
  stubs.forEach((stub) => {
    if (!stub.names.length) return;
    const p = stubPos(stub);
    placeChips(stub.names, { x: p.x, y: p.y, h: STUB.h }, 'below');
  });
  const emptyAt = { x: geo.cx(Math.max(0, Math.floor((scene.slots - 1) / 2))), y: geo.cy(0) };
  if (emptyNames.length) placeChips(emptyNames, { ...emptyAt, h: 28 }, 'above');

  // Nós, fichas e selos que mudaram de lugar deslizam do último passo desenhado; os que acabaram de
  // surgir aparecem com um "pop".
  const positionsNow = new Map([
    ...[...pos].map(([id, p]) => [`n${id}`, p]),
    ...chips.map((chip) => [`c:${chip.name}`, chip]),
    ...[...stubs].map(([key, stub]) => [`s:${key}`, stubPos(stub)]),
  ]);
  const previous = previousPositions(step, positionsNow);
  const motion = (key, p) => {
    if (!previous) return { cls: '', vars: '' };
    const before = previous.get(key);
    if (!before) return { cls: ' born', vars: '' };
    const dx = before.x - p.x;
    const dy = before.y - p.y;
    return dx || dy ? { cls: ' glide', vars: `;--dx:${dx}px;--dy:${dy}px` } : { cls: '', vars: '' };
  };

  // Setas: uma por ponteiro não nulo, do nó pai (ponto na borda) até a borda do filho.
  const hotNodes = new Set(scene.visited);
  const hotEdges = new Set(step.hotEdges || []);
  const fresh = new Set(scene.fresh);
  const dimmed = new Set(step.dimIndices || []);
  const edge = (from, to, cls) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const sx = from.x + ux * R;
    const sy = from.y + uy * R;
    const ex = to.x - ux * (to.r ?? R + 1);
    const ey = to.y - uy * (to.r ?? R + 1);
    const px = -uy;
    const py = ux;
    const head = `M${ex} ${ey}l${-ux * 9 + px * 4.5} ${-uy * 9 + py * 4.5}l${-px * 9} ${-py * 9}z`;
    return `<g class="tree-edge ${cls}"><path class="circ-wire" pathLength="1" d="M${sx} ${sy}L${ex} ${ey}"/>`
      + `<path class="circ-head" d="${head}"/><circle class="circ-dot" cx="${sx}" cy="${sy}" r="3"/></g>`;
  };
  let wires = '';
  scene.reached.forEach((id) => {
    const from = pos.get(id);
    ['left', 'right'].forEach((side) => {
      const child = nodeOf(id)?.[side];
      const to = typeof child === 'number' ? pos.get(child) : null;
      if (!from || !to) return;
      const classes = [];
      if (fresh.has(child)) classes.push('fresh');
      else if (hotEdges.has(child) || (hotNodes.has(id) && hotNodes.has(child))) classes.push('hot');
      if (dimmed.has(child) || dimmed.has(id)) classes.push('dim');
      wires += edge(from, to, classes.join(' '));
    });
  });
  let stubsHtml = '';
  stubs.forEach((stub) => {
    const p = stubPos(stub);
    wires += edge(pos.get(stub.parent), { x: p.x, y: p.y, r: STUB.h / 2 + 1 }, 'null');
    const { cls, vars } = motion(`s:${stub.parent}:${stub.side}`, p);
    stubsHtml += `<span class="tree-null${cls}" style="left:${p.x - STUB.w / 2}px;top:${p.y - STUB.h / 2}px${vars}">${NULO}</span>`;
  });
  // A árvore vazia (raiz = NULO) mostra o selo `nulo` onde ficaria a raiz.
  const pill = scene.refs.raiz === null
    ? `<span class="circ-null tree-empty" style="left:${emptyAt.x - 28}px;top:${emptyAt.y - 14}px">${NULO}</span>`
    : '';

  const nodesHtml = scene.nodes.filter((node) => pos.get(node.id)).map((node) => {
    const p = pos.get(node.id);
    const classes = ['tree-node'];
    if (p.float) classes.push('detached');
    if (p.lost) classes.push('lost');
    if (hotNodes.has(node.id) && !p.lost) classes.push('visited');
    if (hasIndex(step.processedIndices, node.id)) classes.push('processed');
    if (hasIndex(step.leftIndices, node.id)) classes.push('zone-left');
    if (hasIndex(step.rightIndices, node.id)) classes.push('zone-right');
    if (hasIndex(step.changedIndices, node.id)) classes.push('changed');
    if (hasIndex(step.activeIndices, node.id)) classes.push('active');
    if (hasIndex(step.foundIndices, node.id)) classes.push('found');
    if (hasIndex(step.errorIndices, node.id)) classes.push('error');
    if (dimmed.has(node.id)) classes.push('dim');
    if (state.inspectedItem === node.id) classes.push('inspected');
    const { cls, vars } = motion(`n${node.id}`, p);
    const badge = scene.badges?.[node.id];
    // Árvores AVL: a altura guardada no nó e, quando já foi calculado, o fator de balanceamento.
    const hasHeight = typeof node.h === 'number';
    const factor = scene.fb?.[node.id];
    const meta = hasHeight
      ? `<em class="tree-meta" aria-hidden="true">alt ${node.h}</em>${factor === undefined ? '' : `<em class="tree-meta fb${Math.abs(factor) > 1 ? ' bad' : ''}" aria-hidden="true">FB ${factor > 0 ? '+' : ''}${factor}</em>`}`
      : '';
    const links = `esquerda: ${target(node.left ?? null)}, direita: ${target(node.right ?? null)}${badge ? `, visita ${escapeText(badge)}` : ''}${hasHeight ? `, altura guardada ${node.h}` : ''}${factor === undefined ? '' : `, fator de balanceamento ${factor}`}`;
    return `<div class="tree-slot${cls}" style="left:${p.x - R}px;top:${p.y - R}px${vars}">`
      + `<button type="button" class="${classes.join(' ')}" data-module-action="pick-node" data-index="${node.id}" data-value="${escapeText(node.value)}" aria-label="Nó com valor ${escapeText(fmt(node.value))}, ${links}">`
      + `<span>${escapeText(fmt(node.value))}</span></button>`
      + `${meta}${p.float ? '<em class="tree-tag">isolado</em>' : ''}${badge ? `<em class="tree-badge" aria-hidden="true">${escapeText(badge)}</em>` : ''}</div>`;
  }).join('');

  const chipHtml = chips.map((chip) => {
    const { cls, vars } = motion(`c:${chip.name}`, chip);
    const classes = ['circ-chip', chip.kind, chip.below ? 'below' : '', chip.near ? 'near' : ''].filter(Boolean).join(' ');
    return `<div class="circ-pos${cls}" style="left:${chip.x}px;top:${chip.y}px${vars}"><span class="${classes}">${escapeText(chip.name)}</span></div>`;
  }).join('');

  const varsHtml = scene.vars.map((item) => {
    const kind = item.status === 'param' ? 'param' : CHIP_KIND[item.name] || 'cursor';
    const classes = ['circ-var', kind, item.status === 'unset' || item.status === 'null' ? item.status : '', item.changed ? 'changed' : ''].filter(Boolean).join(' ');
    return `<span class="${classes}"><b>${escapeText(item.name)}</b><i>${item.status === 'param' ? '=' : '→'}</i><span>${escapeText(item.text)}</span></span>`;
  }).join('');

  const inspected = state.inspectedItem === null || state.inspectedItem === undefined ? null : nodeOf(state.inspectedItem);
  let inspection = '';
  if (inspected) {
    const depth = scene.depth[inspected.id];
    const facts = [
      `valor = ${fmt(inspected.value)}`,
      `esquerda = ${target(inspected.left ?? null)}`,
      `direita = ${target(inspected.right ?? null)}`,
    ];
    if (reached.has(inspected.id)) facts.push(`profundidade = ${depth}`, `altura = ${heightIn(scene, inspected.id)}`);
    inspection = `<div class="inspection-card">${icons.info}<span>Nó selecionado</span><strong>${facts.join(', ')}</strong></div>`;
  }

  const count = scene.reached.length;
  const levelsNow = scene.root === null ? 0 : heightIn(scene, scene.root);
  const dimensions = `nós na árvore: ${count}${scene.root === null ? '' : ` · altura: ${levelsNow}`}`;
  const legendHtml = legend.map(([cls, label]) => `<span><i class="legend-dot ${cls}"></i> ${label}</span>`).join('');

  return `
    <div class="node-stage">
      <div class="node-dimensions"><span>${dimensions}</span></div>
      <div class="circ-vars" aria-label="Variáveis do algoritmo">${varsHtml}</div>
      <div class="node-scroll">
        <div class="circ-board tree-board" style="width:${geo.width}px;height:${geo.height}px">
          ${pill}${nodesHtml}${stubsHtml}
          <svg class="circ-wires" style="width:${geo.width}px;height:${geo.height}px" viewBox="0 0 ${geo.width} ${geo.height}" aria-hidden="true">${wires}</svg>
          ${chipHtml}
        </div>
      </div>
      ${extra ? `<div class="tree-extra">${extra}</div>` : ''}
      <div class="node-legend" aria-label="Legenda">${legendHtml}</div>
    </div>${inspection}`;
}
