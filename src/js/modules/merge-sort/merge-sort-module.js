import {
  algorithms, buildSteps, invertedExample, stableExample,
} from './algorithms.js';
import { icons } from '../../core/icons.js';
import {
  renderAux, renderLevels, renderStack, renderTotals,
} from '../shared/recursion-view.js';
import {
  legend, parseVector, randomVector, renderArray, renderCompare, renderInspection, renderLockstep, renderPhase, renderStats, renderVectorEditor,
} from '../shared/sort-view.js';
import { tr } from '../../core/i18n.js';

// O vetor do exemplo da aula (slides 6 a 36 e 42 a 109).
const LESSON_VECTOR = [97, 81, 56, 64, 43, 39, 72];
const DEFAULT_VECTOR = LESSON_VECTOR;
const MIN_ITEMS = 2;
const MAX_ITEMS = 10;
const LIMITS = { min: MIN_ITEMS, max: MAX_ITEMS };
const COMPARE_HINT = tr('A comparação inicio &lt; fim (no mergeSort) e B[i] ≤ B[j] (no intercala) aparece aqui.', 'The comparison start &lt; end (in mergeSort) and B[i] ≤ B[j] (in merge) appears here.');

const LEGEND_RANGE = ['range', tr('início e fim · trecho atual', 'start and end · current range')];
const LEGEND_OUTSIDE = ['outside', tr('fora do trecho', 'outside the range')];
const LEGEND_READ = ['compared', tr('valor lido para B', 'value read into B')];
const LEGEND_B = ['current', tr('B[i] e B[j] · comparados', 'B[i] and B[j] · compared')];
const LEGEND_SORTED = ['sorted', tr('já intercalado', 'already merged')];
const LEGEND_AUX = ['aux', tr('vetor auxiliar B', 'auxiliary array B')];

const LEGENDS = {
  divide: [['range', tr('trecho do nível atual', 'range of the current level')], ['sorted', tr('trecho de um elemento', 'one-element range')]],
  intercala: [LEGEND_RANGE, LEGEND_READ, LEGEND_B, LEGEND_SORTED, LEGEND_AUX],
  'merge-sort': [LEGEND_RANGE, LEGEND_OUTSIDE, LEGEND_READ, LEGEND_B, LEGEND_SORTED, LEGEND_AUX],
  counting: [['range', tr('nível atual', 'current level')]],
  adaptability: [['compared', tr('trecho intercalado', 'merged range')], LEGEND_SORTED],
  stability: [LEGEND_RANGE, LEGEND_READ, LEGEND_B, LEGEND_SORTED, ['dup', tr('repetido (letra = ordem original)', 'repeated (letter = original order)')]],
};

