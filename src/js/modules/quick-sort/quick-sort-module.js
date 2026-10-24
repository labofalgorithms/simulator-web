import { algorithms, buildSteps, stabilityExample } from './algorithms.js';
import { icons } from '../../core/icons.js';
import { renderStack } from '../shared/recursion-view.js';
import {
  legend, parseVector, randomVector, renderArray, renderChart, renderCompare, renderInspection, renderLockstep, renderPhase, renderStats, renderVectorEditor,
} from '../shared/sort-view.js';
import { tr } from '../../core/i18n.js';

// O vetor do exemplo da aula (slides 55 a 200, o debug passo a passo).
const LESSON_VECTOR = [12, 1, 100, 10, 97, 53, 46, 82];
const DEFAULT_VECTOR = LESSON_VECTOR;
const MIN_ITEMS = 2;
const MAX_ITEMS = 10;
const LIMITS = { min: MIN_ITEMS, max: MAX_ITEMS };
const COMPARE_HINT = tr('As comparações inicio &lt; fim, i ≤ j, vetor[i] &lt; pivô e vetor[j] &gt; pivô aparecem aqui.', 'The comparisons start &lt; end, i ≤ j, array[i] &lt; pivot and array[j] &gt; pivot appear here.');

const LEGEND_RANGE = ['range', tr('início e fim · trecho atual', 'start and end · current range')];
const LEGEND_OUTSIDE = ['outside', tr('fora do trecho', 'outside the range')];
const LEGEND_PIVOT = ['pivot', tr('pivô (vetor[inicio])', 'pivot (array[start])')];
const LEGEND_I = ['pointer-i', tr('i · procura valor ≥ pivô', 'i · looks for value ≥ pivot')];
const LEGEND_J = ['current', tr('j · procura valor ≤ pivô', 'j · looks for value ≤ pivot')];
const LEGEND_SWAP = ['compared', tr('valor lido ou trocado', 'value read or swapped')];
const LEGEND_SORTED = ['sorted', tr('posição final', 'final position')];

const LEGENDS = {
  partition: [LEGEND_RANGE, LEGEND_OUTSIDE, LEGEND_PIVOT, LEGEND_I, LEGEND_J, LEGEND_SWAP, LEGEND_SORTED],
  'quick-sort': [LEGEND_RANGE, LEGEND_OUTSIDE, LEGEND_PIVOT, LEGEND_I, LEGEND_J, LEGEND_SWAP, LEGEND_SORTED],
  counting: [LEGEND_RANGE, LEGEND_OUTSIDE, LEGEND_PIVOT, LEGEND_SORTED],
  adaptability: [['compared', tr('trecho particionado', 'partitioned range')], ['min', tr('pivô', 'pivot')], LEGEND_SORTED],
  stability: [LEGEND_RANGE, LEGEND_OUTSIDE, LEGEND_SORTED, ['warn', tr('par de iguais que inverteu', 'pair of equals that reversed')], ['dup', tr('repetido (letra = ordem original)', 'repeated (letter = original order)')]],
};

const WITH_COMPARE = ['partition', 'quick-sort'];
const WITH_STACK = ['partition', 'quick-sort'];

const toInteger = (value, fallback) => {
  const number = value === null || value === undefined ? NaN : Number(value);
  return Number.isInteger(number) ? number : fallback;
};

