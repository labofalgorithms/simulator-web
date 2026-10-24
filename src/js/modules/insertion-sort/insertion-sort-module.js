import { algorithms, buildSteps } from './algorithms.js';
import { icons } from '../../core/icons.js';
import { repeatedExample } from '../shared/sort-steps.js';
import {
  legend, parseVector, randomVector, renderArray, renderChart, renderCompare, renderInspection, renderLockstep, renderPhase, renderStats, renderVectorEditor,
} from '../shared/sort-view.js';
import { tr } from '../../core/i18n.js';

const DEFAULT_VECTOR = [9, 8, 6, 12, 4, 3];
const MIN_ITEMS = 2;
const MAX_ITEMS = 10;
const LIMITS = { min: MIN_ITEMS, max: MAX_ITEMS };
const COMPARE_HINT = tr('A comparação vetor[j - 1] &gt; vetor[j] aparece aqui durante a inserção.', 'The comparison array[j - 1] &gt; array[j] appears here during the insertion.');

const LEGEND_I = ['pointer-i', tr('i · elemento a inserir', 'i · element to insert')];
const LEGEND_PAIR = ['current', tr('j−1 e j · par examinado', 'j−1 and j · examined pair')];
const LEGEND_SWAP = ['compared', tr('troca', 'swap')];
const LEGEND_SORTED = ['sorted', tr('sub-vetor ordenado', 'sorted sub-array')];

const LEGENDS = {
  'insert-one': [LEGEND_I, LEGEND_PAIR, LEGEND_SWAP, LEGEND_SORTED, ['result', tr('posição final do elemento', 'final position of the element')]],
  'insertion-sort': [LEGEND_I, LEGEND_PAIR, LEGEND_SWAP, LEGEND_SORTED],
  counting: [LEGEND_I, LEGEND_SWAP, LEGEND_SORTED],
  adaptability: [['result', tr('onde o elemento parou', 'where the element stopped')], LEGEND_SORTED],
  stability: [LEGEND_I, LEGEND_PAIR, LEGEND_SORTED, ['dup', tr('repetido (letra = ordem original)', 'repeated (letter = original order)')]],
};

const WITH_COMPARE = ['insert-one', 'insertion-sort', 'stability'];
const WITH_STATS = ['insert-one', 'insertion-sort'];

export const insertionSortModule = {
  id: 'insertion-sort',
  name: tr('Insertion Sort', 'Insertion Sort'),
  category: { name: tr('Algoritmos', 'Algorithms'), anchor: 'algoritmos' },
  version: '1.0',
  visualizationTitle: tr('Vetor sendo ordenado', 'Array being sorted'),
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
    const heading = (title) => `<div class="panel-heading compact-heading"><div><span class="eyebrow">${tr('Parâmetros', 'Parameters')}</span><h2 id="config-title">${title}</h2></div></div>`;

    if (state.algorithmId === 'insert-one') {
      return `
        ${heading(tr('Escolha o elemento a inserir', 'Choose the element to insert'))}
        <label class="config-field"><span>${tr('Posição i do elemento', 'Position i of the element')}</span><input id="start-input" type="number" min="1" max="${state.data.length - 1}" value="${state.config.i}" data-module-input="i" /><small>${tr('Intervalo válido: 1 a', 'Valid range: 1 to')} ${state.data.length - 1}${tr('. As posições à esquerda de i aparecem ordenadas. Você também pode clicar em uma posição do vetor.', '. The positions to the left of i appear sorted. You can also click an array position.')}</small></label>`;
    }

    if (state.algorithmId === 'stability') {
      return `
        ${heading(tr('Exemplo com valores repetidos', 'Example with repeated values'))}
        <div class="config-note-row">
          <p>${tr('A estabilidade só aparece quando há valores iguais. O botão ao lado monta um vetor com valores repetidos para você ver onde cada um para.', 'Stability only shows up when there are equal values. The button beside builds an array with repeated values so you can see where each one stops.')}</p>
          <button class="button secondary" type="button" data-module-action="stability-example">${icons.shuffle}<span>${tr('Gerar exemplo', 'Generate example')}</span></button>
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
