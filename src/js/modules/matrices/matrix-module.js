import { algorithms, buildSteps } from './algorithms.js';

const DEFAULT_MATRIX = [
  [61, 12, 43],
  [48, 51, 36],
  [79, 82, 59],
];
const MAX_ROWS = 6;
const MAX_COLS = 6;
const coord = (row, col) => `${row},${col}`;
const hasCoord = (items, row, col) => Array.isArray(items) && items.includes(coord(row, col));

function parseMatrix(text) {
  const rowTexts = String(text).split(/\n|;/).map((row) => row.trim()).filter(Boolean);
  if (!rowTexts.length) return { error: 'Digite pelo menos uma linha da matriz.' };
  if (rowTexts.length > MAX_ROWS) return { error: `Use no máximo ${MAX_ROWS} linhas.` };
  const matrix = rowTexts.map((rowText) => rowText.split(/[\s,]+/).map((token) => token.trim()).filter(Boolean).map(Number));
  if (matrix.some((row) => row.length === 0)) return { error: 'Cada linha precisa ter pelo menos um número.' };
  if (matrix.some((row) => row.length > MAX_COLS)) return { error: `Use no máximo ${MAX_COLS} colunas.` };
  if (matrix.some((row) => row.some((value) => !Number.isFinite(value)))) return { error: 'Use apenas números. Separe colunas por espaço ou vírgula.' };
  const cols = matrix[0].length;
  if (matrix.some((row) => row.length !== cols)) return { error: 'Para a matriz regular, todas as linhas devem ter a mesma quantidade de colunas.' };
  return { matrix };
}

function parseJaggedLengths(text) {
  const values = String(text).split(/[\s,;]+/).map((token) => token.trim()).filter(Boolean).map(Number);
  const valid = values.length >= 1 && values.length <= MAX_ROWS && values.every((value) => Number.isInteger(value) && value >= 1 && value <= MAX_COLS);
  return valid ? values : null;
}

function matrixHtml(matrix, step, escapeText, options = {}) {
  const maxCols = matrix.reduce((max, row) => Math.max(max, row.length), 0);
  const prefix = options.secondary ? 'secondary' : '';
  const activeCells = options.secondary ? step.secondaryActiveCells : step.activeCells;
  const comparedCells = options.secondary ? step.secondaryComparedCells : step.comparedCells;
  const processedCells = options.secondary ? step.secondaryProcessedCells : step.processedCells;
  const resultCells = options.secondary ? step.secondaryResultCells : step.resultCells;
  const changedCells = options.secondary ? step.secondaryChangedCells : step.changedCells;
  const activeRows = options.secondary ? step.secondaryActiveRows : step.activeRows;
  const activeCols = options.secondary ? step.secondaryActiveCols : step.activeCols;
  const interactive = !options.secondary && !step.jagged;
  let content = `<div class="matrix-grid" style="grid-template-columns:28px repeat(${maxCols}, minmax(48px,66px))">`;
  content += '<span class="matrix-corner"></span>';
  for (let j = 0; j < maxCols; j += 1) content += `<span class="matrix-index ${activeCols?.includes(j) ? 'active' : ''}">j=${j}</span>`;
  matrix.forEach((row, i) => {
    content += `<span class="matrix-index ${activeRows?.includes(i) ? 'active' : ''}">i=${i}</span>`;
    for (let j = 0; j < maxCols; j += 1) {
      if (j >= row.length) {
        content += '<span></span>';
        continue;
      }
      const classes = ['matrix-cell'];
      if (hasCoord(processedCells, i, j)) classes.push('processed');
      if (hasCoord(comparedCells, i, j)) classes.push('compared');
      if (hasCoord(activeCells, i, j)) classes.push('active');
      if (hasCoord(resultCells, i, j)) classes.push('result');
      if (hasCoord(changedCells, i, j)) classes.push('changed');
      if (!options.secondary && options.inspectedItem === coord(i, j)) classes.push('inspected');
      content += interactive
        ? `<button type="button" class="${classes.join(' ')}" data-module-action="inspect-item" data-row="${i}" data-col="${j}" aria-label="Linha ${i}, coluna ${j}, valor ${escapeText(row[j])}">${escapeText(row[j])}</button>`
        : `<span class="${classes.join(' ')}">${escapeText(row[j])}</span>`;
    }
  });
  content += '</div>';
  return content;
}

