import { algorithms, buildSteps, stabilityExample } from './algorithms.js';
import { icons } from '../../core/icons.js';
import { renderStack } from '../shared/recursion-view.js';
import {
  legend, parseVector, randomVector, renderArray, renderChart, renderCompare, renderInspection, renderLockstep, renderPhase, renderStats, renderVectorEditor,
} from '../shared/sort-view.js';
import { renderHeapInspection, renderHeapTree } from './views.js';
import { tr } from '../../core/i18n.js';

// O vetor do exemplo da aula (slides 92 a 199, o debug passo a passo), o dos slides 19 a 84
// (a árvore desenhada) e o max-heap do slide 9.
const LESSON_VECTOR = [6, 5, 3, 1, 8, 7, 2, 4];
const PRESETS = {
  lesson: LESSON_VECTOR,
  visual: [9, 8, 6, 12, 4, 3, 7],
  maxheap: [100, 19, 36, 17, 3, 25, 1, 2, 7],
};
const DEFAULT_VECTOR = LESSON_VECTOR;
const MIN_ITEMS = 3;
const MAX_ITEMS = 15;
const LIMITS = { min: MIN_ITEMS, max: MAX_ITEMS, hint: tr(`Use no máximo ${MAX_ITEMS} números: é o que cabe em um heap de quatro níveis.`, `Use at most ${MAX_ITEMS} numbers: that is what fits in a four-level heap.`) };
const COMPARE_HINT = tr('As comparações ENQUANTO, SE e a regra do max-heap aparecem aqui.', 'The WHILE and IF comparisons and the max-heap rule appear here.');
const CHECK_HINT = tr('A comparação vetor[pai] &lt; vetor[filho] aparece aqui: "Sim" quebra a regra do max-heap.', 'The comparison array[parent] &lt; array[child] appears here: "Yes" breaks the max-heap rule.');

const LEGEND_RANGE = ['range', tr('início e fim · limites do trecho', 'start and end · range limits')];
const LEGEND_ROOT = ['pivot', tr('raiz · nó que está descendo', 'root · node going down')];
const LEGEND_CHILD = ['compared', tr('filho · comparado', 'child · compared')];
const LEGEND_SWAP = ['result', tr('trocar · maior valor até agora', 'largest · largest value so far')];
const LEGEND_SORTED = ['sorted', tr('já ordenado · fora do heap', 'already sorted · outside the heap')];

const LEGENDS = {
  heap: [['pivot', 'pai'], ['compared', tr('filho · conferido', 'child · checked')], ['warn', tr('par que quebra a regra', 'pair that breaks the rule')]],
  sift: [LEGEND_RANGE, LEGEND_ROOT, LEGEND_CHILD, LEGEND_SWAP, ['outside', tr('fora do heap', 'outside the heap')]],
  build: [LEGEND_RANGE, LEGEND_ROOT, LEGEND_CHILD, LEGEND_SWAP],
  'heap-sort': [LEGEND_RANGE, LEGEND_ROOT, LEGEND_CHILD, LEGEND_SWAP, LEGEND_SORTED],
  counting: [LEGEND_RANGE, LEGEND_ROOT, LEGEND_SORTED],
  adaptability: [['compared', tr('trecho que acabou de mudar', 'range that just changed')], ['result', tr('onde o valor parou', 'where the value stopped')], LEGEND_SORTED],
  stability: [LEGEND_SORTED, ['warn', tr('par de iguais que inverteu', 'pair of equals that reversed')], ['dup', tr('repetido (letra = ordem original)', 'repeated (letter = original order)')]],
};

const WITH_TREE = ['heap', 'sift', 'build', 'heap-sort'];
const WITH_COMPARE = ['heap', 'sift', 'build', 'heap-sort'];
const WITH_STACK = ['sift', 'build', 'heap-sort'];

const toInteger = (value, fallback) => {
  const number = value === null || value === undefined ? NaN : Number(value);
  return Number.isInteger(number) ? number : fallback;
};

/** O último nó que tem filho: a partir dele, para trás, é que o heap precisa de ajuste. */
const lastParent = (count) => Math.max(0, Math.floor((count - 2) / 2));

