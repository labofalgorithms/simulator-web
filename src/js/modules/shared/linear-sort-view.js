// Peças visuais das ordenações lineares (Bucket Sort, Counting Sort e Radix Sort): o vetor A com os
// marcadores da aula (i, indice, pos, index...), o dígito destacado e os corredores de `step.lanes`
// (buckets e vetores auxiliares). A legenda, o cartão de comparação e o gráfico de barras continuam
// em sort-view.js.

import { hasIndex } from '../../core/utils.js';
import { tr } from '../../core/i18n.js';

// Marcadores do vetor: nome do ponteiro -> [texto, cor]. A cor reaproveita as dos outros módulos.
const CHIPS = {
  i: ['i', 'i'],
  j: ['j', 'j'],
  indice: [tr('indice', 'index'), 'k'],
  pos: ['pos', 'k'],
  index: ['index', 'k'],
  num: ['num', 'j'],
  bucketIndex: ['bucketIndex', 'centro'],
  digitoAtual: [tr('dígito', 'digit'), 'centro'],
  saida: [tr('saída', 'output'), 'k'],
};

const chipsOf = (pointers = {}, index) => Object.keys(CHIPS)
  .filter((name) => pointers[name] === index)
  .map((name) => `<span class="sort-chip ${CHIPS[name][1]}">${CHIPS[name][0]}</span>`).join('');

/** O valor com o dígito da posição `pos` (1, 10, 100...) em destaque; se o número é curto demais, o zero que falta aparece apagado. */
function digitMarkup(value, pos, escapeText) {
  const text = String(value);
  const place = Math.round(Math.log10(pos));
  if (text.length <= place) return `<b class="lb-digit lb-pad">0</b>${escapeText(text)}`;
  const at = text.length - 1 - place;
  return `${escapeText(text.slice(0, at))}<b class="lb-digit">${escapeText(text[at])}</b>${escapeText(text.slice(at + 1))}`;
}

function cellClasses(step, state, index) {
  const classes = ['sort-cell'];
  if (step.digit) classes.push('digits');
  if (hasIndex(step.sortedIndices, index)) classes.push('sorted');
  if (hasIndex(step.comparedIndices, index)) classes.push('compared');
  if (hasIndex(step.warnIndices, index)) classes.push('warn');
  if (hasIndex(step.foundIndices, index)) classes.push('min');
  if (hasIndex(step.activeIndices, index)) classes.push('active');
  if (hasIndex(step.changedIndices, index)) classes.push('changed');
  if (hasIndex(step.outsideIndices, index)) classes.push('outside');
  if (step.tags?.[index]) classes.push('dup');
  if (state.inspectedItem === index) classes.push('inspected');
  return classes.join(' ');
}

/** O vetor A: marcadores acima das células, o dígito em foco (`step.digit = { pos }`) e as letras dos repetidos (`step.tags`). */
export function renderLinearArray(step, state, escapeText) {
  const slots = step.values.map((value, index) => {
    const inner = step.digit ? `<span>${digitMarkup(value, step.digit.pos, escapeText)}</span>` : escapeText(value);
    const tag = step.tags?.[index] ? `<span class="sort-cell-tag">${escapeText(step.tags[index])}</span>` : '';
    return `
      <div class="sort-slot">
        <div class="sort-chips stacked"><span>${chipsOf(step.pointers, index)}</span></div>
        <button type="button" class="${cellClasses(step, state, index)}" data-module-action="inspect-item" data-index="${index}" aria-label="${tr('Posição', 'Position')} ${index}${tr(', valor', ', value')} ${escapeText(value)}">${inner}${tag}</button>
        <span class="sort-index">${index}</span>
        <span class="sort-rail ${hasIndex(step.sortedIndices, index) ? 'sorted' : 'open'}"></span>
      </div>`;
  }).join('');
  return `<div class="sort-scroll roomy" role="group" aria-label="${tr('Representação visual do vetor', 'Visual representation of the array')}"><div class="sort-row">${slots}</div></div>`;
}

