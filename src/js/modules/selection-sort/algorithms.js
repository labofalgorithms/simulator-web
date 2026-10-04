const SORT_CODE = [
  'FUNÇÃO selectionSort(vetor)',
  '  PARA i de 0 até vetor.length - 1 FAÇA',
  '    minimo ← i',
  '    PARA j de i + 1 até vetor.length - 1 FAÇA',
  '      SE vetor[j] < vetor[minimo] ENTÃO',
  '        minimo ← j',
  '      FIM SE',
  '    FIM PARA',
  '    temp ← vetor[i]',
  '    vetor[i] ← vetor[minimo]',
  '    vetor[minimo] ← temp',
  '  FIM PARA',
  'FIM',
];

// Linhas do SORT_CODE (base 0). Cada passo da simulação destaca uma única linha.
const LINE = { loopI: 1, minInit: 2, loopJ: 3, test: 4, minUpdate: 5, temp: 8, copy: 9, put: 10, end: 12 };

/** Valor mostrado para uma variável que ainda não foi atribuída. */
const NONE = '—';

export const algorithms = [
  {
    id: 'find-min', title: 'Encontrar o menor (varredura)', menuLabel: 'Encontrar o menor', group: 'Como funciona', number: '01',
    description: 'Percorra o sub-vetor guardando a posição do menor valor visto até agora. É a varredura que o Selection Sort repete a cada passada.',
    interaction: 'Mude a posição inicial ou clique em uma célula do vetor para começar a varredura nela.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Cada posição do sub-vetor é comparada uma única vez com o menor candidato.' },
    pseudocode: [
      'FUNÇÃO encontrarMenor(vetor, inicio)',
      '  minimo ← inicio',
      '  PARA j de inicio + 1 até vetor.length - 1 FAÇA',
      '    SE vetor[j] < vetor[minimo] ENTÃO',
      '      minimo ← j',
      '    FIM SE',
      '  FIM PARA',
      '  RETORNE minimo',
      'FIM',
    ],
  },
  {
    id: 'selection-sort', title: 'Selection Sort', menuLabel: 'Selection Sort', group: 'Como funciona', number: '02',
    description: 'A cada passada, encontre o menor valor do sub-vetor não ordenado e troque-o com a primeira posição desse sub-vetor.',
    interaction: 'Pause nas comparações e acompanhe os marcadores i, j e min. Tudo à esquerda de i já está ordenado.',
    complexity: { time: 'O(n²)', space: 'O(1)', note: 'S(n) = 4: além do vetor, que é ordenado no próprio lugar, só existem i, j, minimo e temp.' },
    pseudocode: SORT_CODE,
  },
  {
    id: 'counting', title: 'Contando as operações', menuLabel: 'Complexidade de tempo', group: 'Análise do algoritmo', number: '03',
    description: 'Conte as comparações e as trocas de cada passada e veja por que o custo total cresce com n².',
    interaction: 'Gere vetores de tamanhos diferentes e compare o total de comparações com n(n−1)/2.',
    complexity: { time: 'O(n²)', space: 'O(1)', note: 'As varreduras fazem (n−1) + (n−2) + … + 1 + 0 = n(n−1)/2 comparações; as trocas são apenas n.' },
    pseudocode: SORT_CODE,
  },
  {
    id: 'adaptability', title: 'Adaptabilidade', menuLabel: 'Adaptabilidade', group: 'Análise do algoritmo', number: '04',
    description: 'Execute o algoritmo em três vetores com os mesmos valores em ordens diferentes e compare os contadores.',
    interaction: 'Avance passo a passo e observe que os contadores dos três vetores são idênticos em todas as passadas.',
    complexity: { time: 'O(n²)', space: 'O(1)', note: 'Melhor, médio e pior caso fazem as mesmas n(n−1)/2 comparações: o Selection Sort não se adapta à ordem inicial.' },
    pseudocode: SORT_CODE,
  },
  {
    id: 'stability', title: 'Estabilidade', menuLabel: 'Estabilidade', group: 'Análise do algoritmo', number: '05',
    description: 'Valores repetidos recebem uma letra que marca a ordem original. Veja se o algoritmo preserva essa ordem.',
    interaction: 'Use "Gerar exemplo" para criar um vetor com valores repetidos e acompanhe a troca que inverte a ordem deles.',
    complexity: { time: 'O(n²)', space: 'O(1)', note: 'A troca entre posições distantes pode passar um elemento por cima de outro igual a ele; por isso o Selection Sort não é estável.' },
    pseudocode: SORT_CODE,
  },
];

