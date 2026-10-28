import { algorithms, buildSteps, randomValues, stableExample } from './algorithms.js';
import { icons } from '../../core/icons.js';
import { renderLanes, renderLinearArray } from '../shared/linear-sort-view.js';
import {
  legend, renderChart, renderCompare, renderInspection, renderPhase, renderVectorEditor,
} from '../shared/sort-view.js';
import { tr } from '../../core/i18n.js';

// O vetor do exemplo da aula (slides 10 a 99), o do slide 100 (valores repetidos no count) e o do código de exemplo.
const LESSON_VECTOR = [9, 8, 6, 10, 4, 3, 7];
const PRESETS = {
  lesson: LESSON_VECTOR,
  repeated: [4, 3, 4, 9, 3, 10, 4],
  java: [4, 2, 2, 8, 3, 3, 1],
};
const DEFAULT_VECTOR = LESSON_VECTOR;
const MIN_ITEMS = 3;
const MAX_ITEMS = 15;
const MAX_VALUE = 50;
const LIMITS = {
  min: MIN_ITEMS,
  max: MAX_ITEMS,
  help: tr(`Separe os valores por vírgula, espaço ou ponto e vírgula. De ${MIN_ITEMS} a ${MAX_ITEMS} números inteiros, de 0 a ${MAX_VALUE}: o vetor count tem uma posição para cada valor possível, até o maior.`, `Separate the values by comma, space or semicolon. From ${MIN_ITEMS} to ${MAX_ITEMS} whole numbers, from 0 to ${MAX_VALUE}: the count array has one position for each possible value, up to the largest.`),
};

const HINT = tr('As comparações SE e ENQUANTO aparecem aqui.', 'The IF and WHILE comparisons appear here.');
const LEGEND_BASE = [['current', tr('elemento em foco', 'element in focus')], ['result', tr('maior valor · onde está', 'largest value · where it is')], ['compared', tr('comparado', 'compared')], ['sorted', tr('já escrito em A', 'already written in A')]];
const LEGENDS = {
  counting: LEGEND_BASE,
  stable: [['current', tr('elemento em foco', 'element in focus')], ['dup', tr('repetido (letra = ordem original)', 'repeated (letter = original order)')], ['result', tr('posição na saída', 'position in the output')], ['sorted', tr('já copiado de volta', 'already copied back')]],
  complexity: [['sorted', tr('vetor do cenário', 'array of the scenario')]],
  adaptability: [['sorted', tr('vetor do cenário', 'array of the scenario')]],
};

function parseValues(text) {
  const tokens = text.split(/[;,\s]+/).map((token) => token.trim()).filter(Boolean);
  if (tokens.length < MIN_ITEMS) return { error: tr(`Digite pelo menos ${MIN_ITEMS} números para haver o que ordenar.`, `Enter at least ${MIN_ITEMS} numbers so there is something to sort.`) };
  if (tokens.length > MAX_ITEMS) return { error: tr(`Use no máximo ${MAX_ITEMS} números para manter a visualização legível.`, `Use at most ${MAX_ITEMS} numbers to keep the visualization readable.`) };
  const values = tokens.map(Number);
  if (values.some((value) => !Number.isInteger(value) || value < 0 || value > MAX_VALUE)) {
    return { error: tr(`O Counting Sort ordena inteiros não negativos. Use apenas números inteiros de 0 a ${MAX_VALUE}, separados por espaço, vírgula ou ponto e vírgula.`, `Counting Sort sorts non-negative integers. Use only whole numbers from 0 to ${MAX_VALUE}, separated by space, comma or semicolon.`) };
  }
  return { values };
}

export const countingSortModule = {
  id: 'counting-sort',
  name: tr('Counting Sort', 'Counting Sort'),
  category: { name: tr('Algoritmos', 'Algorithms'), anchor: 'algoritmos' },
  version: '1.0',
  visualizationTitle: tr('Vetor e contagens sendo ordenados', 'Array and counts being sorted'),
  defaultAlgorithmId: 'counting',
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
      ['repeated', tr('Repetidos (slide 100)', 'Repeated (slide 100)'), PRESETS.repeated],
      ['java', tr('Código de exemplo', 'Example code'), PRESETS.java],
    ].map(([key, text, values]) => `<button class="button secondary compact" type="button" data-module-action="preset" data-preset="${key}" title="${values.join(', ')}">${text}</button>`).join('');
    return `${renderVectorEditor(context, { ...LIMITS, placeholder: '9, 8, 6, 10, 4, 3, 7' })}
      <div class="preset-row"><span>${tr('Exemplos', 'Examples')}</span>${buttons}</div>`;
  },

  renderConfig({ state }) {
    if (state.algorithmId !== 'stable') return '';
    return `
      <div class="panel-heading compact-heading"><div><span class="eyebrow">${tr('Parâmetros', 'Parameters')}</span><h2 id="config-title">${tr('Exemplo com valores repetidos', 'Example with repeated values')}</h2></div></div>
      <div class="config-note-row">
        <p>${tr('A estabilidade só aparece quando há valores iguais. O botão ao lado monta um vetor com valores repetidos: as letras marcam a ordem original de cada um.', 'Stability only shows up when there are equal values. The button beside builds an array with repeated values: the letters mark the original order of each one.')}</p>
        <button class="button secondary" type="button" data-module-action="stability-example">${icons.shuffle}<span>${tr('Gerar exemplo', 'Generate example')}</span></button>
      </div>`;
  },

  renderVisualization({ state, step, escapeText }) {
    const id = state.algorithmId;
    return `
      <div class="sort-stage">
        ${renderPhase(step, escapeText)}
        ${renderLinearArray(step, state, escapeText)}
        ${id === 'counting' || id === 'stable' ? renderCompare(step, escapeText, HINT) : ''}
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
      app.setData(app.state.algorithmId === 'stable' ? stableExample(randomCount) : randomValues(randomCount));
      return;
    }

    if (action === 'stability-example') {
      app.setData(stableExample(app.state.randomCount));
      return;
    }

    if (action === 'inspect-item') {
      app.state.inspectedItem = Number(button.dataset.index);
      app.renderSimulation();
    }
  },
};
