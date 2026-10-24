import { algorithms, buildSteps, deepestNode } from './algorithms.js';
import {
  afterRenderTree, buildTree, heightOf, inorder, renderTree,
} from '../shared/tree-scene.js';
import { tr } from '../../core/i18n.js';

const MAX_NODES = 12;
const MAX_VALUE = 999;
const DEFAULT_DATA = { values: [40, 20, 60, 10, 30, 50, 70] };

// Exemplos da aula: a árvore dos slides, a mesma com o 45 (o caso de um filho), o exercício 1 e
// valores em ordem (a árvore vira uma cadeia).
const PRESETS = {
  lesson: { label: tr('Árvore da aula', 'Lesson tree'), values: [40, 20, 60, 10, 30, 50, 70] },
  lessonPlus: { label: tr('Aula + 45', 'Lesson + 45'), values: [40, 20, 60, 10, 30, 50, 70, 45] },
  exercise: { label: tr('Exercício 1', 'Exercise 1'), values: [45, 25, 65, 15, 35, 55, 75] },
  ascending: { label: tr('Em ordem crescente', 'In ascending order'), values: [10, 20, 30, 40, 50, 60, 70] },
};

const LEGENDS = {
  node: [['detached', tr('nó isolado', 'isolated node')], ['compared', tr('alterado', 'changed')], ['result', tr('resultado', 'result')]],
  anatomy: [['compared', tr('raiz / pai', 'root / parent')], ['result', tr('folhas / filhos', 'leaves / children')], ['current', tr('nó escolhido', 'chosen node')], ['processed', tr('caminho', 'path')]],
  rule: [['current', tr('nó conferido', 'checked node')], ['left', tr('menores (esquerda)', 'smaller (left)')], ['right', tr('maiores ou iguais (direita)', 'greater or equal (right)')], ['error', tr('violação', 'violation')]],
  insert: [['current', tr('atual', 'current')], ['processed', tr('visitado', 'visited')], ['compared', tr('alterado', 'changed')], ['result', tr('novo nó', 'new node')], ['detached', tr('isolado', 'isolated')]],
  build: [['current', tr('atual', 'current')], ['processed', tr('visitado', 'visited')], ['compared', tr('alterado', 'changed')], ['result', tr('novo nó', 'new node')], ['detached', tr('isolado', 'isolated')]],
  search: [['current', tr('atual', 'current')], ['processed', tr('visitado', 'visited')], ['result', tr('encontrado', 'found')]],
  remove: [['current', tr('atual', 'current')], ['processed', tr('visitado', 'visited')], ['compared', tr('alterado', 'changed')], ['result', tr('sucessor / filho', 'successor / child')], ['lost', tr('fora da árvore', 'outside the tree')]],
};

const isValue = (value) => Number.isInteger(value) && value >= 0 && value <= MAX_VALUE;
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

/** Valores de exemplo para cada operação: um novo para INSERIR e existentes para BUSCAR e REMOVER. */
function defaultConfig(data) {
  const { values } = data;
  const taken = new Set(values);
  const free = Array.from({ length: 99 }, (_, index) => index + 1).filter((value) => !taken.has(value));
  const existing = (fallback) => (values.length ? values[randomBelow(values.length)] : fallback);
  return {
    insertValue: free.length ? free[randomBelow(free.length)] : 100,
    searchValue: existing(40),
    removeValue: existing(40),
    focus: deepestNode(values),
    rule: 'valid',
  };
}

/**
 * Valor de um nó com 0, 1 ou 2 filhos, para os botões "uma folha", "um filho" e "dois filhos":
 * a raiz, se servir (é o caso dos slides), senão o primeiro em ordem.
 */
function nodeWithChildren(values, wanted) {
  const tree = buildTree(values);
  const children = (id) => (typeof tree.nodes[id].left === 'number') + (typeof tree.nodes[id].right === 'number');
  const found = [tree.root, ...inorder(tree)].find((id) => id !== null && children(id) === wanted);
  return found === undefined ? null : tree.nodes[found].value;
}

