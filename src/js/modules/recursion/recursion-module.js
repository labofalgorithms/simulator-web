import {
  DEFAULT_DATA, LIMITS, STACK_LIMIT, WORDS, algorithms, buildSteps,
} from './algorithms.js';
import {
  renderAction, renderCallStack, renderChars, renderExpression, renderStrip,
} from './views.js';
import { icons } from '../../core/icons.js';
import { renderTotals } from '../shared/recursion-view.js';
import {
  legend, randomVector, renderArray, renderCompare, renderInspection, renderStats,
} from '../shared/sort-view.js';
import { tr } from '../../core/i18n.js';

const COMPARE_HINT = tr('A comparação v[i] &gt; maiorResto aparece aqui.', 'The comparison v[i] &gt; largestRest appears here.');

const LEGENDS = {
  maior: [
    ['pointer-i', tr('i · último elemento do trecho da chamada', 'i · last element of the call\'s range')],
    ['compared', tr('v[i] comparado', 'v[i] compared')],
    ['result', tr('maior do trecho até agora', 'largest of the range so far')],
    ['outside', tr('fora do trecho da chamada', 'outside the call\'s range')],
  ],
  inverter: [
    ['current', tr('texto[0] · fica esperando a volta', 'text[0] · waits for the return')],
    ['outside', tr('fora do texto da chamada', 'outside the call\'s text')],
  ],
};

function parseVector(text) {
  const { min, max } = LIMITS.vetor;
  const tokens = text.split(/[;,\s]+/).filter(Boolean);
  if (tokens.length < min) return { error: tr(`Digite pelo menos ${min} números para o vetor ter o que comparar.`, `Enter at least ${min} numbers so the array has something to compare.`) };
  if (tokens.length > max) return { error: tr(`Use no máximo ${max} números para a pilha de chamadas caber na tela.`, `Use at most ${max} numbers so the call stack fits on the screen.`) };
  const values = tokens.map(Number);
  if (values.some((value) => !Number.isFinite(value))) return { error: tr('Use apenas números separados por espaço, vírgula ou ponto e vírgula.', 'Use only numbers separated by space, comma or semicolon.') };
  return { values };
}

const isNumber = (id) => ['soma', 'fatorial', 'iterativo', 'overflow'].includes(id);

/** Campo de `state.data` que cada simulador edita. */
const FIELD = {
  soma: 'n', iterativo: 'n', fatorial: 'fat', maior: 'vetor', inverter: 'texto', overflow: 'inicio',
};

const clampInt = (value, { min, max }) => Math.max(min, Math.min(max, Math.round(value)));

function describe(id) {
  const field = FIELD[id];
  const { min, max } = LIMITS[field];
  switch (id) {
    case 'soma': return { title: tr('Escolha o valor de n', 'Choose the value of n'), label: tr('Valor de n', 'Value of n'), help: tr(`De ${min} a ${max}. Cada chamada pendente ocupa um frame, então n maior é uma pilha mais alta.`, `From ${min} to ${max}. Each pending call takes up a frame, so a larger n means a taller stack.`) };
    case 'iterativo': return { title: tr('Escolha o valor de n', 'Choose the value of n'), label: tr('Valor de n', 'Value of n'), help: tr(`De ${min} a ${max}. Compare com a recursão: ela precisaria de n frames.`, `From ${min} to ${max}. Compare with the recursion: it would need n frames.`) };
    case 'fatorial': return { title: tr('Escolha o valor de n', 'Choose the value of n'), label: tr('Valor de n (n ≥ 0)', 'Value of n (n ≥ 0)'), help: tr(`De ${min} a ${max}. Pré-condição: n ≥ 0. Com n = 0 não há chamada recursiva.`, `From ${min} to ${max}. Precondition: n ≥ 0. With n = 0 there is no recursive call.`) };
    case 'overflow': return { title: tr('Escolha o n da primeira chamada', 'Choose the n of the first call'), label: tr('Valor inicial de n', 'Initial value of n'), help: tr(`De ${min} a ${max}. A pilha deste simulador comporta ${STACK_LIMIT} frames. n > 0 se afasta do caso base; n ≤ 0 se aproxima.`, `From ${min} to ${max}. The stack of this simulator holds ${STACK_LIMIT} frames. n > 0 moves away from the base case; n ≤ 0 moves closer.`) };
    case 'maior': return { title: tr('Monte seu vetor', 'Build your array'), label: tr('Números do vetor', 'Array numbers'), help: tr(`Separe os valores por vírgula, espaço ou ponto e vírgula. De ${LIMITS.vetor.min} a ${LIMITS.vetor.max} números.`, `Separate the values by comma, space or semicolon. From ${LIMITS.vetor.min} to ${LIMITS.vetor.max} numbers.`) };
    default: return { title: tr('Escolha uma palavra', 'Pick a word'), label: tr('Texto', 'Text'), help: tr(`De ${LIMITS.texto.min} a ${LIMITS.texto.max} caracteres. Cada chamada guarda um pedaço do texto.`, `From ${LIMITS.texto.min} to ${LIMITS.texto.max} characters. Each call keeps a piece of the text.`) };
  }
}

