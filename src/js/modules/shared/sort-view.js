// Peças visuais e de entrada de dados compartilhadas pelos módulos de ordenação
// (Selection Sort, Bubble Sort, Insertion Sort, Shotgun Sort, Merge Sort, Quick Sort e Heap Sort):
// vetor com marcadores, cartão de comparação, contadores, legenda, gráfico de barras, vetores em
// paralelo e editor de números.

import { icons } from '../../core/icons.js';
import { hasIndex } from '../../core/utils.js';
import { tr, variableName } from '../../core/i18n.js';

// Os quatro seguintes marcam o trecho do Merge Sort e do Quick Sort (início, meio, fim e o índice k)
// e os três últimos, o pai e a raiz, o filho e o candidato a trocar do Heap Sort.
const CHIP_LABELS = {
  i: 'i', j: 'j', min: 'min', next: 'i+1', prev: 'j−1', inicio: tr('início', 'start'), meio: tr('meio', 'mid'), fim: tr('fim', 'end'), k: 'k', pai: tr('pai', 'parent'), raiz: tr('raiz', 'root'), filho: tr('filho', 'child'), trocar: tr('trocar', 'largest'),
};

export function parseVector(text, { min, max, hint }) {
  const tokens = text.split(/[;,\s]+/).map((token) => token.trim()).filter(Boolean);
  if (tokens.length < min) return { error: tr(`Digite pelo menos ${min} números para haver o que ordenar.`, `Enter at least ${min} numbers so there is something to sort.`) };
  if (tokens.length > max) return { error: hint || tr(`Use no máximo ${max} números para manter a visualização legível.`, `Use at most ${max} numbers to keep the visualization readable.`) };
  const values = tokens.map(Number);
  if (values.some((value) => !Number.isFinite(value))) {
    return { error: tr('Use apenas números separados por espaço, vírgula ou ponto e vírgula.', 'Use only numbers separated by space, comma or semicolon.') };
  }
  return { values };
}

export function randomVector(count) {
  const pool = Array.from({ length: 90 }, (_, index) => index + 10);
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[other]] = [pool[other], pool[index]];
  }
  return pool.slice(0, count);
}

export function renderVectorEditor({ state, escapeText }, { min, max, placeholder, help }) {
  return `
    <div class="panel-heading compact-heading">
      <div><span class="eyebrow">${tr('Dados de entrada', 'Input data')}</span><h2 id="data-editor-title">${tr('Monte seu vetor', 'Build your array')}</h2></div>
      <span class="size-badge">${state.data.length} ${tr('posições', 'positions')}</span>
    </div>
    <label class="field-label" for="vector-input">${tr('Números do vetor', 'Array numbers')}</label>
    <div class="input-action-row">
      <input id="vector-input" class="text-input ${state.inputError ? 'invalid' : ''}" value="${escapeText(state.draft)}" placeholder="${escapeText(placeholder)}" aria-describedby="vector-help vector-error" data-module-input="draft" data-module-enter="apply" />
      <button class="button primary" type="button" data-module-action="apply-data">${icons.check}<span>${tr('Aplicar', 'Apply')}</span></button>
    </div>
    <p id="vector-help" class="field-help">${help || tr(`Separe os valores por vírgula, espaço ou ponto e vírgula. De ${min} a ${max} números.`, `Separate the values by comma, space or semicolon. From ${min} to ${max} numbers.`)}</p>
    <p id="vector-error" class="error-message" role="alert">${escapeText(state.inputError)}</p>
    <div class="random-row">
      <label for="random-count">${tr('Quantidade aleatória', 'Random quantity')}</label>
      <input id="random-count" type="range" min="3" max="${max}" value="${state.randomCount}" data-module-input="random-count" />
      <output id="random-count-output">${state.randomCount}</output>
      <button class="button secondary" type="button" data-module-action="random-data">${icons.shuffle}<span>${tr('Gerar vetor', 'Generate array')}</span></button>
    </div>`;
}

export const legend = (items) => `
  <div class="array-legend" aria-label="${tr('Legenda', 'Legend')}">
    ${items.map(([kind, text]) => `<span><i class="legend-dot ${kind}"></i> ${text}</span>`).join('')}
  </div>`;