export const mergeSortModule = {
  id: 'merge-sort',
  name: tr('Merge Sort', 'Merge Sort'),
  category: { name: tr('Algoritmos', 'Algorithms'), anchor: 'algoritmos' },
  version: '1.0',
  visualizationTitle: tr('Vetor sendo ordenado', 'Array being sorted'),
  defaultAlgorithmId: 'merge-sort',
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

  createInitialConfig(values) {
    return { meio: Math.floor((values.length - 1) / 2) };
  },

  // `meio: null` quer dizer "no meio do vetor": é o que vale depois de trocar os dados.
  normalizeConfig(values, config) {
    const meio = config.meio === null || config.meio === undefined ? NaN : Number(config.meio);
    return { meio: Number.isInteger(meio) ? Math.max(0, Math.min(values.length - 2, meio)) : Math.floor((values.length - 1) / 2) };
  },

  renderEditor(context) {
    return `${renderVectorEditor(context, { ...LIMITS, placeholder: '97, 81, 56, 64, 43, 39, 72' })}
      <div class="preset-row"><span>${tr('Exemplo da aula', 'Lesson example')}</span><button class="button secondary compact" type="button" data-module-action="preset">97, 81, 56, 64, 43, 39, 72</button></div>`;
  },

  renderConfig({ state }) {
    const heading = (title) => `<div class="panel-heading compact-heading"><div><span class="eyebrow">${tr('Parâmetros', 'Parameters')}</span><h2 id="config-title">${title}</h2></div></div>`;

    if (state.algorithmId === 'intercala') {
      const last = state.data.length - 2;
      return `
        ${heading(tr('Escolha onde o vetor se divide', 'Choose where the array splits'))}
        <label class="config-field"><span>${tr('Posição meio (fim da 1ª metade)', 'Position mid (end of the 1st half)')}</span><input id="meio-input" type="number" min="0" max="${last}" value="${state.config.meio}" data-module-input="meio" /><small>${tr('Intervalo válido: 0 a', 'Valid range: 0 to')} ${last}${tr('. A 1ª metade vai de 0 a meio e a 2ª, de meio + 1 até o fim. Você também pode clicar em uma posição do vetor.', '. The 1st half goes from 0 to mid and the 2nd, from mid + 1 to the end. You can also click an array position.')}</small></label>`;
    }

    if (state.algorithmId === 'stability') {
      return `
        ${heading(tr('Exemplos com valores repetidos', 'Examples with repeated values'))}
        <div class="config-note-row">
          <p>${tr('A estabilidade só aparece quando há valores iguais. "Gerar exemplo" monta um vetor com repetidos em que a ordem é preservada; "Ver o caso que inverte" monta um em que a 2ª metade, copiada invertida, faz dois iguais trocarem de lugar.', 'Stability only shows up when there are equal values. "Generate example" builds an array with repeated values where the order is preserved; "See the case that reverses" builds one where the 2nd half, copied reversed, makes two equals swap places.')}</p>
          <div class="config-buttons">
            <button class="button secondary" type="button" data-module-action="stability-example">${icons.shuffle}<span>${tr('Gerar exemplo', 'Generate example')}</span></button>
            <button class="button secondary" type="button" data-module-action="stability-inverted">${icons.shuffle}<span>${tr('Ver o caso que inverte', 'See the case that reverses')}</span></button>
          </div>
        </div>`;
    }

    return '';
  },

  renderVisualization({ state, step, escapeText }) {
    const { algorithmId } = state;
    if (algorithmId === 'adaptability') return renderLockstep(step, escapeText, LEGENDS.adaptability);

    if (algorithmId === 'divide') {
      return `
        <div class="sort-stage">
          ${renderPhase(step, escapeText)}
          ${renderLevels(step, escapeText)}
          ${legend(LEGENDS.divide)}
        </div>`;
    }

    if (algorithmId === 'counting') {
      return `
        <div class="sort-stage">
          ${renderPhase(step, escapeText)}
          ${renderLevels(step, escapeText)}
          ${renderTotals(step)}
        </div>`;
    }

    const showTags = algorithmId === 'stability';
    return `
      <div class="sort-stage">
        ${renderPhase(step, escapeText)}
        ${renderArray(step, state, escapeText, { showTags, stacked: true })}
        ${renderCompare(step, escapeText, COMPARE_HINT)}
        ${renderAux(step, escapeText, { showTags })}
        ${renderStats(step)}
        ${renderStack(step, escapeText)}
        ${legend(LEGENDS[algorithmId])}
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
      case 'meio':
        app.state.config.meio = Number(input.value);
        app.rebuildSteps();
        break;
      default:
        break;
    }
  },

  handleAction(action, button, app) {
    const reset = () => { app.state.config = { meio: null }; };

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
      app.setData(app.state.algorithmId === 'stability' ? stableExample(randomCount) : randomVector(randomCount));
      return;
    }

    if (action === 'stability-example') {
      reset();
      app.setData(stableExample(app.state.randomCount));
      return;
    }

    if (action === 'stability-inverted') {
      reset();
      app.setData(invertedExample(Math.max(4, app.state.randomCount)));
      return;
    }

    if (action === 'inspect-item') {
      const index = Number(button.dataset.index);
      app.state.inspectedItem = index;
      if (app.state.algorithmId === 'intercala') {
        app.state.config.meio = index;
        app.rebuildSteps(false);
        app.renderConfig();
      }
      app.renderSimulation();
    }
  },
};
