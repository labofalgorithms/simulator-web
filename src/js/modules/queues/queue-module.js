import { algorithms, buildSteps } from './algorithms.js';
import { hasIndex } from '../../core/utils.js';
import { tr } from '../../core/i18n.js';

const DEFAULT_DATA = { capacity: 5, values: [27, 7, 19, 85] };
const MAX_CAPACITY = 8;

function parseQueueValues(text, capacity) {
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

export const queueModule = {
  id: 'queues',
  name: tr('Filas', 'Queues'),
  version: '1.0',
  visualizationTitle: tr('Fila na memória', 'Queue in memory'),
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
    return { enqueueValue: data.values.length ? data.values[data.values.length - 1] + 1 : 5 };
  },

  normalizeConfig(data, config) {
    return { enqueueValue: Number.isFinite(Number(config.enqueueValue)) ? Number(config.enqueueValue) : 0 };
  },

  renderEditor({ state, icons, escapeText }) {
    const { capacity, values } = state.data;
    return `
      <div class="panel-heading compact-heading">
        <div><span class="eyebrow">${tr('Dados de entrada', 'Input data')}</span><h2 id="data-editor-title">${tr('Monte sua fila', 'Build your queue')}</h2></div>
        <span id="queue-size-badge" class="size-badge">${values.length}/${capacity} ${tr('posições', 'positions')}</span>
      </div>
      <label class="field-label" for="queue-input">${tr('Elementos (do início para o fim)', 'Elements (from front to rear)')}</label>
      <div class="input-action-row">
        <input id="queue-input" class="text-input ${state.inputError ? 'invalid' : ''}" value="${escapeText(state.draft)}" placeholder="27, 7, 19, 85" aria-describedby="queue-help queue-error" data-module-input="draft" data-module-enter="apply" />
        <button class="button primary" type="button" data-module-action="apply-data">${icons.check}<span>${tr('Aplicar', 'Apply')}</span></button>
      </div>
      <p id="queue-help" class="field-help">${tr('Informe os valores já enfileirados, do início para o fim, separados por vírgula, espaço ou ponto e vírgula. Deixe em branco para uma fila vazia. Máximo: a capacidade atual.', 'Enter the values already enqueued, from front to rear, separated by comma, space or semicolon. Leave blank for an empty queue. Maximum: the current capacity.')}</p>
      <p id="queue-error" class="error-message" role="alert">${escapeText(state.inputError)}</p>
      <div class="random-row">
        <label for="queue-capacity">${tr('Capacidade', 'Capacity')}</label>
        <input id="queue-capacity" type="range" min="1" max="${MAX_CAPACITY}" value="${capacity}" data-module-input="capacity" />
        <output id="queue-capacity-output">${capacity}</output>
        <button class="button secondary" type="button" data-module-action="random-data">${icons.shuffle}<span>${tr('Gerar fila aleatória', 'Generate random queue')}</span></button>
      </div>`;
  },

  renderConfig({ state }) {
    if (state.algorithmId !== 'enqueue') return '';
    const cheia = state.data.values.length >= state.data.capacity;
    return `
      <div class="panel-heading compact-heading"><div><span class="eyebrow">${tr('Parâmetros', 'Parameters')}</span><h2 id="config-title">${tr('Escolha o valor a inserir', 'Choose the value to insert')}</h2></div></div>
      <label class="config-field"><span>${tr('Valor', 'Value')}</span><input id="enqueue-value-input" type="number" value="${state.config.enqueueValue}" data-module-input="enqueue-value" /><small>${tr('Será inserido no final, se houver espaço.', 'It will be inserted at the end, if there is room.')}</small></label>
      ${cheia ? `<p class="matrix-config-note">${tr('A fila está cheia: o enqueue demonstrará a verificação de isFull() sem inserir o valor.', 'The queue is full: enqueue will demonstrate the isFull() check without inserting the value.')}</p>` : ''}`;
  },

  renderVisualization({ state, step, icons, escapeText }) {
    const slots = slotsFromStep(step);
    const { fim, capacidade } = step;
    const cells = slots.map((value, i) => {
      const isStart = i === 0;
      const isEnd = i === fim;
      let marker = '';
      if (isStart && isEnd) marker = tr('início · fim', 'front · rear');
      else if (isStart) marker = tr('início', 'front');
      else if (isEnd) marker = tr('fim', 'rear');

      const classes = ['queue-cell'];
      if (value === null) classes.push('empty');
      if (hasIndex(step.processedIndices, i)) classes.push('processed');
      if (hasIndex(step.changedIndices, i)) classes.push('changed');
      if (hasIndex(step.activeIndices, i)) classes.push('active');
      if (hasIndex(step.foundIndices, i)) classes.push('found');
      if (state.inspectedItem === i) classes.push('inspected');
      const cellMarkup = value === null
        ? `<div class="${classes.join(' ')}">${tr('vazio', 'empty')}</div>`
        : `<button type="button" class="${classes.join(' ')}" data-module-action="inspect-item" data-index="${i}" aria-label="${tr('Posição', 'Position')} ${i}${tr(', valor', ', value')} ${escapeText(value)}"><span>${escapeText(value)}</span></button>`;
      return `<div class="queue-slot"><span class="queue-marker">${marker}</span>${cellMarkup}<span class="queue-index">${i}</span></div>`;
    }).join('');

    const inspection = state.inspectedItem !== null && state.inspectedItem <= fim && state.inspectedItem >= 0
      ? `<div class="inspection-card">${icons.info}<span>${tr('Posição selecionada', 'Selected position')}</span><strong>${tr('vetorFila[', 'queueArray[')}${state.inspectedItem}] = ${escapeText(step.values[state.inspectedItem])}</strong></div>`
      : '';

    return `
      <div class="queue-stage">
        <div class="queue-dimensions"><span>${tr('capacidade:', 'capacity:')} ${capacidade}</span><span>${tr('elementos:', 'elements:')} ${fim + 1}</span><span>${tr('fim:', 'rear:')} ${fim}</span></div>
        <div class="queue-scroll"><div class="queue-row">${cells}</div></div>
        <div class="queue-legend" aria-label="${tr('Legenda', 'Legend')}">
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
          const draftInput = document.querySelector('#queue-input');
          if (draftInput) draftInput.value = app.state.draft;
        }
        const output = document.querySelector('#queue-capacity-output');
        if (output) output.textContent = capacity;
        const badge = document.querySelector('#queue-size-badge');
        if (badge) badge.textContent = tr(`${app.state.data.values.length}/${capacity} posições`, `${app.state.data.values.length}/${capacity} positions`);
        app.rebuildSteps();
        break;
      }
      case 'enqueue-value':
        app.state.config.enqueueValue = Number(input.value);
        app.rebuildSteps();
        break;
      default:
        break;
    }
  },

  handleAction(action, button, app) {
    if (action === 'apply-data') {
      const capacity = app.state.data.capacity;
      const parsed = parseQueueValues(app.state.draft, capacity);
      if (!parsed.values) {
        app.state.inputError = parsed.error;
        app.renderEditor();
        document.querySelector('#queue-input')?.focus();
        return;
      }
      app.setData({ capacity, values: parsed.values });
      return;
    }

    if (action === 'random-data') {
      const capacity = app.state.data.capacity;
      const count = Math.floor(Math.random() * (capacity + 1));
      const values = Array.from({ length: count }, () => Math.floor(Math.random() * 90) + 1);
      app.state.config.enqueueValue = Math.floor(Math.random() * 90) + 1;
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
