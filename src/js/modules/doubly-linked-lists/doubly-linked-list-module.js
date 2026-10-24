import { algorithms, buildSteps } from './algorithms.js';
import { afterRenderScene, renderScene } from '../shared/node-scene.js';
import { tr } from '../../core/i18n.js';

const DEFAULT_DATA = { values: [10, 20, 30] };
const MAX_NODES = 8;

function parseNodeValues(text) {
  const trimmed = String(text).trim();
  if (!trimmed) return { values: [] };
  const tokens = trimmed.split(/[;,\s]+/).map((token) => token.trim()).filter(Boolean);
  if (tokens.length > MAX_NODES) {
    return { error: tr(`Use no máximo ${MAX_NODES} nós para manter a visualização legível.`, `Use at most ${MAX_NODES} nodes to keep the visualization readable.`) };
  }
  const values = tokens.map(Number);
  if (values.some((value) => !Number.isFinite(value))) {
    return { error: tr('Use apenas números separados por espaço, vírgula ou ponto e vírgula.', 'Use only numbers separated by space, comma or semicolon.') };
  }
  return { values };
}

export const doublyLinkedListModule = {
  id: 'doubly-linked-lists',
  name: tr('Listas Duplamente Encadeadas', 'Doubly Linked Lists'),
  version: '1.0',
  visualizationTitle: tr('Lista duplamente encadeada na memória', 'Doubly linked list in memory'),
  defaultAlgorithmId: 'creation',
  defaultData: DEFAULT_DATA,
  defaultRandomCount: 3,
  algorithms,
  buildSteps,

  isValidData(value) {
    return !!value && typeof value === 'object'
      && Array.isArray(value.values) && value.values.length <= MAX_NODES
      && value.values.every((item) => Number.isFinite(item));
  },

  sanitizeData(value) {
    if (this.isValidData(value)) return { values: [...value.values] };
    return { values: [...DEFAULT_DATA.values] };
  },

  formatData(data) {
    return data.values.join(', ');
  },

  createInitialConfig(data) {
    return { item: data.values.length ? data.values[data.values.length - 1] + 10 : 40 };
  },

  normalizeConfig(data, config) {
    return { item: Number.isFinite(Number(config.item)) ? Number(config.item) : 0 };
  },

  renderEditor({ state, icons, escapeText }) {
    const { values } = state.data;
    return `
      <div class="panel-heading compact-heading">
        <div><span class="eyebrow">${tr('Dados de entrada', 'Input data')}</span><h2 id="data-editor-title">${tr('Monte sua lista', 'Build your list')}</h2></div>
        <span class="size-badge">${values.length} ${tr('nó', 'node')}${values.length === 1 ? '' : 's'}</span>
      </div>
      <label class="field-label" for="node-input">${tr('Elementos (do início para o fim)', 'Elements (from head to tail)')}</label>
      <div class="input-action-row">
        <input id="node-input" class="text-input ${state.inputError ? 'invalid' : ''}" value="${escapeText(state.draft)}" placeholder="10, 20, 30" aria-describedby="node-help node-error" data-module-input="draft" data-module-enter="apply" />
        <button class="button primary" type="button" data-module-action="apply-data">${icons.check}<span>${tr('Aplicar', 'Apply')}</span></button>
      </div>
      <p id="node-help" class="field-help">${tr('Informe os valores do início para o fim, separados por vírgula, espaço ou ponto e vírgula. Deixe em branco para uma lista vazia. Máximo:', 'Enter the values from head to tail, separated by comma, space or semicolon. Leave blank for an empty list. Maximum:')} ${MAX_NODES} ${tr('nós.', 'nodes.')}</p>
      <p id="node-error" class="error-message" role="alert">${escapeText(state.inputError)}</p>
      <div class="random-row">
        <label for="random-count">${tr('Quantidade aleatória', 'Random quantity')}</label>
        <input id="random-count" type="range" min="0" max="${MAX_NODES}" value="${state.randomCount}" data-module-input="random-count" />
        <output id="random-count-output">${state.randomCount}</output>
        <button class="button secondary" type="button" data-module-action="random-data">${icons.shuffle}<span>${tr('Gerar lista aleatória', 'Generate random list')}</span></button>
      </div>`;
  },

  renderConfig({ state }) {
    const { algorithmId, config } = state;
    if (algorithmId === 'inserirNoInicio' || algorithmId === 'inserirNoFim') {
      const label = algorithmId === 'inserirNoInicio' ? tr('Escolha o valor a inserir no início', 'Choose the value to insert at the start') : tr('Escolha o valor a inserir no final', 'Choose the value to insert at the end');
      return `
        <div class="panel-heading compact-heading"><div><span class="eyebrow">${tr('Parâmetros', 'Parameters')}</span><h2 id="config-title">${label}</h2></div></div>
        <label class="config-field"><span>${tr('Valor', 'Value')}</span><input id="item-input" type="number" value="${config.item}" data-module-input="item" /><small>${tr('Um novo nó será criado. Não há verificação de lista cheia.', 'A new node will be created. There is no full-list check.')}</small></label>`;
    }
    if (algorithmId === 'removerNo') {
      return `
        <div class="panel-heading compact-heading"><div><span class="eyebrow">${tr('Parâmetros', 'Parameters')}</span><h2 id="config-title">${tr('Escolha o valor a remover', 'Choose the value to remove')}</h2></div></div>
        <label class="config-field"><span>${tr('Valor', 'Value')}</span><input id="item-input" type="number" value="${config.item}" data-module-input="item" /><small>${tr('A busca começa em início e percorre pelo ponteiro próximo.', 'The search starts at head and follows the next pointer.')}</small></label>`;
    }
    return '';
  },

  renderVisualization({ state, step, icons, escapeText }) {
    return renderScene({ state, step, icons, escapeText, showLost: state.algorithmId === 'removerNo' });
  },

  afterRender: afterRenderScene,

  handleInput(name, input, app) {
    switch (name) {
      case 'draft':
        app.state.draft = input.value;
        break;
      case 'random-count':
        app.state.randomCount = Number(input.value);
        document.querySelector('#random-count-output').textContent = input.value;
        break;
      case 'item':
        app.state.config.item = Number(input.value);
        app.rebuildSteps();
        break;
      default:
        break;
    }
  },

  handleAction(action, button, app) {
    if (action === 'apply-data') {
      const parsed = parseNodeValues(app.state.draft);
      if (!parsed.values) {
        app.state.inputError = parsed.error;
        app.renderEditor();
        document.querySelector('#node-input')?.focus();
        return;
      }
      app.setData({ values: parsed.values });
      return;
    }

    if (action === 'random-data') {
      const count = app.state.randomCount;
      const values = Array.from({ length: count }, () => Math.floor(Math.random() * 90) + 1);
      app.state.config.item = Math.floor(Math.random() * 90) + 1;
      app.setData({ values });
      return;
    }

    if (action === 'inspect-item') {
      const index = Number(button.dataset.index);
      app.state.inspectedItem = index;
      app.renderSimulation();
    }
  },
};