const clone = (values) => [...values];
const fmt = (value) => (Number.isInteger(value) ? String(value) : value.toLocaleString('pt-BR', { maximumFractionDigits: 2 }));
const range = (end, start = 0) => Array.from({ length: Math.max(0, end - start) }, (_, index) => start + index);
const pad = (number) => String(number).padStart(2, '0');
const step = (values, line, title, description, tone = 'neutral', extra = {}) => ({ values: clone(values), line, title, description, tone, variables: {}, output: [], ...extra });
const compareOf = (values, j, min, result) => ({
  left: { label: 'vetor[j]', value: fmt(values[j]) },
  op: '<',
  right: { label: 'vetor[minimo]', value: fmt(values[min]) },
  result,
});

// ---------------------------------------------------------------------------
// Execução por passadas: base das simulações de análise (contagem,
// adaptabilidade e estabilidade). Cada item é { v: valor, tag: letra }.
// ---------------------------------------------------------------------------

const TAGS = 'abcdefghij';
const toItems = (values) => values.map((v) => ({ v, tag: '' }));

function tagDuplicates(values) {
  const totals = new Map();
  values.forEach((value) => totals.set(value, (totals.get(value) ?? 0) + 1));
  const seen = new Map();
  return values.map((v) => {
    if (totals.get(v) < 2) return { v, tag: '' };
    const occurrence = seen.get(v) ?? 0;
    seen.set(v, occurrence + 1);
    return { v, tag: TAGS[occurrence] };
  });
}

function runPasses(items) {
  const current = items.map((item) => ({ ...item }));
  const n = current.length;
  const passes = [];
  for (let i = 0; i < n; i += 1) {
    let min = i;
    for (let j = i + 1; j < n; j += 1) if (current[j].v < current[min].v) min = j;
    const before = current.map((item) => ({ ...item }));
    const moved = { ...current[i] };
    const jumped = range(min, i + 1).filter((k) => current[k].v === moved.v);
    [current[i], current[min]] = [current[min], current[i]];
    passes.push({ i, min, comparisons: n - 1 - i, before, after: current.map((item) => ({ ...item })), moved, jumped });
  }
  return passes;
}

const isStable = (items) => {
  const last = new Map();
  return items.every((item) => {
    if (!item.tag) return true;
    const previous = last.get(item.v);
    last.set(item.v, item.tag);
    return previous === undefined || previous < item.tag;
  });
};

const label = (item) => (item.tag ? `${fmt(item.v)}(${item.tag})` : fmt(item.v));
const valuesOf = (items) => items.map((item) => item.v);
const tagsOf = (items) => items.map((item) => item.tag);

/** Vetor com repetidos em que o Selection Sort inverte a ordem de dois iguais. */
export function stabilityExample(count) {
  const span = Math.max(3, Math.ceil(count * 0.6));
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const pool = Array.from({ length: span }, () => 10 + Math.floor(Math.random() * 90));
    const values = Array.from({ length: count }, () => pool[Math.floor(Math.random() * span)]);
    const items = tagDuplicates(values);
    if (items.some((item) => item.tag) && !isStable(runPasses(items).at(-1).after)) return values;
  }
  return [40, 40, 20, 60, 10];
}

