import { algorithms, buildSteps } from './algorithms.js';
import { hasIndex } from '../../core/utils.js';
import { tr } from '../../core/i18n.js';

const DEFAULT_VECTOR = [8, 3, 12, 5, 9, 1, 7, 4];
const MAX_ITEMS = 12;

function parseVector(text) {
  const tokens = text.split(/[;,\s]+/).map((token) => token.trim()).filter(Boolean);
  if (!tokens.length) return { error: tr('Digite pelo menos um número.', 'Enter at least one number.') };
  if (tokens.length > MAX_ITEMS) return { error: tr(`Use no máximo ${MAX_ITEMS} números para manter a visualização legível.`, `Use at most ${MAX_ITEMS} numbers to keep the visualization readable.`) };
  const values = tokens.map(Number);
  if (values.some((value) => !Number.isFinite(value))) {
    return { error: tr('Use apenas números separados por espaço, vírgula ou ponto e vírgula.', 'Use only numbers separated by space, comma or semicolon.') };
  }
  return { values };
}

export const vectorModule = {
  id: 'vectors',
  name: tr('Vetores', 'Arrays'),
  version: '2.0',
  visualizationTitle: tr('Vetor na memória', 'Array in memory'),
  defaultAlgorithmId: 'indices',
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
        <div><span class="eyebrow">${tr('Dados de entrada', 'Input data')}</span><h2 id="data-editor-title">${tr('Monte seu vetor', 'Build your array')}</h2></div>
        <span class="size-badge">${state.data.length} ${tr('posições', 'positions')}</span>
      </div>
      <label class="field-label" for="vector-input">${tr('Números do vetor', 'Array numbers')}</label>
      <div class="input-action-row">
        <input id="vector-input" class="text-input ${state.inputError ? 'invalid' : ''}" value="${escapeText(state.draft)}" placeholder="8, 3, 12, 5, 9" aria-describedby="vector-help vector-error" data-module-input="draft" data-module-enter="apply" />
        <button class="button primary" type="button" data-module-action="apply-data">${icons.check}<span>${tr('Aplicar', 'Apply')}</span></button>
      </div>
      <p id="vector-help" class="field-help">${tr('Separe os valores por vírgula, espaço ou ponto e vírgula. Máximo:', 'Separate the values by comma, space or semicolon. Maximum:')} ${MAX_ITEMS}.</p>
      <p id="vector-error" class="error-message" role="alert">${escapeText(state.inputError)}</p>
      <div class="random-row">
        <label for="random-count">${tr('Quantidade aleatória', 'Random quantity')}</label>
        <input id="random-count" type="range" min="3" max="${MAX_ITEMS}" value="${state.randomCount}" data-module-input="random-count" />
        <output id="random-count-output">${state.randomCount}</output>
        <button class="button secondary" type="button" data-module-action="random-data">${icons.shuffle}<span>${tr('Gerar vetor', 'Generate array')}</span></button>
      </div>`;
  },

  renderConfig({ state }) {
    if (state.algorithmId === 'search') {
      return `
        <div class="panel-heading compact-heading"><div><span class="eyebrow">${tr('Parâmetros', 'Parameters')}</span><h2 id="config-title">${tr('Interaja com o algoritmo', 'Interact with the algorithm')}</h2></div></div>
        <label class="config-field"><span>${tr('Valor buscado', 'Searched value')}</span><input id="target-input" type="number" value="${state.config.target}" data-module-input="target" /><small>${tr('Experimente um valor que existe e outro que não existe.', 'Try a value that exists and another that does not.')}</small></label>`;
    }

    if (state.algorithmId === 'access') {
      return `
        <div class="panel-heading compact-heading"><div><span class="eyebrow">${tr('Parâmetros', 'Parameters')}</span><h2 id="config-title">${tr('Interaja com o algoritmo', 'Interact with the algorithm')}</h2></div></div>
        <div class="config-grid">
          <label class="config-field"><span>${tr('Índice', 'Index')}</span><input id="index-input" type="number" min="0" max="${state.data.length - 1}" value="${state.config.index}" data-module-input="index" /><small>${tr('Intervalo válido: 0 a', 'Valid range: 0 to')} ${state.data.length - 1}.</small></label>
          <label class="config-field"><span>${tr('Novo valor', 'New value')}</span><input id="new-value-input" type="number" value="${state.config.newValue}" data-module-input="new-value" /><small>${tr('Será escrito na posição escolhida.', 'It will be written to the chosen position.')}</small></label>
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
      return `<button type="button" class="${classes.join(' ')}" data-module-action="inspect-item" data-index="${index}" aria-label="${tr('Índice', 'Index')} ${index}${tr(', valor', ', value')} ${escapeText(value)}"><span class="cell-value">${escapeText(value)}</span><span class="cell-index">${index}</span></button>`;
    }).join('');

    const inspection = state.inspectedItem !== null && state.inspectedItem < step.values.length
      ? `<div class="inspection-card">${icons.info}<span>${tr('Posição selecionada', 'Selected position')}</span><strong>${tr('vetor[', 'array[')}${state.inspectedItem}] = ${escapeText(step.values[state.inspectedItem])}</strong></div>`
      : '';

    return `
      <div class="array-stage">
        <div class="memory-label"><span class="memory-line"></span><span>${tr('memória sequencial', 'sequential memory')}</span></div>
        <div class="array-scroll" role="group" aria-label="${tr('Representação visual do vetor', 'Visual representation of the array')}"><div class="array-row">${cells}</div></div>
        <div class="array-legend" aria-label="${tr('Legenda', 'Legend')}">
          <span><i class="legend-dot current"></i> ${tr('atual', 'current')}</span>
          <span><i class="legend-dot compared"></i> ${tr('comparação', 'comparison')}</span>
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
