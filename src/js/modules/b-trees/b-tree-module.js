import {
  algorithms, buildSteps, dryRun, freeKeys, initialTree, inorderKeys, LIMITS, levelKeys, summarize, tOf,
} from './algorithms.js';
import { afterRenderBTree, renderBTree } from './views.js';
import { tr } from '../../core/i18n.js';

const N = (k, ...c) => ({ k, c });
const ORDERS = Array.from({ length: LIMITS.mMax - LIMITS.mMin + 1 }, (_, index) => LIMITS.mMin + index);
// Ordem 4 como nos exemplos de inserção e remoção da aula (as chaves 27, 10, 52, 46 e 35 são as dos slides 47 a 68), com
// mais chaves para a árvore já ter três níveis: inserir o 47 divide uma folha e remover o 20 pede uma rotação.
const DEFAULT_DATA = { m: 4, median: 'upper', keys: [27, 10, 52, 46, 35, 64, 15, 8, 70, 90, 20, 58] };

// Exemplos. `shape` monta a árvore exatamente como o slide a desenha; `keys` insere as chaves em ordem.
const PRESETS = {
  tree7: {
    label: tr('Árvore de ordem 5', 'Order-5 tree'),
    hint: tr('Árvore de ordem 5 com 27 chaves e 3 níveis, para conferir as propriedades', 'Order-5 tree with 27 keys and 3 levels, to check the properties'),
    m: 5,
    shape: N([25], N([10, 20], N([2, 5, 7, 8]), N([13, 14, 15, 18]), N([21, 22, 23, 24])), N([30, 40], N([26, 27, 28]), N([32, 35, 38]), N([41, 42, 45, 46]))),
    algorithm: 'properties',
  },
  ins12: {
    label: tr('Inserir 12 (m = 5)', 'Insert 12 (m = 5)'), hint: tr('A folha tem espaço', 'The leaf has room'), m: 5, shape: N([48], N([25, 37]), N([62, 78])), insert: 12, algorithm: 'insert',
  },
  ins34: {
    label: tr('Inserir 34 (m = 5)', 'Insert 34 (m = 5)'), hint: tr('A folha está cheia e é dividida', 'The leaf is full and gets split'), m: 5, shape: N([48], N([12, 25, 37, 42]), N([62, 78, 82, 99])), insert: 34, algorithm: 'insert',
  },
  ins46: {
    label: tr('Inserir 46 (m = 4)', 'Insert 46 (m = 4)'), hint: tr('A árvore de 27, 10 e 52 divide ao receber 46', 'The tree of 27, 10 and 52 splits when it receives 46'), m: 4, keys: [27, 10, 52], insert: 46, algorithm: 'insert',
  },
  rem35: {
    label: tr('Remover 35 (Caso 1)', 'Remove 35 (Case 1)'), hint: tr('Remoção simples numa folha', 'Simple removal in a leaf'), m: 4, shape: N([46], N([10, 27, 35]), N([52])), remove: 35, algorithm: 'remove',
  },
  rem10f: {
    label: tr('Remover 10 (fusão)', 'Remove 10 (merge)'), hint: tr('O irmão está no mínimo, então os nós se fundem', 'The sibling is at the minimum, so the nodes merge'), m: 4, shape: N([46], N([10]), N([52])), remove: 10, algorithm: 'remove',
  },
  rem10r: {
    label: tr('Remover 10 (rotação)', 'Remove 10 (rotation)'), hint: tr('O irmão tem chave de sobra, então há uma rotação', 'The sibling has a spare key, so there is a rotation'), m: 4, shape: N([46], N([10]), N([52, 64])), remove: 10, algorithm: 'remove',
  },
  rem52: {
    label: tr('Remover 52 (Caso 2a)', 'Remove 52 (Case 2a)'), hint: tr('Predecessor', 'Predecessor'), m: 4, shape: N([52], N([10, 46]), N([64])), remove: 52, algorithm: 'remove',
  },
  rem68: {
    label: tr('Remover 68 (Caso 2b)', 'Remove 68 (Case 2b)'), hint: tr('Sucessor', 'Successor'), m: 4, shape: N([68], N([31]), N([85, 87])), remove: 68, algorithm: 'remove',
  },
  rem85: {
    label: tr('Remover 85 (Caso 2c)', 'Remove 85 (Case 2c)'), hint: tr('y e z no mínimo, os três se fundem', 'y and z at the minimum, the three merge'), m: 4, shape: N([85], N([31]), N([87])), remove: 85, algorithm: 'remove',
  },
};

