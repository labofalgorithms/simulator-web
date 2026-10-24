import { algorithms, buildSteps } from './algorithms.js';
import { renderStack } from '../shared/recursion-view.js';
import {
  afterRenderTree, buildTree, heightOf, renderTree,
} from '../shared/tree-scene.js';
import { renderFactorial, renderQueue } from './views.js';
import { tr } from '../../core/i18n.js';

const MAX_NODES = 15;
const MAX_VALUE = 999;
const MAX_N = 8;
const DEFAULT_N = 3;

// A árvore dos slides de pré-ordem, na ordem dos níveis: inserir assim monta exatamente essa árvore.
const DEFAULT_DATA = { values: [39, 22, 55, 12, 25, 46, 63, 10, 15, 23, 28] };

// Todas as árvores dos slides são ABBs, então inserir os valores por níveis monta cada uma delas.
const PRESETS = {
  preorder: { label: tr('Slides: pré-ordem', 'Slides: pre-order'), values: [39, 22, 55, 12, 25, 46, 63, 10, 15, 23, 28] },
  inorder: { label: tr('Slides: em ordem', 'Slides: in-order'), values: [42, 29, 71, 3, 37, 64, 92] },
  postorder: { label: tr('Slides: pós-ordem', 'Slides: post-order'), values: [31, 19, 53, 12, 27, 42, 65] },
  bfs: { label: tr('Slides: largura', 'Slides: breadth-first'), values: [72, 41, 89, 9, 53, 78, 91] },
  exercise: { label: tr('Exercício 1', 'Exercise 1'), values: [53, 27, 76, 15, 40, 68, 87, 11, 22, 32, 45, 59, 70, 81] },
  ascending: { label: tr('Em ordem crescente', 'In ascending order'), values: [10, 20, 30, 40, 50, 60, 70] },
};

const FACTORIAL_EXAMPLES = [0, 1, 3, 5, MAX_N];

const LEGENDS = {
  dfs: [['current', tr('No · chamada atual', 'Node · current call')], ['left', tr('na pilha, esperando', 'on the stack, waiting')], ['compared', tr('argumento da chamada', 'call argument')], ['result', tr('visitado agora', 'visited now')], ['processed', tr('já visitado', 'already visited')]],
  bfs: [['current', tr('No · nó removido', 'Node · removed node')], ['right', tr('na fila', 'in the queue')], ['compared', tr('acabou de entrar', 'just entered')], ['result', tr('visitado agora', 'visited now')], ['processed', tr('já visitado', 'already visited')]],
  compare: [['current', tr('primeiro visitado', 'first visited')], ['result', tr('último visitado', 'last visited')]],
};

const isValue = (value) => Number.isInteger(value) && value >= 0 && value <= MAX_VALUE;
const isN = (value) => Number.isInteger(value) && value >= 0 && value <= MAX_N;
const countLabel = (values) => tr(`${values.length} nó${values.length === 1 ? '' : 's'}${values.length ? ` · altura ${heightOf(buildTree(values))}` : ''}`, `${values.length} node${values.length === 1 ? '' : 's'}${values.length ? ` · height ${heightOf(buildTree(values))}` : ''}`);
const randomBelow = (limit) => Math.floor(Math.random() * limit);

function parseValues(text) {
  const trimmed = String(text).trim();
  if (!trimmed) return { values: [] };
  const tokens = trimmed.split(/[;,\s]+/).map((token) => token.trim()).filter(Boolean);
  if (tokens.length > MAX_NODES) return { error: tr(`Use no máximo ${MAX_NODES} valores para manter a visualização legível.`, `Use at most ${MAX_NODES} values to keep the visualization readable.`) };
  const values = tokens.map(Number);
  if (!values.every(isValue)) return { error: tr(`Use apenas números inteiros de 0 a ${MAX_VALUE}, separados por espaço, vírgula ou ponto e vírgula.`, `Use only integers from 0 to ${MAX_VALUE}, separated by space, comma or semicolon.`) };
  return { values };
}

function shuffled(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const other = randomBelow(index + 1);
    [copy[index], copy[other]] = [copy[other], copy[index]];
  }
  return copy;
}

/** Valores distintos de 1 a 99, na ordem em que serão inseridos. */
function randomValues(count) {
  return shuffled(Array.from({ length: 99 }, (_, index) => index + 1)).slice(0, count);
}

