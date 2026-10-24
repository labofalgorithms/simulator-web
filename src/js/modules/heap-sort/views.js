import { icons } from '../../core/icons.js';
import { hasIndex } from '../../core/utils.js';
import { tr } from '../../core/i18n.js';

// O heap como árvore binária completa, desenhada em SVG: o nó i fica no nível ⌊log₂(i + 1)⌋, e os
// filhos de i são 2i + 1 e 2i + 2. Cada passo traz o vetor e os mesmos marcadores do vetor
// (`pointers`, `pivotIndex`, `comparedIndices`, `foundIndices`, `changedIndices`, `warnIndices`);
// os nós a partir de `step.sortedFrom` já saíram do heap e ficam apagados, sem as arestas.

const SLOT = 64;
const ROW = 68;
const RADIUS = 19;
const TOP = 28;
const BOTTOM = 46;
const LINE = 11.5;

// Marcadores que viram rótulo sob o nó (`inicio` só quando ainda não existe `raiz`, em CriaHeap).
const ROLE_LABELS = {
  pai: tr('pai', 'parent'), raiz: tr('raiz', 'root'), filho: tr('filho', 'child'), trocar: tr('trocar', 'largest'), i: 'i', j: 'j',
};

const levelOf = (index) => Math.floor(Math.log2(index + 1));
const parentOf = (index) => Math.floor((index - 1) / 2);

function rolesOf(step, index) {
  const pointers = step.pointers || {};
  const roles = Object.keys(ROLE_LABELS).filter((name) => pointers[name] === index).map((name) => ROLE_LABELS[name]);
  if (pointers.raiz === undefined && pointers.pai === undefined && pointers.inicio === index) roles.push(tr('início', 'start'));
  return roles;
}

/** `state.inspectedItem` (a célula clicada) destaca o nó, o pai e os filhos dele. */
function kinOf(state, count) {
  const item = state.inspectedItem;
  if (item === null || item === undefined || item >= count) return new Map();
  const kin = new Map();
  if (item > 0) kin.set(parentOf(item), 'pai');
  [2 * item + 1, 2 * item + 2].forEach((child, side) => { if (child < count) kin.set(child, side === 0 ? 'esq.' : 'dir.'); });
  return kin;
}

export function renderHeapTree(step, state, escapeText) {
  const count = step.values.length;
  const depth = levelOf(count - 1) + 1;
  const slots = 2 ** (depth - 1);
  const width = slots * SLOT;
  const height = TOP + (depth - 1) * ROW + RADIUS + BOTTOM;
  const sortedFrom = step.sortedFrom ?? count;
  const pointers = step.pointers || {};
  const kin = kinOf(state, count);
  const anchor = pointers.raiz ?? pointers.pai;

  const place = (index) => {
    const level = levelOf(index);
    const first = 2 ** level - 1;
    return { x: (width * (index - first + 0.5)) / 2 ** level, y: TOP + level * ROW };
  };

  const edges = step.values.map((_, index) => {
    if (index === 0) return '';
    const from = place(parentOf(index));
    const to = place(index);
    const out = index >= sortedFrom;
    const hot = !out && anchor === parentOf(index);
    return `<line class="heap-edge${out ? ' out' : ''}${hot ? ' hot' : ''}" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" />`;
  }).join('');

  const nodes = step.values.map((value, index) => {
    const { x, y } = place(index);
    const classes = ['heap-node'];
    if (index >= sortedFrom) classes.push('out');
    if (step.pivotIndex === index) classes.push('pivot');
    if (hasIndex(step.comparedIndices, index)) classes.push('compared');
    if (pointers.min === index || hasIndex(step.foundIndices, index)) classes.push('found');
    if (hasIndex(step.warnIndices, index)) classes.push('warn');
    if (hasIndex(step.changedIndices, index)) classes.push('changed');
    if (state.inspectedItem === index) classes.push('inspected');
    else if (kin.has(index)) classes.push('kin');
    const roles = rolesOf(step, index);
    const captions = roles.length ? roles : [kin.get(index)].filter(Boolean);
    return `
      <g class="${classes.join(' ')}" transform="translate(${x} ${y})">
        <circle r="${RADIUS}" />
        <text class="heap-value" y="1">${escapeText(value)}</text>
        <text class="heap-index" x="${-RADIUS + 2}" y="${-RADIUS + 1}">${index}</text>
        ${captions.length ? `<text class="heap-role${roles.length ? '' : ' kin'}" y="${RADIUS + 13}">${captions.map((text, line) => `<tspan x="0" dy="${line === 0 ? 0 : LINE}">${escapeText(text)}</tspan>`).join('')}</text>` : ''}
      </g>`;
  }).join('');

  return `
    <div class="heap-scroll" role="group" aria-label="${tr('O vetor visto como uma árvore binária completa (heap)', 'The array seen as a complete binary tree (heap)')}">
      <svg class="heap-svg" viewBox="0 0 ${width} ${height}" style="min-width:${Math.round(width * 0.58)}px;max-width:${Math.round(width * 1.25)}px" role="img" aria-label="${tr('Heap com', 'Heap with')} ${count} ${tr('nós', 'nodes')}">
        <g>${edges}</g>
        <g>${nodes}</g>
      </svg>
    </div>`;
}

/** Cartão de inspeção do heap: o pai e os filhos da posição clicada, pelas fórmulas da aula. */
export function renderHeapInspection(step, state, escapeText) {
  const item = state.inspectedItem;
  const count = step.values.length;
  if (item === null || item === undefined || item >= count) return '';
  const at = (index) => tr(`vetor[${index}] = ${escapeText(step.values[index])}`, `array[${index}] = ${escapeText(step.values[index])}`);
  const parent = item === 0 ? tr('a raiz não tem pai', 'the root has no parent') : tr(`pai (${item} − 1) / 2 = ${parentOf(item)}: ${at(parentOf(item))}`, `parent (${item} − 1) / 2 = ${parentOf(item)}: ${at(parentOf(item))}`);
  const children = [2 * item + 1, 2 * item + 2].filter((child) => child < count);
  const kids = children.length
    ? tr(`filhos 2·${item} + 1 = ${children[0]}${children[1] === undefined ? '' : ` e 2·${item} + 2 = ${children[1]}`}: ${children.map(at).join(' · ')}`, `children 2·${item} + 1 = ${children[0]}${children[1] === undefined ? '' : ` and 2·${item} + 2 = ${children[1]}`}: ${children.map(at).join(' · ')}`)
    : tr(`filhos 2·${item} + 1 = ${2 * item + 1} (fora do vetor): é uma folha`, `children 2·${item} + 1 = ${2 * item + 1} (outside the array): it is a leaf`);
  return `<div class="inspection-card heap-inspection">${icons.info}<span>${tr('Posição', 'Position')} ${item}: ${escapeText(step.values[item])}</span><strong>${parent} · ${kids}</strong></div>`;
}