// ---------------------------------------------------------------------------
// 01 · Encontrar o menor
// Execução como num depurador: cada passo é a linha que acabou de executar e as
// variáveis valem o que valeriam naquele ponto. Linhas: 1 minimo ← inicio ·
// 2 PARA j · 3 SE · 4 minimo ← j · 7 RETORNE
// ---------------------------------------------------------------------------

function findMinSteps(values, config) {
  const n = values.length;
  const start = Math.max(0, Math.min(n - 1, Number(config.inicio) || 0));
  const outsideIndices = range(start);
  const phase = { label: 'Varredura', text: 'Busca o menor' };
  const scope = { inicio: start, j: NONE, minimo: NONE };
  const base = (extra) => ({ outsideIndices, phase, variables: { ...scope }, ...extra });

  let min = start;
  const steps = [
    step(values, 0, 'Iniciando a varredura', `Procuraremos o menor valor do sub-vetor que vai da posição ${start} até a ${n - 1}. Os parâmetros já têm valor (inicio = ${start}); as demais variáveis ainda não foram atribuídas.`, 'neutral', base({})),
  ];

  scope.minimo = min;
  steps.push(step(values, 1, 'minimo ← inicio', `minimo recebe ${start}: por enquanto, ${fmt(values[start])} é o menor valor conhecido.`, 'update', base({ pointers: { min } })));

  for (let j = start + 1; j < n; j += 1) {
    scope.j = j;
    steps.push(step(values, 2, `PARA j (j = ${j})`, `j recebe ${j} e a condição j ≤ ${n - 1} é verdadeira: o laço entra.`, 'reading', base({ pointers: { j, min } })));
    const less = values[j] < values[min];
    const verdict = less
      ? 'Encontramos um valor menor.'
      : values[j] === values[min] ? 'Os valores são iguais; o teste estrito (<) mantém o candidato atual.' : `O candidato continua sendo ${fmt(values[min])}.`;
    steps.push(step(values, 3, 'SE vetor[j] < vetor[minimo]', `${fmt(values[j])} < ${fmt(values[min])} é ${less ? 'verdadeiro' : 'falso'}. ${verdict}`, 'comparison', base({ pointers: { j, min }, compare: compareOf(values, j, min, less) })));
    if (less) {
      min = j;
      scope.minimo = min;
      steps.push(step(values, 4, 'minimo ← j', `minimo recebe ${j}: agora o menor candidato é ${fmt(values[min])}.`, 'update', base({ pointers: { j, min }, changedIndices: [j] })));
    }
  }

  scope.j = n;
  steps.push(step(values, 2, `PARA j (j = ${n}): fim`, start === n - 1
    ? `j recebe ${n} e a condição j ≤ ${n - 1} é falsa: o laço nem chega a entrar, e o único elemento já é o menor.`
    : `j recebe ${n} e a condição j ≤ ${n - 1} é falsa: o laço termina. Todas as posições do sub-vetor foram examinadas e o menor valor é ${fmt(values[min])}.`, 'success', base({ pointers: { min } })));
  steps.push(step(values, 7, 'RETORNE minimo', `A função retorna ${min}: o menor valor do sub-vetor, ${fmt(values[min])}, está na posição ${min}.`, 'done', base({
    pointers: { min },
    output: [`Menor valor: ${fmt(values[min])}`, `Posição: ${min}`],
  })));
  return steps;
}

// ---------------------------------------------------------------------------
// 02 · Selection Sort completo, passo a passo como num depurador
// ---------------------------------------------------------------------------