// Árvores que quebram uma regra, para o simulador de propriedades mostrar qual.
const INVALID = {
  leaves: { label: tr('Folhas em níveis diferentes', 'Leaves at different levels'), hint: tr('Todas as folhas devem estar no mesmo nível', 'All leaves must be at the same level'), m: 4, shape: N([20], N([5, 10]), N([30], N([25]), N([35, 40]))) },
  few: { label: tr('Nó abaixo do mínimo', 'Node below the minimum'), hint: tr('Com m = 5 todo nó (exceto a raiz) tem pelo menos 2 chaves', 'With m = 5 every node (except the root) has at least 2 keys'), m: 5, shape: N([30], N([10]), N([40, 50])) },
  many: { label: tr('Nó acima do máximo', 'Node above the maximum'), hint: tr('Com m = 4 um nó tem no máximo 3 chaves', 'With m = 4 a node has at most 3 keys'), m: 4, shape: N([10, 20, 30, 40]) },
};

const LEGENDS = {
  properties: [['bt-current', tr('nó conferido', 'node being checked')], ['bt-ok', tr('de acordo com as regras', 'follows the rules')], ['bt-error', tr('viola uma regra', 'breaks a rule')]],
  search: [['bt-current', tr('nó lido', 'node read')], ['bt-cmp', tr('chave comparada', 'key compared')], ['bt-hit', tr('chave encontrada', 'key found')]],
  insert: [['bt-current', tr('nó atual', 'current node')], ['bt-new', tr('chave ou nó novo', 'new key or node')], ['bt-over', tr('overflow (m chaves)', 'overflow (m keys)')], ['bt-median', tr('mediana', 'median')], ['bt-ok', tr('concluído', 'done')]],
  remove: [['bt-current', tr('nó atual', 'current node')], ['bt-hit', tr('chave procurada / k′', 'key we want / k′')], ['bt-under', tr('no mínimo (precisa de reforço)', 'at the minimum (needs reinforcing)')], ['bt-moved', tr('chave que mudou de lugar', 'key that moved')], ['bt-gone', tr('chave que sai de cima', 'key leaving the parent')], ['bt-ok', tr('concluído', 'done')]],
};
LEGENDS.build = LEGENDS.insert;
const STRIPS = { insert: 'path', build: 'path', remove: 'stack' };

const isValue = (value) => Number.isInteger(value) && value >= 0 && value <= LIMITS.value;
const randomBelow = (limit) => Math.floor(Math.random() * limit);

const isShape = (shape) => !!shape && Array.isArray(shape.k) && shape.k.every(isValue)
  && (shape.c === undefined || (Array.isArray(shape.c) && shape.c.every(isShape)));

/** Dados completos de uma árvore: ordem, mediana e as chaves (e, às vezes, a forma exata). */
function dataOf({ m, median, keys, shape }) {
  const data = { m, median, keys: shape ? levelKeys(initialTree({ m, median, keys: [], shape })) : [...keys] };
  if (shape) data.shape = shape;
  return data;
}

/** Converte a árvore de uma cena de volta para `shape` (para usar o resultado de uma operação como nova árvore). */
function shapeFromScene(scene) {
  if (scene.root === null) return null;
  const byId = new Map(scene.nodes.map((node) => [node.id, node]));
  const build = (id) => ({ k: [...byId.get(id).keys], c: byId.get(id).kids.map(build) });
  return build(scene.root);
}

function countLabel(data) {
  const info = summarize(data);
  if (!info.nodes) return tr('0 chaves', '0 keys');
  const nodes = tr(`${info.nodes} nó${info.nodes === 1 ? '' : 's'}`, `${info.nodes} node${info.nodes === 1 ? '' : 's'}`);
  const keys = tr(`${info.keys} chave${info.keys === 1 ? '' : 's'}`, `${info.keys} key${info.keys === 1 ? '' : 's'}`);
  return `${keys} · ${nodes} · ${tr('altura', 'height')} ${info.height}${info.valid ? '' : tr(' · não é Árvore B', ' · not a B-tree')}`;
}

