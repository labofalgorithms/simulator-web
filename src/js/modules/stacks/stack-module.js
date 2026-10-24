import { algorithms, buildSteps } from './algorithms.js';
import { hasIndex } from '../../core/utils.js';
import { tr } from '../../core/i18n.js';

const DEFAULT_DATA = { capacity: 4, values: [8, 3, 9] };
const MAX_CAPACITY = 8;

function parseStackValues(text, capacity) {
  const trimmed = String(text).trim();
  if (!trimmed) return { values: [] };
  const tokens = trimmed.split(/[;,\s]+/).map((token) => token.trim()).filter(Boolean);
  if (tokens.length > capacity) {
    return { error: tr(`A capacidade atual é ${capacity}; reduza a quantidade de valores ou aumente a capacidade.`, `The current capacity is ${capacity}; reduce the number of values or increase the capacity.`) };
  }
  const values = tokens.map(Number);
  if (values.some((value) => !Number.isFinite(value))) {
    return { error: tr('Use apenas números separados por espaço, vírgula ou ponto e vírgula.', 'Use only numbers separated by space, comma or semicolon.') };
  }
  return { values };
}

function slotsFromStep(step) {
  const slots = new Array(step.capacidade).fill(null);
  step.values.forEach((value, index) => {
    if (index < step.capacidade) slots[index] = value;
  });
  return slots;
}

