import { algorithms, buildSteps, buildOpenTable, DELETADO } from './algorithms.js';
import { hasIndex } from '../../core/utils.js';

const MIN_CAPACITY = 5;
const MAX_CAPACITY = 12;
const MAX_KEY = 999;
const MAX_VALUE_LENGTH = 12;
const NAMES = ['Ana', 'Bia', 'Caio', 'Duda', 'Edu', 'Fabi', 'Gabi', 'Hugo', 'Iara', 'João', 'Lia', 'Malu', 'Nina', 'Otto'];

const DEFAULT_DATA = {
  capacity: 10,
  entries: [
    { chave: 36, valor: 'Ana' },
    { chave: 56, valor: 'Bia' },
    { chave: 10, valor: 'Caio' },
    { chave: 22, valor: 'Duda' },
    { chave: 72, valor: 'Edu' },
    { chave: 49, valor: 'Fabi' },
  ],
};

const isKey = (value) => Number.isInteger(value) && value >= 0 && value <= MAX_KEY;
const maxEntries = (capacity) => capacity - 1;
const countLabel = (entries) => {
  const removed = entries.filter((entry) => entry.removida).length;
  const active = entries.length - removed;
  return `${active} entrada${active === 1 ? '' : 's'}${removed ? ` + ${removed} removida${removed === 1 ? '' : 's'}` : ''}`;
};
const hashOf = (chave, capacity) => Math.abs(chave) % capacity;

function parseEntries(text, capacity) {
  const rawTokens = String(text).split(/[;,\n]+/).map((token) => token.trim()).filter(Boolean)
    .flatMap((token) => (/^\d+(\s+\d+)+$/.test(token) ? token.split(/\s+/) : [token]));
  const entries = [];
  for (const token of rawTokens) {
    const match = token.match(/^(~)?\s*(\d+)\s*(?:[:=]\s*(.+))?$/);
    if (!match) return { error: 'Use pares chave:valor, por exemplo 36:Ana. A chave é um número inteiro.' };
    const removida = Boolean(match[1]);
    const chave = Number(match[2]);
    const valor = (match[3] ?? 'valor').trim();
    if (!isKey(chave)) return { error: `A chave deve ser um inteiro entre 0 e ${MAX_KEY}.` };
    if (!valor || valor.length > MAX_VALUE_LENGTH) return { error: `O valor deve ter de 1 a ${MAX_VALUE_LENGTH} caracteres.` };
    entries.push(removida ? { chave, valor, removida } : { chave, valor });
  }
  if (new Set(entries.map((entry) => entry.chave)).size !== entries.length) {
    return { error: 'Não repita chaves: cada chave aparece uma única vez na tabela.' };
  }
  if (entries.length > maxEntries(capacity)) {
    return { error: `Com capacidade ${capacity}, use no máximo ${maxEntries(capacity)} entradas (sempre sobra ao menos uma posição null).` };
  }
  return { entries };
}

function shuffled(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[other]] = [copy[other], copy[index]];
  }
  return copy;
}

function randomData(capacity) {
  const limit = Math.min(maxEntries(capacity), 8);
  const count = Math.min(limit, 4 + Math.floor(Math.random() * 5));
  const multipliers = Math.min(10, Math.floor((MAX_KEY + 1) / capacity));
  const names = shuffled(NAMES);
  const homes = [];
  const used = new Set();
  const entries = [];
  while (entries.length < count) {
    const reuse = homes.length > 0 && Math.random() < 0.55;
    const home = reuse ? homes[Math.floor(Math.random() * homes.length)] : Math.floor(Math.random() * capacity);
    const chave = home + capacity * Math.floor(Math.random() * multipliers);
    if (used.has(chave)) continue;
    used.add(chave);
    homes.push(home);
    entries.push({ chave, valor: names[entries.length] });
  }
  const table = buildOpenTable(entries, capacity);
  const followed = entries.filter((entry) => {
    const index = table.findIndex((cell) => cell && cell.chave === entry.chave);
    return table[(index + 1) % capacity] !== null;
  });
  if (entries.length >= 5 && followed.length && Math.random() < 0.7) {
    followed[Math.floor(Math.random() * followed.length)].removida = true;
  }
  return { capacity, entries };
}

function defaultConfig(data) {
  const { capacity, entries } = data;
  const table = buildOpenTable(entries, capacity);
  let key = entries.length ? entries[entries.length - 1].chave : 0;
  let farthest = -1;
  table.forEach((cell, index) => {
    if (!cell || cell === DELETADO) return;
    const distance = (index - hashOf(cell.chave, capacity) + capacity) % capacity;
    if (distance > farthest) {
      farthest = distance;
      key = cell.chave;
    }
  });
  const taken = new Set(entries.map((entry) => entry.chave));
  let newKey = hashOf(key, capacity);
  while (taken.has(newKey) && newKey <= MAX_KEY) newKey += capacity;
  if (newKey > MAX_KEY) newKey = Array.from({ length: MAX_KEY + 1 }, (_, value) => value).find((value) => !taken.has(value)) ?? 0;
  const usedValues = new Set(entries.map((entry) => entry.valor));
  const value = NAMES.find((name) => !usedValues.has(name)) ?? 'valor';
  return { key, newKey, value };
}

