import {
  DEFAULT_DATA, LIMITS, SLIDE_SORTED, SLIDE_UNSORTED, algorithms, buildSteps,
} from './algorithms.js';
import { renderCases, renderGrowth, renderRace } from './views.js';
import { renderAction, renderCallStack } from '../recursion/views.js';
import { icons } from '../../core/icons.js';
import {
  legend, randomVector, renderArray, renderCompare, renderInspection, renderPhase, renderStats, renderVectorEditor,
} from '../shared/sort-view.js';
import { tr } from '../../core/i18n.js';

const fmtN = (value) => value.toLocaleString(tr('pt-BR', 'en-US'));

/** Os simuladores que procuram um valor (os outros só dependem do vetor ou do tamanho). */
const HAS_TARGET = ['sequencial', 'ordenada', 'iterativa', 'recursiva', 'comparacao'];
const SORTED = ['ordenada', 'iterativa', 'recursiva', 'comparacao', 'casos'];

const HINTS = {
  sequencial: tr('A comparação vetor[i] = valorProcurado aparece aqui.', 'The comparison array[i] = target appears here.'),
  ordenada: tr('As comparações vetor[i] = valorProcurado e vetor[i] &gt; valorProcurado aparecem aqui.', 'The comparisons array[i] = target and array[i] &gt; target appear here.'),
  iterativa: tr('Os testes inicio &lt;= fim e valorProcurado com vetor[centro] aparecem aqui.', 'The tests start &lt;= end and target against array[mid] appear here.'),
  recursiva: tr('Os testes inicio &gt; fim e vetor[meio] com valorProcurado aparecem aqui.', 'The tests start &gt; end and array[mid] against target appear here.'),
};

const LEGEND_FOUND = ['result', tr('valor encontrado', 'value found')];
const LEGEND_RANGE = ['warn', tr('início e fim · limites dos candidatos', 'start and end · limits of the candidates')];
const LEGENDS = {
  sequencial: [['pointer-i', tr('i · índice do laço', 'i · loop index')], ['current', tr('posição examinada', 'position examined')], LEGEND_FOUND, ['outside', tr('já examinada e descartada', 'already examined and discarded')]],
  ordenada: [['pointer-i', tr('i · índice do laço', 'i · loop index')], ['current', tr('posição examinada', 'position examined')], LEGEND_FOUND, ['outside', tr('já examinada e descartada', 'already examined and discarded')]],
  iterativa: [LEGEND_RANGE, ['compared', tr('centro · posição examinada', 'mid · position examined')], LEGEND_FOUND, ['outside', tr('descartada (fora de início..fim)', 'discarded (outside start..end)')]],
  recursiva: [LEGEND_RANGE, ['compared', tr('meio · posição examinada', 'mid · position examined')], LEGEND_FOUND, ['outside', tr('descartada (fora de início..fim)', 'discarded (outside start..end)')]],
  comparacao: [['current', tr('posição examinada na rodada', 'position examined in the round')], LEGEND_FOUND, ['outside', tr('já examinada ou descartada', 'already examined or discarded')]],
  casos: [LEGEND_FOUND],
};

const PRESETS = {
  sequencial: [
    [tr('Slides 6 a 14 · procurar 62', 'Slides 6 to 14 · search for 62'), { vetor: SLIDE_UNSORTED, alvo: 62 }],
    [tr('Melhor caso · o 1º (85)', 'Best case · the first (85)'), { vetor: SLIDE_UNSORTED, alvo: 85 }],
    [tr('Pior caso · ausente (50)', 'Worst case · missing (50)'), { vetor: SLIDE_UNSORTED, alvo: 50 }],
  ],
  ordenada: [
    [tr('Slides 23 a 30 · procurar 65', 'Slides 23 to 30 · search for 65'), { vetor: SLIDE_SORTED, alvo: 65 }],
    [tr('Valor existente (62)', 'Existing value (62)'), { vetor: SLIDE_SORTED, alvo: 62 }],
    [tr('Maior que todos (100)', 'Larger than all (100)'), { vetor: SLIDE_SORTED, alvo: 100 }],
  ],
  iterativa: [
    [tr('Slide 33 · procurar 56', 'Slide 33 · search for 56'), { vetor: SLIDE_SORTED, alvo: 56 }],
    [tr('Slide 35 · procurar 73', 'Slide 35 · search for 73'), { vetor: SLIDE_SORTED, alvo: 73 }],
    [tr('Melhor caso · o centro (48)', 'Best case · the middle (48)'), { vetor: SLIDE_SORTED, alvo: 48 }],
  ],
  casos: [[tr('Vetor dos slides 33 e 35', 'Array from slides 33 and 35'), { vetor: SLIDE_SORTED }]],
  crescimento: [10, 100, 1000, 1000000, 1000000000].map((n) => [`n = ${fmtN(n)}`, { tamanho: n }]),
};
PRESETS.recursiva = PRESETS.iterativa;
PRESETS.comparacao = PRESETS.iterativa;

