import { tr, variableName } from '../../core/i18n.js';

/*
 * Desenho da Árvore B. Cada nó é uma caixa com m − 1 vagas (como nos slides 7 a 18): as chaves ocupam as
 * primeiras, as outras ficam tracejadas, e um nó em overflow ganha a vaga m, em vermelho. Os ponteiros para
 * os filhos saem das divisões entre as chaves (k chaves, k + 1 ponteiros). O desenho usa coordenadas fixas,
 * então as arestas são calculadas sem medir o DOM.
 *
 * O que o passo (`step`) informa: `scene` (a árvore, o irmão ainda solto em `float`, a mediana em `carry` e as
 * variáveis que apontam para nós em `refs`), `keyMarks` ([nó, índice, tipo]), `nodeMarks` ([nó, tipo]) e `hotEdges`.
 */

const CELL = 34; // largura de uma vaga de chave
const CELL_H = 34;
const PAD = 5; // folga dentro da caixa do nó
const GAP = 16; // espaço entre nós irmãos
const LEVEL = 102; // distância entre um nível e o seguinte
const TOP = 60; // espaço acima da raiz para as fichas e a mediana
const MARGIN = 26;
const CHIP_H = 20;
const CHIP_STEP = 23;
const MIN_SCALE = 0.6;

const CHIP_ORDER = ['x', 'nó', 'c', 'pai', 'y', 'z', 'irmão', 'raiz'];
const CHIP_KIND = {
  nó: 'atual', x: 'atual', c: 'filho', pai: 'cursor', y: 'inicio', z: 'alvo', irmão: 'novo', raiz: 'inicio',
};
const KEY_KINDS = new Set(['cmp', 'hit', 'found', 'new', 'median', 'moved', 'gone']);
const NODE_KINDS = new Set(['current', 'ok', 'under', 'overflow', 'absorbed', 'new', 'error']);

const slotsOf = (m, count) => Math.max(count, m - 1);
const widthOf = (m, count) => slotsOf(m, count) * CELL + 2 * PAD;

/** Posição de cada nó (canto superior esquerdo e largura) e o tamanho do quadro. */
function layoutOf(scene) {
  const byId = new Map(scene.nodes.map((node) => [node.id, node]));
  const { float } = scene;
  const rootLevelFloat = Boolean(float) && float.after === scene.root;
  const kidsOf = (id) => {
    const kids = [...byId.get(id).kids];
    if (float && !rootLevelFloat) {
      const at = kids.indexOf(float.after);
      if (at >= 0) kids.splice(at + 1, 0, float.id);
    }
    return kids;
  };
  const own = (id) => widthOf(scene.m, byId.get(id).keys.length);
  const spans = new Map();
  const kidsWidth = (id) => {
    const kids = kidsOf(id);
    return kids.reduce((sum, kid) => sum + spans.get(kid), 0) + GAP * Math.max(0, kids.length - 1);
  };
  const measure = (id) => {
    kidsOf(id).forEach(measure);
    spans.set(id, Math.max(own(id), kidsWidth(id)));
  };
  const pos = new Map();
  let deepest = 0;
  const place = (id, left, depth) => {
    deepest = Math.max(deepest, depth);
    const span = spans.get(id);
    pos.set(id, { x: left + (span - own(id)) / 2, y: TOP + depth * LEVEL, w: own(id), depth });
    const kids = kidsOf(id);
    let cursor = left + (span - kidsWidth(id)) / 2;
    kids.forEach((kid) => {
      place(kid, cursor, depth + 1);
      cursor += spans.get(kid) + GAP;
    });
  };
  const roots = scene.root === null ? [] : [scene.root];
  if (rootLevelFloat) roots.push(float.id);
  roots.forEach(measure);
  const total = roots.reduce((sum, id) => sum + spans.get(id), 0) + GAP * Math.max(0, roots.length - 1);
  let cursor = MARGIN;
  roots.forEach((id) => {
    place(id, cursor, 0);
    cursor += spans.get(id) + GAP;
  });
  return {
    pos, width: Math.max(total + 2 * MARGIN, 300), height: TOP + deepest * LEVEL + CELL_H + 34, deepest,
  };
}

/** Nós, chaves e altura da árvore já ligada à raiz (o irmão solto ainda não conta). */
function dimensionsOf(scene) {
  const byId = new Map(scene.nodes.map((node) => [node.id, node]));
  let nodes = 0;
  let keys = 0;
  let height = 0;
  const walk = (id, depth) => {
    const node = byId.get(id);
    nodes += 1;
    keys += node.keys.length;
    height = Math.max(height, depth);
    node.kids.forEach((kid) => walk(kid, depth + 1));
  };
  if (scene.root !== null) walk(scene.root, 0);
  return { nodes, keys, height };
}

const kidsLabel = (count) => tr(`${count} ${count === 1 ? 'filho' : 'filhos'}`, `${count} ${count === 1 ? 'child' : 'children'}`);