function sortSteps(values) {
  const a = clone(values);
  const n = a.length;
  const log = [];
  let comparisons = 0;
  let swaps = 0;
  const stats = () => ({ 'comparações': comparisons, trocas: swaps });
  const scope = { i: NONE, j: NONE, minimo: NONE, temp: NONE };
  const steps = [
    step(a, 0, 'Iniciando o Selection Sort', `O vetor tem ${n} posições. As variáveis i, j, minimo e temp ainda não foram atribuídas. A cada passada, o menor valor do sub-vetor não ordenado vai para a primeira posição dele.`, 'neutral', { stats: stats(), variables: { ...scope } }),
  ];

  for (let i = 0; i < n; i += 1) {
    const scan = { label: `i = ${i}`, text: 'Busca o menor', code: true };
    const swap = { label: `i = ${i}`, text: 'Troca o menor com a primeira posição do sub-vetor', code: true };
    let min = i;
    const at = (extra) => ({ sortedCount: i, stats: stats(), output: clone(log), variables: { ...scope }, ...extra });

    scope.i = i;
    steps.push(step(a, LINE.loopI, `PARA i (i = ${i})`, `i recebe ${i} e a condição i ≤ ${n - 1} é verdadeira: o laço entra. O sub-vetor não ordenado vai da posição ${i} até a ${n - 1}; tudo à esquerda de i já está em sua posição final.`, 'reading', at({ pointers: { i }, phase: scan })));
    scope.minimo = i;
    steps.push(step(a, LINE.minInit, 'minimo ← i', `minimo recebe ${i}: por enquanto, ${fmt(a[i])} é o menor candidato.`, 'update', at({ pointers: { i, min }, phase: scan })));

    for (let j = i + 1; j < n; j += 1) {
      scope.j = j;
      steps.push(step(a, LINE.loopJ, `PARA j (j = ${j})`, `j recebe ${j} e a condição j ≤ ${n - 1} é verdadeira: o laço entra.`, 'reading', at({ pointers: { i, j, min }, phase: scan })));
      comparisons += 1;
      const less = a[j] < a[min];
      const verdict = less ? 'Há um novo menor.' : a[j] === a[min] ? 'Valores iguais: o candidato não muda.' : `O candidato continua sendo ${fmt(a[min])}.`;
      steps.push(step(a, LINE.test, 'SE vetor[j] < vetor[minimo]', `${fmt(a[j])} < ${fmt(a[min])} é ${less ? 'verdadeiro' : 'falso'}. ${verdict}`, 'comparison', at({ pointers: { i, j, min }, compare: compareOf(a, j, min, less), phase: scan })));
      if (less) {
        min = j;
        scope.minimo = min;
        steps.push(step(a, LINE.minUpdate, 'minimo ← j', `minimo recebe ${j}: o novo candidato é ${fmt(a[min])}.`, 'update', at({ pointers: { i, j, min }, changedIndices: [j], phase: scan })));
      }
    }

    scope.j = n;
    steps.push(step(a, LINE.loopJ, `PARA j (j = ${n}): fim`, i === n - 1
      ? `j recebe ${n} e a condição j ≤ ${n - 1} é falsa: o laço nem chega a entrar, porque não há posições depois de i. O único elemento já é o menor.`
      : `j recebe ${n} e a condição j ≤ ${n - 1} é falsa: o laço termina. O menor valor do sub-vetor é ${fmt(a[min])}, na posição ${min}.`, 'success', at({ pointers: { i, min }, phase: scan })));

    const pair = i === min ? [i] : [i, min];
    const temp = a[i];
    scope.temp = temp;
    steps.push(step(a, LINE.temp, 'temp ← vetor[i]', `temp recebe ${fmt(temp)}, o valor que está na primeira posição do sub-vetor.`, 'update', at({ pointers: { i, min }, comparedIndices: pair, phase: swap })));
    a[i] = a[min];
    steps.push(step(a, LINE.copy, 'vetor[i] ← vetor[minimo]', i === min
      ? `vetor[${i}] recebe ${fmt(a[i])}: o mesmo valor que já estava lá.`
      : `vetor[${i}] recebe ${fmt(a[i])}. Por um instante, ${fmt(a[i])} aparece duas vezes; o valor original está salvo em temp.`, 'update', at({ pointers: { i, min }, comparedIndices: pair, changedIndices: [i], phase: swap })));
    a[min] = temp;
    swaps += 1;
    log.push(`i = ${i}: menor = ${fmt(a[i])} → posição ${i}`);
    steps.push(step(a, LINE.put, 'vetor[minimo] ← temp', i === min
      ? `vetor[${min}] recebe ${fmt(temp)}. O menor já estava na posição certa, então a troca não altera o vetor.`
      : `vetor[${min}] recebe ${fmt(temp)}. A posição ${i} agora guarda ${fmt(a[i])}, seu valor definitivo.`, 'success', at({ sortedCount: i + 1, pointers: { i, min }, comparedIndices: pair, changedIndices: pair, phase: swap })));
  }

  scope.i = n;
  steps.push(step(a, LINE.loopI, `PARA i (i = ${n}): fim`, `i recebe ${n} e a condição i ≤ ${n - 1} é falsa: o laço termina. Todas as posições já estão em sua posição final.`, 'success', {
    sortedCount: n, stats: stats(), output: clone(log), variables: { ...scope },
  }));
  steps.push(step(a, LINE.end, 'Ordenação concluída', `Todas as posições estão em ordem crescente, após ${comparisons} comparações e ${swaps} trocas.`, 'done', {
    sortedCount: n,
    stats: stats(),
    variables: { ...scope },
    output: [...log, `Vetor ordenado: [${a.map(fmt).join(', ')}]`, `Comparações: ${comparisons} · Trocas: ${swaps}`],
  }));
  return steps;
}