function parseVector(text) {
  const { min, max } = LIMITS.vetor;
  const tokens = text.split(/[;,\s]+/).filter(Boolean);
  if (tokens.length < min) return { error: tr(`Digite pelo menos ${min} números para haver onde buscar.`, `Enter at least ${min} numbers so there is somewhere to search.`) };
  if (tokens.length > max) return { error: tr(`Use no máximo ${max} números para manter a visualização legível.`, `Use at most ${max} numbers to keep the visualization readable.`) };
  const values = tokens.map(Number);
  if (values.some((value) => !Number.isFinite(value))) return { error: tr('Use apenas números separados por espaço, vírgula ou ponto e vírgula.', 'Use only numbers separated by space, comma or semicolon.') };
  return { values };
}

/** Um valor para procurar: um elemento do vetor (na maioria das vezes) ou um valor que não está nele. */
function randomTarget(values) {
  if (Math.random() < 0.7) return values[Math.floor(Math.random() * values.length)];
  let candidate;
  do candidate = 10 + Math.floor(Math.random() * 90); while (values.includes(candidate));
  return candidate;
}

const clampSize = (value) => Math.max(LIMITS.tamanho.min, Math.min(LIMITS.tamanho.max, Math.round(value)));

export const searchesModule = {
  id: 'buscas',
  name: tr('Buscas', 'Searching'),
  category: { name: tr('Algoritmos', 'Algorithms'), anchor: 'algoritmos' },
  version: '1.0',
  visualizationTitle: tr('Busca no vetor', 'Search in the array'),
  defaultAlgorithmId: 'sequencial',
  defaultData: DEFAULT_DATA,
  defaultRandomCount: 10,
  algorithms,
  buildSteps,
  codeScroll: true,

  isValidData(value) {
    return Boolean(value) && Array.isArray(value.vetor) && Number.isFinite(value.alvo) && Number.isInteger(value.tamanho);
  },

  sanitizeData(value) {
    const data = this.isValidData(value) ? value : DEFAULT_DATA;
    const vector = data.vetor.length >= LIMITS.vetor.min && data.vetor.length <= LIMITS.vetor.max && data.vetor.every(Number.isFinite);
    return {
      vetor: vector ? [...data.vetor] : [...DEFAULT_DATA.vetor],
      alvo: data.alvo,
      tamanho: clampSize(data.tamanho),
    };
  },

  formatData(data) {
    return data.vetor.join(', ');
  },

  createInitialConfig() {
    return {};
  },

  normalizeConfig(values, config) {
    return { ...config };
  },

  renderEditor(context) {
    const { state, escapeText } = context;
    const id = state.algorithmId;
    const presets = PRESETS[id].map(([text], index) => `<button class="button secondary compact" type="button" data-module-action="preset" data-index="${index}">${escapeText(text)}</button>`).join('');
    const examples = `<div class="preset-row"><span>${tr('Exemplos', 'Examples')}</span>${presets}</div>`;

    if (id === 'crescimento') {
      const { min, max } = LIMITS.tamanho;
      return `
        <div class="panel-heading compact-heading">
          <div><span class="eyebrow">${tr('Dados de entrada', 'Input data')}</span><h2 id="data-editor-title">${tr('Escolha o tamanho do vetor', 'Choose the size of the array')}</h2></div>
          <span class="size-badge">n = ${fmtN(state.data.tamanho)}</span>
        </div>
        <label class="field-label" for="size-input">${tr('Tamanho n do vetor', 'Size n of the array')}</label>
        <div class="input-action-row">
          <input id="size-input" class="text-input" type="number" inputmode="numeric" min="${min}" max="${max}" step="1" value="${state.data.tamanho}" aria-describedby="size-help" data-module-input="tamanho" />
          <button class="button secondary" type="button" data-module-action="random-data">${icons.shuffle}<span>${tr('Sortear n', 'Random n')}</span></button>
        </div>
        <p id="size-help" class="field-help">${tr(`De ${fmtN(min)} a ${fmtN(max)}. O vetor não é desenhado: o simulador só conta quantos candidatos sobram a cada comparação.`, `From ${fmtN(min)} to ${fmtN(max)}. The array is not drawn: the simulator just counts how many candidates are left after each comparison.`)}</p>
        ${examples}`;
    }

    const sorted = SORTED.includes(id);
    const help = sorted
      ? tr(`Separe os valores por vírgula, espaço ou ponto e vírgula. De ${LIMITS.vetor.min} a ${LIMITS.vetor.max} números. Esta busca exige um vetor ordenado: os números que você digitar são ordenados.`, `Separate the values by comma, space or semicolon. From ${LIMITS.vetor.min} to ${LIMITS.vetor.max} numbers. This search requires a sorted array: the numbers you type are sorted.`)
      : tr(`Separe os valores por vírgula, espaço ou ponto e vírgula. De ${LIMITS.vetor.min} a ${LIMITS.vetor.max} números, em qualquer ordem.`, `Separate the values by comma, space or semicolon. From ${LIMITS.vetor.min} to ${LIMITS.vetor.max} numbers, in any order.`);
    return `${renderVectorEditor(context, {
      ...LIMITS.vetor, placeholder: SLIDE_UNSORTED.join(', '), help, size: state.data.vetor.length,
    })}${examples}`;
  },

  renderConfig({ state }) {
    if (!HAS_TARGET.includes(state.algorithmId)) return '';
    return `
      <div class="panel-heading compact-heading"><div><span class="eyebrow">${tr('Parâmetros', 'Parameters')}</span><h2 id="config-title">${tr('Escolha o valor procurado', 'Choose the target value')}</h2></div></div>
      <label class="config-field"><span>${tr('Valor procurado', 'Target value')}</span><input id="target-input" type="number" step="any" value="${state.data.alvo}" data-module-input="alvo" /><small>${tr('Pode ser um valor do vetor ou não: se ele não estiver no vetor, a busca devolve -1.', 'It can be a value from the array or not: if it is not in the array, the search returns -1.')}</small></label>`;
  },

  renderVisualization({ state, step, escapeText }) {
    const id = state.algorithmId;
    const legendHtml = legend(LEGENDS[id] ?? []);

    if (id === 'comparacao') return renderRace(step, escapeText, legendHtml);
    if (id === 'crescimento') return `<div class="sort-stage">${renderStats(step)}${renderGrowth(step)}</div>`;
    if (id === 'casos') {
      return `
        <div class="sort-stage">
          ${renderArray(step, state, escapeText)}
          ${legendHtml}
          ${renderCases(step, escapeText)}
        </div>${renderInspection(step, state, escapeText)}`;
    }

    if (id === 'recursiva') {
      return `
        <div class="cs-stage">
          <div class="cs-top">
            ${renderArray(step, state, escapeText, { stacked: true })}
            ${renderCompare(step, escapeText, HINTS.recursiva)}
            ${legendHtml}
            ${renderInspection(step, state, escapeText)}
          </div>
          <div class="cs-body"><div class="cs-main">${renderAction(step, escapeText)}${renderStats(step)}</div>${renderCallStack(step, escapeText)}</div>
        </div>`;
    }

    return `
      <div class="sort-stage">
        ${id === 'iterativa' ? renderPhase(step, escapeText) : ''}
        ${renderArray(step, state, escapeText, { stacked: id === 'iterativa' })}
        ${renderCompare(step, escapeText, HINTS[id])}
        ${renderStats(step)}
        ${legendHtml}
      </div>${renderInspection(step, state, escapeText)}`;
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
      case 'alvo': {
        const value = Number(input.value);
        if (input.value === '' || !Number.isFinite(value)) break;
        app.state.data = { ...app.state.data, alvo: value };
        app.rebuildSteps();
        break;
      }
      case 'tamanho': {
        const value = Number(input.value);
        if (input.value === '' || !Number.isFinite(value)) break;
        const clamped = clampSize(value);
        if (clamped !== value) input.value = clamped;
        app.state.data = { ...app.state.data, tamanho: clamped };
        app.rebuildSteps();
        document.querySelector('.size-badge').textContent = `n = ${fmtN(clamped)}`;
        break;
      }
      default:
        break;
    }
  },

  handleAction(action, button, app) {
    const id = app.state.algorithmId;

    if (action === 'apply-data') {
      const parsed = parseVector(app.state.draft);
      if (!parsed.values) {
        app.state.inputError = parsed.error;
        app.renderEditor();
        document.querySelector('#vector-input')?.focus();
        return;
      }
      app.setData({ ...app.state.data, vetor: parsed.values });
      return;
    }

    if (action === 'preset') {
      app.setData({ ...app.state.data, ...PRESETS[id][Number(button.dataset.index)][1] });
      return;
    }

    if (action === 'random-data') {
      if (!button) {
        app.setData(DEFAULT_DATA);
        return;
      }
      if (id === 'crescimento') {
        app.setData({ ...app.state.data, tamanho: clampSize(10 ** (Math.random() * 9)) });
        return;
      }
      const vetor = randomVector(app.state.randomCount);
      app.setData({ ...app.state.data, vetor, alvo: randomTarget(vetor) });
      return;
    }

    if (action === 'inspect-item') {
      app.state.inspectedItem = Number(button.dataset.index);
      app.renderSimulation();
    }
  },
};