function jaggedHtml(matrix, step, escapeText) {
  const allocated = step.allocatedRows || [];
  return `<div class="matrix-jagged">${matrix.map((row, i) => {
    const isAllocated = allocated.includes(i);
    const cells = isAllocated
      ? row.map((value, j) => `<span class="matrix-cell ${hasCoord(step.changedCells, i, j) ? 'changed' : ''} ${hasCoord(step.processedCells, i, j) ? 'processed' : ''}">${escapeText(value)}<span class="cell-index">${j}</span></span>`).join('')
      : '<span class="jagged-empty">linha ainda não alocada</span>';
    return `<div class="jagged-row ${step.activeRows?.includes(i) ? 'active' : ''}"><span class="jagged-row-label">[${i}] →</span>${cells}</div>`;
  }).join('')}</div>`;
}

export const matrixModule = {
  id: 'matrices',
  name: 'Matrizes',
  version: '1.0',
  visualizationTitle: 'Matriz na memória',
  defaultAlgorithmId: 'dimensions',
  storageKey: 'loa-matriz',
  defaultData: DEFAULT_MATRIX,
  defaultRandomCount: 3,
  algorithms,
  buildSteps,

  isValidData(value) {
    return Array.isArray(value) && value.length >= 1 && value.length <= MAX_ROWS && value.every((row) => Array.isArray(row) && row.length >= 1 && row.length <= MAX_COLS && row.every(Number.isFinite)) && value.every((row) => row.length === value[0].length);
  },
  sanitizeData(value) {
    return this.isValidData(value) ? value.map((row) => [...row]) : DEFAULT_MATRIX.map((row) => [...row]);
  },
  formatData(matrix) {
    return matrix.map((row) => row.join(', ')).join('\n');
  },
  createInitialConfig(matrix) {
    return {
      row: Math.min(1, matrix.length - 1),
      col: Math.min(2, matrix[0].length - 1),
      newValue: 10,
      order: Math.min(4, MAX_ROWS),
      jaggedText: '2, 4, 3',
      jaggedLengths: [2, 4, 3],
      randomRows: matrix.length,
      randomCols: matrix[0].length,
    };
  },
  normalizeConfig(matrix, config) {
    const parsedLengths = parseJaggedLengths(config.jaggedText) || config.jaggedLengths || [2, 4, 3];
    return {
      ...config,
      row: Number.isInteger(Number(config.row)) ? Number(config.row) : 0,
      col: Number.isInteger(Number(config.col)) ? Number(config.col) : 0,
      newValue: Number.isFinite(Number(config.newValue)) ? Number(config.newValue) : 0,
      order: Math.max(1, Math.min(MAX_ROWS, Number.parseInt(config.order, 10) || 3)),
      jaggedText: String(config.jaggedText ?? parsedLengths.join(', ')),
      jaggedLengths: parsedLengths,
      randomRows: Math.max(1, Math.min(MAX_ROWS, Number.parseInt(config.randomRows, 10) || matrix.length)),
      randomCols: Math.max(1, Math.min(MAX_COLS, Number.parseInt(config.randomCols, 10) || matrix[0].length)),
    };
  },
  renderEditor({ state, icons, escapeText }) {
    const rows = state.data.length;
    const cols = state.data[0].length;
    return `
      <div class="panel-heading compact-heading">
        <div><span class="eyebrow">Dados de entrada</span><h2 id="data-editor-title">Monte sua matriz</h2></div>
        <span class="size-badge">${rows} × ${cols}</span>
      </div>
      <label class="field-label" for="matrix-input">Valores da matriz</label>
      <div class="input-action-row">
        <textarea id="matrix-input" class="matrix-textarea ${state.inputError ? 'invalid' : ''}" aria-describedby="matrix-help matrix-error" data-module-input="draft">${escapeText(state.draft)}</textarea>
        <button class="button primary" type="button" data-module-action="apply-data">${icons.check}<span>Aplicar</span></button>
      </div>
      <p id="matrix-help" class="field-help">Uma linha por linha da matriz. Separe colunas por espaço ou vírgula; também aceitamos ponto e vírgula entre linhas. Máximo: ${MAX_ROWS} × ${MAX_COLS}.</p>
      <p id="matrix-error" class="error-message" role="alert">${escapeText(state.inputError)}</p>
      <div class="matrix-random-controls">
        <label for="random-rows">Linhas</label><input id="random-rows" type="range" min="1" max="${MAX_ROWS}" value="${state.config.randomRows}" data-module-input="random-rows" /><output id="random-rows-output">${state.config.randomRows}</output>
        <label for="random-cols">Colunas</label><input id="random-cols" type="range" min="1" max="${MAX_COLS}" value="${state.config.randomCols}" data-module-input="random-cols" /><output id="random-cols-output">${state.config.randomCols}</output>
        <button class="button secondary" type="button" data-module-action="random-data">${icons.shuffle}<span>Gerar matriz</span></button>
      </div>`;
  },
  renderConfig({ state, escapeText }) {
    const rows = state.data.length;
    const cols = state.data[0].length;
    if (state.algorithmId === 'access') {
      return `<div class="panel-heading compact-heading"><div><span class="eyebrow">Parâmetros</span><h2 id="config-title">Escolha uma posição</h2></div></div>
        <div class="matrix-config-wide two">
          <label class="config-field"><span>Linha</span><input type="number" value="${state.config.row}" data-module-input="row" /><small>Índices válidos: 0..${rows - 1}.</small></label>
          <label class="config-field"><span>Coluna</span><input type="number" value="${state.config.col}" data-module-input="col" /><small>Índices válidos: 0..${cols - 1}.</small></label>
        </div><p class="matrix-config-note">Você também pode clicar diretamente em uma célula da matriz.</p>`;
    }
    if (state.algorithmId === 'update') {
      return `<div class="panel-heading compact-heading"><div><span class="eyebrow">Parâmetros</span><h2 id="config-title">Altere uma célula</h2></div></div>
        <div class="matrix-config-wide">
          <label class="config-field"><span>Linha</span><input type="number" value="${state.config.row}" data-module-input="row" /><small>0..${rows - 1}</small></label>
          <label class="config-field"><span>Coluna</span><input type="number" value="${state.config.col}" data-module-input="col" /><small>0..${cols - 1}</small></label>
          <label class="config-field"><span>Novo valor</span><input type="number" value="${state.config.newValue}" data-module-input="new-value" /><small>Valor a ser escrito.</small></label>
        </div><p class="matrix-config-note">Clique em uma célula para preencher automaticamente linha e coluna.</p>`;
    }
    if (state.algorithmId === 'identity') {
      return `<div class="panel-heading compact-heading"><div><span class="eyebrow">Parâmetros</span><h2 id="config-title">Ordem da matriz identidade</h2></div></div>
        <label class="config-field"><span>n</span><input type="range" min="1" max="${MAX_ROWS}" value="${state.config.order}" data-module-input="order" /><small>Será criada uma matriz ${state.config.order} × ${state.config.order}.</small></label>`;
    }
    if (state.algorithmId === 'jagged') {
      return `<div class="panel-heading compact-heading"><div><span class="eyebrow">Parâmetros</span><h2 id="config-title">Tamanhos das linhas</h2></div></div>
        <label class="config-field"><span>Comprimentos</span><input type="text" value="${escapeText(state.config.jaggedText)}" data-module-input="jagged-lengths" /><small>Exemplo dos slides: 2, 4, 3. Use de 1 a ${MAX_COLS} posições por linha.</small></label>`;
    }
    if (state.algorithmId === 'symmetric' && rows !== cols) {
      return `<div class="panel-heading compact-heading"><div><span class="eyebrow">Observação</span><h2 id="config-title">Matriz não quadrada</h2></div></div><p class="matrix-config-note">A verificação encerrará imediatamente. Gere ou digite uma matriz com o mesmo número de linhas e colunas para testar a simetria.</p>`;
    }
    return '';
  },
  renderVisualization({ state, step, icons, escapeText }) {
    const matrix = step.values;
    const dimensions = `${matrix.length} × ${matrix.reduce((max, row) => Math.max(max, row.length), 0)}`;
    let visual;
    if (step.jagged) {
      visual = `<div class="matrix-block"><div class="matrix-block-title">jagged</div><div class="matrix-scroll">${jaggedHtml(matrix, step, escapeText)}</div></div>`;
    } else if (step.secondaryMatrix) {
      visual = `<div class="matrix-pair"><div class="matrix-block"><div class="matrix-block-title">${escapeText(step.primaryLabel || 'A')}</div><div class="matrix-scroll">${matrixHtml(matrix, step, escapeText, { inspectedItem: state.inspectedItem })}</div></div><div class="matrix-arrow">→</div><div class="matrix-block"><div class="matrix-block-title">${escapeText(step.secondaryLabel || 'Resultado')}</div><div class="matrix-scroll">${matrixHtml(step.secondaryMatrix, step, escapeText, { secondary: true })}</div></div></div>`;
    } else {
      visual = `<div class="matrix-block"><div class="matrix-scroll">${matrixHtml(matrix, step, escapeText, { inspectedItem: state.inspectedItem })}</div></div>`;
    }
    const resultVector = Array.isArray(step.resultVector)
      ? `<div class="matrix-result-vector"><span>${escapeText(step.resultVectorLabel || 'resultado')}</span><div class="matrix-vector-row">${step.resultVector.map((value, index) => `<span class="matrix-vector-cell ${step.resultVectorActive === index ? 'active' : ''}">${escapeText(value)}</span>`).join('')}</div></div>`
      : '';
    let inspection = '';
    if (state.inspectedItem && !step.jagged) {
      const [row, col] = state.inspectedItem.split(',').map(Number);
      if (matrix[row] && col < matrix[row].length) inspection = `<div class="inspection-card matrix-inspection">${icons.info}<span>Posição selecionada</span><strong>A[${row}][${col}] = ${escapeText(matrix[row][col])}</strong></div>`;
    }
    return `<div class="matrix-stage"><div class="matrix-stage-header"><span class="matrix-stage-label">estrutura bidimensional</span><span class="matrix-dimensions">${dimensions}</span></div>${visual}${resultVector}<div class="matrix-legend"><span><i class="legend-dot current"></i> atual</span><span><i class="legend-dot compared"></i> comparação</span><span><i class="legend-dot processed"></i> processado</span><span><i class="legend-dot result"></i> resultado</span></div></div>${inspection}`;
  },
  handleInput(name, input, app) {
    switch (name) {
      case 'draft':
        app.state.draft = input.value;
        break;
      case 'random-rows':
        app.state.config.randomRows = Number(input.value);
        document.querySelector('#random-rows-output').textContent = input.value;
        break;
      case 'random-cols':
        app.state.config.randomCols = Number(input.value);
        document.querySelector('#random-cols-output').textContent = input.value;
        break;
      case 'row':
        app.state.config.row = Number(input.value);
        app.rebuildSteps();
        break;
      case 'col':
        app.state.config.col = Number(input.value);
        app.rebuildSteps();
        break;
      case 'new-value':
        app.state.config.newValue = Number(input.value);
        app.rebuildSteps();
        break;
      case 'order':
        app.state.config.order = Number(input.value);
        app.rebuildSteps();
        app.renderConfig();
        break;
      case 'jagged-lengths': {
        app.state.config.jaggedText = input.value;
        const parsed = parseJaggedLengths(input.value);
        if (parsed) {
          app.state.config.jaggedLengths = parsed;
          app.rebuildSteps();
        }
        break;
      }
      default:
        break;
    }
  },
  handleAction(action, button, app) {
    if (action === 'apply-data') {
      const parsed = parseMatrix(app.state.draft);
      if (!parsed.matrix) {
        app.state.inputError = parsed.error;
        app.renderEditor();
        document.querySelector('#matrix-input')?.focus();
        return;
      }
      app.setData(parsed.matrix);
      return;
    }
    if (action === 'random-data') {
      const rows = app.state.config.randomRows;
      const cols = app.state.config.randomCols;
      const matrix = Array.from({ length: rows }, () => Array.from({ length: cols }, () => Math.floor(Math.random() * 90) + 10));
      app.setData(matrix);
      return;
    }
    if (action === 'inspect-item') {
      const row = Number(button.dataset.row);
      const col = Number(button.dataset.col);
      app.state.inspectedItem = coord(row, col);
      if (app.state.algorithmId === 'access' || app.state.algorithmId === 'update') {
        app.state.config.row = row;
        app.state.config.col = col;
        app.rebuildSteps(false);
        app.renderConfig();
      }
      app.renderSimulation();
    }
  },
};
