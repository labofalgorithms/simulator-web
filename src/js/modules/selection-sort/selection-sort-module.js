import { algorithms, buildSteps, stabilityExample } from './algorithms.js';
import { icons } from '../../core/icons.js';
import {
  legend, parseVector, randomVector, renderArray, renderChart, renderCompare, renderInspection, renderLockstep, renderPhase, renderStats, renderVectorEditor,
} from '../shared/sort-view.js';

const DEFAULT_VECTOR = [93, 87, 65, 99, 42, 31, 74];
const MIN_ITEMS = 2;
const MAX_ITEMS = 10;
const LIMITS = { min: MIN_ITEMS, max: MAX_ITEMS };
const COMPARE_HINT = 'A comparação vetor[j] &lt; vetor[minimo] aparece aqui durante a varredura.';

const LEGEND_I = ['pointer-i', 'i · início do sub-vetor'];
const LEGEND_J = ['current', 'j · posição examinada'];
const LEGEND_MIN = ['result', 'min · menor encontrado'];
const LEGEND_SWAP = ['compared', 'troca'];
const LEGEND_SORTED = ['sorted', 'ordenado'];

const LEGENDS = {
  'find-min': [LEGEND_J, LEGEND_MIN, ['outside', 'fora do sub-vetor']],
  'selection-sort': [LEGEND_I, LEGEND_J, LEGEND_MIN, LEGEND_SWAP, LEGEND_SORTED],
  counting: [LEGEND_I, LEGEND_MIN, LEGEND_SWAP, LEGEND_SORTED],
  adaptability: [LEGEND_MIN, LEGEND_SWAP, LEGEND_SORTED],
  stability: [LEGEND_I, LEGEND_MIN, LEGEND_SORTED, ['dup', 'repetido (letra = ordem original)'], ['warn', 'ordem invertida']],
};

export const selectionSortModule = {
  id: 'selection-sort',
  name: 'Selection Sort',
  category: { name: 'Algoritmos', anchor: 'algoritmos' },
  version: '1.0',
  visualizationTitle: 'Vetor sendo ordenado',
  defaultAlgorithmId: 'find-min',
  defaultData: DEFAULT_VECTOR,
  defaultRandomCount: 7,
  algorithms,
  buildSteps,

  isValidData(value) {
    return Array.isArray(value) && value.length >= MIN_ITEMS && value.length <= MAX_ITEMS && value.every(Number.isFinite);
  },

  sanitizeData(value) {
    return this.isValidData(value) ? [...value] : [...DEFAULT_VECTOR];
  },

  formatData(values) {
    return values.join(', ');
  },

  createInitialConfig() {
    return { inicio: 0 };
  },

  normalizeConfig(values, config) {
    const inicio = Number(config.inicio);
    return { inicio: Number.isInteger(inicio) ? Math.max(0, Math.min(values.length - 1, inicio)) : 0 };
  },

  renderEditor(context) {
    return renderVectorEditor(context, { ...LIMITS, placeholder: '93, 87, 65, 99, 42, 31, 74' });
  },

  renderConfig({ state }) {
    const heading = (title) => `<div class="panel-heading compact-heading"><div><span class="eyebrow">Parâmetros</span><h2 id="config-title">${title}</h2></div></div>`;

    if (state.algorithmId === 'find-min') {
      return `
        ${heading('Escolha onde a varredura começa')}
        <label class="config-field"><span>Posição inicial do sub-vetor</span><input id="start-input" type="number" min="0" max="${state.data.length - 1}" value="${state.config.inicio}" data-module-input="inicio" /><small>Intervalo válido: 0 a ${state.data.length - 1}. Você também pode clicar em uma posição do vetor.</small></label>`;
    }

    if (state.algorithmId === 'stability') {
      return `
        ${heading('Exemplo com valores repetidos')}
        <div class="config-note-row">
          <p>A estabilidade só aparece quando há valores iguais. O botão ao lado monta um vetor em que a ordem deles realmente se inverte.</p>
          <button class="button secondary" type="button" data-module-action="stability-example">${icons.shuffle}<span>Gerar exemplo</span></button>
        </div>`;
    }

    return '';
  },

  renderVisualization({ state, step, escapeText }) {
    const { algorithmId } = state;
    if (algorithmId === 'adaptability') return renderLockstep(step, escapeText, LEGENDS.adaptability);

    const showTags = algorithmId === 'stability';
    return `
      <div class="sort-stage">
        ${renderPhase(step, escapeText)}
        ${renderArray(step, state, escapeText, { showTags })}
        ${algorithmId === 'find-min' || algorithmId === 'selection-sort' ? renderCompare(step, escapeText, COMPARE_HINT) : ''}
        ${algorithmId === 'selection-sort' ? renderStats(step) : ''}
        ${legend(LEGENDS[algorithmId])}
        ${algorithmId === 'counting' ? renderChart(step) : ''}
      </div>${renderInspection(step, state, escapeText)}`;
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
      case 'inicio':
        app.state.config.inicio = Number(input.value);
        app.rebuildSteps();
        break;
      default:
        break;
    }
  },

  handleAction(action, button, app) {
    if (action === 'apply-data') {
      const parsed = parseVector(app.state.draft, LIMITS);
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
      const { randomCount } = app.state;
      app.setData(app.state.algorithmId === 'stability' ? stabilityExample(randomCount) : randomVector(randomCount));
      return;
    }

    if (action === 'stability-example') {
      app.setData(stabilityExample(app.state.randomCount));
      return;
    }

    if (action === 'inspect-item') {
      const index = Number(button.dataset.index);
      app.state.inspectedItem = index;
      if (app.state.algorithmId === 'find-min') {
        app.state.config.inicio = index;
        app.rebuildSteps(false);
        app.renderConfig();
      }
      app.renderSimulation();
    }
  },
};
