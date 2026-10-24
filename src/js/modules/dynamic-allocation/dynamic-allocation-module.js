import { algorithms, buildSteps } from './algorithms.js';
import { hasIndex } from '../../core/utils.js';
import { displayValue, tr, variableName } from '../../core/i18n.js';

const NODE_COUNT = 3;
const MAX_ABS_VALUE = 999;
const DEFAULT_DATA = { values: [42, 51, 63] };

function parseNodeValues(text) {
  const tokens = String(text).trim().split(/[;,\s]+/).map((token) => token.trim()).filter(Boolean);
  if (tokens.length !== NODE_COUNT) {
    return { error: tr(`Informe exatamente ${NODE_COUNT} números, um para cada nó (n1, n2 e n3).`, `Enter exactly ${NODE_COUNT} numbers, one for each node (n1, n2 and n3).`) };
  }
  const values = tokens.map(Number);
  if (values.some((value) => !Number.isInteger(value) || Math.abs(value) > MAX_ABS_VALUE)) {
    return { error: tr(`Use apenas números inteiros entre -${MAX_ABS_VALUE} e ${MAX_ABS_VALUE}.`, `Use only integers between -${MAX_ABS_VALUE} and ${MAX_ABS_VALUE}.`) };
  }
  return { values };
}

function randomValues() {
  const pool = new Set();
  while (pool.size < NODE_COUNT) pool.add(Math.floor(Math.random() * 90) + 10);
  return [...pool];
}

function renderObjects(scene, step, escapeText) {
  const objectById = (id) => scene.objects.find((item) => item.id === id);

  const vars = scene.vars.map((variable) => {
    const classes = ['mem-var'];
    if (step.changedVar === variable.name) classes.push('changed');
    if (step.activeVar === variable.name) classes.push('active');
    let content;
    if (variable.kind === 'value') {
      content = `<span class="mem-var-value">${variable.value === null ? '?' : escapeText(variable.value)}</span>`;
    } else if (variable.pending) {
      content = '<span class="mem-ref pending">?</span>';
    } else if (variable.target === null) {
      content = '<span class="mem-ref null">null</span>';
    } else {
      content = `<span class="mem-ref">${escapeText(objectById(variable.target)?.address ?? '?')}</span>`;
    }
    return `<div class="${classes.join(' ')}"><span class="mem-var-name">${escapeText(variableName(variable.name))}</span>${content}</div>`;
  }).join('');

  const objects = scene.objects.length
    ? scene.objects.map((object) => {
      const born = step.bornObject === object.id ? ' born' : '';
      const fields = object.fields.map((field) => {
        const changed = step.changedField === field.name ? ' changed' : '';
        return `<div class="mem-object-field${changed}"><span>${escapeText(variableName(field.name))}</span><strong>${escapeText(displayValue(field.value))}</strong></div>`;
      }).join('');
      return `<div class="mem-object${born}"><div class="mem-object-head"><span>${escapeText(object.type)}</span><span class="mem-object-address">${escapeText(object.address)}</span></div>${fields}</div>`;
    }).join('')
    : `<div class="mem-empty">${tr('nenhum objeto criado', 'no object created')}</div>`;

  const pointing = scene.vars.some((variable) => variable.kind === 'ref' && !variable.pending && variable.target !== null);
  const error = scene.error ? `<div class="mem-error" role="alert">⚠ ${escapeText(scene.error)}</div>` : '';

  return `
    <div class="mem-stage">
      <div class="node-dimensions"><span>${tr('variáveis:', 'variables:')} ${scene.vars.length} ${tr('· objetos:', '· objects:')} ${scene.objects.length}</span></div>
      <div class="mem-board">
        <div class="mem-zone"><span class="mem-zone-label">${tr('Variáveis', 'Variables')}</span>${vars}</div>
        <span class="mem-arrow${pointing ? ' on' : ''}" aria-hidden="true">→</span>
        <div class="mem-zone"><span class="mem-zone-label">${tr('Memória', 'Memory')}</span>${objects}</div>
      </div>
      ${error}
    </div>`;
}

