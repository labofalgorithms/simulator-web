import {
  algorithms, buildSteps, defaultK,
} from './algorithms.js';
import { renderStack } from '../shared/recursion-view.js';
import {
  legend, parseVector, randomVector, renderArray, renderChart, renderCompare, renderInspection, renderPhase, renderStats, renderVectorEditor,
} from '../shared/sort-view.js';
import { renderHeapInspection, renderHeapTree } from '../heap-sort/views.js';
import { tr } from '../../core/i18n.js';

// Os vetores dos exemplos: Seleção parcial (slides 14 a 26), Inserção parcial (31 a 39),
// Heapsort parcial (45 a 71) e Quicksort parcial (77 a 103), cada um com o seu k.
const PRESETS = {
  selection: { values: [64, 25, 12, 22, 11], k: 3 },
  insertion: { values: [9, 8, 6, 12, 4, 16], k: 4 },
  heap: { values: [9, 8, 6, 12, 4, 3, 7], k: 3 },
  quick: { values: [57, 70, 97, 38, 63, 21, 85, 68, 76], k: 4 },
};
const DEFAULT_VECTOR = PRESETS.selection.values;
const MIN_ITEMS = 3;
const MAX_ITEMS = 12;
const LIMITS = { min: MIN_ITEMS, max: MAX_ITEMS };
const MIN_SIZE = 10;
const MAX_SIZE = 200;

const HINTS = {
  selection: tr('A comparação A[j] &lt; A[minIndex] aparece aqui.', 'The comparison A[j] &lt; A[minIndex] appears here.'),
  insertion: tr('As comparações do ENQUANTO (A[j] &gt; key ou x) e x &lt; A[k − 1] aparecem aqui.', 'The WHILE comparisons (A[j] &gt; key or x) and x &lt; A[k − 1] appear here.'),
  heap: tr('As comparações dos filhos com smallest e smallest ≠ i aparecem aqui.', 'The comparisons of the children with smallest and smallest ≠ i appear here.'),
  quick: tr('As comparações low &lt; high, A[j] ≤ pivot, pi ≥ k e pi + 1 &lt; k aparecem aqui.', 'The comparisons low &lt; high, A[j] ≤ pivot, pi ≥ k and pi + 1 &lt; k appear here.'),
};

const LEGEND_SORTED = ['sorted', tr('posição final', 'final position')];
const LEGENDS = {
  selection: [['pointer-i', tr('i · posição que vai receber o menor', 'i · position that will receive the smallest')], ['current', tr('j · valor lido', 'j · value being read')], ['result', tr('minIndex · menor até agora', 'minIndex · smallest so far')], ['compared', tr('valor comparado ou trocado', 'value compared or swapped')], LEGEND_SORTED],
  insertion: [['pointer-i', tr('i · valor que será inserido', 'i · value to be inserted')], ['current', tr('j · valor comparado', 'j · value compared')], ['compared', tr('valor lido ou deslocado', 'value read or shifted')], ['sorted', tr('bloco ordenado', 'sorted block')]],
  heap: [['pivot', tr('i · raiz do ajuste', 'i · root of the fix')], ['compared', tr('left e right · filhos comparados', 'left and right · children compared')], ['result', tr('smallest · menor até agora', 'smallest · smallest so far')], ['sorted', tr('já extraído · fora do heap', 'already extracted · outside the heap')]],
  quick: [['range', tr('low e high · trecho atual', 'low and high · current range')], ['outside', tr('fora do trecho', 'outside the range')], ['pivot', tr('pivô', 'pivot')], ['pointer-i', tr('i · fim dos menores ou iguais', 'i · end of the smaller or equal')], ['current', tr('j · valor lido', 'j · value being read')], ['compared', tr('valor lido ou trocado', 'value read or swapped')], LEGEND_SORTED],
};
const WITH_COMPARE = ['selection', 'insertion', 'heap', 'quick'];
const WITH_STACK = ['heap', 'quick'];

const toInteger = (value, fallback) => {
  const number = value === null || value === undefined || value === '' ? NaN : Number(value);
  return Number.isInteger(number) ? number : fallback;
};

