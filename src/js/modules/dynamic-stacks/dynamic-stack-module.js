import { algorithms, buildSteps } from './algorithms.js';
import { hasIndex } from '../../core/utils.js';
import { tr } from '../../core/i18n.js';

const DEFAULT_DATA = { values: [51, 72, 94] };
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

export const dynamicStackModule = {
  id: 'dynamic-stacks',
  name: tr('Pilhas Dinâmicas', 'Dynamic Stacks'),
  version: '1.0',
  visualizationTitle: tr('Pilha encadeada na memória', 'Linked stack in memory'),
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
    return { pushValue: data.values.length ? data.values[0] + 1 : 15 };
  },

  normalizeConfig(data, config) {
    return { pushValue: Number.isFinite(Number(config.pushValue)) ? Number(config.pushValue) : 0 };
  },

  renderEditor({ state, icons, escapeText }) {
    const { values } = state.data;
    return `
      <div class="panel-heading compact-heading">
        <div><span class="eyebrow">${tr('Dados de entrada', 'Input data')}</span><h2 id="data-editor-title">${tr('Monte sua pilha', 'Build your stack')}</h2></div>
        <span class="size-badge">${values.length} ${tr('nó', 'node')}${values.length === 1 ? '' : 's'}</span>
      </div>
      <label class="field-label" for="node-input">${tr('Elementos (do topo para a base)', 'Elements (from top to base)')}</label>
      <div class="input-action-row">
        <input id="node-input" class="text-input ${state.inputError ? 'invalid' : ''}" value="${escapeText(state.draft)}" placeholder="51, 72, 94" aria-describedby="node-help node-error" data-module-input="draft" data-module-enter="apply" />
        <button class="button primary" type="button" data-module-action="apply-data">${icons.check}<span>${tr('Aplicar', 'Apply')}</span></button>
      </div>
      <p id="node-help" class="field-help">${tr('Informe os valores do topo para a base, separados por vírgula, espaço ou ponto e vírgula. Deixe em branco para uma pilha vazia. Máximo:', 'Enter the values from top to base, separated by comma, space or semicolon. Leave blank for an empty stack. Maximum:')} ${MAX_NODES} ${tr('nós.', 'nodes.')}</p>
      <p id="node-error" class="error-message" role="alert">${escapeText(state.inputError)}</p>
      <div class="random-row">
        <label for="random-count">${tr('Quantidade aleatória', 'Random quantity')}</label>
        <input id="random-count" type="range" min="0" max="${MAX_NODES}" value="${state.randomCount}" data-module-input="random-count" />
        <output id="random-count-output">${state.randomCount}</output>
        <button class="button secondary" type="button" data-module-action="random-data">${icons.shuffle}<span>${tr('Gerar pilha aleatória', 'Generate random stack')}</span></button>
      </div>`;
  },

  renderConfig({ state }) {
    if (state.algorithmId !== 'push') return '';
    return `
      <div class="panel-heading compact-heading"><div><span class="eyebrow">${tr('Parâmetros', 'Parameters')}</span><h2 id="config-title">${tr('Escolha o valor a empilhar', 'Choose the value to push')}</h2></div></div>
      <label class="config-field"><span>${tr('Valor', 'Value')}</span><input id="push-value-input" type="number" value="${state.config.pushValue}" data-module-input="push-value" /><small>${tr('Um novo nó será criado no topo. Não há verificação de pilha cheia.', 'A new node will be created at the top. There is no full-stack check.')}</small></label>`;
  },

  renderVisualization({ state, step, icons, escapeText }) {
    const nodes = step.values.map((value, index) => {
      const classes = ['node'];
      if (hasIndex(step.processedIndices, index)) classes.push('processed');
      if (hasIndex(step.changedIndices, index)) classes.push('changed');
      if (hasIndex(step.activeIndices, index)) classes.push('active');
      if (hasIndex(step.foundIndices, index)) classes.push('found');
      if (state.inspectedItem === index) classes.push('inspected');
      const box = `<button type="button" class="${classes.join(' ')}" data-module-action="inspect-item" data-index="${index}" aria-label="${tr('Nó', 'Node')} ${index}${tr(', valor', ', value')} ${escapeText(value)}">${escapeText(value)}</button>`;
      return `${box}<span class="node-arrow">→</span>`;
    }).join('');

    const inspection = state.inspectedItem !== null && state.inspectedItem < step.values.length
      ? `<div class="inspection-card">${icons.info}<span>${tr('Nó selecionado', 'Selected node')}</span><strong>${tr('nó[', 'node[')}${state.inspectedItem}] = ${escapeText(step.values[state.inspectedItem])}</strong></div>`
      : '';

    return `
      <div class="node-stage">
        <div class="node-dimensions"><span>${tr('nós:', 'nodes:')} ${step.values.length}</span></div>
        <div class="node-scroll">
          <div class="node-chain">
            <span class="node-topo-badge">${tr('TOPO', 'TOP')}</span>
            <span class="node-arrow">→</span>
            ${nodes}
            <span class="node-null">${tr('nulo', 'null')}</span>
          </div>
        </div>
        <div class="node-legend" aria-label="${tr('Legenda', 'Legend')}">
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
      case 'random-count':
        app.state.randomCount = Number(input.value);
        document.querySelector('#random-count-output').textContent = input.value;
        break;
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
      app.state.config.pushValue = Math.floor(Math.random() * 90) + 1;
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