export const heapSortModule = {
  id: 'heap-sort',
  name: tr('Heap Sort', 'Heap Sort'),
  category: { name: tr('Algoritmos', 'Algorithms'), anchor: 'algoritmos' },
  version: '1.0',
  visualizationTitle: tr('Vetor e heap sendo ordenados', 'Array and heap being sorted'),
  defaultAlgorithmId: 'heap-sort',
  defaultData: DEFAULT_VECTOR,
  defaultRandomCount: 8,
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
    return { inicio: lastParent(values.length), fim: values.length - 1 };
  },

  // `null` quer dizer "o padrão": é o que vale depois de trocar os dados (do último pai ao fim do vetor).
  normalizeConfig(values, config) {
    const last = values.length - 1;
    const inicio = Math.max(0, Math.min(last, toInteger(config.inicio, lastParent(values.length))));
    const fim = Math.max(inicio, Math.min(last, toInteger(config.fim, last)));
    return { inicio, fim };
  },

  renderEditor(context) {
    const buttons = [
      ['lesson', tr('Debug da aula', 'Lesson debug'), PRESETS.lesson],
      ['visual', tr('Árvore passo a passo', 'Step-by-step tree'), PRESETS.visual],
      ['maxheap', tr('Max-heap do slide 9', 'Max-heap from slide 9'), PRESETS.maxheap],
    ].map(([key, text, values]) => `<button class="button secondary compact" type="button" data-module-action="preset" data-preset="${key}" title="${values.join(', ')}">${text}</button>`).join('');
    return `${renderVectorEditor(context, { ...LIMITS, placeholder: '6, 5, 3, 1, 8, 7, 2, 4' })}
      <div class="preset-row"><span>${tr('Exemplos da aula', 'Lesson examples')}</span>${buttons}</div>`;
  },

  renderConfig({ state }) {
    const heading = (title) => `<div class="panel-heading compact-heading"><div><span class="eyebrow">${tr('Parâmetros', 'Parameters')}</span><h2 id="config-title">${title}</h2></div></div>`;

    if (state.algorithmId === 'sift') {
      const last = state.data.length - 1;
      return `
        ${heading(tr('Escolha o trecho do heap', 'Choose the range of the heap'))}
        <div class="config-grid">
          <label class="config-field"><span>${tr('inicio (o nó que vai descer)', 'start (the node that will sink)')}</span><input id="inicio-input" type="number" min="0" max="${last}" value="${state.config.inicio}" data-module-input="inicio" /></label>
          <label class="config-field"><span>${tr('fim (a última posição do heap)', 'end (the last position of the heap)')}</span><input id="fim-input" type="number" min="${state.config.inicio}" max="${last}" value="${state.config.fim}" data-module-input="fim" /></label>
        </div>
        <p class="config-note">${tr('Intervalo válido: inicio de 0 a', 'Valid range: start from 0 to')} ${last} ${tr('e fim de inicio a', 'and end from start to')} ${last}${tr('. O ajuste só deixa um max-heap quando as subárvores do nó já são heaps, como ocorre com o último pai (', '. The adjustment only leaves a max-heap when the subtrees of the node are already heaps, as happens with the last parent (')}${lastParent(state.data.length)}${tr(') em um vetor qualquer. Você também pode clicar em uma posição do vetor para fazer dela o início.', ') in any array. You can also click an array position to make it the start.')}</p>`;
    }

    if (state.algorithmId === 'stability') {
      return `
        ${heading(tr('Exemplo com valores repetidos', 'Example with repeated values'))}
        <div class="config-note-row">
          <p>${tr('A estabilidade só aparece quando há valores iguais. O botão ao lado monta um vetor com valores repetidos em que o Heapsort realmente inverte a ordem de dois deles.', 'Stability only shows up when there are equal values. The button beside builds an array with repeated values where Heapsort really reverses the order of two of them.')}</p>
          <button class="button secondary" type="button" data-module-action="stability-example">${icons.shuffle}<span>${tr('Gerar exemplo', 'Generate example')}</span></button>
        </div>`;
    }

    return '';
  },

  renderVisualization({ state, step, escapeText }) {
    const { algorithmId } = state;
    if (algorithmId === 'adaptability') return renderLockstep(step, escapeText, LEGENDS.adaptability);

    const withTree = WITH_TREE.includes(algorithmId);
    return `
      <div class="sort-stage">
        ${renderPhase(step, escapeText)}
        ${renderArray(step, state, escapeText, { showTags: algorithmId === 'stability', stacked: true })}
        ${withTree ? renderHeapTree(step, state, escapeText) : ''}
        ${WITH_COMPARE.includes(algorithmId) ? renderCompare(step, escapeText, algorithmId === 'heap' ? CHECK_HINT : COMPARE_HINT) : ''}
        ${WITH_COMPARE.includes(algorithmId) ? renderStats(step) : ''}
        ${WITH_STACK.includes(algorithmId) ? renderStack(step, escapeText) : ''}
        ${legend(LEGENDS[algorithmId])}
        ${algorithmId === 'counting' ? renderChart(step) : ''}
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
      case 'inicio':
      case 'fim': {
        app.state.config[name] = Number(input.value);
        app.rebuildSteps();
        // O outro limite pode ter sido ajustado pela validação: mantém os dois campos coerentes.
        const { inicio, fim } = app.state.config;
        const start = document.querySelector('#inicio-input');
        const end = document.querySelector('#fim-input');
        if (name === 'inicio' && end) {
          end.min = inicio;
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
      app.setData(PRESETS[button.dataset.preset] ?? LESSON_VECTOR);
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
      if (app.state.algorithmId === 'sift') {
        app.state.config.inicio = index;
        app.rebuildSteps(false);
        app.renderConfig();
      }
      app.renderSimulation();
    }
  },
};
