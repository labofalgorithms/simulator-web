// Peças visuais do módulo de Buscas: as três buscas lado a lado (sequencial × binária), as barras de
// comparações de cada valor (melhor, médio e pior caso) e os candidatos que sobram a cada comparação.
// O vetor com marcadores, o cartão de comparação e a legenda continuam em sort-view.js.

import { hasIndex } from '../../core/utils.js';
import { tr } from '../../core/i18n.js';

/**
 * As buscas em paralelo, como o `renderLockstep` das ordenações. `step.race` tem uma linha por busca:
 * `label`, `values`, `comparisons`, `current` (a posição examinada na rodada), `seen` (posições já
 * examinadas ou descartadas), `found` (a posição do valor, quando a busca terminou) e `done`.
 */
export function renderRace(step, escapeText, legendHtml) {
  const rows = step.race.map((row) => {
    const cells = row.values.map((value, index) => {
      const classes = ['sort-cell', 'mini'];
      if (hasIndex(row.seen, index)) classes.push('outside');
      if (row.current === index) classes.push(row.found === index ? 'min' : 'active');
      return `<div class="sort-slot"><span class="${classes.join(' ')}">${escapeText(value)}</span><span class="sort-index">${index}</span></div>`;
    }).join('');
    const verdict = row.done
      ? `<span class="bs-result${row.found === null ? ' missing' : ''}">${row.found === null ? tr('não encontrado', 'not found') : tr(`achou na posição ${row.found}`, `found at position ${row.found}`)}</span>`
      : '';
    return `
      <div class="sort-scenario">
        <div class="sort-scenario-head">
          <span class="sort-scenario-label">${escapeText(row.label)}</span>
          <span class="sort-counters">${verdict}${tr('comparações', 'comparisons')} <strong>${row.comparisons}</strong></span>
        </div>
        <div class="sort-scroll"><div class="sort-row">${cells}</div></div>
      </div>`;
  }).join('');
  return `
    <div class="sort-stage">
      <div class="sort-lockstep" role="group" aria-label="${tr('As três buscas em paralelo', 'The three searches in parallel')}">${rows}</div>
      ${legendHtml}
    </div>`;
}

const pct = (value, max) => `${Math.min(100, (value / Math.max(1, max)) * 100)}%`;

/**
 * Comparações de cada valor do vetor. `step.cases`: `n`, `rows` (`label`, `position`, `seq`, `bin`, com
 * `null` nos valores ainda não procurados e `current` no último), `averages`, `missing` (o valor ausente) e
 * `boxes` (melhor, médio e pior caso).
 */
export function renderCases(step, escapeText) {
  const {
    n, rows, averages, missing, boxes,
  } = step.cases;
  const bar = (value, kind) => `
    <span class="bs-case-bar ${kind}"><span class="sort-bar-track"><i style="width:${value === null ? 0 : pct(value, n)}"></i></span><b>${value === null ? '·' : value}</b></span>`;
  const lines = rows.map((row) => `
    <div class="bs-case-row${row.current ? ' current' : ''}">
      <span class="bs-case-label">${escapeText(row.label)}<small>${tr('pos.', 'pos.')} ${row.position}</small></span>
      ${bar(row.seq, 'seq')}${bar(row.bin, 'bin')}
    </div>`).join('');
  const absent = missing
    ? `<div class="bs-case-row missing">
      <span class="bs-case-label">${tr('ausente', 'missing')}<small>${tr('pior caso', 'worst case')}</small></span>
      ${bar(missing.seq, 'seq')}${bar(missing.bin, 'bin')}
    </div>`
    : '';
  const mean = averages.seq === null ? ''
    : `<p class="bs-case-mean">${tr('média até aqui', 'average so far')}: <span>${tr('sequencial', 'sequential')} <strong>${averages.seq.toLocaleString(tr('pt-BR', 'en-US'), { maximumFractionDigits: 2 })}</strong></span> · <span>${tr('binária', 'binary')} <strong>${averages.bin.toLocaleString(tr('pt-BR', 'en-US'), { maximumFractionDigits: 2 })}</strong></span></p>`;
  const totals = boxes
    ? `<div class="sort-totals bs-boxes">${boxes.map((box) => `
        <div class="sort-total final"><small>${box.label}</small>
          <span class="bs-pair"><span>${tr('Sequencial', 'Sequential')} <strong>${box.seq}</strong></span><span>${tr('Binária', 'Binary')} <strong>${box.bin}</strong></span></span>
          <span>${box.note}</span></div>`).join('')}</div>`
    : '';
  return `
    <div class="sort-chart bs-cases">
      <div class="sort-chart-title"><span>${tr('Comparações até achar cada valor', 'Comparisons until each value is found')}</span><span>${tr(`escala: 0 a n = ${n}`, `scale: 0 to n = ${n}`)}</span></div>
      <div class="bs-case-head"><span>${tr('Valor', 'Value')}</span><span>${tr('Sequencial', 'Sequential')}</span><span>${tr('Binária', 'Binary')}</span></div>
      <div class="bs-case-rows">${lines}${absent}</div>
      ${mean}${totals}
    </div>`;
}

/**
 * Candidatos que sobram no pior caso. `step.growth`: `n` e `rows` (`label`, `value`, `note`); `step.totals`
 * (opcional, `label`, `value` e `note`) são as caixas do fim.
 */
export function renderGrowth(step) {
  const { n, rows } = step.growth;
  const locale = tr('pt-BR', 'en-US');
  const lines = rows.map((row, index) => `
    <div class="sort-bar-row bs-growth-row${index === 0 ? ' current' : ''}">
      <span>${row.label}</span>
      <span class="sort-bar-track"><i style="width:${pct(row.value, n)};min-width:${row.value > 0 ? 3 : 0}px"></i></span>
      <b class="sort-bar-value">${row.value.toLocaleString(locale)} <small>${row.note}</small></b>
    </div>`).join('');
  const boxes = step.totals
    ? `<div class="sort-totals">${step.totals.map((total) => `
        <div class="sort-total final"><small>${total.label}</small><strong>${total.value}</strong><span>${total.note}</span></div>`).join('')}</div>`
    : '';
  return `
    <div class="sort-chart bs-growth">
      <div class="sort-chart-title"><span>${tr('Candidatos que ainda podem conter o valor (pior caso)', 'Candidates that can still contain the value (worst case)')}</span><span>n = ${n.toLocaleString(locale)}</span></div>
      <div class="sort-bars">${lines}</div>
      ${boxes}
    </div>`;
}