/**
 * Posições já ordenadas: as `sortedCount` primeiras (Selection e Insertion Sort), as que vêm a partir
 * de `sortedFrom` (Bubble Sort, que leva o maior valor para o fim) e as listadas em `sortedIndices`
 * (trechos prontos do Merge Sort e posições finais dos pivôs do Quick Sort).
 */
const isSorted = (step, index) => index < (step.sortedCount ?? 0) || index >= (step.sortedFrom ?? step.values.length) || hasIndex(step.sortedIndices, index);

function cellClasses(step, state, index, showTags) {
  const pointers = step.pointers || {};
  const classes = ['sort-cell'];
  if (isSorted(step, index)) classes.push('sorted');
  if (hasIndex(step.outsideIndices, index)) classes.push('outside');
  if (showTags && step.tags?.[index]) classes.push('dup');
  if (hasIndex(step.comparedIndices, index)) classes.push('compared');
  if (hasIndex(step.warnIndices, index)) classes.push('warn');
  if (pointers.min === index || hasIndex(step.foundIndices, index)) classes.push('min');
  if (pointers.j === index || hasIndex(step.activeIndices, index)) classes.push('active');
  if (step.pivotIndex === index) classes.push('pivot');
  if (hasIndex(step.changedIndices, index)) classes.push('changed');
  if (state.inspectedItem === index) classes.push('inspected');
  return classes.join(' ');
}

/** A célula logo depois de `step.splitAfter` ganha a barra que separa as duas metades (Merge Sort). */
export const slotClass = (step, index) => (step.splitAfter !== undefined && index === step.splitAfter + 1 ? 'sort-slot split' : 'sort-slot');

/** `stacked` empilha os marcadores de uma mesma célula (início, meio, fim, i, j...) em vez de pô-los lado a lado. */
export function renderArray(step, state, escapeText, { showTags = false, stacked = false } = {}) {
  const pointers = step.pointers || {};
  const slots = step.values.map((value, index) => {
    const chips = Object.keys(CHIP_LABELS)
      .filter((name) => pointers[name] === index)
      .map((name) => `<span class="sort-chip ${name}">${CHIP_LABELS[name]}</span>`).join('');
    const tag = showTags && step.tags?.[index] ? `<span class="sort-cell-tag">${escapeText(step.tags[index])}</span>` : '';
    const rail = isSorted(step, index) ? 'sorted' : hasIndex(step.outsideIndices, index) ? 'outside' : 'open';
    return `
      <div class="${slotClass(step, index)}">
        <div class="sort-chips${stacked ? ' stacked' : ''}"><span>${chips}</span></div>
        <button type="button" class="${cellClasses(step, state, index, showTags)}" data-module-action="inspect-item" data-index="${index}" aria-label="${tr('Posição', 'Position')} ${index}${tr(', valor', ', value')} ${escapeText(value)}">${escapeText(value)}${tag}</button>
        <span class="sort-index">${index}</span>
        <span class="sort-rail ${rail}"></span>
      </div>`;
  }).join('');
  return `<div class="sort-scroll${stacked ? ' roomy' : ''}" role="group" aria-label="${tr('Representação visual do vetor', 'Visual representation of the array')}"><div class="sort-row">${slots}</div></div>`;
}

export const renderPhase = (step, escapeText) => `<div class="sort-phase">${step.phase
  ? `<span class="sort-phase-badge${step.phase.code ? ' code' : ''}">${escapeText(step.phase.label)}</span><span>${escapeText(step.phase.text)}</span>`
  : ''}</div>`;

/** `compare.alarm` inverte as cores: "Sim" é o resultado ruim (par fora de ordem). */
export function renderCompare(step, escapeText, hint) {
  const { compare } = step;
  const tone = compare?.alarm ? (compare.result ? 'bad' : 'good') : (compare?.result ? 'yes' : 'no');
  const body = compare
    ? `<div class="sort-compare ${tone}">
        <span class="sort-compare-side"><small>${escapeText(compare.left.label)}</small><strong>${escapeText(compare.left.value)}</strong></span>
        <span class="sort-compare-op">${escapeText(compare.op)}</span>
        <span class="sort-compare-side"><small>${escapeText(compare.right.label)}</small><strong>${escapeText(compare.right.value)}</strong></span>
        <span class="sort-compare-result">${compare.result ? tr('Sim', 'Yes') : tr('Não', 'No')}</span>
      </div>`
    : `<span class="sort-compare-hint">${hint}</span>`;
  return `<div class="sort-compare-slot">${body}</div>`;
}

