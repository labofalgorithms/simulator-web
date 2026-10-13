import { algorithms, buildSteps } from './algorithms.js';
import { icons } from '../../core/icons.js';
import { repeatedExample } from '../shared/sort-steps.js';
import {
  legend, parseVector, randomVector, renderArray, renderChart, renderCompare, renderInspection, renderLockstep, renderPhase, renderStats, renderVectorEditor,
} from '../shared/sort-view.js';

const DEFAULT_VECTOR = [9, 8, 6, 12, 4, 3];
const MIN_ITEMS = 2;
const MAX_ITEMS = 10;
const LIMITS = { min: MIN_ITEMS, max: MAX_ITEMS };
const COMPARE_HINT = 'A comparação vetor[j - 1] &gt; vetor[j] aparece aqui durante a inserção.';

const LEGEND_I = ['pointer-i', 'i · elemento a inserir'];
const LEGEND_PAIR = ['current', 'j−1 e j · par examinado'];
const LEGEND_SWAP = ['compared', 'troca'];
const LEGEND_SORTED = ['sorted', 'sub-vetor ordenado'];

const LEGENDS = {
  'insert-one': [LEGEND_I, LEGEND_PAIR, LEGEND_SWAP, LEGEND_SORTED, ['result', 'posição final do elemento']],
  'insertion-sort': [LEGEND_I, LEGEND_PAIR, LEGEND_SWAP, LEGEND_SORTED],
  counting: [LEGEND_I, LEGEND_SWAP, LEGEND_SORTED],
  adaptability: [['result', 'onde o elemento parou'], LEGEND_SORTED],
  stability: [LEGEND_I, LEGEND_PAIR, LEGEND_SORTED, ['dup', 'repetido (letra = ordem original)']],
};

const WITH_COMPARE = ['insert-one', 'insertion-sort', 'stability'];
const WITH_STATS = ['insert-one', 'insertion-sort'];

export const insertionSortModule = {
  id: 'insertion-sort',
  name: 'Insertion Sort',
  category: { name: 'Algoritmos', anchor: 'algoritmos' },
  version: '1.0',
  visualizationTitle: 'Vetor sendo ordenado',
  defaultAlgorithmId: 'insert-one',
  defaultData: DEFAULT_VECTOR,
  defaultRandomCount: 6,
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

  createInitialConfig(values) {
    return { i: values.length - 1 };
  },

  // `i: null` quer dizer "o último elemento": é o que vale depois de trocar os dados.
  normalizeConfig(values, config) {
    const i = config.i === null || config.i === undefined ? NaN : Number(config.i);
    return { i: Number.isInteger(i) ? Math.max(1, Math.min(values.length - 1, i)) : values.length - 1 };
  },

  renderEditor(context) {
    return renderVectorEditor(context, { ...LIMITS, placeholder: '9, 8, 6, 12, 4, 3' });
  },

  renderConfig({ state }) {
    const heading = (title) => `<div class="panel-heading compact-heading"><div><span class="eyebrow">Parâmetros</span><h2 id="config-title">${title}</h2></div></div>`;

    if (state.algorithmId === 'insert-one') {
      return `
        ${heading('Escolha o elemento a inserir')}
        <label class="config-field"><span>Posição i do elemento</span><input id="start-input" type="number" min="1" max="${state.data.length - 1}" value="${state.config.i}" data-module-input="i" /><small>Intervalo válido: 1 a ${state.data.length - 1}. As posições à esquerda de i aparecem ordenadas. Você também pode clicar em uma posição do vetor.</small></label>`;
    }

    if (state.algorithmId === 'stability') {
      return `
        ${heading('Exemplo com valores repetidos')}
        <div class="config-note-row">
          <p>A estabilidade só aparece quando há valores iguais. O botão ao lado monta um vetor com valores repetidos para você ver onde cada um para.</p>
          <button class="button secondary" type="button" data-module-action="stability-example">${icons.shuffle}<span>Gerar exemplo</span></button>
        </div>`;
    }

    return '';
  },

  renderVisualization({ state, step, escapeText }) {
    const { algorithmId } = state;
    if (algorithmId === 'adaptability') return renderLockstep(step, escapeText, LEGENDS.adaptability);

    return `
      <div class="sort-stage">
        ${renderPhase(step, escapeText)}
        ${renderArray(step, state, escapeText, { showTags: algorithmId === 'stability' })}
        ${WITH_COMPARE.includes(algorithmId) ? renderCompare(step, escapeText, COMPARE_HINT) : ''}
        ${WITH_STATS.includes(algorithmId) ? renderStats(step) : ''}
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
      case 'i':
        app.state.config.i = Number(input.value);
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
      app.state.config = { i: null };
      app.setData(parsed.values);
      return;
    }

    if (action === 'random-data') {
      const { randomCount } = app.state;
      app.state.config = { i: null };
      app.setData(app.state.algorithmId === 'stability' ? repeatedExample(randomCount) : randomVector(randomCount));
      return;
    }

    if (action === 'stability-example') {
      app.state.config = { i: null };
      app.setData(repeatedExample(app.state.randomCount));
      return;
    }

    if (action === 'inspect-item') {
      const index = Number(button.dataset.index);
      app.state.inspectedItem = index;
      if (app.state.algorithmId === 'insert-one') {
        app.state.config.i = Math.max(1, index);
        app.rebuildSteps(false);
        app.renderConfig();
      }
      app.renderSimulation();
    }
  },
};