export const treeTraversalModule = {
  id: 'tree-traversals',
  name: tr('Percursos em Árvores Binárias', 'Binary Tree Traversals'),
  version: '1.0',
  visualizationTitle: tr('Execução na memória', 'Execution in memory'),
  defaultAlgorithmId: 'preorder',
  defaultData: DEFAULT_DATA,
  defaultRandomCount: 9,
  algorithms,
  buildSteps,

  isValidData(value) {
    return !!value && typeof value === 'object'
      && Array.isArray(value.values) && value.values.length <= MAX_NODES
      && value.values.every(isValue);
  },

  sanitizeData(value) {
    if (this.isValidData(value)) return { values: [...value.values] };
    return { values: [...DEFAULT_DATA.values] };
  },

  formatData(data) {
    return data.values.join(', ');
  },

  createInitialConfig() {
    return { n: DEFAULT_N };
  },

  normalizeConfig(data, config) {
    return { n: isN(config.n) ? config.n : DEFAULT_N };
  },

  renderEditor({ state, icons, escapeText }) {
    if (state.algorithmId === 'factorial') {
      const examples = FACTORIAL_EXAMPLES.map((n) => `<button class="button secondary compact" type="button" data-module-action="factorial-n" data-n="${n}" ${state.config.n === n ? 'aria-pressed="true"' : ''}>n = ${n}</button>`).join('');
      return `
        <div class="panel-heading compact-heading">
          <div><span class="eyebrow">${tr('Dados de entrada', 'Input data')}</span><h2 id="data-editor-title">${tr('Escolha o número n', 'Choose the number n')}</h2></div>
        </div>
        <label class="config-field"><span>${tr('Valor de n', 'Value of n')}</span><input id="factorial-input" type="number" min="0" max="${MAX_N}" step="1" value="${state.config.n}" data-module-input="factorial-n" /><small>${tr('Inteiro de 0 a', 'Integer from 0 to')} ${MAX_N}${tr(': a pilha ganha um frame para cada valor, de n até 0. O exemplo da aula é n = 3.', ': the stack gets a frame for each value, from n down to 0. The lesson example is n = 3.')}</small></label>
        <div class="preset-row"><span>${tr('Exemplos', 'Examples')}</span>${examples}</div>`;
    }

    const { values } = state.data;
    const presets = Object.entries(PRESETS).map(([key, preset]) => `<button class="button secondary compact" type="button" data-module-action="preset" data-preset="${key}">${preset.label}</button>`).join('');
    return `
      <div class="panel-heading compact-heading">
        <div><span class="eyebrow">${tr('Dados de entrada', 'Input data')}</span><h2 id="data-editor-title">${tr('Monte a árvore', 'Build the tree')}</h2></div>
        <span id="tree-size" class="size-badge">${countLabel(values)}</span>
      </div>
      <label class="field-label" for="node-input">${tr('Valores, na ordem em que serão inseridos', 'Values, in the order they will be inserted')}</label>
      <div class="input-action-row">
        <input id="node-input" class="text-input ${state.inputError ? 'invalid' : ''}" value="${escapeText(state.draft)}" placeholder="39, 22, 55, 12, 25, 46, 63" aria-describedby="node-help node-error" data-module-input="draft" data-module-enter="apply" />
        <button class="button primary" type="button" data-module-action="apply-data">${icons.check}<span>${tr('Aplicar', 'Apply')}</span></button>
      </div>
      <p id="node-help" class="field-help">${tr('A árvore é montada inserindo cada valor, na ordem informada (iguais vão para a direita), como na aula de ABB. Inserir por níveis, como nos exemplos dos slides, monta a árvore dos slides. Inteiros de 0 a', 'The tree is built by inserting each value, in the order given (equal values go to the right), as in the BST lesson. Inserting level by level, as in the slide examples, builds the slides\' tree. Integers from 0 to')} ${MAX_VALUE}${tr('; no máximo', '; at most')} ${MAX_NODES} ${tr('nós. Deixe em branco para uma árvore vazia.', 'nodes. Leave blank for an empty tree.')}</p>
      <p id="node-error" class="error-message" role="alert">${escapeText(state.inputError)}</p>
      <div class="preset-row"><span>${tr('Exemplos da aula', 'Lesson examples')}</span>${presets}</div>
      <div class="random-row">
        <label for="random-count">${tr('Quantidade aleatória', 'Random quantity')}</label>
        <input id="random-count" type="range" min="0" max="${MAX_NODES}" value="${state.randomCount}" data-module-input="random-count" />
        <output id="random-count-output">${state.randomCount}</output>
        <button class="button secondary" type="button" data-module-action="random-data">${icons.shuffle}<span>${tr('Gerar árvore aleatória', 'Generate random tree')}</span></button>
      </div>`;
  },

  renderConfig() {
    return '';
  },

  renderVisualization({ state, step, icons, escapeText }) {
    const { algorithmId } = state;
    if (algorithmId === 'factorial') return renderFactorial(step, escapeText);
    const dfs = ['preorder', 'inorder', 'postorder'].includes(algorithmId);
    let extra = '';
    if (dfs) extra = renderStack(step, escapeText);
    else if (algorithmId === 'bfs') extra = renderQueue(step, escapeText);
    return renderTree({
      state, step, icons, escapeText, legend: LEGENDS[dfs ? 'dfs' : algorithmId], extra,
    });
  },

  afterRender: afterRenderTree,

  handleInput(name, input, app) {
    switch (name) {
      case 'draft':
        app.state.draft = input.value;
        break;
      case 'random-count':
        app.state.randomCount = Number(input.value);
        document.querySelector('#random-count-output').textContent = input.value;
        break;
      case 'factorial-n':
        if (input.value !== '' && isN(Number(input.value))) {
          app.state.config.n = Number(input.value);
          app.rebuildSteps();
        }
        break;
      default:
        break;
    }
  },

  handleAction(action, button, app) {
    const { state } = app;

    if (action === 'apply-data') {
      const parsed = parseValues(state.draft);
      if (!parsed.values) {
        state.inputError = parsed.error;
        app.renderEditor();
        document.querySelector('#node-input')?.focus();
        return;
      }
      app.setData({ values: parsed.values });
      return;
    }

    // Ao abrir a página (sem botão), vale a árvore dos slides, não uma sorteada.
    if (action === 'random-data') {
      app.setData(button ? { values: randomValues(state.randomCount) } : DEFAULT_DATA);
      return;
    }

    if (action === 'preset') {
      const preset = PRESETS[button.dataset.preset];
      if (preset) app.setData({ values: [...preset.values] });
      return;
    }

    if (action === 'factorial-n') {
      state.config.n = Number(button.dataset.n);
      app.renderEditor();
      app.rebuildSteps();
      return;
    }

    if (action === 'pick-node') {
      state.inspectedItem = Number(button.dataset.index);
      app.renderSimulation();
    }
  },
};