/** `step.stats` é um objeto { rótulo: valor }, exibido na ordem em que foi escrito. */
export const renderStats = (step) => (step.stats
  ? `<div class="sort-stats">${Object.entries(step.stats).map(([name, value]) => `<span>${variableName(name)}: <strong>${value}</strong></span>`).join('')}</div>`
  : '');

export function renderInspection(step, state, escapeText) {
  if (state.inspectedItem === null || state.inspectedItem >= step.values.length) return '';
  return `<div class="inspection-card">${icons.info}<span>${tr('Posição selecionada', 'Selected position')}</span><strong>${tr('vetor[', 'array[')}${state.inspectedItem}] = ${escapeText(step.values[state.inspectedItem])}</strong></div>`;
}

/**
 * Gráfico de barras com o custo de cada passada. `step.chart` tem `title` e `hint` (cabeçalho),
 * `max` (valor da barra cheia), `bars` (`{ label, value, current, mark }`: `value` nulo é uma
 * passada ainda não contada e `mark` é o texto da última coluna, como "⇄ 3") e `totals`
 * (`{ label, value, note }`, com `final` quando a soma está completa).
 */
export function renderChart(step) {
  const { title, hint, max, bars, totals, final } = step.chart;
  const longest = Math.max(1, max);
  const rows = bars.map((bar) => `
    <div class="sort-bar-row${bar.current ? ' current' : ''}">
      <span>${bar.label}</span>
      <span class="sort-bar-track"><i style="width:${bar.value === null ? 0 : (bar.value / longest) * 100}%"></i></span>
      <b class="sort-bar-value">${bar.value === null ? '·' : bar.value}</b>
      <span class="sort-bar-swap" title="${tr('troca', 'swap')}">${bar.mark || ''}</span>
    </div>`).join('');
  const boxes = totals.map((total) => `
        <div class="sort-total${final ? ' final' : ''}"><small>${total.label}</small><strong>${total.value}</strong><span>${total.note}</span></div>`).join('');
  return `
    <div class="sort-chart">
      <div class="sort-chart-title"><span>${title}</span><span>${hint}</span></div>
      <div class="sort-bars">${rows}</div>
      <div class="sort-totals">${boxes}
      </div>
    </div>`;
}

/**
 * Os mesmos valores em ordens diferentes, ordenados em paralelo. Cada linha de `step.rows` tem
 * `label`, `values`, os contadores `comparisons` e `swaps`, `sortedCount` ou `sortedFrom` (posições
 * ordenadas), `markIndex` (a posição destacada) e `changedIndices`.
 */
export function renderLockstep(step, escapeText, legendItems) {
  const scenarios = step.rows.map((row) => {
    const cells = row.values.map((value, index) => {
      const classes = ['sort-cell', 'mini'];
      const done = isSorted(row, index);
      if (done) classes.push('sorted');
      if (row.markIndex === index) classes.push('min');
      if (hasIndex(row.changedIndices, index)) classes.push('changed');
      return `<div class="sort-slot"><span class="${classes.join(' ')}">${escapeText(value)}</span><span class="sort-rail ${done ? 'sorted' : 'open'}"></span></div>`;
    }).join('');
    return `
      <div class="sort-scenario">
        <div class="sort-scenario-head">
          <span class="sort-scenario-label">${escapeText(row.label)}</span>
          <span class="sort-counters">${tr('comparações', 'comparisons')} <strong>${row.comparisons}</strong> · ${row.moveLabel ?? tr('trocas', 'swaps')} <strong>${row.swaps}</strong></span>
        </div>
        <div class="sort-scroll"><div class="sort-row">${cells}</div></div>
      </div>`;
  }).join('');
  return `
    <div class="sort-stage">
      <div class="sort-lockstep" role="group" aria-label="${tr('Três vetores sendo ordenados em paralelo', 'Three arrays being sorted in parallel')}">${scenarios}</div>
      ${legend(legendItems)}
    </div>`;
}