export const stackModule = {
  id: 'stacks',
  name: tr('Pilhas', 'Stacks'),
  version: '1.0',
  visualizationTitle: tr('Pilha na memória', 'Stack in memory'),
  defaultAlgorithmId: 'creation',
  defaultData: DEFAULT_DATA,
  defaultRandomCount: 3,
  algorithms,
  buildSteps,

  isValidData(value) {
    return !!value && typeof value === 'object'
      && Number.isInteger(value.capacity) && value.capacity >= 1 && value.capacity <= MAX_CAPACITY
      && Array.isArray(value.values) && value.values.length <= value.capacity
      && value.values.every((item) => Number.isFinite(item));
  },

  sanitizeData(value) {
    if (this.isValidData(value)) return { capacity: value.capacity, values: [...value.values] };
    return { capacity: DEFAULT_DATA.capacity, values: [...DEFAULT_DATA.values] };
  },

  formatData(data) {
    return data.values.join(', ');
  },

  createInitialConfig(data) {
    return { pushValue: data.values.length ? data.values[data.values.length - 1] + 1 : 5 };
  },

  normalizeConfig(data, config) {
    return { pushValue: Number.isFinite(Number(config.pushValue)) ? Number(config.pushValue) : 0 };
  },

  renderEditor({ state, icons, escapeText }) {
    const { capacity, values } = state.data;
    return `
      <div class="panel-heading compact-heading">
        <div><span class="eyebrow">${tr('Dados de entrada', 'Input data')}</span><h2 id="data-editor-title">${tr('Monte sua pilha', 'Build your stack')}</h2></div>
        <span id="stack-size-badge" class="size-badge">${values.length}/${capacity} ${tr('posições', 'positions')}</span>
      </div>
      <label class="field-label" for="stack-input">${tr('Elementos (da base para o topo)', 'Elements (from base to top)')}</label>
      <div class="input-action-row">
        <input id="stack-input" class="text-input ${state.inputError ? 'invalid' : ''}" value="${escapeText(state.draft)}" placeholder="8, 3, 9" aria-describedby="stack-help stack-error" data-module-input="draft" data-module-enter="apply" />
        <button class="button primary" type="button" data-module-action="apply-data">${icons.check}<span>${tr('Aplicar', 'Apply')}</span></button>
      </div>
      <p id="stack-help" class="field-help">${tr('Informe os valores já empilhados, da base para o topo, separados por vírgula, espaço ou ponto e vírgula. Deixe em branco para uma pilha vazia. Máximo: a capacidade atual.', 'Enter the values already pushed, from base to top, separated by comma, space or semicolon. Leave blank for an empty stack. Maximum: the current capacity.')}</p>
      <p id="stack-error" class="error-message" role="alert">${escapeText(state.inputError)}</p>
      <div class="random-row">
        <label for="stack-capacity">${tr('Capacidade', 'Capacity')}</label>
        <input id="stack-capacity" type="range" min="1" max="${MAX_CAPACITY}" value="${capacity}" data-module-input="capacity" />
        <output id="stack-capacity-output">${capacity}</output>
        <button class="button secondary" type="button" data-module-action="random-data">${icons.shuffle}<span>${tr('Gerar pilha aleatória', 'Generate random stack')}</span></button>
      </div>`;
  },

  renderConfig({ state }) {
    if (state.algorithmId !== 'push') return '';
    const cheia = state.data.values.length >= state.data.capacity;
    return `
      <div class="panel-heading compact-heading"><div><span class="eyebrow">${tr('Parâmetros', 'Parameters')}</span><h2 id="config-title">${tr('Escolha o valor a empilhar', 'Choose the value to push')}</h2></div></div>
      <label class="config-field"><span>${tr('Valor', 'Value')}</span><input id="push-value-input" type="number" value="${state.config.pushValue}" data-module-input="push-value" /><small>${tr('Será inserido no topo, se houver espaço.', 'It will be inserted at the top, if there is room.')}</small></label>
      ${cheia ? `<p class="matrix-config-note">${tr('A pilha está cheia: o push demonstrará a verificação de isFull() sem inserir o valor.', 'The stack is full: push will demonstrate the isFull() check without inserting the value.')}</p>` : ''}`;
  },

  renderVisualization({ state, step, icons, escapeText }) {
    const slots = slotsFromStep(step);
    const { topo, capacidade } = step;
    const rows = [];
    for (let i = slots.length - 1; i >= 0; i -= 1) {
      const value = slots[i];
      const isTopo = i === topo;
      const classes = ['stack-cell'];
      if (value === null) classes.push('empty');
      if (hasIndex(step.processedIndices, i)) classes.push('processed');
      if (hasIndex(step.changedIndices, i)) classes.push('changed');
      if (hasIndex(step.activeIndices, i)) classes.push('active');
      if (hasIndex(step.foundIndices, i)) classes.push('found');
      if (state.inspectedItem === i) classes.push('inspected');
      const cellMarkup = value === null
        ? `<div class="${classes.join(' ')}">${tr('vazio', 'empty')}</div>`
        : `<button type="button" class="${classes.join(' ')}" data-module-action="inspect-item" data-index="${i}" aria-label="${tr('Posição', 'Position')} ${i}${tr(', valor', ', value')} ${escapeText(value)}"><span>${escapeText(value)}</span></button>`;
      rows.push(`<div class="stack-row ${isTopo ? 'is-topo' : ''}"><span class="stack-index">${i}</span>${cellMarkup}${isTopo ? `<span class="stack-pointer">${tr('topo', 'top')}</span>` : ''}</div>`);
    }
    const floor = topo === -1
      ? `<div class="stack-row stack-row-floor"><span class="stack-index">-1</span><span class="stack-floor-note">${tr('nenhuma posição ocupada', 'no position occupied')}</span><span class="stack-pointer">${tr('topo', 'top')}</span></div>`
      : '';

    const inspection = state.inspectedItem !== null && state.inspectedItem <= topo && state.inspectedItem >= 0
      ? `<div class="inspection-card">${icons.info}<span>${tr('Posição selecionada', 'Selected position')}</span><strong>${tr('pilha[', 'stack[')}${state.inspectedItem}] = ${escapeText(step.values[state.inspectedItem])}</strong></div>`
      : '';

    return `
      <div class="stack-stage">
        <div class="stack-dimensions"><span>${tr('capacidade:', 'capacity:')} ${capacidade}</span><span>${tr('elementos:', 'elements:')} ${topo + 1}</span><span>${tr('topo:', 'top:')} ${topo}</span></div>
        <div class="stack-frame">${rows.join('')}${floor}</div>
        <div class="stack-legend" aria-label="${tr('Legenda', 'Legend')}">
          <span><i class="legend-dot current"></i> ${tr('atual', 'current')}</span>
          <span><i class="legend-dot compared"></i> ${tr('alterado', 'changed')}</span>
          <span><i class="legend-dot processed"></i> ${tr('processado', 'processed')}</span>
          <span><i class="legend-dot result"></i> ${tr('resultado', 'result')}</span>
        </div>
      </div>${inspection}`;
  },

  handleInput(name, input, app) {
    switch (name) {
      case 'draft':
        app.state.draft = input.value;
        break;
      case 'capacity': {
        const capacity = Math.max(1, Math.min(MAX_CAPACITY, Math.round(Number(input.value)) || 1));
        app.state.data.capacity = capacity;
        if (app.state.data.values.length > capacity) {
          app.state.data.values = app.state.data.values.slice(0, capacity);
          app.state.draft = app.state.data.values.join(', ');
          const draftInput = document.querySelector('#stack-input');
          if (draftInput) draftInput.value = app.state.draft;
        }
        const output = document.querySelector('#stack-capacity-output');
        if (output) output.textContent = capacity;
        const badge = document.querySelector('#stack-size-badge');
        if (badge) badge.textContent = tr(`${app.state.data.values.length}/${capacity} posições`, `${app.state.data.values.length}/${capacity} positions`);
        app.rebuildSteps();
        break;
      }
      case 'push-value':
        app.state.config.pushValue = Number(input.value);
        app.rebuildSteps();
        break;
      default:
        break;
    }
  },

  handleAction(action, button, app) {
    if (action === 'apply-data') {
      const capacity = app.state.data.capacity;
      const parsed = parseStackValues(app.state.draft, capacity);
      if (!parsed.values) {
        app.state.inputError = parsed.error;
        app.renderEditor();
        document.querySelector('#stack-input')?.focus();
        return;
      }
      app.setData({ capacity, values: parsed.values });
      return;
    }

    if (action === 'random-data') {
      const capacity = app.state.data.capacity;
      const count = Math.floor(Math.random() * (capacity + 1));
      const values = Array.from({ length: count }, () => Math.floor(Math.random() * 90) + 1);
      app.state.config.pushValue = Math.floor(Math.random() * 90) + 1;
      app.setData({ capacity, values });
      return;
    }

    if (action === 'inspect-item') {
      const index = Number(button.dataset.index);
      app.state.inspectedItem = index;
      app.renderSimulation();
    }
  },
};
