import {
  algorithms, buildSteps, normalizeOptions, stabilityExample,
} from './algorithms.js';
import { icons } from '../../core/icons.js';
import { renderStack } from '../shared/recursion-view.js';
import {
  legend, parseVector, randomVector, renderArray, renderChart, renderCompare, renderInspection, renderPhase, renderStats, renderVectorEditor,
} from '../shared/sort-view.js';
import { tr } from '../../core/i18n.js';

const MIN_ITEMS = 4;
const MAX_ITEMS = 24;
const LIMITS = { min: MIN_ITEMS, max: MAX_ITEMS, hint: tr(`Use de ${MIN_ITEMS} a ${MAX_ITEMS} números: é o que cabe na tela com os trechos e as chamadas.`, `Use from ${MIN_ITEMS} to ${MAX_ITEMS} numbers: that is what fits on the screen with the ranges and the calls.`) };
const SORTED_VECTOR = Array.from({ length: 16 }, (_, index) => index + 1);
const DEFAULT_VECTOR = [34, 7, 23, 32, 5, 62, 32, 7, 45, 19, 88, 3, 51, 26, 14, 70];
const DEFAULT_CONFIG = { cutoff: 4, median: true, depthLimit: null };

const HINTS = {
  'quick-insertion': tr('As comparações (hi − lo + 1) &gt; CUTOFF e (pivotIndex − lo) &lt; (hi − pivotIndex) aparecem aqui.', 'The comparisons (hi − lo + 1) &gt; CUTOFF and (pivotIndex − lo) &lt; (hi − pivotIndex) appear here.'),
  'merge-insertion': tr('A comparação (hi − lo + 1) ≤ CUTOFF aparece aqui.', 'The comparison (hi − lo + 1) ≤ CUTOFF appears here.'),
  introsort: tr('As comparações do tamanho, de depthLimit = 0 e dos lados do pivô aparecem aqui.', 'The comparisons of the size, depthLimit = 0 and the sides of the pivot appear here.'),
};
const LEGEND_SORTED = ['sorted', tr('posição final', 'final position')];
const QUICK_LEGEND = [['range', tr('lo e hi · trecho atual', 'lo and hi · current range')], ['outside', tr('fora do trecho', 'outside the range')], ['pivot', tr('pivô (pi)', 'pivot (pi)')], ['compared', tr('trecho que acabou de mudar', 'range that just changed')], LEGEND_SORTED];
const LEGENDS = {
  'quick-insertion': QUICK_LEGEND,
  introsort: QUICK_LEGEND,
  'merge-insertion': [['range', tr('lo, mid e hi · trecho atual', 'lo, mid and hi · current range')], ['outside', tr('fora do trecho', 'outside the range')], ['compared', tr('trecho que acabou de mudar', 'range that just changed')], ['sorted', tr('trecho já ordenado', 'range already sorted')]],
  stability: [LEGEND_SORTED, ['warn', tr('par de iguais que inverteu', 'pair of equals that reversed')], ['dup', tr('repetido (letra = ordem original)', 'repeated (letter = original order)')]],
};
const WITH_CALLS = ['quick-insertion', 'merge-insertion', 'introsort'];

const toInteger = (value, fallback) => {
  const number = value === null || value === undefined || value === '' ? NaN : Number(value);
  return Number.isInteger(number) ? number : fallback;
};

