import { algorithms, buildSteps } from './algorithms.js';
import { hasIndex } from '../../core/utils.js';

const DEFAULT_DATA = { values: [10, 20, 30] };
const MAX_NODES = 8;

function parseNodeValues(text) {
  const trimmed = String(text).trim();
  if (!trimmed) return { values: [] };
  const tokens = trimmed.split(/[;,\s]+/).map((token) => token.trim()).filter(Boolean);
  if (tokens.length > MAX_NODES) {
    return { error: `Use no máximo ${MAX_NODES} nós para manter a visualização legível.` };
  }
  const values = tokens.map(Number);
  if (values.some((value) => !Number.isFinite(value))) {
    return { error: 'Use apenas números separados por espaço, vírgula ou ponto e vírgula.' };
  }
  return { values };
}

export const doublyLinkedListModule = {
  id: 'doubly-linked-lists',
  name: 'Listas Duplamente Encadeadas',
  version: '1.0',
  visualizationTitle: 'Lista duplamente encadeada na memória',
  defaultAlgorithmId: 'creation',
  storageKey: 'loa-lista-dupla',
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
        <div><span class="eyebrow">Dados de entrada</span><h2 id="data-editor-title">Monte sua lista</h2></div>
        <span class="size-badge">${values.length} nó${values.length === 1 ? '' : 's'}</span>
      </div>
      <label class="field-label" for="node-input">Elementos (do início para o fim)</label>
      <div class="input-action-row">
        <input id="node-input" class="text-input ${state.inputError ? 'invalid' : ''}" value="${escapeText(state.draft)}" placeholder="10, 20, 30" aria-describedby="node-help node-error" data-module-input="draft" data-module-enter="apply" />
        <button class="button primary" type="button" data-module-action="apply-data">${icons.check}<span>Aplicar</span></button>
      </div>
      <p id="node-help" class="field-help">Informe os valores do início para o fim, separados por vírgula, espaço ou ponto e vírgula. Deixe em branco para uma lista vazia. Máximo: ${MAX_NODES} nós.</p>
      <p id="node-error" class="error-message" role="alert">${escapeText(state.inputError)}</p>
      <div class="random-row">
        <label for="random-count">Quantidade aleatória</label>
        <input id="random-count" type="range" min="0" max="${MAX_NODES}" value="${state.randomCount}" data-module-input="random-count" />
        <output id="random-count-output">${state.randomCount}</output>
        <button class="button secondary" type="button" data-module-action="random-data">${icons.shuffle}<span>Gerar lista aleatória</span></button>
      </div>`;
  },

  renderConfig({ state }) {
    const { algorithmId, config } = state;
    if (algorithmId === 'inserirNoInicio' || algorithmId === 'inserirNoFim') {
      const label = algorithmId === 'inserirNoInicio' ? 'Escolha o valor a inserir no início' : 'Escolha o valor a inserir no final';
      return `
        <div class="panel-heading compact-heading"><div><span class="eyebrow">Parâmetros</span><h2 id="config-title">${label}</h2></div></div>
        <label class="config-field"><span>Valor</span><input id="item-input" type="number" value="${config.item}" data-module-input="item" /><small>Um novo nó será criado. Não há verificação de lista cheia.</small></label>`;
    }
    if (algorithmId === 'removerNo') {
      return `
        <div class="panel-heading compact-heading"><div><span class="eyebrow">Parâmetros</span><h2 id="config-title">Escolha o valor a remover</h2></div></div>
        <label class="config-field"><span>Valor</span><input id="item-input" type="number" value="${config.item}" data-module-input="item" /><small>A busca começa em início e percorre pelo ponteiro próximo.</small></label>`;
    }
    return '';
  },

  renderVisualization({ state, step, icons, escapeText }) {
    const total = step.values.length;
    const nodes = step.values.map((value, index) => {
      const classes = ['node'];
      if (hasIndex(step.processedIndices, index)) classes.push('processed');
      if (hasIndex(step.changedIndices, index)) classes.push('changed');
      if (hasIndex(step.activeIndices, index)) classes.push('active');
      if (hasIndex(step.foundIndices, index)) classes.push('found');
      if (state.inspectedItem === index) classes.push('inspected');
      const box = `<button type="button" class="${classes.join(' ')}" data-module-action="inspect-item" data-index="${index}" aria-label="Nó ${index}, valor ${escapeText(value)}">${escapeText(value)}</button>`;
      let arrow;
      if (index < total - 1) {
        const pending = step.pendingConnector;
        const missingNext = pending && pending.index === index && pending.missing === 'next';
        const missingPrev = pending && pending.index === index && pending.missing === 'prev';
        const nextLink = missingNext ? '' : '<span class="node-link node-link-next"><span class="node-link-arrow">→</span><span class="node-link-label">próximo</span></span>';
        const prevLink = missingPrev ? '' : '<span class="node-link node-link-prev"><span class="node-link-label">anterior</span><span class="node-link-arrow">←</span></span>';
        arrow = `<span class="node-links">${nextLink}${prevLink}</span>`;
      } else {
        arrow = '<span class="node-arrow">→</span>';
      }
      return `<span class="node-wrap">${box}</span>${arrow}`;
    }).join('');

    const inspection = state.inspectedItem !== null && state.inspectedItem < step.values.length
      ? `<div class="inspection-card">${icons.info}<span>Nó selecionado</span><strong>nó[${state.inspectedItem}] = ${escapeText(step.values[state.inspectedItem])}</strong></div>`
      : '';

    return `
      <div class="node-stage">
        <div class="node-dimensions"><span>nós: ${total}</span></div>
        <div class="node-scroll">
          <div class="node-chain">
            <span class="node-topo-badge">início</span>
            <span class="node-arrow">→</span>
            ${nodes}
            <span class="node-null">nulo</span>
          </div>
        </div>
        <div class="node-legend" aria-label="Legenda">
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
