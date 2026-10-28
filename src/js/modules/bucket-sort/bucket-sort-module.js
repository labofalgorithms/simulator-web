import { algorithms, buildSteps, stabilityExample } from './algorithms.js';
import { icons } from '../../core/icons.js';
import { INNER_SORTS } from '../shared/linear-sort.js';
import { renderLanes, renderLinearArray } from '../shared/linear-sort-view.js';
import {
  legend, randomVector, renderChart, renderCompare, renderInspection, renderPhase, renderVectorEditor,
} from '../shared/sort-view.js';
import { tr } from '../../core/i18n.js';

// O vetor do exemplo da aula (slides 9 a 145): dez valores de 2 a 200 em dez buckets.
const LESSON_VECTOR = [60, 32, 20, 2, 100, 120, 200, 40, 86, 95];
const PRESETS = {
  lesson: LESSON_VECTOR,
  spread: [0, 11, 22, 33, 44, 55, 66, 77, 88, 99],
  squeezed: [9, 8, 7, 6, 5, 4, 3, 2, 1, 999],
};
const DEFAULT_VECTOR = LESSON_VECTOR;
const MIN_ITEMS = 3;
const MAX_ITEMS = 15;
const MAX_VALUE = 999;
const BUCKETS = { min: 2, max: 12, fallback: 10 };
const LIMITS = {
  min: MIN_ITEMS,
  max: MAX_ITEMS,
  help: tr(`Separe os valores por vírgula, espaço ou ponto e vírgula. De ${MIN_ITEMS} a ${MAX_ITEMS} números inteiros, de 0 a ${MAX_VALUE}: a fórmula do bucket usa o maior valor e não aceita negativos.`, `Separate the values by comma, space or semicolon. From ${MIN_ITEMS} to ${MAX_ITEMS} whole numbers, from 0 to ${MAX_VALUE}: the bucket formula uses the largest value and does not accept negatives.`),
};

const HINT = tr('As comparações SE aparecem aqui (A[i] > max).', 'The IF comparisons appear here (A[i] > max).');
const LEGEND_BASE = [['current', tr('elemento em foco', 'element in focus')], ['result', tr('maior valor até agora', 'largest value so far')], ['compared', tr('comparado', 'compared')], ['sorted', tr('já copiado de volta', 'already copied back')]];
const LEGENDS = {
  bucket: LEGEND_BASE,
  complexity: [['sorted', tr('vetor ordenado', 'sorted array')]],
  adaptability: [['sorted', tr('vetor ordenado', 'sorted array')]],
  stability: [['dup', tr('repetido (letra = ordem original)', 'repeated (letter = original order)')], ['warn', tr('par de iguais que inverteu', 'pair of equals that reversed')], ['sorted', tr('vetor final', 'final array')]],
};

const toInteger = (value, fallback) => {
  const number = value === null || value === undefined ? NaN : Number(value);
  return Number.isInteger(number) ? number : fallback;
};

function parseValues(text) {
  const tokens = text.split(/[;,\s]+/).map((token) => token.trim()).filter(Boolean);
  if (tokens.length < MIN_ITEMS) return { error: tr(`Digite pelo menos ${MIN_ITEMS} números para haver o que ordenar.`, `Enter at least ${MIN_ITEMS} numbers so there is something to sort.`) };
  if (tokens.length > MAX_ITEMS) return { error: tr(`Use no máximo ${MAX_ITEMS} números para manter a visualização legível.`, `Use at most ${MAX_ITEMS} numbers to keep the visualization readable.`) };
  const values = tokens.map(Number);
  if (values.some((value) => !Number.isInteger(value) || value < 0 || value > MAX_VALUE)) {
    return { error: tr(`Use apenas números inteiros de 0 a ${MAX_VALUE}, separados por espaço, vírgula ou ponto e vírgula.`, `Use only whole numbers from 0 to ${MAX_VALUE}, separated by space, comma or semicolon.`) };
  }
  return { values };
}

