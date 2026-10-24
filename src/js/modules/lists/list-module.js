import { algorithms, buildSteps } from './algorithms.js';
import { hasIndex } from '../../core/utils.js';
import { tr } from '../../core/i18n.js';

const DEFAULT_DATA = { capacity: 6, values: [27, 6, 19, 31, 30] };
const MAX_CAPACITY = 8;

function parseListValues(text, capacity) {
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

export const listModule = {
  id: 'lists',
  name: tr('Listas', 'Lists'),
  version: '1.0',
  visualizationTitle: tr('Lista na memória', 'List in memory'),
  defaultAlgorithmId: 'creation',
  defaultData: DEFAULT_DATA,
  defaultRandomCount: 4,
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
    return { position: Math.min(1, data.values.length), value: 57 };
  },

  normalizeConfig(data, config) {
    return {
      position: Number.isInteger(Number(config.position)) ? Number(config.position) : 0,
      value: Number.isFinite(Number(config.value)) ? Number(config.value) : 0,
    };
  },

  renderEditor({ state, icons, escapeText }) {
    const { capacity, values } = state.data;
    return `
      <div class="panel-heading compact-heading">
        <div><span class="eyebrow">${tr('Dados de entrada', 'Input data')}</span><h2 id="data-editor-title">${tr('Monte sua lista', 'Build your list')}</h2></div>
        <span id="list-size-badge" class="size-badge">${values.length}/${capacity} ${tr('posições', 'positions')}</span>
      </div>
      <label class="field-label" for="list-input">${tr('Elementos (posição 0 em diante)', 'Elements (position 0 onward)')}</label>
      <div class="input-action-row">
        <input id="list-input" class="text-input ${state.inputError ? 'invalid' : ''}" value="${escapeText(state.draft)}" placeholder="27, 6, 19, 31, 30" aria-describedby="list-help list-error" data-module-input="draft" data-module-enter="apply" />
        <button class="button primary" type="button" data-module-action="apply-data">${icons.check}<span>${tr('Aplicar', 'Apply')}</span></button>
      </div>
      <p id="list-help" class="field-help">${tr('Informe os valores já armazenados, da posição 0 em diante, separados por vírgula, espaço ou ponto e vírgula. Deixe em branco para uma lista vazia. Máximo: a capacidade atual.', 'Enter the values already stored, from position 0 onward, separated by comma, space or semicolon. Leave blank for an empty list. Maximum: the current capacity.')}</p>
      <p id="list-error" class="error-message" role="alert">${escapeText(state.inputError)}</p>
      <div class="random-row">
        <label for="list-capacity">${tr('Capacidade', 'Capacity')}</label>
        <input id="list-capacity" type="range" min="1" max="${MAX_CAPACITY}" value="${capacity}" data-module-input="capacity" />
        <output id="list-capacity-output">${capacity}</output>
        <button class="button secondary" type="button" data-module-action="random-data">${icons.shuffle}<span>${tr('Gerar lista aleatória', 'Generate random list')}</span></button>
      </div>`;
  },

  renderConfig({ state }) {
    const { algorithmId, data, config } = state;
    if (algorithmId === 'add') {
      const cheia = data.values.length >= data.capacity;
      return `
        <div class="panel-heading compact-heading"><div><span class="eyebrow">${tr('Parâmetros', 'Parameters')}</span><h2 id="config-title">${tr('Escolha a posição e o valor', 'Choose the position and the value')}</h2></div></div>
        <div class="config-grid">
          <label class="config-field"><span>${tr('Posição', 'Position')}</span><input id="position-input" type="number" value="${config.position}" data-module-input="position" /><small>${tr('Intervalo válido: 0 a', 'Valid range: 0 to')} ${data.values.length}.</small></label>
          <label class="config-field"><span>${tr('Valor', 'Value')}</span><input id="value-input" type="number" value="${config.value}" data-module-input="value" /><small>${tr('Será inserido na posição escolhida.', 'It will be inserted at the chosen position.')}</small></label>
        </div>
        ${cheia ? `<p class="matrix-config-note">${tr('A lista está cheia: o add() demonstrará a verificação de isFull() sem inserir o valor.', 'The list is full: add() will demonstrate the isFull() check without inserting the value.')}</p>` : ''}`;
    }
    if (algorithmId === 'set') {
      const vazia = data.values.length === 0;
      return `
        <div class="panel-heading compact-heading"><div><span class="eyebrow">${tr('Parâmetros', 'Parameters')}</span><h2 id="config-title">${tr('Escolha a posição e o valor', 'Choose the position and the value')}</h2></div></div>
        <div class="config-grid">
          <label class="config-field"><span>${tr('Posição', 'Position')}</span><input id="position-input" type="number" value="${config.position}" data-module-input="position" /><small>${tr('Intervalo válido: 0 a', 'Valid range: 0 to')} ${Math.max(0, data.values.length - 1)}.</small></label>
          <label class="config-field"><span>${tr('Valor', 'Value')}</span><input id="value-input" type="number" value="${config.value}" data-module-input="value" /><small>${tr('Substituirá o valor atual, sem deslocar elementos.', 'It will replace the current value, without shifting elements.')}</small></label>
        </div>
        ${vazia ? `<p class="matrix-config-note">${tr('A lista está vazia: o set() demonstrará a verificação de isEmpty() sem alterar nada.', 'The list is empty: set() will demonstrate the isEmpty() check without changing anything.')}</p>` : ''}`;
    }
    if (algorithmId === 'remove' || algorithmId === 'get') {
      const vazia = data.values.length === 0;
      const actionLabel = algorithmId === 'remove' ? tr('Escolha a posição a remover', 'Choose the position to remove') : tr('Escolha a posição a consultar', 'Choose the position to query');
      return `
        <div class="panel-heading compact-heading"><div><span class="eyebrow">${tr('Parâmetros', 'Parameters')}</span><h2 id="config-title">${actionLabel}</h2></div></div>
        <label class="config-field"><span>${tr('Posição', 'Position')}</span><input id="position-input" type="number" value="${config.position}" data-module-input="position" /><small>${tr('Intervalo válido: 0 a', 'Valid range: 0 to')} ${Math.max(0, data.values.length - 1)}.</small></label>
        ${vazia ? `<p class="matrix-config-note">${tr('A lista está vazia: o método apenas demonstrará a verificação de isEmpty().', 'The list is empty: the method will only demonstrate the isEmpty() check.')}</p>` : ''}
        <p class="matrix-config-note">${tr('Você também pode clicar diretamente em uma posição da lista.', 'You can also click a list position directly.')}</p>`;
    }
    return '';
  },

  renderVisualization({ state, step, icons, escapeText }) {
    const cells = Array.from({ length: step.capacidade }, (_, index) => {
      const unused = index >= step.values.length;
      const classes = ['array-cell'];
      if (unused) classes.push('unused');
      if (hasIndex(step.processedIndices, index)) classes.push('processed');
      if (hasIndex(step.comparedIndices, index)) classes.push('compared');
      if (hasIndex(step.activeIndices, index)) classes.push('active');
      if (hasIndex(step.foundIndices, index)) classes.push('found');
      if (hasIndex(step.changedIndices, index)) classes.push('changed');
      if (state.inspectedItem === index) classes.push('inspected');
      const value = unused ? tr('não usado', 'unused') : escapeText(step.values[index]);
      return `<button type="button" class="${classes.join(' ')}" data-module-action="inspect-item" data-index="${index}" aria-label="${tr('Posição', 'Position')} ${index}${unused ? tr(', não utilizada', ', unused') : tr(`, valor ${escapeText(step.values[index])}`, `, value ${escapeText(step.values[index])}`)}"><span class="cell-value">${value}</span><span class="cell-index">${index}</span></button>`;
    }).join('');

    const inspection = state.inspectedItem !== null && state.inspectedItem < step.values.length
      ? `<div class="inspection-card">${icons.info}<span>${tr('Posição selecionada', 'Selected position')}</span><strong>${tr('vetorLista[', 'listArray[')}${state.inspectedItem}] = ${escapeText(step.values[state.inspectedItem])}</strong></div>`
      : '';

    return `
      <div class="array-stage">
        <div class="memory-label"><span class="memory-line"></span><span>${tr('capacidade:', 'capacity:')} ${step.capacidade} ${tr('· tamanho:', '· size:')} ${step.tamanho}</span></div>
        <div class="array-scroll" role="group" aria-label="${tr('Representação visual da lista', 'Visual representation of the list')}"><div class="array-row">${cells}</div></div>
        <div class="array-legend" aria-label="${tr('Legenda', 'Legend')}">
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
          const draftInput = document.querySelector('#list-input');
          if (draftInput) draftInput.value = app.state.draft;
        }
        const output = document.querySelector('#list-capacity-output');
        if (output) output.textContent = capacity;
        const badge = document.querySelector('#list-size-badge');
        if (badge) badge.textContent = tr(`${app.state.data.values.length}/${capacity} posições`, `${app.state.data.values.length}/${capacity} positions`);
        app.rebuildSteps();
        break;
      }
      case 'position':
        app.state.config.position = Number(input.value);
        app.rebuildSteps();
        break;
      case 'value':
        app.state.config.value = Number(input.value);
        app.rebuildSteps();
        break;
      default:
        break;
    }
  },

  handleAction(action, button, app) {
    if (action === 'apply-data') {
      const capacity = app.state.data.capacity;
      const parsed = parseListValues(app.state.draft, capacity);
      if (!parsed.values) {
        app.state.inputError = parsed.error;
        app.renderEditor();
        document.querySelector('#list-input')?.focus();
        return;
      }
      app.setData({ capacity, values: parsed.values });
      return;
    }

    if (action === 'random-data') {
      const capacity = app.state.data.capacity;
      const count = Math.floor(Math.random() * (capacity + 1));
      const values = Array.from({ length: count }, () => Math.floor(Math.random() * 90) + 1);
      app.state.config.value = Math.floor(Math.random() * 90) + 1;
      app.setData({ capacity, values });
      return;
    }

    if (action === 'inspect-item') {
      const index = Number(button.dataset.index);
      app.state.inspectedItem = index;
      if (['add', 'remove', 'set', 'get'].includes(app.state.algorithmId) && index <= app.state.data.values.length) {
        app.state.config.position = index;
        app.rebuildSteps(false);
        app.renderConfig();
      }
      app.renderSimulation();
    }
  },
};