// ---------------------------------------------------------------------------
// Passadas resumidas (03, 04 e 05): a varredura vira um único passo, destacando
// a linha da comparação (ou a do laço, quando ele não executa), e a troca vira
// três passos, um por atribuição.
// ---------------------------------------------------------------------------

const scanLine = (pass) => (pass.comparisons ? LINE.test : LINE.loopJ);

/** Estado do vetor entre `vetor[i] ← vetor[minimo]` e `vetor[minimo] ← temp`. */
function midSwap(items, i, min) {
  const mid = items.map((item) => ({ ...item }));
  mid[i] = { ...items[min] };
  return mid;
}

// ---------------------------------------------------------------------------
// 03 · Contando as operações
// ---------------------------------------------------------------------------

function countingSteps(values) {
  const n = values.length;
  const passes = runPasses(toItems(values));
  const expected = (n * (n - 1)) / 2;
  const series = passes.map((pass) => pass.comparisons);
  const bars = passes.map(() => ({ value: null, swapped: false, current: false }));
  let comparisons = 0;
  let swaps = 0;
  const chart = (final = false) => ({ bars: bars.map((bar) => ({ ...bar })), comparisons, swaps, expected, n, final });
  const common = (extra) => ({ chart: chart(extra.final), ...extra });

  const steps = [
    step(values, 0, 'Contando as operações', `Com n = ${n}, vamos contar quantas comparações e quantas trocas o algoritmo faz em cada passada.`, 'neutral', common({})),
  ];

  passes.forEach((pass, index) => {
    const { i, min } = pass;
    const phaseName = `i = ${i}`;
    const pair = i === min ? [i] : [i, min];
    const swapPhase = { label: phaseName, text: 'Troca o menor com a primeira posição', code: true };
    bars.forEach((bar, position) => { bar.current = position === index; });
    comparisons += pass.comparisons;
    bars[index].value = pass.comparisons;

    steps.push(step(valuesOf(pass.before), scanLine(pass), `i = ${i}: varredura`, pass.comparisons
      ? `A linha SE vetor[j] < vetor[minimo] executa ${n - 1 - i} vezes, uma para cada j de ${i + 1} a ${n - 1}. O menor está na posição ${min}.`
      : 'Não há posições depois de i: o laço PARA j não executa e nenhuma comparação é feita nesta passada.', 'comparison', common({
      sortedCount: i, pointers: { i, min }, phase: { label: phaseName, text: 'Busca o menor', code: true }, variables: { i, minimo: min, 'comparações da passada': pass.comparisons, 'comparações acumuladas': comparisons },
    })));
    steps.push(step(valuesOf(pass.before), LINE.temp, `i = ${i}: guardando em temp`, 'A troca são três atribuições (temp, vetor[i], vetor[minimo]). Esse custo é constante, não depende do tamanho do vetor.', 'update', common({
      sortedCount: i, comparedIndices: pair, pointers: { i, min }, phase: swapPhase, variables: { i, minimo: min, temp: pass.before[i].v },
    })));
    steps.push(step(valuesOf(midSwap(pass.before, i, min)), LINE.copy, `i = ${i}: copiando o menor`, `vetor[${i}] recebe ${fmt(pass.before[min].v)}.`, 'update', common({
      sortedCount: i, comparedIndices: pair, changedIndices: [i], pointers: { i, min }, phase: swapPhase, variables: { i, minimo: min, temp: pass.before[i].v },
    })));
    swaps += 1;
    bars[index].swapped = true;
    steps.push(step(valuesOf(pass.after), LINE.put, `i = ${i}: completando a troca`, `vetor[${min}] recebe ${fmt(pass.before[i].v)}. Mais uma troca contada.`, 'success', common({
      sortedCount: i + 1, comparedIndices: pair, changedIndices: pair, pointers: { i, min }, phase: swapPhase, variables: { i, minimo: min, trocas: swaps, 'comparações acumuladas': comparisons },
    })));
  });

  bars.forEach((bar) => { bar.current = false; });
  const doubled = n * 2;
  steps.push(step(valuesOf(passes.at(-1).after), LINE.end, 'Somando as passadas', `${series.join(' + ')} = ${comparisons} = n(n−1)/2, com n = ${n}. As trocas somam ${swaps} (uma por passada). Como n(n−1)/2 cresce com n², o custo é O(n²).`, 'done', common({
    final: true,
    sortedCount: n,
    variables: { n, 'comparações': comparisons, 'n(n−1)/2': expected, trocas: swaps },
    output: [`Comparações: ${comparisons}`, `Trocas: ${swaps}`, `n(n−1)/2 = ${n}·${n - 1}/2 = ${expected}`, `Com n = ${doubled}: ${(doubled * (doubled - 1)) / 2} comparações (≈ ${((doubled * (doubled - 1)) / 2 / Math.max(1, expected)).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}×)`],
  })));
  return steps;
}