function cellStates(step, index) {
  const classes = [];
  if (hasIndex(step.processedCells, index)) classes.push('processed');
  if (hasIndex(step.changedCells, index)) classes.push('changed');
  if (hasIndex(step.activeCells, index)) classes.push('active');
  if (hasIndex(step.foundCells, index)) classes.push('found');
  if (hasIndex(step.collisionCells, index)) classes.push('collision');
  return classes;
}

function chipsHtml(markers, at, escapeText, names = null) {
  return markers.filter((marker) => marker.at === at && (!names || names.includes(marker.name)))
    .map((marker) => `<span class="mem-chip${marker.name === 'original' ? ' cursor' : ''}">${escapeText(marker.name)}</span>`)
    .join('');
}

const legend = `
  <div class="node-legend" aria-label="Legenda">
    <span><i class="legend-dot current"></i> atual</span>
    <span><i class="legend-dot compared"></i> alterado</span>
    <span><i class="legend-dot processed"></i> processado</span>
    <span><i class="legend-dot result"></i> resultado</span>
    <span><i class="legend-dot collision"></i> colisão</span>
  </div>`;

function renderOpen(scene, step, escapeText) {
  const filled = scene.cells.filter((cell) => cell && cell !== DELETADO).length;
  const deletedCount = scene.cells.filter((cell) => cell === DELETADO).length;
  const slots = scene.cells.map((cell, index) => {
    const classes = ['hash-cell', ...cellStates(step, index)];
    let content;
    let tag = 'div';
    let attrs = '';
    if (cell === null) {
      classes.push('empty');
      content = '<span class="hash-null">null</span>';
    } else if (cell === DELETADO) {
      classes.push('deleted');
      content = '<span class="hash-del">DEL</span>';
    } else {
      tag = 'button';
      attrs = ` type="button" data-module-action="pick-key" data-key="${cell.chave}" aria-label="Posição ${index}, chave ${cell.chave}, valor ${escapeText(cell.valor)}"`;
      content = `<strong>${cell.chave}</strong><small>${escapeText(cell.valor)}</small>`;
    }
    if (step.bornTable) classes.push('born');
    return `
      <div class="hash-slot">
        <div class="hash-slot-chip top">${chipsHtml(scene.markers, index, escapeText, ['indice'])}</div>
        <${tag} class="${classes.join(' ')}"${attrs}>${content}</${tag}>
        <span class="hash-index">${index}</span>
        <div class="hash-slot-chip bottom">${chipsHtml(scene.markers, index, escapeText, ['original'])}</div>
      </div>`;
  }).join('');

  const body = scene.cells.length
    ? `<div class="node-scroll"><div class="hash-open-row">${slots}</div></div>`
    : `<div class="mem-empty">A tabela ainda não foi criada (capacidade ${scene.capacity}).</div>`;
  const info = [
    scene.i === null ? '' : `<span>i = <strong>${scene.i}</strong></span>`,
    scene.deleted ? '<span>DELETADO = <strong>{-1 = ""}</strong></span>' : '',
  ].filter(Boolean).join('');

  return `
    <div class="mem-stage">
      <div class="node-dimensions"><span>capacidade: ${scene.capacity} · entradas: ${filled}${deletedCount ? ` · deletados: ${deletedCount}` : ''}</span></div>
      ${body}
      ${info ? `<div class="hash-info">${info}</div>` : ''}
      ${legend}
    </div>`;
}

