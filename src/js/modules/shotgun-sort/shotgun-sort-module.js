import { algorithms, buildSteps, arrangements, MAX_ATTEMPTS } from './algorithms.js';
import { icons } from '../../core/icons.js';
import {
  legend, parseVector, randomVector, renderArray, renderCompare, renderInspection, renderPhase, renderStats, renderVectorEditor,
} from '../shared/sort-view.js';

const DEFAULT_VECTOR = [42, 15, 73, 28];
const MIN_ITEMS = 2;
const MAX_ITEMS = 8;
const LIMITS = {
  min: MIN_ITEMS,
  max: MAX_ITEMS,
  hint: `Use no máximo ${MAX_ITEMS} números: com mais elementos o Shotgun Sort quase nunca termina, porque são n! ordens possíveis.`,
};
const COMPARE_HINT = 'O par examinado por isOrdenado aparece aqui, com o resultado de vetor[i] &gt; vetor[i+1].';

const LEGEND_PAIR = ['pointer-i', 'i · par examinado (i e i+1)'];
const LEGEND_OK = ['sorted', 'em ordem até aqui'];
const LEGEND_BAD = ['warn', 'par fora de ordem'];
const LEGENDS = {
  'is-sorted': [LEGEND_PAIR, LEGEND_OK, LEGEND_BAD],
  'shotgun-sort': [LEGEND_PAIR, LEGEND_OK, LEGEND_BAD],
};

const ascending = (values) => [...values].sort((a, b) => a - b);

/** Vetor ordenado com um único par vizinho trocado (ou, às vezes, já ordenado). */
function almostSortedVector(count) {
  const values = ascending(randomVector(count));
  if (Math.random() < 0.2) return values;
  const at = Math.floor(Math.random() * (count - 1));
  [values[at], values[at + 1]] = [values[at + 1], values[at]];
  return values;
}

function renderOdds(step) {
  const parts = [];
  if (step.odds) {
    const { total, hit, chance } = step.odds;
    const winner = Math.floor(total * 0.37);
    const dots = total <= 144
      ? `<div class="sort-dots" role="img" aria-label="${total} ordens possíveis, uma delas ordenada">${Array.from({ length: total }, (_, index) => `<i class="sort-dot${index === winner ? ' hit' : ''}"></i>`).join('')}</div>`
      : '<div class="sort-odds-bar" role="img" aria-label="Uma ordem ordenada entre muitas"><i></i></div>';
    parts.push(`
      <div class="sort-odds">
        ${dots}
        <p class="sort-odds-caption"><strong>${total}</strong> ordens possíveis · <span class="hit">1</span> ordenada${hit ? ` · chance por tentativa: <strong>${chance}%</strong>` : ''}</p>
      </div>`);
  }
  if (step.table) {
    const rows = step.table.map((row) => `
      <div class="sort-table-row${row.mine ? ' mine' : ''}">
        <span>n = ${row.n}${row.mine ? ' <em>seu vetor</em>' : ''}</span>
        <span>${row.selection}</span>
        <span>${row.attempts}</span>
        <span>${row.time}</span>
      </div>`).join('');
    parts.push(`
      <div class="sort-table" role="table" aria-label="Custo por tamanho de entrada">
        <div class="sort-table-head"><span>Tamanho</span><span>Selection Sort<small>n(n−1)/2 comparações</small></span><span>Shotgun Sort<small>tentativas esperadas</small></span><span>Tempo estimado*<small>no Shotgun Sort</small></span></div>
        ${rows}
        <p class="sort-table-note">* supondo 1 milhão de tentativas por segundo, só para dar uma noção de escala.</p>
      </div>`);
  }
  return parts.join('');
}

export const shotgunSortModule = {
  id: 'shotgun-sort',
  name: 'Shotgun Sort',
  category: { name: 'Algoritmos', anchor: 'algoritmos' },
  version: '1.0',
  visualizationTitle: 'Vetor sendo embaralhado',
  defaultAlgorithmId: 'is-sorted',
  defaultData: DEFAULT_VECTOR,
  defaultRandomCount: 4,
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
    return {};
  },

  normalizeConfig(values, config) {
    return config;
  },

  renderEditor(context) {
    return renderVectorEditor(context, {
      ...LIMITS,
      placeholder: '42, 15, 73, 28',
      help: `Separe os valores por vírgula, espaço ou ponto e vírgula. De ${MIN_ITEMS} a ${MAX_ITEMS} números: com n elementos são esperadas n! tentativas (n = 4 → 24, n = 6 → 720, n = 8 → 40.320).`,
    });
  },

  renderConfig({ state }) {
    const heading = (title) => `<div class="panel-heading compact-heading"><div><span class="eyebrow">Parâmetros</span><h2 id="config-title">${title}</h2></div></div>`;
    const sortedButton = `<button class="button secondary" type="button" data-module-action="make-sorted">${icons.check}<span>Usar vetor ordenado</span></button>`;

    if (state.algorithmId === 'is-sorted') {
      return `
        ${heading('Teste casos diferentes')}
        <div class="config-note-row">
          <p>Num vetor ordenado a função percorre todos os pares; num quase ordenado ela anda até o par trocado e para ali.</p>
          <div class="config-buttons">
            ${sortedButton}
            <button class="button secondary" type="button" data-module-action="make-almost-sorted">${icons.shuffle}<span>Quase ordenado</span></button>
          </div>
        </div>`;
    }

    if (state.algorithmId === 'shotgun-sort') {
      const total = arrangements(state.data);
      return `
        ${heading('Cada execução é um sorteio novo')}
        <div class="config-note-row">
          <p>Com ${state.data.length} elementos a média esperada é de ${total.toLocaleString('pt-BR')} tentativas; a simulação para em ${MAX_ATTEMPTS}. Um vetor já ordenado termina na primeira verificação.</p>
          <div class="config-buttons">
            <button class="button secondary" type="button" data-module-action="new-run">${icons.restart}<span>Sortear outra execução</span></button>
            ${sortedButton}
          </div>
        </div>`;
    }

    return '';
  },

  renderVisualization({ state, step, escapeText }) {
    const { algorithmId } = state;
    const showCompare = algorithmId === 'is-sorted' || algorithmId === 'shotgun-sort';
    return `
      <div class="sort-stage">
        ${renderPhase(step, escapeText)}
        ${renderArray(step, state, escapeText)}
        ${showCompare ? renderCompare(step, escapeText, COMPARE_HINT) : ''}
        ${algorithmId === 'shotgun-sort' ? renderStats(step) : ''}
        ${algorithmId === 'why-worst' ? renderOdds(step) : legend(LEGENDS[algorithmId])}
      </div>${renderInspection(step, state, escapeText)}`;
  },

  handleInput(name, input, app) {
    if (name === 'draft') {
      app.state.draft = input.value;
    } else if (name === 'random-count') {
      app.state.randomCount = Number(input.value);
      document.querySelector('#random-count-output').textContent = input.value;
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

    if (action === 'random-data') {
      const { randomCount } = app.state;
      app.setData(app.state.algorithmId === 'is-sorted' ? almostSortedVector(randomCount) : randomVector(randomCount));
      return;
    }

    if (action === 'make-sorted') {
      app.setData(ascending(app.state.data));
      return;
    }

    if (action === 'make-almost-sorted') {
      app.setData(almostSortedVector(app.state.data.length));
      return;
    }

    if (action === 'new-run') {
      app.rebuildSteps();
      return;
    }

    if (action === 'inspect-item') {
      app.state.inspectedItem = Number(button.dataset.index);
      app.renderSimulation();
    }
  },
};