export const partialSortModule = {
  id: 'partial-sort',
  name: tr('Ordenação Parcial', 'Partial Sorting'),
  category: { name: tr('Algoritmos', 'Algorithms'), anchor: 'algoritmos' },
  version: '1.0',
  visualizationTitle: tr('Vetor sendo ordenado só até o k', 'Array being sorted only up to k'),
  defaultAlgorithmId: 'selection',
  defaultData: DEFAULT_VECTOR,
  defaultRandomCount: 10,
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

  createInitialConfig(values) {
    return { k: PRESETS.selection.k <= values.length ? PRESETS.selection.k : defaultK(values.length), size: 100 };
  },

  // `k: null` quer dizer "o padrão" (metade dos valores): é o que vale depois de trocar os dados.
  normalizeConfig(values, config) {
    return {
      k: Math.max(1, Math.min(values.length, toInteger(config.k, defaultK(values.length)))),
      size: Math.max(MIN_SIZE, Math.min(MAX_SIZE, toInteger(config.size, 100))),
    };
  },

  renderEditor(context) {
    const labels = {
      selection: tr('Seleção parcial', 'Partial selection'),
      insertion: tr('Inserção parcial', 'Partial insertion'),
      heap: tr('Heap parcial', 'Partial heap'),
      quick: tr('Quick parcial', 'Partial quick'),
    };
    const buttons = Object.entries(PRESETS).map(([key, preset], index) => `<button class="button secondary compact" type="button" data-module-action="preset" data-preset="${key}" title="${labels[key]} · ${preset.values.join(', ')} · k = ${preset.k}" aria-label="${tr('Exemplo', 'Example')} ${index + 1}: ${labels[key]}">${index + 1}</button>`).join('');
    return `${renderVectorEditor(context, { ...LIMITS, placeholder: '64, 25, 12, 22, 11' })}
      <div class="preset-row"><span>${tr('Exemplos', 'Examples')}</span>${buttons}</div>`;
  },

  renderConfig({ state }) {
    const heading = (title) => `<div class="panel-heading compact-heading"><div><span class="eyebrow">${tr('Parâmetros', 'Parameters')}</span><h2 id="config-title">${title}</h2></div></div>`;
    const count = state.data.length;

    if (state.algorithmId === 'compare') {
      return `
        ${heading(tr('Tamanho do vetor da comparação', 'Size of the comparison array'))}
        <div class="config-grid">
          <label class="config-field"><span>n</span><input id="size-input" type="number" min="${MIN_SIZE}" max="${MAX_SIZE}" value="${state.config.size}" data-module-input="size" /></label>
        </div>
        <p class="config-note">${tr(`De ${MIN_SIZE} a ${MAX_SIZE} valores. Os vetores são sorteados a partir dos seus números (os mesmos números dão os mesmos vetores) e o custo é a média de vários deles; os slides usam n = 100 e k = 15.`, `From ${MIN_SIZE} to ${MAX_SIZE} values. The arrays are drawn from your numbers (the same numbers give the same arrays) and the cost is the average of several of them; the slides use n = 100 and k = 15.`)}</p>`;
    }

    return `
      ${heading(tr('Quantos menores obter (k)', 'How many smallest to get (k)'))}
      <div class="config-grid">
        <label class="config-field"><span>k</span><input id="k-input" type="number" min="1" max="${count}" value="${state.config.k}" data-module-input="k" /></label>
      </div>
      <p class="config-note">${tr(`De 1 a ${count}. A barra no vetor marca o limite dos k primeiros: com k = 1 o problema é achar o mínimo e com k = ${count} é a ordenação completa. Os slides pedem os 5 menores de 10 números no exercício.`, `From 1 to ${count}. The bar in the array marks the limit of the first k: with k = 1 the problem is finding the minimum and with k = ${count} it is the full sort. The exercise in the slides asks for the 5 smallest of 10 numbers.`)}</p>`;
  },

  renderVisualization({ state, step, escapeText }) {
    const { algorithmId } = state;
    if (algorithmId === 'compare') return `<div class="sort-stage">${renderChart(step)}</div>`;

    const withTree = algorithmId === 'heap';
    return `
      <div class="sort-stage">
        ${renderPhase(step, escapeText)}
        ${renderArray(step, state, escapeText, { stacked: true })}
        ${withTree ? renderHeapTree(step, state, escapeText) : ''}
        ${WITH_COMPARE.includes(algorithmId) ? renderCompare(step, escapeText, HINTS[algorithmId]) : ''}
        ${WITH_COMPARE.includes(algorithmId) ? renderStats(step) : ''}
        ${WITH_STACK.includes(algorithmId) ? renderStack(step, escapeText) : ''}
        ${legend(LEGENDS[algorithmId])}
      </div>${withTree ? renderHeapInspection(step, state, escapeText) : renderInspection(step, state, escapeText)}`;
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
      case 'k':
      case 'size':
        if (input.value === '') break;
        app.state.config[name] = Number(input.value);
        app.rebuildSteps();
        break;
      default:
        break;
    }
  },

  handleAction(action, button, app) {
    const reset = () => { app.state.config = { ...app.state.config, k: null }; };

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
      const preset = PRESETS[button.dataset.preset] ?? PRESETS.selection;
      app.state.config = { ...app.state.config, k: preset.k };
      app.setData(preset.values);
      return;
    }

    if (action === 'random-data') {
      reset();
      app.setData(randomVector(app.state.randomCount));
      return;
    }

    if (action === 'inspect-item') {
      app.state.inspectedItem = Number(button.dataset.index);
      app.renderSimulation();
    }
  },
};
