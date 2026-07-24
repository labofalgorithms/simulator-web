import { algorithms, buildSteps } from './algorithms.js';
import { hasIndex } from '../../core/utils.js';

const DEFAULT_VECTOR = [8, 3, 12, 5, 9, 1, 7, 4];
const MAX_ITEMS = 12;

function parseVector(text) {
  const tokens = text.split(/[;,\s]+/).map((token) => token.trim()).filter(Boolean);
  if (!tokens.length) return { error: 'Digite pelo menos um número.' };
  if (tokens.length > MAX_ITEMS) return { error: `Use no máximo ${MAX_ITEMS} números para manter a visualização legível.` };
  const values = tokens.map(Number);
  if (values.some((value) => !Number.isFinite(value))) {
    return { error: 'Use apenas números separados por espaço, vírgula ou ponto e vírgula.' };
  }
  return { values };
}

export const vectorModule = {
  id: 'vectors',
  name: 'Vetores',
  version: '2.0',
  visualizationTitle: 'Vetor na memória',
  defaultAlgorithmId: 'sum',
  storageKey: 'loa-vetor',
  defaultData: DEFAULT_VECTOR,
  defaultRandomCount: 8,
  algorithms,
  buildSteps,

  isValidData(value) {
    return Array.isArray(value) && value.length > 0 && value.length <= MAX_ITEMS && value.every(Number.isFinite);
  },

  sanitizeData(value) {
    return this.isValidData(value) ? [...value] : [...DEFAULT_VECTOR];
  },

  formatData(values) {
    return values.join(', ');
  },

  createInitialConfig(values) {
    return { target: values.includes(9) ? 9 : values[0], index: Math.min(2, values.length - 1), newValue: 20 };
  },

  normalizeConfig(values, config) {
    const maximumIndex = Math.max(0, values.length - 1);
    return {
      target: Number.isFinite(Number(config.target)) ? Number(config.target) : values[0],
      index: Number.isInteger(Number(config.index)) ? Math.max(-1, Math.min(maximumIndex, Number(config.index))) : 0,
      newValue: Number.isFinite(Number(config.newValue)) ? Number(config.newValue) : 0,
    };
  },

  renderEditor({ state, icons, escapeText }) {
    return `
      <div class="panel-heading compact-heading">
        <div><span class="eyebrow">Dados de entrada</span><h2 id="data-editor-title">Monte seu vetor</h2></div>
        <span class="size-badge">${state.data.length} posições</span>
      </div>
      <label class="field-label" for="vector-input">Números do vetor</label>
      <div class="input-action-row">
        <input id="vector-input" class="text-input ${state.inputError ? 'invalid' : ''}" value="${escapeText(state.draft)}" placeholder="8, 3, 12, 5, 9" aria-describedby="vector-help vector-error" data-module-input="draft" data-module-enter="apply" />
        <button class="button primary" type="button" data-module-action="apply-data">${icons.check}<span>Aplicar</span></button>
      </div>
      <p id="vector-help" class="field-help">Separe os valores por vírgula, espaço ou ponto e vírgula. Máximo: ${MAX_ITEMS}.</p>
      <p id="vector-error" class="error-message" role="alert">${escapeText(state.inputError)}</p>
      <div class="random-row">
        <label for="random-count">Quantidade aleatória</label>
        <input id="random-count" type="range" min="3" max="${MAX_ITEMS}" value="${state.randomCount}" data-module-input="random-count" />
        <output id="random-count-output">${state.randomCount}</output>
        <button class="button secondary" type="button" data-module-action="random-data">${icons.shuffle}<span>Gerar vetor</span></button>
      </div>`;
  },

  renderConfig({ state }) {
    if (state.algorithmId === 'search') {
      return `
        <div class="panel-heading compact-heading"><div><span class="eyebrow">Parâmetros</span><h2 id="config-title">Interaja com o algoritmo</h2></div></div>
        <label class="config-field"><span>Valor buscado</span><input id="target-input" type="number" value="${state.config.target}" data-module-input="target" /><small>Experimente um valor que existe e outro que não existe.</small></label>`;
    }

    if (state.algorithmId === 'access') {
      return `
        <div class="panel-heading compact-heading"><div><span class="eyebrow">Parâmetros</span><h2 id="config-title">Interaja com o algoritmo</h2></div></div>
        <div class="config-grid">
          <label class="config-field"><span>Índice</span><input id="index-input" type="number" min="0" max="${state.data.length - 1}" value="${state.config.index}" data-module-input="index" /><small>Intervalo válido: 0 a ${state.data.length - 1}.</small></label>
          <label class="config-field"><span>Novo valor</span><input id="new-value-input" type="number" value="${state.config.newValue}" data-module-input="new-value" /><small>Será escrito na posição escolhida.</small></label>
        </div>`;
    }

    return '';
  },

  renderVisualization({ state, step, icons, escapeText }) {
    const cells = step.values.map((value, index) => {
      const classes = ['array-cell'];
      if (hasIndex(step.processedIndices, index)) classes.push('processed');
      if (hasIndex(step.comparedIndices, index)) classes.push('compared');
      if (hasIndex(step.activeIndices, index)) classes.push('active');
      if (hasIndex(step.foundIndices, index)) classes.push('found');
      if (hasIndex(step.sortedIndices, index)) classes.push('sorted');
      if (hasIndex(step.changedIndices, index)) classes.push('changed');
      if (state.inspectedItem === index) classes.push('inspected');
      return `<button type="button" class="${classes.join(' ')}" data-module-action="inspect-item" data-index="${index}" aria-label="Índice ${index}, valor ${escapeText(value)}"><span class="cell-value">${escapeText(value)}</span><span class="cell-index">${index}</span></button>`;
    }).join('');

    const inspection = state.inspectedItem !== null && state.inspectedItem < step.values.length
      ? `<div class="inspection-card">${icons.info}<span>Posição selecionada</span><strong>vetor[${state.inspectedItem}] = ${escapeText(step.values[state.inspectedItem])}</strong></div>`
      : '';

    return `
      <div class="array-stage">
        <div class="memory-label"><span class="memory-line"></span><span>memória sequencial</span></div>
        <div class="array-scroll" role="group" aria-label="Representação visual do vetor"><div class="array-row">${cells}</div></div>
        <div class="array-legend" aria-label="Legenda">
          <span><i class="legend-dot current"></i> atual</span>
          <span><i class="legend-dot compared"></i> comparação</span>
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
      case 'target':
        app.state.config.target = Number(input.value);
        app.rebuildSteps();
        break;
      case 'index':
        app.state.config.index = Number(input.value);
        app.rebuildSteps();
        break;
      case 'new-value':
        app.state.config.newValue = Number(input.value);
        app.rebuildSteps();
        break;
      default:
        break;
    }
  },

  handleAction(action, button, app) {
    if (action === 'apply-data') {
      const parsed = parseVector(app.state.draft);
      if (!parsed.values) {
        app.state.inputError = parsed.error;
        app.renderEditor();
        document.querySelector('#vector-input')?.focus();
        return;
      }
      app.setData(parsed.values);
      return;
    }

    if (action === 'random-data') {
      const count = app.state.randomCount;
      const values = Array.from({ length: count }, () => Math.floor(Math.random() * 91) - 10);
      app.state.config.target = values[Math.floor(Math.random() * values.length)];
      app.setData(values);
      return;
    }

    if (action === 'inspect-item') {
      const index = Number(button.dataset.index);
      app.state.inspectedItem = index;
      if (app.state.algorithmId === 'access') {
        app.state.config.index = index;
        app.rebuildSteps(false);
        app.renderConfig();
      }
      app.renderSimulation();
    }
  },
};