// ---------------------------------------------------------------------------
// 04 · Adaptabilidade
// ---------------------------------------------------------------------------

function adaptabilitySteps(values) {
  const n = values.length;
  const ascending = [...values].sort((x, y) => x - y);
  const scenarios = [
    { label: 'Já ordenado', values: ascending },
    { label: 'Ordem inversa', values: [...ascending].reverse() },
    { label: 'Seu vetor', values: clone(values) },
  ].map((scenario) => ({ ...scenario, passes: runPasses(toItems(scenario.values)), comparisons: 0, swaps: 0 }));
  const expected = (n * (n - 1)) / 2;

  const rows = (pick) => scenarios.map((scenario) => ({ label: scenario.label, comparisons: scenario.comparisons, swaps: scenario.swaps, ...pick(scenario) }));
  const joined = (key) => scenarios.map((scenario) => scenario[key]).join(' · ');
  const steps = [
    step(values, 0, 'Três vetores, os mesmos valores', 'O primeiro já está ordenado, o segundo está em ordem inversa e o terceiro é o seu vetor. O algoritmo vai tratar os três do mesmo jeito?', 'neutral', {
      rows: rows((scenario) => ({ values: scenario.values, sortedCount: 0 })),
    }),
  ];

  for (let index = 0; index < n; index += 1) {
    const phase = `i = ${index}`;
    const remaining = n - 1 - index;
    scenarios.forEach((scenario) => { scenario.comparisons += scenario.passes[index].comparisons; });
    steps.push(step(values, scanLine(scenarios[0].passes[index]), `${phase}: varredura`, remaining
      ? `A linha SE vetor[j] < vetor[minimo] executa ${remaining} vezes em cada vetor, mesmo no que já está ordenado. Total acumulado: ${joined('comparisons')}.`
      : 'Não há posições depois de i: o laço PARA j não executa em nenhum dos vetores.', 'comparison', {
      rows: rows((scenario) => ({ values: valuesOf(scenario.passes[index].before), sortedCount: index, minIndex: scenario.passes[index].min })),
      variables: { i: index, 'comparações': joined('comparisons') },
    }));
    steps.push(step(values, LINE.temp, `${phase}: guardando em temp`, 'Cada vetor guarda vetor[i] em temp.', 'update', {
      rows: rows((scenario) => ({ values: valuesOf(scenario.passes[index].before), sortedCount: index, minIndex: scenario.passes[index].min })),
      variables: { i: index },
    }));
    steps.push(step(values, LINE.copy, `${phase}: copiando o menor`, 'Cada vetor copia o menor valor do sub-vetor para vetor[i].', 'update', {
      rows: rows((scenario) => {
        const { i, min } = scenario.passes[index];
        return { values: valuesOf(midSwap(scenario.passes[index].before, i, min)), sortedCount: index, changedIndices: [i] };
      }),
      variables: { i: index },
    }));
    scenarios.forEach((scenario) => { scenario.swaps += 1; });
    steps.push(step(values, LINE.put, `${phase}: completando a troca`, 'Todos completam a troca, mesmo quando o menor já está na posição certa. Os contadores continuam iguais nos três vetores.', 'success', {
      rows: rows((scenario) => {
        const { i, min } = scenario.passes[index];
        return { values: valuesOf(scenario.passes[index].after), sortedCount: index + 1, changedIndices: i === min ? [i] : [i, min] };
      }),
      variables: { i: index, 'comparações': joined('comparisons'), trocas: joined('swaps') },
    }));
  }

  steps.push(step(values, LINE.end, 'Mesmo custo para qualquer ordem', `Os três vetores terminaram com ${expected} comparações e ${n} trocas. A ordem inicial não mudou o custo: por isso o Selection Sort é usado quando o tempo de execução precisa ser previsível.`, 'done', {
    rows: rows((scenario) => ({ values: valuesOf(scenario.passes.at(-1).after), sortedCount: n })),
    output: scenarios.map((scenario) => `${scenario.label}: ${scenario.comparisons} comparações, ${scenario.swaps} trocas`),
  }));
  return steps;
}