function renderNodes(scene, step, state, icons, escapeText) {
  const chipsFor = (target) => scene.refs
    .filter((ref) => ref.target === target)
    .map((ref) => `<span class="mem-chip${ref.cursor ? ' cursor' : ''}">${escapeText(variableName(ref.name))}</span>`)
    .join('');

  const cells = scene.nodes.map((item, position) => {
    const classes = ['mem-node'];
    if (hasIndex(step.processedIndices, item.id)) classes.push('processed');
    if (hasIndex(step.changedIndices, item.id)) classes.push('changed');
    if (hasIndex(step.activeIndices, item.id)) classes.push('active');
    if (hasIndex(step.foundIndices, item.id)) classes.push('found');
    if (item.state === 'lost') classes.push('lost');
    if (item.state === 'freed') classes.push('freed');
    if (step.bornNode === item.id) classes.push('born');
    if (state.inspectedItem === item.id) classes.push('inspected');

    const next = item.next === undefined ? '?' : item.next === null ? 'null' : '●';
    const nextClass = item.next === undefined ? ' pending' : item.next === null ? ' null' : ' linked';
    const lostTag = item.state === 'lost' ? `<span class="mem-node-tag">${tr('inacessível', 'unreachable')}</span>` : item.state === 'freed' ? `<span class="mem-node-tag">${tr('liberado', 'freed')}</span>` : '';
    const valueText = item.value === null ? '?' : escapeText(item.value);

    const box = `
      <div class="mem-node-box">
        <div class="mem-chips">${chipsFor(item.id)}</div>
        <button type="button" class="${classes.join(' ')}" data-module-action="inspect-item" data-index="${item.id}" aria-label="${tr('Nó', 'Node')} ${escapeText(item.id + 1)}${tr(', valor', ', value')} ${valueText}">
          <span class="mem-node-value">${valueText}</span><span class="mem-node-next${nextClass}">${next}</span>
        </button>
        <div class="mem-node-caption"><span>${tr('valor', 'value')}</span><span>${tr('próximo', 'next')}</span></div>
        ${lostTag}
      </div>`;

    const following = scene.nodes[position + 1];
    const isLast = position === scene.nodes.length - 1;
    let linked = false;
    if (following) linked = item.next === following.id;
    else if (isLast && scene.nullSlot) linked = item.next === null;
    const justLinked = linked && hasIndex(step.justLinked, item.id) ? ' just-linked' : '';
    const link = following || (isLast && scene.nullSlot)
      ? `<span class="mem-link${linked ? ' on' : ''}${justLinked}" aria-hidden="true">→</span>`
      : '';
    return `<div class="mem-node-line">${box}${link}</div>`;
  }).join('');

  const nullSlot = scene.nullSlot
    ? `<div class="mem-node-line"><div class="mem-node-box"><div class="mem-chips">${chipsFor(null)}</div><span class="mem-null">null</span></div></div>`
    : '';

  const inspected = state.inspectedItem !== null ? scene.nodes.find((item) => item.id === state.inspectedItem) : null;
  const inspection = inspected
    ? `<div class="inspection-card">${icons.info}<span>${tr('Nó selecionado', 'Selected node')}</span><strong>${escapeText(nodeSummary(inspected, scene))}</strong></div>`
    : '';

  return `
    <div class="mem-stage">
      <div class="node-dimensions"><span>${tr('nós na memória:', 'nodes in memory:')} ${scene.nodes.length}</span></div>
      <div class="node-scroll">
        <div class="mem-row">${cells}${nullSlot}</div>
      </div>
      <div class="node-legend" aria-label="${tr('Legenda', 'Legend')}">
        <span><i class="legend-dot current"></i> ${tr('atual', 'current')}</span>
        <span><i class="legend-dot compared"></i> ${tr('alterado', 'changed')}</span>
        <span><i class="legend-dot processed"></i> ${tr('processado', 'processed')}</span>
        <span><i class="legend-dot result"></i> ${tr('resultado', 'result')}</span>
      </div>
    </div>${inspection}`;
}

