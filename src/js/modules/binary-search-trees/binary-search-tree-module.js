import { algorithms, buildSteps, deepestNode } from './algorithms.js';
import {
  afterRenderTree, buildTree, heightOf, inorder, renderTree,
} from '../shared/tree-scene.js';

const MAX_NODES = 12;
const MAX_VALUE = 999;
const DEFAULT_DATA = { values: [40, 20, 60, 10, 30, 50, 70] };

// Exemplos da aula: a árvore dos slides, a mesma com o 45 (o caso de um filho), o exercício 1 e
// valores em ordem (a árvore vira uma cadeia).
const PRESETS = {
  lesson: { label: 'Árvore da aula', values: [40, 20, 60, 10, 30, 50, 70] },
  lessonPlus: { label: 'Aula + 45', values: [40, 20, 60, 10, 30, 50, 70, 45] },
  exercise: { label: 'Exercício 1', values: [45, 25, 65, 15, 35, 55, 75] },
  ascending: { label: 'Em ordem crescente', values: [10, 20, 30, 40, 50, 60, 70] },
};

const LEGENDS = {
  node: [['detached', 'nó isolado'], ['compared', 'alterado'], ['result', 'resultado']],
  anatomy: [['compared', 'raiz / pai'], ['result', 'folhas / filhos'], ['current', 'nó escolhido'], ['processed', 'caminho']],
  rule: [['current', 'nó conferido'], ['left', 'menores (esquerda)'], ['right', 'maiores ou iguais (direita)'], ['error', 'violação']],
  insert: [['current', 'atual'], ['processed', 'visitado'], ['compared', 'alterado'], ['result', 'novo nó'], ['detached', 'isolado']],
  build: [['current', 'atual'], ['processed', 'visitado'], ['compared', 'alterado'], ['result', 'novo nó'], ['detached', 'isolado']],
  search: [['current', 'atual'], ['processed', 'visitado'], ['result', 'encontrado']],
  remove: [['current', 'atual'], ['processed', 'visitado'], ['compared', 'alterado'], ['result', 'sucessor / filho'], ['lost', 'fora da árvore']],
};

const isValue = (value) => Number.isInteger(value) && value >= 0 && value <= MAX_VALUE;
const countLabel = (values) => `${values.length} nó${values.length === 1 ? '' : 's'}${values.length ? ` · altura ${heightOf(buildTree(values))}` : ''}`;
const randomBelow = (limit) => Math.floor(Math.random() * limit);

function parseValues(text) {
  const trimmed = String(text).trim();
  if (!trimmed) return { values: [] };
  const tokens = trimmed.split(/[;,\s]+/).map((token) => token.trim()).filter(Boolean);
  if (tokens.length > MAX_NODES) return { error: `Use no máximo ${MAX_NODES} valores para manter a visualização legível.` };
  const values = tokens.map(Number);
  if (!values.every(isValue)) return { error: `Use apenas números inteiros de 0 a ${MAX_VALUE}, separados por espaço, vírgula ou ponto e vírgula.` };
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
  name: 'Árvore Binária de Busca',
  version: '1.0',
  visualizationTitle: 'Árvore binária de busca na memória',
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
        <div><span class="eyebrow">Dados de entrada</span><h2 id="data-editor-title">Monte a árvore</h2></div>
        <span id="tree-size" class="size-badge">${countLabel(values)}</span>
      </div>
      <label class="field-label" for="node-input">Valores, na ordem em que serão inseridos</label>
      <div class="input-action-row">
        <input id="node-input" class="text-input ${state.inputError ? 'invalid' : ''}" value="${escapeText(state.draft)}" placeholder="40, 20, 60, 10, 30, 50, 70" aria-describedby="node-help node-error" data-module-input="draft" data-module-enter="apply" />
        <button class="button primary" type="button" data-module-action="apply-data">${icons.check}<span>Aplicar</span></button>
      </div>
      <p id="node-help" class="field-help">A árvore é montada inserindo cada valor, na ordem informada (iguais vão para a direita). Por isso a ordem muda o formato. Inteiros de 0 a ${MAX_VALUE}; no máximo ${MAX_NODES} nós. Deixe em branco para uma árvore vazia.</p>
      <p id="node-error" class="error-message" role="alert">${escapeText(state.inputError)}</p>
      <div class="preset-row"><span>Exemplos da aula</span>${presets}</div>
      <div class="random-row">
        <label for="random-count">Quantidade aleatória</label>
        <input id="random-count" type="range" min="0" max="${MAX_NODES}" value="${state.randomCount}" data-module-input="random-count" />
        <output id="random-count-output">${state.randomCount}</output>
        <button class="button secondary" type="button" data-module-action="random-data">${icons.shuffle}<span>Gerar árvore aleatória</span></button>
      </div>`;
  },

  renderConfig({ state }) {
    const { algorithmId, config, data } = state;
    const heading = (title) => `<div class="panel-heading compact-heading"><div><span class="eyebrow">Parâmetros</span><h2 id="config-title">${title}</h2></div></div>`;
    const field = (key, hint) => `<label class="config-field"><span>Valor</span><input id="item-input" type="number" min="0" max="${MAX_VALUE}" step="1" value="${config[key]}" data-module-input="${key}" /><small>${hint}</small></label>`;

    if (algorithmId === 'insert') {
      return `${heading('Escolha o valor a inserir')}${field('insertValue', 'Um valor igual a um que já existe vai para a direita. Clique em um nó da árvore para repetir o valor dele.')}`;
    }
    if (algorithmId === 'search') {
      return `${heading('Escolha o valor a buscar')}${field('searchValue', 'Teste um valor que existe e um que não existe. Clique em um nó da árvore para usar o valor dele.')}`;
    }
    if (algorithmId === 'remove') {
      const cases = [[0, 'Uma folha'], [1, 'Um filho'], [2, 'Dois filhos']].map(([count, label]) => {
        const available = nodeWithChildren(data.values, count) !== null;
        return `<button class="button secondary compact" type="button" data-module-action="pick-case" data-case="${count}" ${available ? '' : 'disabled'}>${label}</button>`;
      }).join('');
      return `${heading('Escolha o valor a remover')}${field('removeValue', 'Clique em um nó da árvore para usar o valor dele, ou escolha um dos casos abaixo.')}
        <div class="preset-row"><span>Escolher um nó com</span>${cases}</div>`;
    }
    if (algorithmId === 'anatomy' && data.values.length) {
      return `${heading('Escolha o nó')}
        <p class="config-note">Nó escolhido: <strong>${data.values[config.focus]}</strong>. Clique em outro nó da árvore para falar dele: pai e filhos, subárvore, profundidade e altura mudam.</p>`;
    }
    if (algorithmId === 'rule') {
      const pressed = (mode) => `aria-pressed="${config.rule === mode}"`;
      return `${heading('Escolha a árvore')}
        <div class="preset-row">
          <button class="button secondary compact" type="button" data-module-action="set-rule" data-mode="valid" ${pressed('valid')}>A minha árvore</button>
          <button class="button secondary compact" type="button" data-module-action="set-rule" data-mode="error" ${pressed('error')}>Árvore com erro da aula</button>
        </div>
        <p class="config-note">${config.rule === 'error' ? 'Árvore fixa dos slides: 40, 20, 60, 10, 45, 50, 70, com o 45 à esquerda de 40.' : 'A árvore montada com os valores dos dados de entrada.'}</p>`;
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
