import {
  algorithms, buildSteps, CASE_TREES, heightOfTree, initialTree, pivotFor, rotationsOnInsert, worstFactor,
} from './algorithms.js';
import { renderStack } from '../shared/recursion-view.js';
import { afterRenderTree, inorder, renderTree } from '../shared/tree-scene.js?v=2';

const MAX_NODES = 12;
const MAX_VALUE = 999;
// A árvore da aula (slides de FB, aula 13): uma AVL com os nós dos exemplos de inserção.
const DEFAULT_DATA = { values: [8, 4, 10, 2, 6, 9, 15, 12], balanced: true };

// Exemplos da aula. `balanced: false` monta a árvore com inserção de ABB (sem rotações): é o que a aula 13
// pede nos exercícios de remoção ("sem rotacionar") e o que o slide 66 da aula 14 desenha.
const PRESETS = {
  ll: { label: 'LL: inserir(4)', hint: 'Aula 14, slides 28–40', values: [32, 16], insert: 4 },
  rr: { label: 'RR: inserir(12)', hint: 'Aula 14, slides 42–60', values: [8, 4, 10, 9, 15], insert: 12 },
  lr: { label: 'LR: inserir(5)', hint: 'Aula 13, slides 49–54', values: [8, 4, 10, 2, 6], insert: 5 },
  rl: { label: 'RL: inserir(11)', hint: 'O espelho do caso LR', values: [8, 12, 6, 14, 10], insert: 11 },
  rem80: { label: 'Slides: remover(80)', hint: 'Aula 14, slides 66–85. A árvore do slide já tem |FB| = 2 na raiz: não é AVL, por isso é montada como ABB.', values: [50, 30, 80, 10, 40, 35], balanced: false, remove: 80 },
  rem90: { label: 'remover(90) (AVL válida)', hint: 'O exemplo do slide 66 com o 90 à direita do 80: é AVL e a remoção também precisa de uma rotação dupla (LR).', values: [50, 30, 80, 10, 40, 90, 35], remove: 90 },
  rem10: { label: 'Aula 13: remover(10)', hint: 'Aula 13, slides 65–69', values: [8, 4, 10, 2, 6], remove: 10 },
  ascending: { label: 'Em ordem crescente', hint: 'Com inserção de ABB comum isto vira uma cadeia', values: [10, 20, 30, 40, 50, 60, 70] },
};

// Exercícios das aulas 13 e 14: os quatro primeiros são só inserções; nos outros quatro, a aula 13 pede
// para inserir "sem rotacionar" e remover, e a aula 14 pede para inserir numa AVL e remover.
const EXERCISES = [
  { values: [50, 30, 70, 20, 40, 10] },
  { values: [10, 20, 5, 25, 30, 40] },
  { values: [30, 10, 50, 5, 20, 15] },
  { values: [10, 5, 30, 40, 20, 25] },
  { values: [50, 30, 70, 20, 40, 10], remove: 70, balanced: false },
  { values: [10, 20, 5, 15, 25, 30], remove: 5, balanced: false },
  { values: [50, 30, 70, 10, 40, 35], remove: 70, balanced: false },
  { values: [20, 10, 40, 30, 50, 35], remove: 10, balanced: false },
];

const CASE_LABELS = {
  LL: 'LL: esquerda-esquerda',
  RR: 'RR: direita-direita',
  LR: 'LR: esquerda-direita',
  RL: 'RL: direita-esquerda',
};

const ROTATION_LEGEND = [['current', 'nó que desce (pivô)'], ['result', 'nó que sobe'], ['compared', 'ligação alterada'], ['lost', 'solto: só uma variável aponta']];
const LEGENDS = {
  balance: [['current', 'nó conferido'], ['result', '|FB| ≤ 1'], ['error', '|FB| > 1']],
  rotRight: ROTATION_LEGEND,
  rotLeft: ROTATION_LEGEND,
  cases: [['current', 'nó'], ['compared', 'alterado'], ['error', '|FB| > 1'], ['result', 'novo nó / nó que sobe'], ['lost', 'solto']],
  insert: [['current', 'nó (chamada atual)'], ['left', 'esperando na pilha'], ['compared', 'alterado'], ['error', '|FB| > 1'], ['result', 'novo nó / retornado'], ['detached', 'isolado'], ['lost', 'solto']],
  build: [['current', 'nó'], ['compared', 'alterado'], ['error', '|FB| > 1'], ['result', 'novo nó / nó que sobe'], ['detached', 'isolado'], ['lost', 'solto']],
  remove: [['current', 'nó (chamada atual)'], ['left', 'esperando na pilha'], ['compared', 'alterado'], ['error', '|FB| > 1'], ['result', 'sucessor / retornado'], ['lost', 'fora da árvore']],
};
const WITH_STACK = ['rotRight', 'rotLeft', 'cases', 'insert', 'remove'];