function parseKeys(text) {
  const trimmed = String(text).trim();
  if (!trimmed) return { keys: [] };
  const tokens = trimmed.split(/[;,\s]+/).map((token) => token.trim()).filter(Boolean);
  if (tokens.length > LIMITS.keys) return { error: tr(`Use no máximo ${LIMITS.keys} valores para manter a visualização legível.`, `Use at most ${LIMITS.keys} values to keep the visualization readable.`) };
  const keys = tokens.map(Number);
  if (!keys.every(isValue)) return { error: tr(`Use apenas números inteiros de 0 a ${LIMITS.value}, separados por espaço, vírgula ou ponto e vírgula.`, `Use only integers from 0 to ${LIMITS.value}, separated by space, comma or semicolon.`) };
  if (new Set(keys).size !== keys.length) return { error: tr('Esta Árvore B guarda chaves distintas: tire os valores repetidos.', 'This B-tree keeps distinct keys: remove the repeated values.') };
  return { keys };
}

function shuffled(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const other = randomBelow(index + 1);
    [copy[index], copy[other]] = [copy[other], copy[index]];
  }
  return copy;
}
const randomKeys = (count) => shuffled(Array.from({ length: 99 }, (_, index) => index + 1)).slice(0, count);

/** A primeira chave livre cuja inserção satisfaz `wanted` (divide, divide a raiz...). */
function findInsert(data, wanted) {
  return freeKeys(data).find((key) => wanted(dryRun('insert', data, key)));
}

/** A primeira chave da árvore cuja remoção satisfaz `wanted`. */
function findRemove(data, wanted) {
  return inorderKeys(initialTree(data)).find((key) => wanted(dryRun('remove', data, key)));
}

/** Uma chave de folha ou de nó interno, para os botões da remoção. */
function keyAt(data, internal) {
  const T = initialTree(data);
  for (const node of T.nodes.values()) {
    const reachable = node.keys.length > 0;
    if (reachable && (node.kids.length > 0) === internal) return node.keys[Math.floor(node.keys.length / 2)];
  }
  return undefined;
}

function defaultConfig(data) {
  const keys = inorderKeys(initialTree(data));
  const splitting = findInsert(data, (r) => r.splits > 0);
  const free = freeKeys(data);
  const prepared = findRemove(data, (r) => r.merges + r.rotations > 0);
  return {
    insertValue: splitting ?? free[Math.floor(free.length / 2)] ?? 100,
    removeValue: prepared ?? keys[0] ?? 0,
    searchValue: keys.length ? keys[Math.floor(keys.length / 2)] : 0,
  };
}