// ---------------------------------------------------------------------------
// 05 · Estabilidade
// ---------------------------------------------------------------------------

function stabilitySteps(values) {
  const n = values.length;
  const items = tagDuplicates(values);
  const hasRepeated = items.some((item) => item.tag);
  const passes = runPasses(items);
  const log = [];
  const steps = [
    hasRepeated
      ? step(values, 0, 'Valores repetidos em destaque', 'Os valores repetidos ganham uma letra (a, b, …) que marca a ordem em que aparecem. Um algoritmo estável termina com essas letras em ordem alfabética.', 'neutral', { tags: tagsOf(items) })
      : step(values, 0, 'Não há valores repetidos', 'Sem valores repetidos não existe ordem relativa para preservar. Use "Gerar exemplo" para criar um vetor com repetidos.', 'warning', { tags: tagsOf(items) }),
  ];

  passes.forEach((pass) => {
    const { i, min } = pass;
    const phase = `i = ${i}`;
    const swapPhase = { label: phase, text: 'Troca o menor com a primeira posição', code: true };
    const minItem = pass.before[min];
    const tied = pass.before.slice(min + 1).some((item) => item.v === minItem.v);
    const pair = i === min ? [i] : [i, min];
    const at = (extra) => ({ pointers: { i, min }, variables: { i, minimo: min }, output: clone(log), ...extra });

    steps.push(step(valuesOf(pass.before), scanLine(pass), `${phase}: o menor é ${label(minItem)}`, `${pass.comparisons ? '' : 'O laço PARA j não executa: '}O menor valor do sub-vetor está na posição ${min}.${tied ? ` Há outro ${fmt(minItem.v)} mais adiante; o teste estrito (<) fica com o primeiro que encontrou.` : ''}`, 'comparison', at({
      tags: tagsOf(pass.before), sortedCount: i, phase: { label: phase, text: 'Busca o menor', code: true },
    })));
    steps.push(step(valuesOf(pass.before), LINE.temp, `${phase}: guardando em temp`, `temp recebe ${label(pass.moved)}, o elemento que está na posição ${i}.`, 'update', at({
      tags: tagsOf(pass.before), sortedCount: i, comparedIndices: pair, phase: swapPhase,
    })));
    const mid = midSwap(pass.before, i, min);
    steps.push(step(valuesOf(mid), LINE.copy, `${phase}: copiando o menor`, i === min
      ? `vetor[${i}] recebe ${label(minItem)}: o mesmo elemento que já estava lá.`
      : `vetor[${i}] recebe ${label(minItem)}; o elemento original, ${label(pass.moved)}, continua salvo em temp.`, 'update', at({
      tags: tagsOf(mid), sortedCount: i, comparedIndices: pair, changedIndices: [i], phase: swapPhase,
    })));

    const broke = pass.jumped.length > 0;
    let title = 'completando a troca';
    let description = i === min ? 'O menor já está na posição certa; a troca não altera o vetor.' : `vetor[${min}] recebe ${label(pass.moved)}. Os dois elementos trocaram de lugar.`;
    if (broke) {
      const over = pass.jumped.map((k) => label(pass.before[k])).join(', ');
      title = 'troca que inverte a ordem dos iguais';
      description = `${label(pass.moved)} saltou da posição ${i} para a ${min}, passando por cima de ${over}. Antes ele vinha primeiro; agora vem depois: a ordem relativa dos iguais foi invertida.`;
      log.push(`${phase}: ${label(pass.moved)} passou depois de ${over}`);
    }
    steps.push(step(valuesOf(pass.after), LINE.put, `${phase}: ${title}`, description, broke ? 'warning' : 'success', at({
      tags: tagsOf(pass.after), sortedCount: i + 1, changedIndices: pair, warnIndices: broke ? [min, ...pass.jumped] : [], phase: swapPhase,
    })));
  });

  const final = passes.at(-1).after;
  const order = final.map(label).join(' ');
  let verdict;
  if (!hasRepeated) verdict = 'O vetor não tinha valores repetidos, então não há o que comparar.';
  else if (isStable(final)) verdict = 'Neste vetor a ordem dos iguais sobreviveu, mas foi sorte: o Selection Sort não garante isso. Gere outro exemplo para ver a inversão.';
  else verdict = 'A ordem relativa dos iguais mudou (as letras ficaram fora de ordem alfabética). O Selection Sort não é estável.';
  steps.push(step(valuesOf(final), LINE.end, hasRepeated && !isStable(final) ? 'Resultado: não estável' : 'Resultado', verdict, hasRepeated && !isStable(final) ? 'warning' : 'done', {
    tags: tagsOf(final),
    sortedCount: n,
    output: [...log, `Ordem final: ${order}`, !hasRepeated ? 'Sem valores repetidos.' : isStable(final) ? 'Ordem preservada neste exemplo.' : 'Ordem dos iguais invertida.'],
  }));
  return steps;
}

export function buildSteps(id, values, config) {
  switch (id) {
    case 'find-min': return findMinSteps(values, config);
    case 'selection-sort': return sortSteps(values);
    case 'counting': return countingSteps(values);
    case 'adaptability': return adaptabilitySteps(values);
    case 'stability': return stabilitySteps(values);
    default: return findMinSteps(values, config);
  }
}