function nodeSummary(item, scene) {
  const target = item.next === undefined ? tr('indefinido', 'undefined') : item.next === null ? 'null' : tr(`nó ${scene.nodes.find((candidate) => candidate.id === item.next)?.value ?? '?'}`, `node ${scene.nodes.find((candidate) => candidate.id === item.next)?.value ?? '?'}`);
  return tr(`valor = ${item.value ?? '?'}, proximoNo = ${target}`, `value = ${item.value ?? '?'}, nextNode = ${target}`);
}

export const dynamicAllocationModule = {
  id: 'dynamic-allocation',
  name: tr('Alocação Dinâmica', 'Dynamic Allocation'),
  version: '1.0',
  visualizationTitle: tr('Variáveis, referências e nós na memória', 'Variables, references and nodes in memory'),
  defaultAlgorithmId: 'allocation',
  defaultData: DEFAULT_DATA,
  defaultRandomCount: NODE_COUNT,
  algorithms,
  buildSteps,

  isValidData(value) {
    return !!value && typeof value === 'object'
      && Array.isArray(value.values) && value.values.length === NODE_COUNT
      && value.values.every((item) => Number.isInteger(item) && Math.abs(item) <= MAX_ABS_VALUE);
  },

  sanitizeData(value) {
    if (this.isValidData(value)) return { values: [...value.values] };
    return { values: [...DEFAULT_DATA.values] };
  },

  formatData(data) {
    return data.values.join(', ');
  },

  createInitialConfig() {
    return {};
  },

  normalizeConfig() {
    return {};
  },

  renderEditor({ state, icons, escapeText }) {
    return `
      <div class="panel-heading compact-heading">
        <div><span class="eyebrow">${tr('Dados de entrada', 'Input data')}</span><h2 id="data-editor-title">${tr('Defina os valores dos nós', 'Set the node values')}</h2></div>
        <span class="size-badge">${NODE_COUNT} ${tr('nós', 'nodes')}</span>
      </div>
      <label class="field-label" for="node-input">${tr('Valores de n1, n2 e n3', 'Values of n1, n2 and n3')}</label>
      <div class="input-action-row">
        <input id="node-input" class="text-input ${state.inputError ? 'invalid' : ''}" value="${escapeText(state.draft)}" placeholder="42, 51, 63" aria-describedby="node-help node-error" data-module-input="draft" data-module-enter="apply" />
        <button class="button primary" type="button" data-module-action="apply-data">${icons.check}<span>${tr('Aplicar', 'Apply')}</span></button>
      </div>
      <p id="node-help" class="field-help">${tr('Informe três números inteiros separados por vírgula, espaço ou ponto e vírgula. Eles são usados nos algoritmos de nós encadeados (03 a 06).', 'Enter three integers separated by comma, space or semicolon. They are used in the linked node algorithms (03 to 06).')}</p>
      <p id="node-error" class="error-message" role="alert">${escapeText(state.inputError)}</p>
      <div class="random-row single">
        <button class="button secondary" type="button" data-module-action="random-data">${icons.shuffle}<span>${tr('Gerar valores aleatórios', 'Generate random values')}</span></button>
      </div>`;
  },

  renderConfig() {
    return '';
  },

  renderVisualization({ state, step, icons, escapeText }) {
    const { scene } = step;
    return scene.kind === 'objects'
      ? renderObjects(scene, step, escapeText)
      : renderNodes(scene, step, state, icons, escapeText);
  },

  handleInput(name, input, app) {
    if (name === 'draft') app.state.draft = input.value;
  },

  handleAction(action, button, app) {
    if (action === 'apply-data') {
      const parsed = parseNodeValues(app.state.draft);
      if (!parsed.values) {
        app.state.inputError = parsed.error;
        app.renderEditor();
        document.querySelector('#node-input')?.focus();
        return;
      }
      app.setData({ values: parsed.values });
      return;
    }

    if (action === 'random-data') {
      app.setData({ values: randomValues() });
      return;
    }

    if (action === 'inspect-item') {
      app.state.inspectedItem = Number(button.dataset.index);
      app.renderSimulation();
    }
  },
};