const isValue = (value) => Number.isInteger(value) && value >= 0 && value <= MAX_VALUE;
const randomBelow = (limit) => Math.floor(Math.random() * limit);
const freeValues = (values) => Array.from({ length: 99 }, (_, index) => index + 1).filter((value) => !values.includes(value));

function countLabel({ values, balanced }) {
  if (!values.length) return '0 nós';
  const tree = initialTree(values, balanced);
  return `${values.length} nó${values.length === 1 ? '' : 's'} · altura ${heightOfTree(tree)} · ${worstFactor(tree) <= 1 ? 'é AVL' : 'não é AVL'}`;
}

function parseValues(text) {
  const trimmed = String(text).trim();
  if (!trimmed) return { values: [] };
  const tokens = trimmed.split(/[;,\s]+/).map((token) => token.trim()).filter(Boolean);
  if (tokens.length > MAX_NODES) return { error: `Use no máximo ${MAX_NODES} valores para manter a visualização legível.` };
  const values = tokens.map(Number);
  if (!values.every(isValue)) return { error: `Use apenas números inteiros de 0 a ${MAX_VALUE}, separados por espaço, vírgula ou ponto e vírgula.` };
  if (new Set(values).size !== values.length) return { error: 'A AVL não aceita valores repetidos: ela ignora o segundo. Tire as repetições.' };
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
const randomValues = (count) => shuffled(Array.from({ length: 99 }, (_, index) => index + 1)).slice(0, count);

/** O primeiro valor livre cuja inserção rotaciona (para o exemplo padrão já mostrar uma rotação). */
function defaultInsert(data) {
  const tree = initialTree(data.values, data.balanced);
  const free = freeValues(data.values);
  return free.find((value) => rotationsOnInsert(tree, value) > 0) ?? free[Math.floor(free.length / 2)] ?? 100;
}

/** O primeiro valor da árvore cuja remoção rotaciona; senão, a raiz. */
function defaultRemove(data) {
  if (!data.values.length) return 0;
  const hit = data.values.find((value) => buildSteps('remove', data, { removeValue: value }).some((step) => step.rotation));
  return hit ?? data.values[0];
}

function defaultConfig(data) {
  return {
    insertValue: defaultInsert(data), removeValue: defaultRemove(data), pivot: null, caseId: 'LL',
  };
}

/** Valor de um nó com 0, 1 ou 2 filhos, para os botões "uma folha", "um filho" e "dois filhos". */
function nodeWithChildren(data, wanted) {
  const tree = initialTree(data.values, data.balanced);
  const children = (id) => (typeof tree.nodes[id].left === 'number') + (typeof tree.nodes[id].right === 'number');
  const found = [tree.root, ...inorder(tree)].find((id) => id !== null && children(id) === wanted);
  return found === undefined ? null : tree.nodes[found].value;
}

export const avlTreeModule = {
  id: 'avl-trees',
  name: 'Árvore AVL',
  version: '1.0',
  visualizationTitle: 'Árvore AVL na memória',
  defaultAlgorithmId: 'balance',
  defaultData: DEFAULT_DATA,
  defaultRandomCount: 8,
  codeScroll: true,
  algorithms,
  buildSteps,

  isValidData(value) {
    return !!value && typeof value === 'object'
      && Array.isArray(value.values) && value.values.length <= MAX_NODES
      && value.values.every(isValue) && new Set(value.values).size === value.values.length;
  },

  sanitizeData(value) {
    if (this.isValidData(value)) return { values: [...value.values], balanced: value.balanced !== false };
    return { values: [...DEFAULT_DATA.values], balanced: true };
  },

  formatData(data) {
    return data.values.join(', ');
  },

  createInitialConfig(data) {
    return defaultConfig(data);
  },

  normalizeConfig(data, config) {
    const fallback = defaultConfig(data);
    const toValue = (value, backup) => (value !== '' && value !== null && isValue(Number(value)) ? Number(value) : backup);
    return {
      insertValue: toValue(config.insertValue, fallback.insertValue),
      removeValue: toValue(config.removeValue, fallback.removeValue),
      pivot: Number.isInteger(config.pivot) && config.pivot >= 0 && config.pivot < data.values.length ? config.pivot : null,
      caseId: CASE_TREES[config.caseId] ? config.caseId : 'LL',
    };
  },

  renderEditor({ state, icons, escapeText }) {
    if (state.algorithmId === 'cases') {
      const buttons = Object.keys(CASE_TREES).map((id) => `<button class="button secondary compact" type="button" data-module-action="set-case" data-case="${id}" aria-pressed="${state.config.caseId === id}">${CASE_LABELS[id]}</button>`).join('');
      const { values, insert } = CASE_TREES[state.config.caseId];
      return `
        <div class="panel-heading compact-heading">
          <div><span class="eyebrow">Dados de entrada</span><h2 id="data-editor-title">Escolha o caso</h2></div>
        </div>
        <div class="preset-row"><span>Caso</span>${buttons}</div>
        <p class="field-help">Árvore fixa deste simulador: ${values.slice(0, -1).join(', ')} (inseridos em ordem) e, em seguida, o ${insert}. Ela é montada como ABB, sem rotações, para mostrar o momento antes de balancear. Os outros simuladores usam os valores dos dados de entrada.</p>`;
    }

    const { values, balanced } = state.data;
    const presets = Object.entries(PRESETS).map(([key, preset]) => `<button class="button secondary compact" type="button" data-module-action="preset" data-preset="${key}" title="${escapeText(preset.hint)}">${preset.label}</button>`).join('');
    const exercises = EXERCISES.map((item, index) => `<button class="button secondary compact" type="button" data-module-action="exercise" data-exercise="${index}" title="${escapeText(`${item.values.join(', ')}${item.remove === undefined ? '' : ` e remover o ${item.remove}`}`)}">${index + 1}</button>`).join('');
    const mode = (flag, label) => `<button class="button secondary compact" type="button" data-module-action="set-mode" data-balanced="${flag}" aria-pressed="${balanced === flag}">${label}</button>`;
    return `
      <div class="panel-heading compact-heading">
        <div><span class="eyebrow">Dados de entrada</span><h2 id="data-editor-title">Monte a árvore</h2></div>
        <span id="tree-size" class="size-badge">${countLabel(state.data)}</span>
      </div>
      <label class="field-label" for="node-input">Valores, na ordem em que serão inseridos</label>
      <div class="input-action-row">
        <input id="node-input" class="text-input ${state.inputError ? 'invalid' : ''}" value="${escapeText(state.draft)}" placeholder="8, 4, 10, 2, 6, 9, 15, 12" aria-describedby="node-help node-error" data-module-input="draft" data-module-enter="apply" />
        <button class="button primary" type="button" data-module-action="apply-data">${icons.check}<span>Aplicar</span></button>
      </div>
      <p id="node-help" class="field-help">Cada valor é inserido na ordem informada. Com <strong>inserção AVL</strong> a árvore é balanceada com rotações, como no inserir da aula; com <strong>ABB comum</strong> não há rotações e ela pode ficar desbalanceada (é o "sem rotacionar" dos exercícios). Inteiros de 0 a ${MAX_VALUE}, sem repetidos; no máximo ${MAX_NODES} nós. Deixe em branco para uma árvore vazia.</p>
      <p id="node-error" class="error-message" role="alert">${escapeText(state.inputError)}</p>
      <div class="preset-row"><span>Montar com</span>${mode(true, 'Inserção AVL')}${mode(false, 'ABB comum (sem rotações)')}</div>
      <div class="preset-row"><span>Exemplos da aula</span>${presets}</div>
      <div class="preset-row"><span>Exercícios</span>${exercises}</div>
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
      return `${heading('Escolha o valor a inserir')}${field('insertValue', 'Um valor que já existe é recusado (a AVL não aceita repetidos): clique em um nó da árvore para testar. Os exemplos da aula já escolhem o valor de cada caso.')}`;
    }
    if (algorithmId === 'remove') {
      const cases = [[0, 'Uma folha'], [1, 'Um filho'], [2, 'Dois filhos']].map(([count, label]) => {
        const available = nodeWithChildren(data, count) !== null;
        return `<button class="button secondary compact" type="button" data-module-action="pick-case" data-case="${count}" ${available ? '' : 'disabled'}>${label}</button>`;
      }).join('');
      return `${heading('Escolha o valor a remover')}${field('removeValue', 'Clique em um nó da árvore para usar o valor dele, ou escolha um dos casos abaixo. Um valor que não existe mostra a busca falhando.')}
        <div class="preset-row"><span>Escolher um nó com</span>${cases}</div>`;
    }
    if (algorithmId === 'rotRight' || algorithmId === 'rotLeft') {
      const dir = algorithmId === 'rotRight' ? 'right' : 'left';
      const tree = initialTree(data.values, data.balanced);
      const pivot = pivotFor(tree, dir, config.pivot);
      const name = dir === 'right' ? 'y' : 'x';
      const need = dir === 'right' ? 'esquerdo' : 'direito';
      return `${heading(`Escolha o nó ${name}`)}
        <p class="config-note">${pivot === null
    ? `Nenhum nó tem filho ${need}: mude os valores dos dados de entrada.`
    : `Nó escolhido: <strong>${tree.nodes[pivot].value}</strong>. Clique em outro nó da árvore para girá-lo (ele precisa ter filho ${need}).`}</p>`;
    }
    return '';
  },

  renderVisualization({ state, step, icons, escapeText }) {
    const { algorithmId } = state;
    return renderTree({
      state,
      step,
      icons,
      escapeText,
      legend: LEGENDS[algorithmId] || LEGENDS.insert,
      extra: WITH_STACK.includes(algorithmId) ? renderStack(step, escapeText) : '',
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
    const load = (values, balanced, extra = {}) => {
      const data = { values: [...values], balanced };
      state.config = { ...defaultConfig(data), ...extra, caseId: state.config.caseId };
      app.setData(data);
    };

    if (action === 'apply-data') {
      const parsed = parseValues(state.draft);
      if (!parsed.values) {
        state.inputError = parsed.error;
        app.renderEditor();
        document.querySelector('#node-input')?.focus();
        return;
      }
      load(parsed.values, state.data.balanced);
      return;
    }

    // Ao abrir a página (sem botão), vale a árvore da aula, não uma sorteada.
    if (action === 'random-data') {
      if (button) load(randomValues(state.randomCount), state.data.balanced);
      else app.setData({ ...DEFAULT_DATA, values: [...DEFAULT_DATA.values] });
      return;
    }

    if (action === 'set-mode') {
      load(state.data.values, button.dataset.balanced === 'true');
      return;
    }

    if (action === 'preset' || action === 'exercise') {
      const item = action === 'preset' ? PRESETS[button.dataset.preset] : EXERCISES[Number(button.dataset.exercise)];
      if (!item) return;
      const extra = {};
      if (item.insert !== undefined) extra.insertValue = item.insert;
      if (item.remove !== undefined) extra.removeValue = item.remove;
      load(item.values, item.balanced ?? true, extra);
      return;
    }

    if (action === 'set-case') {
      state.config.caseId = button.dataset.case;
      app.renderEditor();
      app.rebuildSteps();
      return;
    }

    if (action === 'pick-case') {
      const value = nodeWithChildren(state.data, Number(button.dataset.case));
      if (value === null) return;
      state.config.removeValue = value;
      app.renderConfig();
      app.rebuildSteps();
      return;
    }

    if (action === 'pick-node') {
      const id = Number(button.dataset.index);
      const value = Number(button.dataset.value);
      const { algorithmId } = state;
      if (algorithmId === 'insert' || algorithmId === 'remove') {
        state.config[algorithmId === 'insert' ? 'insertValue' : 'removeValue'] = value;
        app.renderConfig();
        app.rebuildSteps();
        return;
      }
      if ((algorithmId === 'rotRight' || algorithmId === 'rotLeft') && id < state.data.values.length) {
        const tree = initialTree(state.data.values, state.data.balanced);
        const dir = algorithmId === 'rotRight' ? 'right' : 'left';
        if (pivotFor(tree, dir, id) === id) {
          state.config.pivot = id;
          app.renderConfig();
          app.rebuildSteps();
          return;
        }
      }
      state.inspectedItem = id;
      app.renderSimulation();
    }
  },
};
