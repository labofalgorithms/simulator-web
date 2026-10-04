// Peças visuais e de entrada de dados compartilhadas pelos módulos de ordenação
// (Selection Sort, Shotgun Sort): vetor com marcadores, cartão de comparação,
// contadores, legenda e editor de números.

import { icons } from '../../core/icons.js';
import { hasIndex } from '../../core/utils.js';

const CHIP_LABELS = { i: 'i', j: 'j', min: 'min', next: 'i+1' };

export function parseVector(text, { min, max, hint }) {
  const tokens = text.split(/[;,\s]+/).map((token) => token.trim()).filter(Boolean);
  if (tokens.length < min) return { error: `Digite pelo menos ${min} números para haver o que ordenar.` };
  if (tokens.length > max) return { error: hint || `Use no máximo ${max} números para manter a visualização legível.` };
  const values = tokens.map(Number);
  if (values.some((value) => !Number.isFinite(value))) {
    return { error: 'Use apenas números separados por espaço, vírgula ou ponto e vírgula.' };
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
      <div><span class="eyebrow">Dados de entrada</span><h2 id="data-editor-title">Monte seu vetor</h2></div>
      <span class="size-badge">${state.data.length} posições</span>
    </div>
    <label class="field-label" for="vector-input">Números do vetor</label>
    <div class="input-action-row">
      <input id="vector-input" class="text-input ${state.inputError ? 'invalid' : ''}" value="${escapeText(state.draft)}" placeholder="${escapeText(placeholder)}" aria-describedby="vector-help vector-error" data-module-input="draft" data-module-enter="apply" />
      <button class="button primary" type="button" data-module-action="apply-data">${icons.check}<span>Aplicar</span></button>
    </div>
    <p id="vector-help" class="field-help">${help || `Separe os valores por vírgula, espaço ou ponto e vírgula. De ${min} a ${max} números.`}</p>
    <p id="vector-error" class="error-message" role="alert">${escapeText(state.inputError)}</p>
    <div class="random-row">
      <label for="random-count">Quantidade aleatória</label>
      <input id="random-count" type="range" min="3" max="${max}" value="${state.randomCount}" data-module-input="random-count" />
      <output id="random-count-output">${state.randomCount}</output>
      <button class="button secondary" type="button" data-module-action="random-data">${icons.shuffle}<span>Gerar vetor</span></button>
    </div>`;
}

export const legend = (items) => `
  <div class="array-legend" aria-label="Legenda">
    ${items.map(([kind, text]) => `<span><i class="legend-dot ${kind}"></i> ${text}</span>`).join('')}
  </div>`;

function cellClasses(step, state, index, showTags) {
  const pointers = step.pointers || {};
  const classes = ['sort-cell'];
  if (index < (step.sortedCount ?? 0)) classes.push('sorted');
  if (hasIndex(step.outsideIndices, index)) classes.push('outside');
  if (showTags && step.tags?.[index]) classes.push('dup');
  if (hasIndex(step.comparedIndices, index)) classes.push('compared');
  if (hasIndex(step.warnIndices, index)) classes.push('warn');
  if (pointers.min === index) classes.push('min');
  if (pointers.j === index || hasIndex(step.activeIndices, index)) classes.push('active');
  if (hasIndex(step.changedIndices, index)) classes.push('changed');
  if (state.inspectedItem === index) classes.push('inspected');
  return classes.join(' ');
}

export function renderArray(step, state, escapeText, { showTags = false } = {}) {
  const pointers = step.pointers || {};
  const sortedCount = step.sortedCount ?? 0;
  const slots = step.values.map((value, index) => {
    const chips = Object.keys(CHIP_LABELS)
      .filter((name) => pointers[name] === index)
      .map((name) => `<span class="sort-chip ${name}">${CHIP_LABELS[name]}</span>`).join('');
    const tag = showTags && step.tags?.[index] ? `<span class="sort-cell-tag">${escapeText(step.tags[index])}</span>` : '';
    const rail = index < sortedCount ? 'sorted' : hasIndex(step.outsideIndices, index) ? 'outside' : 'open';
    return `
      <div class="sort-slot">
        <div class="sort-chips"><span>${chips}</span></div>
        <button type="button" class="${cellClasses(step, state, index, showTags)}" data-module-action="inspect-item" data-index="${index}" aria-label="Posição ${index}, valor ${escapeText(value)}">${escapeText(value)}${tag}</button>
        <span class="sort-index">${index}</span>
        <span class="sort-rail ${rail}"></span>
      </div>`;
  }).join('');
  return `<div class="sort-scroll" role="group" aria-label="Representação visual do vetor"><div class="sort-row">${slots}</div></div>`;
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
        <span class="sort-compare-result">${compare.result ? 'Sim' : 'Não'}</span>
      </div>`
    : `<span class="sort-compare-hint">${hint}</span>`;
  return `<div class="sort-compare-slot">${body}</div>`;
}

/** `step.stats` é um objeto { rótulo: valor }, exibido na ordem em que foi escrito. */
export const renderStats = (step) => (step.stats
  ? `<div class="sort-stats">${Object.entries(step.stats).map(([name, value]) => `<span>${name}: <strong>${value}</strong></span>`).join('')}</div>`
  : '');

export function renderInspection(step, state, escapeText) {
  if (state.inspectedItem === null || state.inspectedItem >= step.values.length) return '';
  return `<div class="inspection-card">${icons.info}<span>Posição selecionada</span><strong>vetor[${state.inspectedItem}] = ${escapeText(step.values[state.inspectedItem])}</strong></div>`;
}