const PRESETS = {
  soma: [[tr('n = 5 (slides 26 a 37)', 'n = 5 (slides 26 to 37)'), 5]],
  fatorial: [[tr('n = 5', 'n = 5'), 5], [tr('n = 0 (só o caso base)', 'n = 0 (base case only)'), 0]],
  iterativo: [[tr('n = 5', 'n = 5'), 5]],
  overflow: [
    [tr('n = 3 (se afasta do caso base)', 'n = 3 (moves away from the base case)'), 3],
    [tr('n = −3 (chega ao caso base)', 'n = −3 (reaches the base case)'), -3],
    [tr('n = −9 (funda demais)', 'n = −9 (too deep)'), -9],
  ],
  maior: [[tr('4, 9, 2, 7, 5', '4, 9, 2, 7, 5'), DEFAULT_DATA.vetor.join(', ')]],
  inverter: [[DEFAULT_DATA.texto, DEFAULT_DATA.texto]],
};

export const recursionModule = {
  id: 'recursao',
  name: tr('Recursão', 'Recursion'),
  category: { name: tr('Algoritmos', 'Algorithms'), anchor: 'algoritmos' },
  version: '1.0',
  visualizationTitle: tr('Chamadas e pilha de chamadas', 'Calls and call stack'),
  defaultAlgorithmId: 'soma',
  defaultData: DEFAULT_DATA,
  defaultRandomCount: 5,
  algorithms,
  buildSteps,

  isValidData(value) {
    return Boolean(value) && Number.isInteger(value.n) && Number.isInteger(value.fat) && Number.isInteger(value.inicio)
      && Array.isArray(value.vetor) && typeof value.texto === 'string';
  },

  sanitizeData(value) {
    const data = this.isValidData(value) ? value : DEFAULT_DATA;
    const vector = data.vetor.length >= LIMITS.vetor.min && data.vetor.length <= LIMITS.vetor.max && data.vetor.every(Number.isFinite);
    const text = [...data.texto].length >= LIMITS.texto.min && [...data.texto].length <= LIMITS.texto.max;
    return {
      n: clampInt(data.n, LIMITS.n),
      fat: clampInt(data.fat, LIMITS.fat),
      vetor: vector ? [...data.vetor] : [...DEFAULT_DATA.vetor],
      texto: text ? data.texto : DEFAULT_DATA.texto,
      inicio: clampInt(data.inicio, LIMITS.inicio),
    };
  },

  formatData() {
    return '';
  },

  createInitialConfig() {
    return {};
  },

  normalizeConfig(values, config) {
    return { ...config };
  },

  renderEditor({ state, escapeText }) {
    const id = state.algorithmId;
    const { title, label, help } = describe(id);
    const field = FIELD[id];
    const presets = PRESETS[id].map(([text, value]) => `<button class="button secondary compact" type="button" data-module-action="preset" data-value="${escapeText(value)}">${escapeText(text)}</button>`).join('');
    const error = state.config.errorFor === id ? state.inputError : '';
    const badge = id === 'maior' ? `${state.data.vetor.length} ${tr('posições', 'positions')}` : id === 'inverter' ? `${[...state.data.texto].length} ${tr('caracteres', 'characters')}` : `n = ${state.data[field]}`;
    const input = isNumber(id)
      ? `<input id="cs-input" class="text-input" type="number" inputmode="numeric" min="${LIMITS[field].min}" max="${LIMITS[field].max}" step="1" value="${state.data[field]}" aria-describedby="cs-help" data-module-input="number" />`
      : `<input id="cs-input" class="text-input ${error ? 'invalid' : ''}" value="${escapeText(id === 'maior' ? state.data.vetor.join(', ') : state.data.texto)}" ${id === 'inverter' ? `maxlength="${LIMITS.texto.max}"` : ''} aria-describedby="cs-help cs-error" data-module-input="draft" data-module-enter="apply" />`;
    const action = isNumber(id)
      ? `<button class="button secondary" type="button" data-module-action="random-data">${icons.shuffle}<span>${tr('Sortear n', 'Random n')}</span></button>`
      : `<button class="button primary" type="button" data-module-action="apply-data">${icons.check}<span>${tr('Aplicar', 'Apply')}</span></button>`;
    const random = isNumber(id) ? ''
      : `<div class="random-row">
          <label for="random-count">${id === 'maior' ? tr('Quantidade aleatória', 'Random quantity') : tr('Palavra aleatória', 'Random word')}</label>
          ${id === 'maior' ? `<input id="random-count" type="range" min="3" max="${LIMITS.vetor.max}" value="${state.randomCount}" data-module-input="random-count" /><output id="random-count-output">${state.randomCount}</output>` : '<span></span><span></span>'}
          <button class="button secondary" type="button" data-module-action="random-data">${icons.shuffle}<span>${id === 'maior' ? tr('Gerar vetor', 'Generate array') : tr('Gerar palavra', 'Generate word')}</span></button>
        </div>`;
    return `
      <div class="panel-heading compact-heading">
        <div><span class="eyebrow">${tr('Dados de entrada', 'Input data')}</span><h2 id="data-editor-title">${title}</h2></div>
        <span class="size-badge">${badge}</span>
      </div>
      <label class="field-label" for="cs-input">${label}</label>
      <div class="input-action-row">${input}${action}</div>
      <p id="cs-help" class="field-help">${help}</p>
      <p id="cs-error" class="error-message" role="alert">${escapeText(error)}</p>
      ${random}
      <div class="preset-row"><span>${tr('Exemplos', 'Examples')}</span>${presets}</div>`;
  },

  renderConfig() {
    return '';
  },

  renderVisualization({ state, step, escapeText }) {
    const id = state.algorithmId;
    const stack = renderCallStack(step, escapeText);
    let top = '';
    let main = `
        ${renderAction(step, escapeText)}
        ${renderStats(step)}`;

    if (id === 'maior') {
      top = `
        ${renderArray(step, state, escapeText, { stacked: false })}
        ${renderCompare(step, escapeText, COMPARE_HINT)}
        ${legend(LEGENDS.maior)}
        ${renderInspection(step, state, escapeText)}`;
    } else if (id === 'inverter') {
      top = `
        ${renderChars(step)}
        ${renderStrip(step)}
        ${legend(LEGENDS.inverter)}`;
    } else if (id === 'iterativo') {
      top = renderTotals(step);
    } else if (id !== 'overflow') {
      main = `
        ${renderAction(step, escapeText)}
        ${renderExpression(step, escapeText)}
        ${renderStats(step)}`;
    }

    return `<div class="cs-stage">${top ? `<div class="cs-top">${top}</div>` : ''}<div class="cs-body"><div class="cs-main">${main}</div>${stack}</div></div>`;
  },

  handleInput(name, input, app) {
    const id = app.state.algorithmId;
    switch (name) {
      case 'draft':
        break;
      case 'random-count':
        app.state.randomCount = Number(input.value);
        document.querySelector('#random-count-output').textContent = input.value;
        break;
      case 'number': {
        const field = FIELD[id];
        const value = Number(input.value);
        if (input.value === '' || !Number.isFinite(value)) break;
        const clamped = clampInt(value, LIMITS[field]);
        if (clamped !== value) input.value = clamped;
        app.state.data = { ...app.state.data, [field]: clamped };
        app.rebuildSteps();
        document.querySelector('.size-badge').textContent = `n = ${clamped}`;
        break;
      }
      default:
        break;
    }
  },

  handleAction(action, button, app) {
    const id = app.state.algorithmId;
    const field = FIELD[id];
    const set = (value) => {
      app.state.config = {};
      app.setData({ ...app.state.data, [field]: value });
    };

    if (action === 'apply-data') {
      const raw = document.querySelector('#cs-input')?.value ?? '';
      const fail = (message) => {
        app.state.inputError = message;
        app.state.config = { errorFor: id };
        app.renderEditor();
        document.querySelector('#cs-input')?.focus();
      };
      if (id === 'maior') {
        const parsed = parseVector(raw);
        if (!parsed.values) fail(parsed.error);
        else set(parsed.values);
        return;
      }
      const text = raw.trim();
      const size = [...text].length;
      if (size < LIMITS.texto.min) fail(tr('Digite pelo menos um caractere.', 'Type at least one character.'));
      else if (size > LIMITS.texto.max) fail(tr(`Use no máximo ${LIMITS.texto.max} caracteres para manter a pilha legível.`, `Use at most ${LIMITS.texto.max} characters to keep the stack readable.`));
      else set(text);
      return;
    }

    if (action === 'preset') {
      const value = button.dataset.value;
      set(id === 'maior' ? value.split(',').map(Number) : id === 'inverter' ? value : Number(value));
      return;
    }

    if (action === 'random-data') {
      if (!button) {
        app.state.config = {};
        app.setData(DEFAULT_DATA);
        return;
      }
      const pick = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
      if (id === 'maior') set(randomVector(app.state.randomCount));
      else if (id === 'inverter') set(WORDS[pick(0, WORDS.length - 1)]);
      else set(pick(LIMITS[field].min, LIMITS[field].max));
      return;
    }

    if (action === 'inspect-item') {
      app.state.inspectedItem = Number(button.dataset.index);
      app.renderSimulation();
    }
  },
};
