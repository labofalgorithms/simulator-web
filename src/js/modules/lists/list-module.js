import { algorithms, buildSteps } from './algorithms.js';
import { hasIndex } from '../../core/utils.js';

const DEFAULT_DATA = { capacity: 6, values: [27, 6, 19, 31, 30] };
const MAX_CAPACITY = 8;

function parseListValues(text, capacity) {
  const trimmed = String(text).trim();
  if (!trimmed) return { values: [] };
  const tokens = trimmed.split(/[;,\s]+/).map((token) => token.trim()).filter(Boolean);
  if (tokens.length > capacity) {
    return { error: `A capacidade atual é ${capacity}; reduza a quantidade de valores ou aumente a capacidade.` };
  }
  const values = tokens.map(Number);
  if (values.some((value) => !Number.isFinite(value))) {
    return { error: 'Use apenas números separados por espaço, vírgula ou ponto e vírgula.' };
  }
  return { values };
}

export const listModule = {
  id: 'lists',
  name: 'Listas',
  version: '1.0',
  visualizationTitle: 'Lista na memória',
  defaultAlgorithmId: 'creation',
  storageKey: 'loa-lista',
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
        <div><span class="eyebrow">Dados de entrada</span><h2 id="data-editor-title">Monte sua lista</h2></div>
        <span id="list-size-badge" class="size-badge">${values.length}/${capacity} posições</span>
      </div>
      <label class="field-label" for="list-input">Elementos (posição 0 em diante)</label>
      <div class="input-action-row">
        <input id="list-input" class="text-input ${state.inputError ? 'invalid' : ''}" value="${escapeText(state.draft)}" placeholder="27, 6, 19, 31, 30" aria-describedby="list-help list-error" data-module-input="draft" data-module-enter="apply" />
        <button class="button primary" type="button" data-module-action="apply-data">${icons.check}<span>Aplicar</span></button>
      </div>
      <p id="list-help" class="field-help">Informe os valores já armazenados, da posição 0 em diante, separados por vírgula, espaço ou ponto e vírgula. Deixe em branco para uma lista vazia. Máximo: a capacidade atual.</p>
      <p id="list-error" class="error-message" role="alert">${escapeText(state.inputError)}</p>
      <div class="random-row">
        <label for="list-capacity">Capacidade</label>
        <input id="list-capacity" type="range" min="1" max="${MAX_CAPACITY}" value="${capacity}" data-module-input="capacity" />
        <output id="list-capacity-output">${capacity}</output>
        <button class="button secondary" type="button" data-module-action="random-data">${icons.shuffle}<span>Gerar lista aleatória</span></button>
      </div>`;
  },

  renderConfig({ state }) {
    const { algorithmId, data, config } = state;
    if (algorithmId === 'add') {
      const cheia = data.values.length >= data.capacity;
      return `
        <div class="panel-heading compact-heading"><div><span class="eyebrow">Parâmetros</span><h2 id="config-title">Escolha a posição e o valor</h2></div></div>
        <div class="config-grid">
          <label class="config-field"><span>Posição</span><input id="position-input" type="number" value="${config.position}" data-module-input="position" /><small>Intervalo válido: 0 a ${data.values.length}.</small></label>
          <label class="config-field"><span>Valor</span><input id="value-input" type="number" value="${config.value}" data-module-input="value" /><small>Será inserido na posição escolhida.</small></label>
        </div>
        ${cheia ? '<p class="matrix-config-note">A lista está cheia: o add() demonstrará a verificação de isFull() sem inserir o valor.</p>' : ''}`;
    }
    if (algorithmId === 'set') {
      const vazia = data.values.length === 0;
      return `
        <div class="panel-heading compact-heading"><div><span class="eyebrow">Parâmetros</span><h2 id="config-title">Escolha a posição e o valor</h2></div></div>
        <div class="config-grid">
          <label class="config-field"><span>Posição</span><input id="position-input" type="number" value="${config.position}" data-module-input="position" /><small>Intervalo válido: 0 a ${Math.max(0, data.values.length - 1)}.</small></label>
          <label class="config-field"><span>Valor</span><input id="value-input" type="number" value="${config.value}" data-module-input="value" /><small>Substituirá o valor atual, sem deslocar elementos.</small></label>
        </div>
        ${vazia ? '<p class="matrix-config-note">A lista está vazia: o set() demonstrará a verificação de isEmpty() sem alterar nada.</p>' : ''}`;
    }
    if (algorithmId === 'remove' || algorithmId === 'get') {
      const vazia = data.values.length === 0;
      const actionLabel = algorithmId === 'remove' ? 'Escolha a posição a remover' : 'Escolha a posição a consultar';
      return `
        <div class="panel-heading compact-heading"><div><span class="eyebrow">Parâmetros</span><h2 id="config-title">${actionLabel}</h2></div></div>
        <label class="config-field"><span>Posição</span><input id="position-input" type="number" value="${config.position}" data-module-input="position" /><small>Intervalo válido: 0 a ${Math.max(0, data.values.length - 1)}.</small></label>
        ${vazia ? '<p class="matrix-config-note">A lista está vazia: o método apenas demonstrará a verificação de isEmpty().</p>' : ''}
        <p class="matrix-config-note">Você também pode clicar diretamente em uma posição da lista.</p>`;
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
      const value = unused ? 'não usado' : escapeText(step.values[index]);
      return `<button type="button" class="${classes.join(' ')}" data-module-action="inspect-item" data-index="${index}" aria-label="Posição ${index}${unused ? ', não utilizada' : `, valor ${escapeText(step.values[index])}`}"><span class="cell-value">${value}</span><span class="cell-index">${index}</span></button>`;
    }).join('');

    const inspection = state.inspectedItem !== null && state.inspectedItem < step.values.length
      ? `<div class="inspection-card">${icons.info}<span>Posição selecionada</span><strong>vetorLista[${state.inspectedItem}] = ${escapeText(step.values[state.inspectedItem])}</strong></div>`
      : '';

    return `
      <div class="array-stage">
        <div class="memory-label"><span class="memory-line"></span><span>capacidade: ${step.capacidade} · tamanho: ${step.tamanho}</span></div>
        <div class="array-scroll" role="group" aria-label="Representação visual da lista"><div class="array-row">${cells}</div></div>
        <div class="array-legend" aria-label="Legenda">
          <span><i class="legend-dot current"></i> atual</span>
          <span><i class="legend-dot compared"></i> alterado</span>
          <span><i class="legend-dot processed"></i> processado</span>
          <span><i class="legend-dot result"></i> resultado</span>
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
        if (badge) badge.textContent = `${app.state.data.values.length}/${capacity} posições`;
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