export const quickSortModule = {
  id: 'quick-sort',
  name: tr('Quick Sort', 'Quick Sort'),
  category: { name: tr('Algoritmos', 'Algorithms'), anchor: 'algoritmos' },
  version: '1.0',
  visualizationTitle: tr('Vetor sendo ordenado', 'Array being sorted'),
  defaultAlgorithmId: 'quick-sort',
  defaultData: DEFAULT_VECTOR,
  defaultRandomCount: 8,
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
    return { inicio: 0, fim: values.length - 1 };
  },

  // `null` quer dizer "o padrão": é o que vale depois de trocar os dados (o vetor inteiro).
  normalizeConfig(values, config) {
    const last = values.length - 1;
    const inicio = Math.max(0, Math.min(last - 1, toInteger(config.inicio, 0)));
    const fim = Math.max(inicio + 1, Math.min(last, toInteger(config.fim, last)));
    return { inicio, fim };
  },

  renderEditor(context) {
    return `${renderVectorEditor(context, { ...LIMITS, placeholder: '12, 1, 100, 10, 97, 53, 46, 82' })}
      <div class="preset-row"><span>${tr('Exemplo da aula', 'Lesson example')}</span><button class="button secondary compact" type="button" data-module-action="preset">12, 1, 100, 10, 97, 53, 46, 82</button></div>`;
  },

  renderConfig({ state }) {
    const heading = (title) => `<div class="panel-heading compact-heading"><div><span class="eyebrow">${tr('Parâmetros', 'Parameters')}</span><h2 id="config-title">${title}</h2></div></div>`;

    if (state.algorithmId === 'partition') {
      const last = state.data.length - 1;
      return `
        ${heading(tr('Escolha o trecho a particionar', 'Choose the range to partition'))}
        <div class="config-grid">
          <label class="config-field"><span>${tr('inicio (o pivô é vetor[inicio])', 'start (the pivot is array[start])')}</span><input id="inicio-input" type="number" min="0" max="${last - 1}" value="${state.config.inicio}" data-module-input="inicio" /></label>
          <label class="config-field"><span>${tr('fim', 'end')}</span><input id="fim-input" type="number" min="${state.config.inicio + 1}" max="${last}" value="${state.config.fim}" data-module-input="fim" /></label>
        </div>
        <p class="config-note">${tr('Intervalo válido: inicio de 0 a', 'Valid range: start from 0 to')} ${last - 1} ${tr('e fim de inicio + 1 a', 'and end from start + 1 to')} ${last}${tr('. Você também pode clicar em uma posição do vetor para fazer dela o pivô.', '. You can also click an array position to make it the pivot.')}</p>`;
    }

    if (state.algorithmId === 'stability') {
      return `
        ${heading(tr('Exemplo com valores repetidos', 'Example with repeated values'))}
        <div class="config-note-row">
          <p>${tr('A estabilidade só aparece quando há valores iguais. O botão ao lado monta um vetor com valores repetidos em que o Quicksort realmente inverte a ordem de dois deles.', 'Stability only shows up when there are equal values. The button beside builds an array with repeated values where Quicksort really reverses the order of two of them.')}</p>
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
        ${renderArray(step, state, escapeText, { showTags: algorithmId === 'stability', stacked: true })}
        ${WITH_COMPARE.includes(algorithmId) ? renderCompare(step, escapeText, COMPARE_HINT) : ''}
        ${WITH_COMPARE.includes(algorithmId) ? renderStats(step) : ''}
        ${WITH_STACK.includes(algorithmId) ? renderStack(step, escapeText) : ''}
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
      case 'fim': {
        app.state.config[name] = Number(input.value);
        app.rebuildSteps();
        // O outro limite pode ter sido ajustado pela validação: mantém os dois campos coerentes.
        const { inicio, fim } = app.state.config;
        const start = document.querySelector('#inicio-input');
        const end = document.querySelector('#fim-input');
        if (name === 'inicio' && end) {
          end.min = inicio + 1;
          end.value = fim;
        }
        if (name === 'fim' && start) start.value = inicio;
        break;
      }
      default:
        break;
    }
  },

  handleAction(action, button, app) {
    const reset = () => { app.state.config = { inicio: null, fim: null }; };

    if (action === 'apply-data') {
      const parsed = parseVector(app.state.draft, LIMITS);
      if (!parsed.values) {
        app.state.inputError = parsed.error;
        app.renderEditor();
        document.querySelector('#vector-input')?.focus();
        return;
      }
      reset();
      app.setData(parsed.values);
      return;
    }

    if (action === 'preset') {
      reset();
      app.setData(LESSON_VECTOR);
      return;
    }

    if (action === 'random-data') {
      const { randomCount } = app.state;
      reset();
      app.setData(app.state.algorithmId === 'stability' ? stabilityExample(Math.max(4, randomCount)) : randomVector(randomCount));
      return;
    }

    if (action === 'stability-example') {
      reset();
      app.setData(stabilityExample(Math.max(4, app.state.randomCount)));
      return;
    }

    if (action === 'inspect-item') {
      const index = Number(button.dataset.index);
      app.state.inspectedItem = index;
      if (app.state.algorithmId === 'partition') {
        app.state.config.inicio = index;
        app.rebuildSteps(false);
        app.renderConfig();
      }
      app.renderSimulation();
    }
  },
};
