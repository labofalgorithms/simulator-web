import { algorithms, buildSteps } from './algorithms.js';
import { icons } from '../../core/icons.js';
import { repeatedExample } from '../shared/sort-steps.js';
import {
  legend, parseVector, randomVector, renderArray, renderChart, renderCompare, renderInspection, renderLockstep, renderPhase, renderStats, renderVectorEditor,
} from '../shared/sort-view.js';
import { tr } from '../../core/i18n.js';

const DEFAULT_VECTOR = [7, 5, 3, 11, 9, 2];
const MIN_ITEMS = 2;
const MAX_ITEMS = 10;
const LIMITS = { min: MIN_ITEMS, max: MAX_ITEMS };
const COMPARE_HINT = tr('A comparação vetor[j - 1] &gt; vetor[j] aparece aqui durante a varredura.', 'The comparison array[j - 1] &gt; array[j] appears here during the sweep.');

const LEGEND_I = ['pointer-i', tr('i · passada', 'i · pass')];
const LEGEND_PAIR = ['current', tr('j−1 e j · par examinado', 'j−1 and j · examined pair')];
const LEGEND_SWAP = ['compared', tr('troca', 'swap')];
const LEGEND_SORTED = ['sorted', tr('posição final', 'final position')];

const LEGENDS = {
  sweep: [LEGEND_PAIR, LEGEND_SWAP, ['result', tr('maior do trecho', 'largest of the range')], ['outside', tr('fora do trecho', 'outside the range')]],
  'bubble-sort': [LEGEND_I, LEGEND_PAIR, LEGEND_SWAP, LEGEND_SORTED],
  optimized: [LEGEND_I, LEGEND_PAIR, LEGEND_SWAP, LEGEND_SORTED],
  counting: [LEGEND_I, LEGEND_SWAP, LEGEND_SORTED],
  adaptability: [LEGEND_SWAP, LEGEND_SORTED],
  stability: [LEGEND_I, LEGEND_PAIR, LEGEND_SORTED, ['dup', tr('repetido (letra = ordem original)', 'repeated (letter = original order)')]],
};

const WITH_COMPARE = ['sweep', 'bubble-sort', 'optimized', 'stability'];
const WITH_STATS = ['bubble-sort', 'optimized'];

export const bubbleSortModule = {
  id: 'bubble-sort',
  name: tr('Bubble Sort', 'Bubble Sort'),
  category: { name: tr('Algoritmos', 'Algorithms'), anchor: 'algoritmos' },
  version: '1.0',
  visualizationTitle: tr('Vetor sendo ordenado', 'Array being sorted'),
  defaultAlgorithmId: 'sweep',
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
    return { fim: values.length - 1 };
  },

  // `fim: null` quer dizer "até o fim do vetor": é o que vale depois de trocar os dados.
  normalizeConfig(values, config) {
    const fim = config.fim === null || config.fim === undefined ? NaN : Number(config.fim);
    return { fim: Number.isInteger(fim) ? Math.max(0, Math.min(values.length - 1, fim)) : values.length - 1 };
  },

  renderEditor(context) {
    return renderVectorEditor(context, { ...LIMITS, placeholder: '7, 5, 3, 11, 9, 2' });
  },

  renderConfig({ state }) {
    const heading = (title) => `<div class="panel-heading compact-heading"><div><span class="eyebrow">${tr('Parâmetros', 'Parameters')}</span><h2 id="config-title">${title}</h2></div></div>`;

    if (state.algorithmId === 'sweep') {
      return `
        ${heading(tr('Escolha até onde vai a varredura', 'Choose how far the sweep goes'))}
        <label class="config-field"><span>${tr('Última posição do trecho', 'Last position of the range')}</span><input id="end-input" type="number" min="0" max="${state.data.length - 1}" value="${state.config.fim}" data-module-input="fim" /><small>${tr('Intervalo válido: 0 a', 'Valid range: 0 to')} ${state.data.length - 1}${tr('. Você também pode clicar em uma posição do vetor.', '. You can also click an array position.')}</small></label>`;
    }

    if (state.algorithmId === 'stability') {
      return `
        ${heading(tr('Exemplo com valores repetidos', 'Example with repeated values'))}
        <div class="config-note-row">
          <p>${tr('A estabilidade só aparece quando há valores iguais. O botão ao lado monta um vetor com valores repetidos para você ver o que acontece quando eles se encontram.', 'Stability only shows up when there are equal values. The button beside builds an array with repeated values so you can see what happens when they meet.')}</p>
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
      case 'fim':
        app.state.config.fim = Number(input.value);
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
      app.state.config = { fim: null };
      app.setData(parsed.values);
      return;
    }

    if (action === 'random-data') {
      const { randomCount } = app.state;
      app.state.config = { fim: null };
      app.setData(app.state.algorithmId === 'stability' ? repeatedExample(randomCount) : randomVector(randomCount));
      return;
    }

    if (action === 'stability-example') {
      app.state.config = { fim: null };
      app.setData(repeatedExample(app.state.randomCount));
      return;
    }

    if (action === 'inspect-item') {
      const index = Number(button.dataset.index);
      app.state.inspectedItem = index;
      if (app.state.algorithmId === 'sweep') {
        app.state.config.fim = index;
        app.rebuildSteps(false);
        app.renderConfig();
      }
      app.renderSimulation();
    }
  },
};
