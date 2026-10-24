import { algorithms, buildSteps, stabilityExample } from './algorithms.js';
import { icons } from '../../core/icons.js';
import {
  legend, parseVector, randomVector, renderArray, renderChart, renderCompare, renderInspection, renderLockstep, renderPhase, renderStats, renderVectorEditor,
} from '../shared/sort-view.js';
import { tr } from '../../core/i18n.js';

const DEFAULT_VECTOR = [93, 87, 65, 99, 42, 31, 74];
const MIN_ITEMS = 2;
const MAX_ITEMS = 10;
const LIMITS = { min: MIN_ITEMS, max: MAX_ITEMS };
const COMPARE_HINT = tr('A comparação vetor[j] &lt; vetor[minimo] aparece aqui durante a varredura.', 'The comparison array[j] &lt; array[min] appears here during the sweep.');

const LEGEND_I = ['pointer-i', tr('i · início do sub-vetor', 'i · start of the sub-array')];
const LEGEND_J = ['current', tr('j · posição examinada', 'j · position examined')];
const LEGEND_MIN = ['result', tr('min · menor encontrado', 'min · smallest found')];
const LEGEND_SWAP = ['compared', tr('troca', 'swap')];
const LEGEND_SORTED = ['sorted', tr('ordenado', 'sorted')];

const LEGENDS = {
  'find-min': [LEGEND_J, LEGEND_MIN, ['outside', tr('fora do sub-vetor', 'outside the sub-array')]],
  'selection-sort': [LEGEND_I, LEGEND_J, LEGEND_MIN, LEGEND_SWAP, LEGEND_SORTED],
  counting: [LEGEND_I, LEGEND_MIN, LEGEND_SWAP, LEGEND_SORTED],
  adaptability: [LEGEND_MIN, LEGEND_SWAP, LEGEND_SORTED],
  stability: [LEGEND_I, LEGEND_MIN, LEGEND_SORTED, ['dup', tr('repetido (letra = ordem original)', 'repeated (letter = original order)')], ['warn', tr('ordem invertida', 'reversed order')]],
};

export const selectionSortModule = {
  id: 'selection-sort',
  name: tr('Selection Sort', 'Selection Sort'),
  category: { name: tr('Algoritmos', 'Algorithms'), anchor: 'algoritmos' },
  version: '1.0',
  visualizationTitle: tr('Vetor sendo ordenado', 'Array being sorted'),
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
    const heading = (title) => `<div class="panel-heading compact-heading"><div><span class="eyebrow">${tr('Parâmetros', 'Parameters')}</span><h2 id="config-title">${title}</h2></div></div>`;

    if (state.algorithmId === 'find-min') {
      return `
        ${heading(tr('Escolha onde a varredura começa', 'Choose where the sweep starts'))}
        <label class="config-field"><span>${tr('Posição inicial do sub-vetor', 'Starting position of the sub-array')}</span><input id="start-input" type="number" min="0" max="${state.data.length - 1}" value="${state.config.inicio}" data-module-input="inicio" /><small>${tr('Intervalo válido: 0 a', 'Valid range: 0 to')} ${state.data.length - 1}${tr('. Você também pode clicar em uma posição do vetor.', '. You can also click a position of the array.')}</small></label>`;
    }

    if (state.algorithmId === 'stability') {
      return `
        ${heading(tr('Exemplo com valores repetidos', 'Example with repeated values'))}
        <div class="config-note-row">
          <p>${tr('A estabilidade só aparece quando há valores iguais. O botão ao lado monta um vetor em que a ordem deles realmente se inverte.', 'Stability only shows up when there are equal values. The button beside builds an array in which their order really is reversed.')}</p>
          <button class="button secondary" type="button" data-module-action="stability-example">${icons.shuffle}<span>${tr('Gerar exemplo', 'Generate example')}</span></button>
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