export const bucketSortModule = {
  id: 'bucket-sort',
  name: tr('Bucket Sort', 'Bucket Sort'),
  category: { name: tr('Algoritmos', 'Algorithms'), anchor: 'algoritmos' },
  version: '1.0',
  visualizationTitle: tr('Vetor e buckets sendo ordenados', 'Array and buckets being sorted'),
  defaultAlgorithmId: 'bucket',
  defaultData: DEFAULT_VECTOR,
  defaultRandomCount: 10,
  codeScroll: true,
  algorithms,
  buildSteps,

  isValidData(value) {
    return Array.isArray(value) && value.length >= MIN_ITEMS && value.length <= MAX_ITEMS && value.every((item) => Number.isInteger(item) && item >= 0 && item <= MAX_VALUE);
  },

  sanitizeData(value) {
    return this.isValidData(value) ? [...value] : [...DEFAULT_VECTOR];
  },

  formatData(values) {
    return values.join(', ');
  },

  createInitialConfig() {
    return { numBuckets: BUCKETS.fallback, inner: 'insertion' };
  },

  normalizeConfig(values, config) {
    const numBuckets = Math.max(BUCKETS.min, Math.min(BUCKETS.max, toInteger(config.numBuckets, BUCKETS.fallback)));
    return { numBuckets, inner: config.inner in INNER_SORTS ? config.inner : 'insertion' };
  },

  renderEditor(context) {
    const buttons = [
      ['lesson', tr('Vetor da aula', 'Lesson array'), PRESETS.lesson],
      ['spread', tr('Bem espalhado', 'Well spread'), PRESETS.spread],
      ['squeezed', tr('Concentrado (pior caso)', 'Squeezed (worst case)'), PRESETS.squeezed],
    ].map(([key, text, values]) => `<button class="button secondary compact" type="button" data-module-action="preset" data-preset="${key}" title="${values.join(', ')}">${text}</button>`).join('');
    return `${renderVectorEditor(context, { ...LIMITS, placeholder: '60, 32, 20, 2, 100, 120, 200, 40, 86, 95' })}
      <div class="preset-row"><span>${tr('Exemplos', 'Examples')}</span>${buttons}</div>`;
  },

  renderConfig({ state }) {
    const { numBuckets, inner } = state.config;
    const stability = state.algorithmId === 'stability';
    const innerButtons = Object.entries(INNER_SORTS).map(([key, sort]) => `<button class="button ${key === inner ? 'primary' : 'secondary'} compact" type="button" data-module-action="inner" data-inner="${key}" aria-pressed="${key === inner}">${sort.name} (${sort.stable ? tr('estável', 'stable') : tr('instável', 'unstable')})</button>`).join('');
    return `
      <div class="panel-heading compact-heading"><div><span class="eyebrow">${tr('Parâmetros', 'Parameters')}</span><h2 id="config-title">${tr('Escolha os buckets', 'Choose the buckets')}</h2></div></div>
      <div class="config-grid">
        <label class="config-field"><span>numBuckets (${tr('quantos buckets', 'how many buckets')})</span><input id="num-buckets-input" type="number" min="${BUCKETS.min}" max="${BUCKETS.max}" value="${numBuckets}" data-module-input="numBuckets" /></label>
      </div>
      <p class="config-note">${tr(`De ${BUCKETS.min} a ${BUCKETS.max}. Cada valor vai para o bucket piso((valor × numBuckets) / (max + 1)): com mais buckets cada lista fica menor, com menos buckets as listas crescem.`, `From ${BUCKETS.min} to ${BUCKETS.max}. Each value goes to bucket floor((value × numBuckets) / (max + 1)): with more buckets each list gets smaller, with fewer buckets the lists grow.`)}</p>
      ${stability ? `
      <div class="config-note-row">
        <p>${tr('O algoritmo que ordena cada bucket decide se o Bucket Sort é estável. O botão ao lado monta um vetor com valores repetidos em que o Selection Sort realmente inverte dois iguais.', 'The algorithm that sorts each bucket decides whether Bucket Sort is stable. The button beside builds an array with repeated values where Selection Sort really reverses two equals.')}</p>
        <div class="config-buttons">${innerButtons}<button class="button secondary" type="button" data-module-action="stability-example">${icons.shuffle}<span>${tr('Gerar exemplo', 'Generate example')}</span></button></div>
      </div>` : ''}`;
  },

  renderVisualization({ state, step, escapeText }) {
    const id = state.algorithmId;
    return `
      <div class="sort-stage">
        ${renderPhase(step, escapeText)}
        ${renderLinearArray(step, state, escapeText)}
        ${id === 'bucket' ? renderCompare(step, escapeText, HINT) : ''}
        ${renderLanes(step, escapeText)}
        ${legend(LEGENDS[id])}
        ${step.chart ? renderChart(step) : ''}
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
      case 'numBuckets':
        app.state.config.numBuckets = Number(input.value);
        app.rebuildSteps();
        break;
      default:
        break;
    }
  },

  handleAction(action, button, app) {
    if (action === 'apply-data') {
      const parsed = parseValues(app.state.draft);
      if (!parsed.values) {
        app.state.inputError = parsed.error;
        app.renderEditor();
        document.querySelector('#vector-input')?.focus();
        return;
      }
      app.setData(parsed.values);
      return;
    }

    if (action === 'preset') {
      app.setData(PRESETS[button.dataset.preset] ?? LESSON_VECTOR);
      return;
    }

    if (action === 'random-data') {
      const { randomCount } = app.state;
      app.setData(app.state.algorithmId === 'stability' ? stabilityExample(Math.max(4, randomCount), app.state.config.numBuckets) : randomVector(randomCount));
      return;
    }

    if (action === 'stability-example') {
      app.setData(stabilityExample(Math.max(4, app.state.randomCount), app.state.config.numBuckets));
      return;
    }

    if (action === 'inner') {
      app.state.config.inner = button.dataset.inner;
      app.rebuildSteps();
      app.renderConfig();
      return;
    }

    if (action === 'inspect-item') {
      app.state.inspectedItem = Number(button.dataset.index);
      app.renderSimulation();
    }
  },
};
