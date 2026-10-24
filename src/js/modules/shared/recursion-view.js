// Peças visuais dos módulos recursivos (Merge Sort e Quick Sort): o vetor auxiliar B do intercala,
// a pilha de chamadas, os níveis da recursão e os totais. O vetor com marcadores, o cartão de
// comparação e a legenda continuam em sort-view.js.

import { hasIndex } from '../../core/utils.js';
import { slotClass } from './sort-view.js';
import { tr } from '../../core/i18n.js';

/**
 * Vetor auxiliar B, alinhado com as colunas do vetor. `step.aux` tem `label`, `values` (uma posição
 * por posição do vetor, `null` enquanto ainda não foi escrita), `tags` (letras dos repetidos),
 * `range` (`[inicio, fim]` do trecho em uso, fora dele as células ficam apagadas), `pointers`
 * (`{ i, j }`, desenhados abaixo das células, como na aula), `activeIndices` e `changedIndices`.
 */
export function renderAux(step, escapeText, { showTags = false } = {}) {
  const { aux } = step;
  const pointers = aux.pointers || {};
  const slots = step.values.map((_, index) => {
    const inRange = Boolean(aux.range) && index >= aux.range[0] && index <= aux.range[1];
    const value = aux.values[index];
    const filled = inRange && value !== null && value !== undefined;
    const classes = ['sort-cell', 'aux'];
    if (!inRange) classes.push('off');
    else if (!filled) classes.push('empty');
    if (hasIndex(aux.activeIndices, index)) classes.push('active');
    if (hasIndex(aux.changedIndices, index)) classes.push('changed');
    if (showTags && filled && aux.tags?.[index]) classes.push('dup');
    const chips = ['i', 'j']
      .filter((name) => pointers[name] === index)
      .map((name) => `<span class="sort-chip ${name}">${name}</span>`).join('');
    const tag = showTags && filled && aux.tags?.[index] ? `<span class="sort-cell-tag">${escapeText(aux.tags[index])}</span>` : '';
    return `
      <div class="${slotClass(step, index)}">
        <span class="${classes.join(' ')}">${filled ? escapeText(value) : ''}${tag}</span>
        <span class="sort-index">${inRange ? index : '&nbsp;'}</span>
        <div class="sort-chips below"><span>${chips}</span></div>
      </div>`;
  }).join('');
  return `
    <div class="sort-aux" role="group" aria-label="${tr('Vetor auxiliar', 'Auxiliary array')} ${escapeText(aux.label)}">
      <span class="sort-aux-title">${escapeText(aux.label)}<small>${tr('vetor auxiliar', 'auxiliary array')}</small></span>
      <div class="sort-scroll roomy"><div class="sort-row">${slots}</div></div>
    </div>`;
}

/** Pilha de chamadas: `step.stack` é a lista de textos, da primeira chamada até a que está executando. */
export function renderStack(step, escapeText) {
  const frames = step.stack || [];
  const items = frames
    .map((frame, index) => `<span class="sort-frame${index === frames.length - 1 ? ' top' : ''}">${escapeText(frame)}</span>`)
    .join('<i class="sort-frame-sep">›</i>');
  return `
    <div class="sort-stack">
      <span class="sort-stack-title">${tr('Pilha de chamadas', 'Call stack')}</span>
      <div class="sort-stack-frames">${items || `<span class="sort-stack-empty">${tr('vazia', 'empty')}</span>`}</div>
    </div>`;
}

/**
 * Os trechos do vetor, nível por nível da recursão (como no desenho da aula). `step.tree.levels` é
 * uma lista de `{ label, segments: [{ values, tags, mark }], current, pending, note }`: `pending` é
 * um nível que ainda não apareceu (a linha fica reservada) e `mark` pinta o trecho (`done`, `active`).
 */
export function renderLevels(step, escapeText, { showTags = false } = {}) {
  const rows = step.tree.levels.map((level) => {
    const segments = level.pending ? '' : level.segments.map((segment) => `
        <span class="sort-seg${segment.mark ? ` ${segment.mark}` : ''}">${segment.values.map((value, index) => {
    const tag = showTags && segment.tags?.[index] ? `<sup>${escapeText(segment.tags[index])}</sup>` : '';
    return `<b>${escapeText(value)}${tag}</b>`;
  }).join('')}</span>`).join('');
    return `
      <div class="sort-level${level.current ? ' current' : ''}${level.pending ? ' pending' : ''}">
        <span class="sort-level-label">${escapeText(level.label)}</span>
        <div class="sort-level-segments">${segments}</div>
        <span class="sort-level-note">${escapeText(level.note || '')}</span>
      </div>`;
  }).join('');
  return `<div class="sort-levels" role="group" aria-label="${tr('Trechos do vetor em cada nível da recursão', 'Array sections at each recursion level')}">${rows}</div>`;
}

/** Caixas de total (`step.summary.totals`: `{ label, value, note }`), no mesmo desenho do gráfico de barras. */
export function renderTotals(step) {
  const { totals, final } = step.summary;
  return `
    <div class="sort-totals">${totals.map((total) => `
      <div class="sort-total${final ? ' final' : ''}"><small>${total.label}</small><strong>${total.value}</strong><span>${total.note}</span></div>`).join('')}
    </div>`;
}
