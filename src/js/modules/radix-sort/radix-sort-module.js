import { algorithms, buildSteps, stabilityExample } from './algorithms.js';
import { icons } from '../../core/icons.js';
import { renderLanes, renderLinearArray, renderOrders } from '../shared/linear-sort-view.js';
import {
  legend, renderChart, renderCompare, renderInspection, renderPhase, renderVectorEditor,
} from '../shared/sort-view.js';
import { tr } from '../../core/i18n.js';

// O vetor do exemplo da aula (slides 9 a 122), o do código de exemplo e os números de 1 a 10 do slide 8 (LSD × MSD).
const LESSON_VECTOR = [279, 230, 20, 692, 378, 895, 534];
const PRESETS = {
  lesson: LESSON_VECTOR,
  java: [170, 45, 75, 90, 802, 24, 2, 66],
  oneToTen: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
};
const DEFAULT_VECTOR = LESSON_VECTOR;
const MIN_ITEMS = 3;
const MAX_ITEMS = 15;
const MAX_VALUE = 9999;
const LIMITS = {
  min: MIN_ITEMS,
  max: MAX_ITEMS,
  help: tr(`Separe os valores por vírgula, espaço ou ponto e vírgula. De ${MIN_ITEMS} a ${MAX_ITEMS} números inteiros, de 0 a ${MAX_VALUE}: quatro dígitos são quatro passadas.`, `Separate the values by comma, space or semicolon. From ${MIN_ITEMS} to ${MAX_ITEMS} whole numbers, from 0 to ${MAX_VALUE}: four digits are four passes.`),
};

const HINT = tr('As comparações SE e ENQUANTO aparecem aqui.', 'The IF and WHILE comparisons appear here.');
const LEGEND_BASE = [['current', tr('elemento em foco', 'element in focus')], ['result', tr('maior número · onde está', 'largest number · where it is')], ['compared', tr('comparado', 'compared')], ['sorted', tr('já copiado de volta', 'already copied back')]];
const LEGENDS = {
  radix: LEGEND_BASE,
  'radix-count': [...LEGEND_BASE.slice(0, 2), ['sorted', tr('já copiado de volta', 'already copied back')]],
  complexity: [['sorted', tr('vetor do cenário', 'array of the scenario')]],
  adaptability: [['sorted', tr('vetor do cenário', 'array of the scenario')]],
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

/** Números de até três dígitos, para as passadas ficarem diferentes umas das outras. */
const randomNumbers = (count) => Array.from({ length: count }, () => Math.floor(Math.random() * 1000));

export const radixSortModule = {
  id: 'radix-sort',
  name: tr('Radix Sort', 'Radix Sort'),
  category: { name: tr('Algoritmos', 'Algorithms'), anchor: 'algoritmos' },
  version: '1.0',
  visualizationTitle: tr('Vetor e dígitos sendo ordenados', 'Array and digits being sorted'),
  defaultAlgorithmId: 'radix',
  defaultData: DEFAULT_VECTOR,
  defaultRandomCount: 8,
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
    return {};
  },

  normalizeConfig(values, config) {
    return { ...config };
  },

  renderEditor(context) {
    const buttons = [
      ['lesson', tr('Vetor da aula', 'Lesson array'), PRESETS.lesson],
      ['java', tr('Código de exemplo', 'Example code'), PRESETS.java],
      ['oneToTen', tr('1 a 10 (slide 8)', '1 to 10 (slide 8)'), PRESETS.oneToTen],
    ].map(([key, text, values]) => `<button class="button secondary compact" type="button" data-module-action="preset" data-preset="${key}" title="${values.join(', ')}">${text}</button>`).join('');
    return `${renderVectorEditor(context, { ...LIMITS, placeholder: '279, 230, 20, 692, 378, 895, 534' })}
      <div class="preset-row"><span>${tr('Exemplos', 'Examples')}</span>${buttons}</div>`;
  },

  renderConfig({ state }) {
    if (state.algorithmId !== 'stability') return '';
    return `
      <div class="panel-heading compact-heading"><div><span class="eyebrow">${tr('Parâmetros', 'Parameters')}</span><h2 id="config-title">${tr('Exemplo com números repetidos', 'Example with repeated numbers')}</h2></div></div>
      <div class="config-note-row">
        <p>${tr('A estabilidade aparece quando há números com dígitos em comum. O botão ao lado monta um vetor com números repetidos em que a passada com pilha realmente estraga o resultado.', 'Stability shows up when there are numbers with digits in common. The button beside builds an array with repeated numbers where the pass with a stack really ruins the result.')}</p>
        <button class="button secondary" type="button" data-module-action="stability-example">${icons.shuffle}<span>${tr('Gerar exemplo', 'Generate example')}</span></button>
      </div>`;
  },

  renderVisualization({ state, step, escapeText }) {
    const id = state.algorithmId;
    if (step.orders) {
      return `<div class="sort-stage">${renderOrders(step, escapeText)}</div>`;
    }
    return `
      <div class="sort-stage">
        ${renderPhase(step, escapeText)}
        ${renderLinearArray(step, state, escapeText)}
        ${id === 'radix' || id === 'radix-count' ? renderCompare(step, escapeText, HINT) : ''}
        ${renderLanes(step, escapeText)}
        ${legend(LEGENDS[id])}
        ${step.chart ? renderChart(step) : ''}
      </div>${renderInspection(step, state, escapeText)}`;
  },

  handleInput(name, input, app) {
    if (name === 'draft') {
      app.state.draft = input.value;
    } else if (name === 'random-count') {
      app.state.randomCount = Number(input.value);
      document.querySelector('#random-count-output').textContent = input.value;
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
      app.setData(app.state.algorithmId === 'stability' ? stabilityExample(Math.max(4, randomCount)) : randomNumbers(randomCount));
      return;
    }

    if (action === 'stability-example') {
      app.setData(stabilityExample(Math.max(4, app.state.randomCount)));
      return;
    }

    if (action === 'inspect-item') {
      app.state.inspectedItem = Number(button.dataset.index);
      app.renderSimulation();
    }
  },
};