export const mixedSortModule = {
  id: 'mixed-sort',
  name: tr('Ordenação Mista', 'Hybrid Sorting'),
  category: { name: tr('Algoritmos', 'Algorithms'), anchor: 'algoritmos' },
  version: '1.0',
  visualizationTitle: tr('Vetor sendo ordenado por um híbrido', 'Array being sorted by a hybrid'),
  defaultAlgorithmId: 'introsort',
  defaultData: DEFAULT_VECTOR,
  defaultRandomCount: 16,
  codeScroll: true,
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
    return { ...DEFAULT_CONFIG };
  },

  normalizeConfig(values, config) {
    const { cutoff, median, depthLimit } = normalizeOptions(values, config);
    return { cutoff, median, depthLimit };
  },

  renderEditor(context) {
    return `${renderVectorEditor(context, { ...LIMITS, placeholder: DEFAULT_VECTOR.join(', ') })}
      <div class="preset-row"><span>${tr('Exemplos', 'Examples')}</span>
        <button class="button secondary compact" type="button" data-module-action="preset" data-preset="sorted" title="${SORTED_VECTOR.join(', ')}">${tr('Já ordenado, sem mediana (pior caso do pivô final)', 'Already sorted, no median (worst case of the last-value pivot)')}</button>
        <button class="button secondary compact" type="button" data-module-action="preset" data-preset="mixed" title="${DEFAULT_VECTOR.join(', ')}">${tr('Vetor misturado', 'Shuffled array')}</button>
      </div>`;
  },

  renderConfig({ state }) {
    const { algorithmId, config } = state;
    if (algorithmId === 'adaptability' || algorithmId === 'stability' || WITH_CALLS.includes(algorithmId)) {
      const heading = `<div class="panel-heading compact-heading"><div><span class="eyebrow">${tr('Parâmetros', 'Parameters')}</span><h2 id="config-title">${tr('Ajuste o híbrido', 'Tune the hybrid')}</h2></div></div>`;
      const merge = algorithmId === 'merge-insertion';
      const median = merge ? '' : `<label class="config-field check"><span>${tr('Mediana-de-três', 'Median-of-three')}</span><input id="median-input" type="checkbox" ${config.median ? 'checked' : ''} data-module-input="median" /></label>`;
      const depth = algorithmId === 'introsort' ? `<label class="config-field"><span>depthLimit</span><input id="depth-input" type="number" min="0" max="40" placeholder="${tr('fórmula', 'formula')}" value="${config.depthLimit ?? ''}" data-module-input="depthLimit" /></label>` : '';
      return `
        ${heading}
        <div class="config-grid">
          <label class="config-field"><span>CUTOFF</span><input id="cutoff-input" type="number" min="1" max="12" value="${config.cutoff}" data-module-input="cutoff" /></label>
          ${median}${depth}
        </div>
        <p class="config-note">${tr(`CUTOFF é o tamanho máximo do trecho entregue ao Insertion Sort (de 1 a 12). Os slides sugerem de 8 a 24 e 16 como ponto de partida; aqui o padrão é 4 porque os vetores são pequenos.${merge ? '' : ' A mediana-de-três escolhe como pivô a mediana de A[lo], A[mid] e A[hi] (o pivô é o último valor se ela estiver desligada).'}${algorithmId === 'introsort' ? ' Deixe depthLimit vazio para usar 2 · ⌊log₂ n⌋, ou escolha um valor menor para forçar o resgate do Heap Sort.' : ''}`, `CUTOFF is the largest range size handed to Insertion Sort (from 1 to 12). The slides suggest 8 to 24 and 16 as a starting point; here the default is 4 because the arrays are small.${merge ? '' : ' The median-of-three chooses as the pivot the median of A[lo], A[mid] and A[hi] (the pivot is the last value if it is off).'}${algorithmId === 'introsort' ? ' Leave depthLimit empty to use 2 · ⌊log₂ n⌋, or choose a smaller value to force the Heap Sort rescue.' : ''}`)}</p>
        ${algorithmId === 'stability' ? `<div class="config-note-row"><p>${tr('A estabilidade só aparece quando há valores iguais. O botão ao lado monta um vetor com valores repetidos em que o Quick + Insertion e o Introsort invertem a ordem de dois deles e o Merge + Insertion não.', 'Stability only shows up when there are equal values. The button beside builds an array with repeated values where Quick + Insertion and Introsort reverse the order of two of them and Merge + Insertion does not.')}</p><button class="button secondary" type="button" data-module-action="stability-example">${icons.shuffle}<span>${tr('Gerar exemplo', 'Generate example')}</span></button></div>` : ''}`;
    }
    return '';
  },

  renderVisualization({ state, step, escapeText }) {
    const { algorithmId } = state;
    if (algorithmId === 'adaptability') return `<div class="sort-stage">${renderArray(step, state, escapeText)}${renderChart(step)}</div>`;

    const calls = WITH_CALLS.includes(algorithmId);
    return `
      <div class="sort-stage">
        ${calls ? renderPhase(step, escapeText) : ''}
        ${renderArray(step, state, escapeText, { showTags: algorithmId === 'stability', stacked: calls })}
        ${calls ? renderCompare(step, escapeText, HINTS[algorithmId]) : ''}
        ${calls ? renderStats(step) : ''}
        ${calls ? renderStack(step, escapeText) : ''}
        ${legend(LEGENDS[algorithmId] ?? [LEGEND_SORTED])}
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
      case 'cutoff':
        if (input.value === '') break;
        app.state.config.cutoff = toInteger(input.value, 4);
        app.rebuildSteps();
        break;
      case 'depthLimit':
        app.state.config.depthLimit = input.value === '' ? null : toInteger(input.value, null);
        app.rebuildSteps();
        break;
      case 'median':
        app.state.config.median = input.checked;
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

    if (action === 'preset') {
      if (button.dataset.preset === 'sorted') {
        app.state.config = { ...app.state.config, median: false };
        app.setData(SORTED_VECTOR);
      } else {
        app.state.config = { ...app.state.config, median: true };
        app.setData(DEFAULT_VECTOR);
      }
      app.renderConfig();
      return;
    }

    if (action === 'random-data') {
      const { randomCount, algorithmId, config } = app.state;
      app.setData(algorithmId === 'stability' ? stabilityExample(Math.max(8, randomCount), normalizeOptions([], config)) : randomVector(randomCount));
      return;
    }

    if (action === 'stability-example') {
      app.setData(stabilityExample(Math.max(8, app.state.randomCount), normalizeOptions([], app.state.config)));
      return;
    }

    if (action === 'inspect-item') {
      app.state.inspectedItem = Number(button.dataset.index);
      app.renderSimulation();
    }
  },
};