export const binarySearchTreeModule = {
  id: 'binary-search-trees',
  name: tr('Árvore Binária de Busca', 'Binary Search Tree'),
  version: '1.0',
  visualizationTitle: tr('Árvore binária de busca na memória', 'Binary search tree in memory'),
  defaultAlgorithmId: 'node',
  defaultData: DEFAULT_DATA,
  defaultRandomCount: 7,
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

  createInitialConfig(data) {
    return defaultConfig(data);
  },

  normalizeConfig(data, config) {
    const fallback = defaultConfig(data);
    const toValue = (value, backup) => (value !== '' && isValue(Number(value)) ? Number(value) : backup);
    const focus = Number.isInteger(config.focus) && config.focus >= 0 && config.focus < data.values.length ? config.focus : fallback.focus;
    return {
      insertValue: toValue(config.insertValue, fallback.insertValue),
      searchValue: toValue(config.searchValue, fallback.searchValue),
      removeValue: toValue(config.removeValue, fallback.removeValue),
      focus,
      rule: config.rule === 'error' ? 'error' : 'valid',
    };
  },

  renderEditor({ state, icons, escapeText }) {
    const { values } = state.data;
    const presets = Object.entries(PRESETS).map(([key, preset]) => `<button class="button secondary compact" type="button" data-module-action="preset" data-preset="${key}">${preset.label}</button>`).join('');
    return `
      <div class="panel-heading compact-heading">
        <div><span class="eyebrow">${tr('Dados de entrada', 'Input data')}</span><h2 id="data-editor-title">${tr('Monte a árvore', 'Build the tree')}</h2></div>
        <span id="tree-size" class="size-badge">${countLabel(values)}</span>
      </div>
      <label class="field-label" for="node-input">${tr('Valores, na ordem em que serão inseridos', 'Values, in the order they will be inserted')}</label>
      <div class="input-action-row">
        <input id="node-input" class="text-input ${state.inputError ? 'invalid' : ''}" value="${escapeText(state.draft)}" placeholder="40, 20, 60, 10, 30, 50, 70" aria-describedby="node-help node-error" data-module-input="draft" data-module-enter="apply" />
        <button class="button primary" type="button" data-module-action="apply-data">${icons.check}<span>${tr('Aplicar', 'Apply')}</span></button>
      </div>
      <p id="node-help" class="field-help">${tr('A árvore é montada inserindo cada valor, na ordem informada (iguais vão para a direita). Por isso a ordem muda o formato. Inteiros de 0 a', 'The tree is built by inserting each value, in the order given (equal values go to the right). That is why the order changes the shape. Integers from 0 to')} ${MAX_VALUE}${tr('; no máximo', '; at most')} ${MAX_NODES} ${tr('nós. Deixe em branco para uma árvore vazia.', 'nodes. Leave blank for an empty tree.')}</p>
      <p id="node-error" class="error-message" role="alert">${escapeText(state.inputError)}</p>
      <div class="preset-row"><span>${tr('Exemplos da aula', 'Lesson examples')}</span>${presets}</div>
      <div class="random-row">
        <label for="random-count">${tr('Quantidade aleatória', 'Random quantity')}</label>
        <input id="random-count" type="range" min="0" max="${MAX_NODES}" value="${state.randomCount}" data-module-input="random-count" />
        <output id="random-count-output">${state.randomCount}</output>
        <button class="button secondary" type="button" data-module-action="random-data">${icons.shuffle}<span>${tr('Gerar árvore aleatória', 'Generate random tree')}</span></button>
      </div>`;
  },

  renderConfig({ state }) {
    const { algorithmId, config, data } = state;
    const heading = (title) => `<div class="panel-heading compact-heading"><div><span class="eyebrow">${tr('Parâmetros', 'Parameters')}</span><h2 id="config-title">${title}</h2></div></div>`;
    const field = (key, hint) => `<label class="config-field"><span>${tr('Valor', 'Value')}</span><input id="item-input" type="number" min="0" max="${MAX_VALUE}" step="1" value="${config[key]}" data-module-input="${key}" /><small>${hint}</small></label>`;

    if (algorithmId === 'insert') {
      return `${heading(tr('Escolha o valor a inserir', 'Choose the value to insert'))}${field('insertValue', tr('Um valor igual a um que já existe vai para a direita. Clique em um nó da árvore para repetir o valor dele.', 'A value equal to one that already exists goes to the right. Click a tree node to repeat its value.'))}`;
    }
    if (algorithmId === 'search') {
      return `${heading(tr('Escolha o valor a buscar', 'Choose the value to search for'))}${field('searchValue', tr('Teste um valor que existe e um que não existe. Clique em um nó da árvore para usar o valor dele.', 'Try a value that exists and one that does not. Click a tree node to use its value.'))}`;
    }
    if (algorithmId === 'remove') {
      const cases = [[0, tr('Uma folha', 'A leaf')], [1, tr('Um filho', 'One child')], [2, tr('Dois filhos', 'Two children')]].map(([count, label]) => {
        const available = nodeWithChildren(data.values, count) !== null;
        return `<button class="button secondary compact" type="button" data-module-action="pick-case" data-case="${count}" ${available ? '' : 'disabled'}>${label}</button>`;
      }).join('');
      return `${heading(tr('Escolha o valor a remover', 'Choose the value to remove'))}${field('removeValue', tr('Clique em um nó da árvore para usar o valor dele, ou escolha um dos casos abaixo.', 'Click a tree node to use its value, or choose one of the cases below.'))}
        <div class="preset-row"><span>${tr('Escolher um nó com', 'Choose a node with')}</span>${cases}</div>`;
    }
    if (algorithmId === 'anatomy' && data.values.length) {
      return `${heading(tr('Escolha o nó', 'Choose the node'))}
        <p class="config-note">${tr('Nó escolhido:', 'Chosen node:')} <strong>${data.values[config.focus]}</strong>${tr('. Clique em outro nó da árvore para falar dele: pai e filhos, subárvore, profundidade e altura mudam.', '. Click another tree node to talk about it: parent and children, subtree, depth and height change.')}</p>`;
    }
    if (algorithmId === 'rule') {
      const pressed = (mode) => `aria-pressed="${config.rule === mode}"`;
      return `${heading(tr('Escolha a árvore', 'Choose the tree'))}
        <div class="preset-row">
          <button class="button secondary compact" type="button" data-module-action="set-rule" data-mode="valid" ${pressed('valid')}>${tr('A minha árvore', 'My tree')}</button>
          <button class="button secondary compact" type="button" data-module-action="set-rule" data-mode="error" ${pressed('error')}>${tr('Árvore com erro da aula', 'Lesson tree with the mistake')}</button>
        </div>
        <p class="config-note">${config.rule === 'error' ? tr('Árvore fixa dos slides: 40, 20, 60, 10, 45, 50, 70, com o 45 à esquerda de 40.', 'Slide tree: 40, 20, 60, 10, 45, 50, 70, with 45 to the left of 40.') : tr('A árvore montada com os valores dos dados de entrada.', 'The tree built with the values from the input data.')}</p>`;
    }
    return '';
  },

  renderVisualization({ state, step, icons, escapeText }) {
    return renderTree({
      state, step, icons, escapeText, legend: LEGENDS[state.algorithmId] || LEGENDS.insert,
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
      case 'insertValue':
      case 'searchValue':
      case 'removeValue':
        if (input.value !== '' && isValue(Number(input.value))) {
          app.state.config[name] = Number(input.value);
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
      state.config = { ...defaultConfig({ values: parsed.values }), rule: state.config.rule };
      app.setData({ values: parsed.values });
      return;
    }

    if (action === 'random-data') {
      const values = randomValues(state.randomCount);
      state.config = { ...defaultConfig({ values }), rule: state.config.rule };
      app.setData({ values });
      return;
    }

    if (action === 'preset') {
      const preset = PRESETS[button.dataset.preset];
      if (!preset) return;
      const values = [...preset.values];
      state.config = { ...defaultConfig({ values }), rule: state.config.rule };
      // Os valores dos exemplos dos slides: INSERIR(45), BUSCAR(30), REMOVER(10) e, com o 45, REMOVER(50).
      if (button.dataset.preset === 'lesson' || button.dataset.preset === 'lessonPlus') {
        if (!values.includes(45)) state.config.insertValue = 45;
        state.config.searchValue = 30;
        state.config.removeValue = button.dataset.preset === 'lessonPlus' ? 50 : 10;
      }
      app.setData({ values });
      return;
    }

    if (action === 'pick-case') {
      const value = nodeWithChildren(state.data.values, Number(button.dataset.case));
      if (value === null) return;
      state.config.removeValue = value;
      app.renderConfig();
      app.rebuildSteps();
      return;
    }

    if (action === 'set-rule') {
      state.config.rule = button.dataset.mode === 'error' ? 'error' : 'valid';
      state.inspectedItem = null;
      app.renderConfig();
      app.rebuildSteps();
      return;
    }

    if (action === 'pick-node') {
      const id = Number(button.dataset.index);
      const value = Number(button.dataset.value);
      const keys = { insert: 'insertValue', search: 'searchValue', remove: 'removeValue' };
      if (state.algorithmId === 'anatomy') {
        if (id < state.data.values.length) {
          state.config.focus = id;
          app.renderConfig();
          app.rebuildSteps();
        }
        return;
      }
      if (keys[state.algorithmId]) {
        state.config[keys[state.algorithmId]] = value;
        app.renderConfig();
        app.rebuildSteps();
        return;
      }
      state.inspectedItem = id;
      app.renderSimulation();
    }
  },
};