function renderVectorLane(lane, escapeText) {
  const slots = lane.values.map((value, index) => {
    const filled = value !== null && value !== undefined;
    const classes = ['sort-cell', 'aux'];
    if (!filled) classes.push('empty');
    else if (value === 0 && lane.dimZeros) classes.push('zero');
    if (hasIndex(lane.activeIndices, index)) classes.push('active');
    if (hasIndex(lane.foundIndices, index)) classes.push('min');
    if (hasIndex(lane.changedIndices, index)) classes.push('changed');
    if (hasIndex(lane.sortedIndices, index)) classes.push('sorted');
    if (filled && lane.tags?.[index]) classes.push('dup');
    const tag = filled && lane.tags?.[index] ? `<span class="sort-cell-tag">${escapeText(lane.tags[index])}</span>` : '';
    return `
      <div class="sort-slot">
        <div class="sort-chips"><span>${chipsOf(lane.pointers, index)}</span></div>
        <span class="${classes.join(' ')}">${filled ? escapeText(value) : ''}${tag}</span>
        <span class="sort-index">${index}</span>
      </div>`;
  }).join('');
  return `
    <div class="sort-aux" role="group" aria-label="${escapeText(lane.label)}">
      <span class="sort-aux-title">${escapeText(lane.label)}<small>${escapeText(lane.caption)}</small></span>
      <div class="sort-scroll roomy"><div class="sort-row">${slots}</div></div>
    </div>`;
}

function renderBucketsLane(lane, escapeText) {
  const columns = lane.buckets.map((bucket, index) => {
    const classes = ['lb-bucket'];
    if (bucket === null) classes.push('missing');
    if (lane.active === index) classes.push('active');
    if (lane.sorted.includes(index)) classes.push('sorted');
    const body = bucket === null
      ? `<em class="lb-null">${tr('nulo', 'null')}</em>`
      : bucket.length
        ? bucket.map((item) => `<span class="lb-item${item.state ? ` ${item.state}` : ''}${item.tag ? ' dup' : ''}">${escapeText(item.v)}${item.tag ? `<span class="sort-cell-tag">${escapeText(item.tag)}</span>` : ''}</span>`).join('')
        : `<em class="lb-null empty">${tr('vazio', 'empty')}</em>`;
    return `<div class="${classes.join(' ')}"><span class="lb-bucket-head">${index}</span><div class="lb-bucket-body">${body}</div></div>`;
  }).join('');
  return `
    <div class="lb-lane" role="group" aria-label="${escapeText(lane.label)}">
      <div class="lb-lane-head"><strong>${escapeText(lane.label)}</strong><small>${escapeText(lane.hint)}</small></div>
      <div class="sort-scroll"><div class="lb-buckets" style="--lb-cols:${lane.buckets.length}">${columns}</div></div>
    </div>`;
}

/** Os corredores do passo (`step.lanes`), um abaixo do outro. */
export const renderLanes = (step, escapeText) => (step.lanes || [])
  .map((lane) => (lane.kind === 'buckets' ? renderBucketsLane(lane, escapeText) : renderVectorLane(lane, escapeText))).join('');

/**
 * Várias ordens do mesmo vetor, uma abaixo da outra (LSD × MSD, fila × pilha). `step.orders` tem, em cada
 * linha, `label`, `caption`, `values`, `tags`, `changedIndices`, `cuts` (índices depois dos quais há uma
 * barra entre grupos) e `warn` (a linha terminou fora de ordem).
 */
export function renderOrders(step, escapeText) {
  const rows = step.orders.map((row) => {
    const cells = row.values.map((value, index) => {
      const classes = ['sort-cell', 'mini'];
      if (hasIndex(row.changedIndices, index)) classes.push('changed');
      if (row.warn) classes.push('warn');
      if (row.tags?.[index]) classes.push('dup');
      const tag = row.tags?.[index] ? `<span class="sort-cell-tag">${escapeText(row.tags[index])}</span>` : '';
      const split = hasIndex(row.cuts, index - 1) ? ' split' : '';
      return `<div class="sort-slot${split}"><span class="${classes.join(' ')}">${escapeText(value)}${tag}</span><span class="sort-index">${index}</span></div>`;
    }).join('');
    return `
      <div class="sort-scenario">
        <div class="sort-scenario-head">
          <span class="sort-scenario-label">${escapeText(row.label)}</span>
          <span class="sort-counters">${escapeText(row.caption)}</span>
        </div>
        <div class="sort-scroll"><div class="sort-row">${cells}</div></div>
      </div>`;
  }).join('');
  return `<div class="sort-lockstep" role="group" aria-label="${tr('O mesmo vetor ordenado de duas formas', 'The same array sorted in two ways')}">${rows}</div>`;
}