export const bTreeModule = {
  id: 'b-trees',
  name: tr('Árvore B', 'B-Tree'),
  version: '1.0',
  visualizationTitle: tr('Árvore B na memória', 'B-tree in memory'),
  defaultAlgorithmId: 'insert',
  defaultData: DEFAULT_DATA,
  defaultRandomCount: 10,
  codeScroll: true,
  algorithms,
  buildSteps,

  isValidData(value) {
    return !!value && typeof value === 'object'
      && Number.isInteger(value.m) && value.m >= LIMITS.mMin && value.m <= LIMITS.mMax
      && Array.isArray(value.keys) && value.keys.every(isValue)
      && (value.shape === undefined ? value.keys.length <= LIMITS.keys && new Set(value.keys).size === value.keys.length : isShape(value.shape));
  },

  sanitizeData(value) {
    if (this.isValidData(value)) return dataOf({ m: value.m, median: value.median === 'lower' ? 'lower' : 'upper', keys: value.keys, shape: value.shape });
    return dataOf({ ...DEFAULT_DATA });
  },

  formatData(data) {
    return data.keys.join(', ');
  },

  createInitialConfig(data) {
    return defaultConfig(data);
  },

  normalizeConfig(data, config) {
    const fallback = defaultConfig(data);
    const toValue = (value, backup) => (value !== '' && value !== null && value !== undefined && isValue(Number(value)) ? Number(value) : backup);
    return {
      insertValue: toValue(config.insertValue, fallback.insertValue),
      removeValue: toValue(config.removeValue, fallback.removeValue),
      searchValue: toValue(config.searchValue, fallback.searchValue),
    };
  },

  renderEditor({ state, icons, escapeText }) {
    const { m, median } = state.data;
    const orders = ORDERS.map((order) => `<button class="button secondary compact" type="button" data-module-action="set-order" data-order="${order}" aria-pressed="${m === order}">${order}</button>`).join('');
    const medians = m % 2 === 0
      ? `<div class="preset-row"><span>${tr('Mediana', 'Median')}</span>
          <button class="button secondary compact" type="button" data-module-action="set-median" data-median="upper" aria-pressed="${median === 'upper'}" title="${tr('Com um número par de chaves há duas do meio; esta opção sobe a de cima', 'With an even number of keys there are two middle ones; this option sends up the upper one')}">${tr('Superior (padrão)', 'Upper (default)')}</button>
          <button class="button secondary compact" type="button" data-module-action="set-median" data-median="lower" aria-pressed="${median === 'lower'}" title="${tr('Com um número par de chaves há duas do meio; esta opção sobe a de baixo', 'With an even number of keys there are two middle ones; this option sends up the lower one')}">${tr('Inferior', 'Lower')}</button></div>`
      : '';
    const presets = Object.entries(PRESETS).map(([key, preset], index) => `<button class="button secondary compact" type="button" data-module-action="preset" data-preset="${key}" title="${escapeText(`${preset.label}. ${preset.hint}`)}" aria-label="${tr('Exemplo', 'Example')} ${index + 1}: ${escapeText(preset.label)}">${index + 1}</button>`).join('');
    const invalid = Object.entries(INVALID).map(([key, preset]) => `<button class="button secondary compact" type="button" data-module-action="invalid" data-preset="${key}" title="${escapeText(preset.hint)}">${preset.label}</button>`).join('');
    return `
      <div class="panel-heading compact-heading">
        <div><span class="eyebrow">${tr('Dados de entrada', 'Input data')}</span><h2 id="data-editor-title">${tr('Monte a árvore', 'Build the tree')}</h2></div>
        <span id="tree-size" class="size-badge">${countLabel(state.data)}</span>
      </div>
      <label class="field-label" for="node-input">${tr('Valores, na ordem em que serão inseridos', 'Values, in the order they will be inserted')}</label>
      <div class="input-action-row">
        <input id="node-input" class="text-input ${state.inputError ? 'invalid' : ''}" value="${escapeText(state.draft)}" placeholder="10, 20, 30, 40, 50" aria-describedby="node-help node-error" data-module-input="draft" data-module-enter="apply" />
        <button class="button primary" type="button" data-module-action="apply-data">${icons.check}<span>${tr('Aplicar', 'Apply')}</span></button>
      </div>
      <p id="node-help" class="field-help">${tr('As chaves são inseridas, uma a uma, numa árvore vazia. Inteiros de 0 a', 'The keys are inserted, one by one, into an empty tree. Integers from 0 to')} ${LIMITS.value}${tr(', sem repetidos; no máximo', ', no repeats; at most')} ${LIMITS.keys}. ${tr('Ordem m é o número máximo de filhos de um nó: cada nó tem no máximo', 'The order m is the maximum number of children of a node: each node has at most')} <strong>m − 1 = ${m - 1}</strong> ${tr('chaves e, fora a raiz, pelo menos', 'keys and, except for the root, at least')} <strong>⌈m/2⌉ − 1 = ${tOf(m) - 1}</strong>.${m % 2 === 1 ? ` ${tr('Com ordem ímpar a remoção usa a variante "remover e consertar na volta" (veja o simulador Remover).', 'With an odd order the removal uses the "remove, then fix on the way back" variant (see the Remove simulator).')}` : ''}</p>
      <p id="node-error" class="error-message" role="alert">${escapeText(state.inputError)}</p>
      <div class="preset-row"><span>${tr('Ordem m', 'Order m')}</span>${orders}</div>
      ${medians}
      <div class="preset-row"><span>${tr('Exemplos', 'Examples')}</span>${presets}</div>
      <div class="preset-row"><span>${tr('Não são Árvores B', 'Not B-trees')}</span>${invalid}</div>
      <div class="random-row">
        <label for="random-count">${tr('Quantidade aleatória', 'Random quantity')}</label>
        <input id="random-count" type="range" min="0" max="${LIMITS.keys}" value="${state.randomCount}" data-module-input="random-count" />
        <output id="random-count-output">${state.randomCount}</output>
        <button class="button secondary" type="button" data-module-action="random-data">${icons.shuffle}<span>${tr('Gerar árvore aleatória', 'Generate random tree')}</span></button>
      </div>`;
  },

  renderConfig({ state }) {
    const { algorithmId, config, data } = state;
    const heading = (title) => `<div class="panel-heading compact-heading"><div><span class="eyebrow">${tr('Parâmetros', 'Parameters')}</span><h2 id="config-title">${title}</h2></div></div>`;
    const field = (key, hint) => `<label class="config-field"><span>${tr('Valor', 'Value')}</span><input id="item-input" type="number" min="0" max="${LIMITS.value}" step="1" value="${config[key]}" data-module-input="${key}" /><small>${hint}</small></label>`;
    const button = (action, attrs, label, disabled = false) => `<button class="button secondary compact" type="button" data-module-action="${action}" ${attrs} ${disabled ? 'disabled' : ''}>${label}</button>`;
    // Uma ficha por chave da árvore, em ordem crescente: o aluno escolhe clicando na que quer buscar ou remover.
    const keyChips = (action, field) => {
      const keys = inorderKeys(initialTree(data));
      if (!keys.length) return '';
      return `<div class="preset-row key-picker"><span>${tr('Chaves da árvore', 'Keys in the tree')}</span>${keys.map((key) => button(action, `data-value="${key}" aria-pressed="${config[field] === key}"`, String(key))).join('')}</div>`;
    };
    const apply = `<div class="preset-row"><span>${tr('Depois', 'Afterwards')}</span>${button('apply-result', '', tr('Usar a árvore resultante', 'Use the resulting tree'))}</div>`;

    if (algorithmId === 'search') {
      return `${heading(tr('Escolha a chave a buscar', 'Choose the key to search'))}${field('searchValue', tr('Clique em uma chave abaixo ou da árvore para buscá-la. Um valor que não existe mostra a busca terminando em uma folha.', 'Click a key below or in the tree to search for it. A value that does not exist shows the search ending at a leaf.'))}${keyChips('pick-search', 'searchValue')}`;
    }
    if (algorithmId === 'insert') {
      const options = [
        [tr('Sem divisão', 'No split'), findInsert(data, (r) => r.inserted && r.splits === 0)],
        [tr('Com divisão', 'With a split'), findInsert(data, (r) => r.splits > 0 && !r.rootSplit)],
        [tr('Divide a raiz', 'Splits the root'), findInsert(data, (r) => r.rootSplit)],
      ].map(([label, value]) => button('pick-insert', `data-value="${value ?? ''}"`, label, value === undefined)).join('');
      return `${heading(tr('Escolha a chave a inserir', 'Choose the key to insert'))}${field('insertValue', tr('Uma chave que já existe é recusada (a Árvore B guarda chaves distintas): clique em uma chave da árvore para testar.', 'A key that already exists is refused (the B-tree keeps distinct keys): click a key in the tree to test it.'))}
        <div class="preset-row"><span>${tr('Procurar uma chave que', 'Find a key that')}</span>${options}</div>${apply}`;
    }
    if (algorithmId === 'remove') {
      const oddNote = data.m % 2 === 1
        ? `<p class="config-note">${tr(`Ordem m = ${data.m} (ímpar): a descida preventiva (reforçar o filho antes de descer) não cabe, porque fundir dois nós no mínimo e a chave do pai daria ${data.m} chaves. O simulador usa a variante "remover e consertar na volta": a chave sai primeiro e o nó que ficar abaixo do mínimo é consertado na volta.`, `Order m = ${data.m} (odd): the preventive descent (reinforcing the child before going down) does not fit, because merging two nodes at the minimum and the parent key would give ${data.m} keys. The simulator uses the "remove, then fix on the way back" variant: the key leaves first and a node left under the minimum is fixed on the way back.`)}</p>`
        : '';
      const kinds = [
        [tr('Uma chave de folha', 'A leaf key'), keyAt(data, false)],
        [tr('Uma chave de nó interno', 'An internal node key'), keyAt(data, true)],
        [tr('Uma que ainda não existe', 'One that does not exist yet'), freeKeys(data)[0]],
      ].map(([label, value]) => button('pick-remove', `data-value="${value ?? ''}"`, label, value === undefined)).join('');
      return `${heading(tr('Escolha a chave a remover', 'Choose the key to remove'))}${field('removeValue', tr('Clique em uma chave abaixo ou da árvore, ou digite um valor. Um valor que não existe mostra o Caso 3 sem achar a chave.', 'Click a key below or in the tree, or type a value. A value that does not exist shows Case 3 without finding the key.'))}
        ${keyChips('pick-remove', 'removeValue')}<div class="preset-row"><span>${tr('Escolher', 'Choose')}</span>${kinds}</div>${oddNote}${apply}`;
    }
    return '';
  },

  renderVisualization({ state, step, icons, escapeText }) {
    return renderBTree({
      state,
      step,
      icons,
      escapeText,
      legend: LEGENDS[state.algorithmId] || LEGENDS.insert,
      strip: STRIPS[state.algorithmId] || null,
    });
  },

  afterRender: afterRenderBTree,

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
      case 'searchValue':
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
    const load = (item, extra = {}) => {
      const data = dataOf({
        m: item.m ?? state.data.m, median: item.median ?? state.data.median, keys: item.keys ?? [], shape: item.shape,
      });
      const next = { ...defaultConfig(data), ...extra };
      state.config = next;
      app.setData(data);
      if (item.algorithm && item.algorithm !== state.algorithmId) app.changeAlgorithm(item.algorithm);
    };

    if (action === 'apply-data') {
      const parsed = parseKeys(state.draft);
      if (!parsed.keys) {
        state.inputError = parsed.error;
        app.renderEditor();
        document.querySelector('#node-input')?.focus();
        return;
      }
      state.config = defaultConfig({ ...state.data, keys: parsed.keys, shape: undefined });
      app.setData({ m: state.data.m, median: state.data.median, keys: parsed.keys });
      return;
    }

    // Ao abrir a página (sem botão), vale a árvore padrão, não uma sorteada.
    if (action === 'random-data') {
      if (button) {
        const keys = randomKeys(state.randomCount);
        state.config = defaultConfig({ ...state.data, keys, shape: undefined });
        app.setData({ m: state.data.m, median: state.data.median, keys });
      } else app.setData({ ...DEFAULT_DATA, keys: [...DEFAULT_DATA.keys] });
      return;
    }

    if (action === 'set-order' || action === 'set-median') {
      const data = {
        ...state.data,
        m: action === 'set-order' ? Number(button.dataset.order) : state.data.m,
        median: action === 'set-median' ? button.dataset.median : state.data.median,
      };
      state.config = defaultConfig(data);
      app.setData(data);
      return;
    }

    if (action === 'preset' || action === 'invalid') {
      const item = action === 'preset' ? PRESETS[button.dataset.preset] : { ...INVALID[button.dataset.preset], algorithm: 'properties' };
      if (!item) return;
      const extra = {};
      if (item.insert !== undefined) extra.insertValue = item.insert;
      if (item.remove !== undefined) extra.removeValue = item.remove;
      load({ ...item, median: 'upper' }, extra);
      return;
    }

    if (action === 'pick-insert' || action === 'pick-remove' || action === 'pick-search') {
      const value = Number(button.dataset.value);
      if (!isValue(value) || button.dataset.value === '') return;
      state.config[{ 'pick-insert': 'insertValue', 'pick-remove': 'removeValue', 'pick-search': 'searchValue' }[action]] = value;
      app.renderConfig();
      app.rebuildSteps();
      return;
    }

    if (action === 'apply-result') {
      const last = app.controller.steps[app.controller.steps.length - 1];
      if (!last) return;
      const shape = shapeFromScene(last.scene);
      const data = shape
        ? dataOf({
          m: state.data.m, median: state.data.median, keys: [], shape,
        })
        : { m: state.data.m, median: state.data.median, keys: [] };
      const nextConfig = { ...defaultConfig(data), insertValue: state.config.insertValue };
      state.config = nextConfig;
      app.setData(data);
      return;
    }

    if (action === 'pick-key') {
      const id = Number(button.dataset.index);
      const value = Number(button.dataset.value);
      const { algorithmId } = state;
      const field = { search: 'searchValue', insert: 'insertValue', remove: 'removeValue' }[algorithmId];
      if (field) {
        state.config[field] = value;
        app.renderConfig();
        app.rebuildSteps();
        return;
      }
      state.inspectedItem = id;
      app.renderSimulation();
    }
  },
};