function renderChain(scene, step, escapeText) {
  const total = scene.buckets.reduce((sum, list) => sum + (list ? list.length : 0), 0);
  const rows = scene.buckets.map((list, bucket) => {
    const classes = ['hash-bucket'];
    if (hasIndex(step.activeBuckets, bucket)) classes.push('active');
    if (hasIndex(step.processedBuckets, bucket)) classes.push('processed');
    if (hasIndex(step.changedBuckets, bucket)) classes.push('changed');
    if (step.bornTable) classes.push('born');

    const head = list === null
      ? '<span class="hash-bucket-head null">null</span>'
      : `<span class="hash-bucket-head${step.bornBucket === bucket ? ' born' : ''}">lista</span>`;

    let entries = '';
    if (list && list.length === 0) {
      entries = '<span class="hash-empty-list">[]</span>';
    } else if (list) {
      entries = list.map((entry, position) => {
        const id = `${bucket}:${position}`;
        const entryClasses = ['hash-entry'];
        if (hasIndex(step.activeEntries, id)) entryClasses.push('active');
        if (hasIndex(step.foundEntries, id)) entryClasses.push('found');
        if (hasIndex(step.changedEntries, id)) entryClasses.push('changed');
        return `<span class="hash-chain-arrow" aria-hidden="true">→</span><button type="button" class="${entryClasses.join(' ')}" data-module-action="pick-key" data-key="${entry.chave}" aria-label="Lista ${bucket}, chave ${entry.chave}, valor ${escapeText(entry.valor)}"><strong>${entry.chave}</strong><small>${escapeText(entry.valor)}</small></button>`;
      }).join('');
    }

    return `
      <div class="${classes.join(' ')}">
        <span class="hash-bucket-mark">${chipsHtml(scene.markers, bucket, escapeText)}</span>
        <span class="hash-index">${bucket}</span>
        ${head}${entries}
      </div>`;
  }).join('');

  return `
    <div class="mem-stage">
      <div class="node-dimensions"><span>capacidade: ${scene.capacity} · entradas: ${total}</span></div>
      <div class="node-scroll"><div class="hash-chain-rows">${rows}</div></div>
      ${legend}
    </div>`;
}

function renderEntry(scene, step, escapeText) {
  const field = (name, value) => `<div class="mem-object-field${step.changedField === name ? ' changed' : ''}"><span>${name}</span><strong>${value === null ? '—' : escapeText(value)}</strong></div>`;
  const text = scene.chave !== null && scene.valor !== null ? `{${scene.chave} = ${scene.valor}}` : '—';
  return `
    <div class="mem-stage">
      <div class="node-dimensions"><span>uma entrada da tabela</span></div>
      <div class="mem-object">
        <div class="mem-object-head"><span>EntradaChaveValor</span></div>
        ${field('chave', scene.chave)}
        ${field('valor', scene.valor)}
        <div class="mem-object-field"><span>toString()</span><strong>${escapeText(text)}</strong></div>
      </div>
    </div>`;
}