// O palco é redesenhado a cada passo: guarda a rolagem de antes para o aluno não voltar ao início da árvore.
let savedScroll = 0;

/**
 * Ajusta a escala para a árvore caber na largura do painel (até 60%); o resto rola na horizontal. A rolagem
 * do passo anterior é mantida, e o nó em foco (o atual, o que estourou ou o recém-criado) é trazido para
 * a área visível quando ficou de fora.
 */
export function afterRenderBTree({ stage }) {
  const board = stage.querySelector('.bt-board');
  const scroller = stage.querySelector('.node-scroll');
  if (!board || !scroller) return;
  const width = Number(board.dataset.width);
  const available = scroller.clientWidth - 6;
  const scale = width > available && available > 0 ? Math.max(MIN_SCALE, available / width) : 1;
  board.style.zoom = scale === 1 ? '' : String(scale);
  scroller.scrollLeft = savedScroll;
  const focus = board.querySelector('.bt-node.overflow, .bt-node.detached, .bt-node.current, .bt-node.new');
  if (focus && scroller.scrollWidth > scroller.clientWidth) {
    const box = focus.getBoundingClientRect();
    const view = scroller.getBoundingClientRect();
    if (box.left < view.left + 8 || box.right > view.right - 8) scroller.scrollLeft += (box.left + box.width / 2) - (view.left + view.width / 2);
  }
  savedScroll = scroller.scrollLeft;
}

/** Uma faixa de texto com a pilha de chamadas ou o caminho de pais (reaproveita o desenho da pilha dos módulos de ordenação). */
function renderStrip(title, frames, empty, escapeText) {
  const items = frames
    .map((frame, index) => `<span class="sort-frame${index === frames.length - 1 ? ' top' : ''}">${escapeText(frame)}</span>`)
    .join('<i class="sort-frame-sep">›</i>');
  return `
    <div class="sort-stack bt-strip">
      <span class="sort-stack-title">${title}</span>
      <div class="sort-stack-frames">${items || `<span class="sort-stack-empty">${empty}</span>`}</div>
    </div>`;
}

export function renderBTree({
  state, step, escapeText, legend, strip = null,
}) {
  const { scene } = step;
  const { m } = scene;
  const previous = document.querySelector('.bt-board') ? document.querySelector('.node-scroll') : null;
  if (previous) savedScroll = previous.scrollLeft;
  const geo = layoutOf(scene);
  const dims = dimensionsOf(scene);
  const byId = new Map(scene.nodes.map((node) => [node.id, node]));
  const keyMarks = new Map();
  (step.keyMarks || []).forEach(([id, index, kind]) => {
    if (KEY_KINDS.has(kind)) keyMarks.set(`${id}:${index}`, kind);
  });
  const nodeMarks = new Map();
  (step.nodeMarks || []).forEach(([id, kind]) => {
    if (NODE_KINDS.has(kind)) nodeMarks.set(id, kind);
  });
  const hot = new Set(step.hotEdges || []);
  const inspected = state.inspectedItem;

  // Arestas: do vão entre as chaves (k + 1 vãos) até o topo do filho; bolinhas marcam os vãos dos nós internos.
  let wires = '';
  scene.nodes.forEach((node) => {
    const p = geo.pos.get(node.id);
    if (!p || !node.kids.length) return;
    for (let gap = 0; gap <= node.keys.length; gap += 1) {
      wires += `<circle class="bt-gap" cx="${p.x + PAD + gap * CELL}" cy="${p.y + CELL_H}" r="2.6"/>`;
    }
    node.kids.forEach((kid, index) => {
      const q = geo.pos.get(kid);
      if (!q) return;
      const sx = p.x + PAD + Math.min(index, node.keys.length) * CELL;
      const sy = p.y + CELL_H;
      const ex = q.x + q.w / 2;
      const ey = q.y;
      wires += `<path class="bt-edge${hot.has(kid) ? ' hot' : ''}" d="M${sx} ${sy}L${ex} ${ey}"/>`;
    });
  });

  // Nós
  const nodesHtml = scene.nodes.map((node) => {
    const p = geo.pos.get(node.id);
    if (!p) return '';
    const detached = scene.float?.id === node.id;
    const kind = nodeMarks.get(node.id);
    const classes = ['bt-node'];
    if (kind) classes.push(kind);
    if (detached) classes.push('detached');
    if (inspected === node.id) classes.push('inspected');
    const slots = slotsOf(m, node.keys.length);
    const cells = Array.from({ length: slots }, (_, index) => {
      if (index >= node.keys.length) return '<span class="bt-slot"></span>';
      const key = node.keys[index];
      const markKind = keyMarks.get(`${node.id}:${index}`);
      const cls = ['bt-key'];
      if (markKind) cls.push(markKind);
      if (index >= m - 1) cls.push('over');
      return `<button type="button" class="${cls.join(' ')}" data-module-action="pick-key" data-index="${node.id}" data-value="${key}" aria-label="${tr('Chave', 'Key')} ${key}, ${tr('posição', 'position')} ${index} ${tr('do nó', 'of the node')} [${escapeText(node.keys.join(' '))}]">${key}</button>`;
    }).join('');
    const label = tr(`Nó com ${node.keys.length} ${node.keys.length === 1 ? 'chave' : 'chaves'} e ${kidsLabel(node.kids.length)}`, `Node with ${node.keys.length} ${node.keys.length === 1 ? 'key' : 'keys'} and ${kidsLabel(node.kids.length)}`);
    return `<div class="${classes.join(' ')}" role="group" aria-label="${label}" style="left:${p.x}px;top:${p.y}px;width:${p.w}px">${cells}${detached ? `<em class="bt-tag">${tr('novo', 'new')}</em>` : ''}</div>`;
  }).join('');

  // Fichas das variáveis que apontam para nós: empilham para cima, no canto esquerdo do nó
  const byNode = new Map();
  CHIP_ORDER.forEach((name) => {
    const id = scene.refs[name];
    if (typeof id !== 'number' || !geo.pos.get(id)) return;
    if (!byNode.has(id)) byNode.set(id, []);
    byNode.get(id).push(name);
  });
  let chipsHtml = '';
  byNode.forEach((names, id) => {
    const p = geo.pos.get(id);
    names.forEach((name, k) => {
      chipsHtml += `<span class="bt-chip ${CHIP_KIND[name] || 'cursor'}${k === 0 ? ' near' : ''}" style="left:${p.x}px;top:${p.y - 7 - CHIP_H - k * CHIP_STEP}px">${escapeText(variableName(name))}</span>`;
    });
  });

  // A mediana que saiu do nó dividido, entre as duas metades (slide 41)
  let carryHtml = '';
  if (scene.float && scene.carry !== null && scene.carry !== undefined) {
    const a = geo.pos.get(scene.float.after);
    const b = geo.pos.get(scene.float.id);
    if (a && b) {
      const cx = (a.x + a.w + b.x) / 2;
      carryHtml = `<span class="bt-key median bt-carry" style="left:${cx - CELL / 2}px;top:${a.y - 44}px" title="${tr('mediana: vai subir para o pai', 'median: goes up to the parent')}">${scene.carry}</span>`;
    }
  }

  const empty = scene.root === null
    ? `<span class="bt-null" style="left:${geo.width / 2 - 28}px;top:${TOP}px">${tr('nulo', 'null')}</span><span class="bt-chip inicio near" style="left:${geo.width / 2 - 27}px;top:${TOP - 30}px">${escapeText(variableName('raiz'))}</span>`
    : '';

  const picked = inspected === null || inspected === undefined ? null : byId.get(inspected);
  const inspection = picked
    ? `<div class="inspection-card"><span>${tr('Nó selecionado', 'Selected node')}</span><strong>${tr(`chaves = [${escapeText(picked.keys.join(', '))}], filhos = ${picked.kids.length}`, `keys = [${escapeText(picked.keys.join(', '))}], children = ${picked.kids.length}`)}</strong></div>`
    : '';

  const dimensions = scene.root === null
    ? tr('árvore vazia', 'empty tree')
    : tr(`ordem m = ${m} · nós: ${dims.nodes} · chaves: ${dims.keys} · altura: ${dims.height}`, `order m = ${m} · nodes: ${dims.nodes} · keys: ${dims.keys} · height: ${dims.height}`);
  const legendHtml = legend.map(([cls, label]) => `<span><i class="legend-dot ${cls}"></i> ${label}</span>`).join('');
  let stripHtml = '';
  if (strip === 'path') stripHtml = renderStrip(tr('Caminho até a folha (pais para a volta)', 'Path to the leaf (parents for the way back)'), step.path || [], tr('vazio', 'empty'), escapeText);
  if (strip === 'stack') stripHtml = renderStrip(tr('Pilha de chamadas', 'Call stack'), step.stack || [], tr('vazia', 'empty'), escapeText);

  return `
    <div class="node-stage bt-stage">
      <div class="node-dimensions"><span>${dimensions}</span></div>
      <div class="node-scroll">
        <div class="bt-board" data-width="${geo.width}" style="width:${geo.width}px;height:${geo.height}px">
          ${empty}${nodesHtml}${carryHtml}
          <svg class="bt-wires" style="width:${geo.width}px;height:${geo.height}px" viewBox="0 0 ${geo.width} ${geo.height}" aria-hidden="true">${wires}</svg>
          ${chipsHtml}
        </div>
      </div>
      ${stripHtml ? `<div class="tree-extra">${stripHtml}</div>` : ''}
      <div class="node-legend" aria-label="${tr('Legenda', 'Legend')}">${legendHtml}</div>
    </div>${inspection}`;
}