export const hashTableModule = {
  id: 'hash-tables',
  name: 'Tabelas Hash',
  version: '1.0',
  visualizationTitle: 'Tabela hash na memória',
  defaultAlgorithmId: 'entry',
  defaultData: DEFAULT_DATA,
  defaultRandomCount: 6,
  algorithms,
  buildSteps,

  isValidData(value) {
    if (!value || typeof value !== 'object' || !Array.isArray(value.entries)) return false;
    const { capacity, entries } = value;
    if (!Number.isInteger(capacity) || capacity < MIN_CAPACITY || capacity > MAX_CAPACITY) return false;
    if (entries.length > maxEntries(capacity)) return false;
    if (!entries.every((entry) => entry && isKey(entry.chave) && typeof entry.valor === 'string' && entry.valor.length > 0 && entry.valor.length <= MAX_VALUE_LENGTH)) return false;
    return new Set(entries.map((entry) => entry.chave)).size === entries.length;
  },

  sanitizeData(value) {
    if (this.isValidData(value)) {
      return { capacity: value.capacity, entries: value.entries.map((entry) => (entry.removida ? { chave: entry.chave, valor: entry.valor, removida: true } : { chave: entry.chave, valor: entry.valor })) };
    }
    return { capacity: DEFAULT_DATA.capacity, entries: DEFAULT_DATA.entries.map((entry) => ({ ...entry })) };
  },

  formatData(data) {
    return data.entries.map((entry) => `${entry.removida ? '~' : ''}${entry.chave}:${entry.valor}`).join(', ');
  },

  createInitialConfig(data) {
    return defaultConfig(data);
  },

  normalizeConfig(data, config) {
    const fallback = defaultConfig(data);
    const toKey = (value, backup) => (isKey(Number(value)) && String(value).trim() !== '' ? Number(value) : backup);
    return {
      key: toKey(config.key, fallback.key),
      newKey: toKey(config.newKey, fallback.newKey),
      value: String(config.value ?? '').trim().slice(0, MAX_VALUE_LENGTH) || 'valor',
    };
  },

  renderEditor({ state, icons, escapeText }) {
    const { capacity, entries } = state.data;
    return `
      <div class="panel-heading compact-heading">
        <div><span class="eyebrow">Dados de entrada</span><h2 id="data-editor-title">Monte a tabela</h2></div>
        <span id="entry-count" class="size-badge">${countLabel(entries)}</span>
      </div>
      <label class="field-label" for="node-input">Entradas chave:valor, na ordem de inserção</label>
      <div class="input-action-row">
        <input id="node-input" class="text-input ${state.inputError ? 'invalid' : ''}" value="${escapeText(state.draft)}" placeholder="36:Ana, 56:Bia, 10:Caio" aria-describedby="node-help node-error" data-module-input="draft" data-module-enter="apply" />
        <button class="button primary" type="button" data-module-action="apply-data">${icons.check}<span>Aplicar</span></button>
      </div>
      <p id="node-help" class="field-help">Chaves inteiras de 0 a ${MAX_KEY}, sem repetir; sem o valor, usa-se "valor". Prefixe com ~ uma entrada já removida (no endereçamento aberto a posição vira DELETADO), ex.: ~22:Duda. Máximo: capacidade − 1 entradas, para sempre sobrar uma posição null. A tabela inicial é montada inserindo as entradas nessa ordem.</p>
      <p id="node-error" class="error-message" role="alert">${escapeText(state.inputError)}</p>
      <div class="random-row">
        <label for="capacity-input">Capacidade</label>
        <input id="capacity-input" type="range" min="${MIN_CAPACITY}" max="${MAX_CAPACITY}" value="${capacity}" data-module-input="capacity" />
        <output id="capacity-output">${capacity}</output>
        <button class="button secondary" type="button" data-module-action="random-data">${icons.shuffle}<span>Gerar tabela aleatória</span></button>
      </div>`;
  },

  renderConfig({ state, escapeText }) {
    const { algorithmId, config } = state;
    const keyField = (id, label, field, hint) => `<label class="config-field"><span>${label}</span><input id="${id}" type="number" min="0" max="${MAX_KEY}" value="${config[field]}" data-module-input="${field}" /><small>${hint}</small></label>`;
    const valueField = `<label class="config-field"><span>Valor</span><input id="value-input" type="text" maxlength="${MAX_VALUE_LENGTH}" value="${escapeText(config.value)}" data-module-input="value" /><small>Texto associado à chave.</small></label>`;
    const heading = (title) => `<div class="panel-heading compact-heading"><div><span class="eyebrow">Parâmetros</span><h2 id="config-title">${title}</h2></div></div>`;

    if (algorithmId === 'entry' || algorithmId === 'oaAdd' || algorithmId === 'scAdd') {
      return `${heading('Escolha a chave e o valor')}
        <div class="config-grid">
          ${keyField('key-input', 'Chave', 'newKey', 'Clique em uma entrada da tabela para usar a chave dela e ver a atualização.')}
          ${valueField}
        </div>`;
    }
    if (algorithmId === 'hash' || algorithmId === 'oaSearch' || algorithmId === 'oaRemove' || algorithmId === 'scSearch' || algorithmId === 'scRemove') {
      const title = algorithmId === 'hash' ? 'Escolha a chave' : algorithmId.endsWith('Search') ? 'Escolha a chave a buscar' : 'Escolha a chave a remover';
      return `${heading(title)}
        ${keyField('key-input', 'Chave', 'key', 'Clique em uma entrada da tabela para usar a chave dela.')}`;
    }
    return '';
  },

  renderVisualization({ step, escapeText }) {
    const { scene } = step;
    if (scene.kind === 'open') return renderOpen(scene, step, escapeText);
    if (scene.kind === 'chain') return renderChain(scene, step, escapeText);
    return renderEntry(scene, step, escapeText);
  },

  handleInput(name, input, app) {
    if (name === 'draft') {
      app.state.draft = input.value;
      return;
    }
    if (name === 'capacity') {
      const capacity = Math.max(MIN_CAPACITY, Math.min(MAX_CAPACITY, Number(input.value)));
      const entries = app.state.data.entries.slice(0, maxEntries(capacity));
      app.state.data = { capacity, entries };
      app.state.draft = this.formatData(app.state.data);
      app.state.inputError = '';
      document.querySelector('#capacity-output').textContent = capacity;
      document.querySelector('#node-input').value = app.state.draft;
      document.querySelector('#node-error').textContent = '';
      document.querySelector('#entry-count').textContent = countLabel(entries);
      app.rebuildSteps();
      return;
    }
    if (name === 'key' || name === 'newKey' || name === 'value') {
      app.state.config[name] = input.value;
      app.rebuildSteps();
    }
  },

  handleAction(action, button, app) {
    if (action === 'apply-data') {
      const parsed = parseEntries(app.state.draft, app.state.data.capacity);
      if (!parsed.entries) {
        app.state.inputError = parsed.error;
        app.renderEditor();
        document.querySelector('#node-input')?.focus();
        return;
      }
      const data = { capacity: app.state.data.capacity, entries: parsed.entries };
      app.state.config = defaultConfig(data);
      app.setData(data);
      return;
    }

    if (action === 'random-data') {
      const data = randomData(app.state.data.capacity);
      app.state.config = defaultConfig(data);
      app.setData(data);
      return;
    }

    if (action === 'pick-key') {
      const chave = Number(button.dataset.key);
      app.state.config.key = chave;
      app.state.config.newKey = chave;
      app.renderConfig();
      app.rebuildSteps();
    }
  },
};
